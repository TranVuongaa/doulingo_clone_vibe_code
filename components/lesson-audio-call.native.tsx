import { Feather } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import {
  type Call,
  CallingState,
  StreamCall,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

// eslint-disable-next-line import/no-unresolved
import { useLessonStreamVideo } from "@/components/stream-video-provider";
import { createStreamLessonCall } from "@/lib/stream-api";
import type { Lesson } from "@/types/learning";

type FeatherIconName = keyof typeof Feather.glyphMap;
type LessonCallStatus =
  | "loading"
  | "connecting"
  | "joined"
  | "muted"
  | "error"
  | "ended";

export function LessonAudioCall({
  lesson,
  onLeave,
  onSubtitlesChange,
  showSubtitles,
}: {
  lesson: Lesson;
  onLeave: () => void;
  onSubtitlesChange: () => void;
  showSubtitles: boolean;
}) {
  const { getToken } = useAuth();
  const stream = useLessonStreamVideo();
  const [call, setCall] = useState<Call>();
  const [callError, setCallError] = useState<string>();
  const [callStatus, setCallStatus] = useState<LessonCallStatus>("loading");
  const [connectionAttempt, setConnectionAttempt] = useState(0);
  const getSessionToken = useCallback(() => getToken(), [getToken]);

  useEffect(() => {
    if (!stream.client) {
      return;
    }

    let active = true;
    let currentCall: Call | undefined;

    setCall(undefined);
    setCallError(undefined);
    setCallStatus("connecting");

    void (async () => {
      try {
        const callSession = await createStreamLessonCall(
          getSessionToken,
          lesson.id,
          lesson.languageCode,
        );

        if (!active) {
          return;
        }

        currentCall = stream.client?.call(
          callSession.callType,
          callSession.callId,
          { reuseInstance: true },
        );

        if (!currentCall) {
          throw new Error("The lesson call is unavailable.");
        }

        currentCall.setDisconnectionTimeout(120);
        setCall(currentCall);
        await currentCall.join();

        if (active) {
          setCallStatus("joined");
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setCallError(
          error instanceof Error
            ? error.message
            : "Unable to join this audio lesson.",
        );
        setCallStatus("error");
      }
    })();

    return () => {
      active = false;
      if (
        currentCall &&
        currentCall.state.callingState !== CallingState.LEFT
      ) {
        void currentCall.leave().catch((error) => {
          console.error("Unable to leave lesson call", error);
        });
      }
    };
  }, [connectionAttempt, getSessionToken, lesson, stream.client]);

  useEffect(() => {
    if (stream.status === "error") {
      setCallError(stream.errorMessage ?? "Unable to connect to Stream.");
      setCallStatus("error");
    } else if (stream.status === "connecting" && !call) {
      setCallStatus("loading");
    }
  }, [call, stream.errorMessage, stream.status]);

  const handleCallActionError = useCallback((message: string) => {
    setCallError(message);
    setCallStatus("error");
  }, []);

  const retryConnection = useCallback(() => {
    setCallError(undefined);
    setCallStatus("connecting");
    if (stream.status === "error") {
      stream.retry();
      return;
    }
    setConnectionAttempt((current) => current + 1);
  }, [stream]);

  const statusDetails = getCallStatusDetails(callStatus);

  return (
    <>
      {call ? (
        <StreamCall call={call}>
          <ConnectedLessonControls
            callStatus={callStatus}
            onActionError={handleCallActionError}
            onStatusChange={setCallStatus}
            onSubtitlesChange={onSubtitlesChange}
            showSubtitles={showSubtitles}
          />
        </StreamCall>
      ) : (
        <DisconnectedLessonControls
          callStatus={callStatus}
          onSubtitlesChange={onSubtitlesChange}
          showSubtitles={showSubtitles}
        />
      )}

      <View
        className="mx-4 mb-4 flex-row items-center rounded-[18px] border bg-white px-4 py-3"
        style={{ borderColor: statusDetails.borderColor }}
      >
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: statusDetails.backgroundColor }}
        >
          {callStatus === "loading" || callStatus === "connecting" ? (
            <ActivityIndicator color={statusDetails.color} size="small" />
          ) : (
            <Feather
              color={statusDetails.color}
              name={statusDetails.icon}
              size={20}
            />
          )}
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-poppins-semibold text-[13px] leading-[18px] text-text-primary">
            {statusDetails.title}
          </Text>
          <Text className="mt-0.5 font-poppins-regular text-[11px] leading-[16px] text-[#68718e]">
            {callStatus === "error"
              ? callError
              : `Connected as ${stream.session?.userName ?? "your account"}`}
          </Text>
        </View>
        {callStatus === "error" ? (
          <StatusAction label="Retry" onPress={retryConnection} />
        ) : callStatus === "ended" ? (
          <StatusAction label="Back" onPress={onLeave} />
        ) : null}
      </View>
    </>
  );
}

