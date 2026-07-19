export type StreamSession = {
  apiKey: string;
  token: string;
  userId: string;
  userImage?: string;
  userName: string;
};

export type StreamLessonCall = {
  callId: string;
  callType: "default";
};

export type StreamClientStatus =
  | "idle"
  | "connecting"
  | "ready"
  | "error";
