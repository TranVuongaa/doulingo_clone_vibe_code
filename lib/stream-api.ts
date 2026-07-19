import type { StreamLessonCall, StreamSession } from "@/types/stream";

type GetSessionToken = () => Promise<string | null>;

type ApiErrorBody = {
  error?: string;
};

async function authenticatedRequest<T>(
  path: string,
  getSessionToken: GetSessionToken,
  init?: RequestInit,
): Promise<T> {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    throw new Error("Your sign-in session is unavailable. Please sign in again.");
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${sessionToken}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(body.error ?? `Request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

export function fetchStreamSession(getSessionToken: GetSessionToken) {
  return authenticatedRequest<StreamSession>(
    "/api/stream/session",
    getSessionToken,
  );
}

export function createStreamLessonCall(
  getSessionToken: GetSessionToken,
  lessonId: string,
  languageCode: string,
) {
  return authenticatedRequest<StreamLessonCall>(
    "/api/stream/calls",
    getSessionToken,
    {
      body: JSON.stringify({ languageCode, lessonId }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );
}
