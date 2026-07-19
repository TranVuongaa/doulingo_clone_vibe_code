import { useAuth } from "@clerk/expo";
import {
  type DeepPartial,
  StreamVideo,
  StreamVideoClient,
  type Theme,
  type User,
} from "@stream-io/video-react-native-sdk";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchStreamSession } from "@/lib/stream-api";
import type { StreamClientStatus, StreamSession } from "@/types/stream";

type StreamVideoContextValue = {
  client?: StreamVideoClient;
  errorMessage?: string;
  retry: () => void;
  session?: StreamSession;
  status: StreamClientStatus;
};

const StreamVideoContext = createContext<StreamVideoContextValue | null>(null);

export function useLessonStreamVideo() {
  const context = useContext(StreamVideoContext);

  if (!context) {
    throw new Error(
      "useLessonStreamVideo must be used inside StreamVideoProvider.",
    );
  }

  return context;
}

export function StreamVideoProvider({ children }: { children: ReactNode }) {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const insets = useSafeAreaInsets();
  const [client, setClient] = useState<StreamVideoClient>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [retryCount, setRetryCount] = useState(0);
  const [session, setSession] = useState<StreamSession>();
  const [status, setStatus] = useState<StreamClientStatus>("idle");
  const getSessionToken = useCallback(() => getToken(), [getToken]);
  const retry = useCallback(() => {
    setRetryCount((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      setClient(undefined);
      setErrorMessage(undefined);
      setSession(undefined);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    let connectedClient: StreamVideoClient | undefined;

    setErrorMessage(undefined);
    setStatus("connecting");

    void (async () => {
      try {
        const nextSession = await fetchStreamSession(getSessionToken);

        if (cancelled) {
          return;
        }

        const user: User = {
          id: nextSession.userId,
          image: nextSession.userImage,
          name: nextSession.userName,
        };
        const tokenProvider = async () => {
          const refreshedSession = await fetchStreamSession(getSessionToken);
          return refreshedSession.token;
        };

        connectedClient = StreamVideoClient.getOrCreateInstance({
          apiKey: nextSession.apiKey,
          token: nextSession.token,
          tokenProvider,
          user,
        });

        if (cancelled) {
          await connectedClient.disconnectUser();
          return;
        }

        setClient(connectedClient);
        setSession(nextSession);
        setStatus("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setClient(undefined);
        setSession(undefined);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to connect to Stream.",
        );
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      if (connectedClient) {
        void connectedClient.disconnectUser().catch((error) => {
          console.error("Unable to disconnect Stream user", error);
        });
      }
    };
  }, [getSessionToken, isLoaded, isSignedIn, retryCount, userId]);

  const contextValue = useMemo(
    () => ({ client, errorMessage, retry, session, status }),
    [client, errorMessage, retry, session, status],
  );
  const theme = useMemo<DeepPartial<Theme>>(
    () =>
      ({
        variants: {
          insets: {
            bottom: insets.bottom,
            left: insets.left,
            right: insets.right,
            top: insets.top,
          },
        },
      }) as unknown as DeepPartial<Theme>,
    [insets.bottom, insets.left, insets.right, insets.top],
  );

  const content = client ? (
    <StreamVideo client={client} style={theme}>
      {children}
    </StreamVideo>
  ) : (
    children
  );

  return (
    <StreamVideoContext.Provider value={contextValue}>
      {content}
    </StreamVideoContext.Provider>
  );
}