function ConnectedLessonControls({
  callStatus,
  onActionError,
  onStatusChange,
  onSubtitlesChange,
  showSubtitles,
}: {
  callStatus: LessonCallStatus;
  onActionError: (message: string) => void;
  onStatusChange: (status: LessonCallStatus) => void;
  onSubtitlesChange: () => void;
  showSubtitles: boolean;
}) {
  const call = useCall();
  const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const {
    isSpeakingWhileMuted,
    isTogglePending,
    microphone,
    optimisticIsMute,
  } = useMicrophoneState();

  useEffect(() => {
    if (
      callingState === CallingState.JOINING ||
      callingState === CallingState.RECONNECTING ||
      callingState === CallingState.MIGRATING ||
      callingState === CallingState.OFFLINE
    ) {
      onStatusChange("connecting");
      return;
    }

    if (callingState === CallingState.LEFT) {
      onStatusChange("ended");
      return;
    }

    if (callingState === CallingState.JOINED) {
      onStatusChange(optimisticIsMute ? "muted" : "joined");
    }
  }, [callingState, onStatusChange, optimisticIsMute]);

  async function toggleMicrophone() {
    try {
      await microphone.toggle();
    } catch (error) {
      onActionError(
        error instanceof Error
          ? error.message
          : "Unable to change the microphone.",
      );
    }
  }

  async function endCall() {
    try {
      if (call && call.state.callingState !== CallingState.LEFT) {
        await call.leave();
      }
      onStatusChange("ended");
    } catch (error) {
      onActionError(
        error instanceof Error ? error.message : "Unable to end the lesson.",
      );
    }
  }

  const canUseMicrophone =
    callStatus === "joined" || callStatus === "muted";

  return (
    <View className="flex-row justify-between px-7 pb-5 pt-5">
      <LessonControl disabled icon="video-off" label="Preview" />
      <LessonControl
        active={canUseMicrophone && !optimisticIsMute}
        disabled={!canUseMicrophone || isTogglePending}
        icon={optimisticIsMute ? "mic-off" : "mic"}
        label={isSpeakingWhileMuted ? "You're muted" : "Mic"}
        onPress={toggleMicrophone}
      />
      <LessonControl
        active={showSubtitles}
        icon="type"
        label="Subtitles"
        onPress={onSubtitlesChange}
      />
      <LessonControl
        danger
        disabled={callStatus === "ended"}
        icon="phone-off"
        label={callStatus === "ended" ? "Ended" : "End Call"}
        onPress={endCall}
      />
    </View>
  );
}

function DisconnectedLessonControls({
  callStatus,
  onSubtitlesChange,
  showSubtitles,
}: {
  callStatus: LessonCallStatus;
  onSubtitlesChange: () => void;
  showSubtitles: boolean;
}) {
  return (
    <View className="flex-row justify-between px-7 pb-5 pt-5">
      <LessonControl disabled icon="video-off" label="Preview" />
      <LessonControl disabled icon="mic-off" label="Mic" />
      <LessonControl
        active={showSubtitles}
        icon="type"
        label="Subtitles"
        onPress={onSubtitlesChange}
      />
      <LessonControl
        danger
        disabled={callStatus === "ended" || callStatus === "error"}
        icon="phone-off"
        label={callStatus === "ended" ? "Ended" : "End Call"}
      />
    </View>
  );
}

function LessonControl({
  active = false,
  danger = false,
  disabled = false,
  icon,
  label,
  onPress,
}: {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  icon: FeatherIconName;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      className="w-[70px] items-center"
      onPress={onPress}
      style={({ pressed }) => ({ opacity: disabled ? 0.45 : pressed ? 0.75 : 1 })}
    >
      <View
        className={`h-[58px] w-[58px] items-center justify-center rounded-full ${danger ? "bg-[#ff3b42]" : active ? "bg-[#eeeaff]" : "bg-white"}`}
        style={{
          boxShadow: danger
            ? "0 4px 10px rgba(255, 59, 66, 0.28)"
            : "0 4px 10px rgba(26, 36, 64, 0.10)",
        }}
      >
        <Feather
          color={danger ? "#ffffff" : active ? "#6346f5" : "#101832"}
          name={icon}
          size={25}
          strokeWidth={2.4}
        />
      </View>
      <Text className="mt-2 text-center font-poppins-medium text-[11px] leading-[15px] text-[#6f7894]">
        {label}
      </Text>
    </Pressable>
  );
}

function StatusAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      className="rounded-full bg-[#eeeaff] px-3 py-2"
      onPress={onPress}
    >
      <Text className="font-poppins-semibold text-[11px] text-[#6346f5]">
        {label}
      </Text>
    </Pressable>
  );
}

function getCallStatusDetails(status: LessonCallStatus): {
  backgroundColor: string;
  borderColor: string;
  color: string;
  icon: FeatherIconName;
  title: string;
} {
  switch (status) {
    case "loading":
      return { backgroundColor: "#f0edff", borderColor: "#e4defe", color: "#6346f5", icon: "loader", title: "Preparing your teacher" };
    case "connecting":
      return { backgroundColor: "#eaf4ff", borderColor: "#d7eaff", color: "#1685ff", icon: "wifi", title: "Joining audio lesson" };
    case "joined":
      return { backgroundColor: "#eafaea", borderColor: "#d7f3d5", color: "#20a915", icon: "check-circle", title: "Audio lesson is live" };
    case "muted":
      return { backgroundColor: "#fff5e8", borderColor: "#ffe5c3", color: "#f08a24", icon: "mic-off", title: "Your microphone is muted" };
    case "error":
      return { backgroundColor: "#fff0f1", borderColor: "#ffd9dc", color: "#e53942", icon: "alert-circle", title: "Could not join the lesson" };
    case "ended":
      return { backgroundColor: "#f1f2f6", borderColor: "#e3e5ec", color: "#68718e", icon: "phone-off", title: "Audio lesson ended" };
  }
}
