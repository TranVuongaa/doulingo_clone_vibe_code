import { createClerkClient } from "@clerk/backend";
import { StreamClient } from "@stream-io/node-sdk";

import { getLessonById } from "@/data/lessons";

type CreateCallBody = {
  languageCode?: unknown;
  lessonId?: unknown;
};

function requiredEnvironmentVariable(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const clerkClient = createClerkClient({
      publishableKey: requiredEnvironmentVariable(
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
        "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
      ),
      secretKey: requiredEnvironmentVariable(
        process.env.CLERK_SECRET_KEY,
        "CLERK_SECRET_KEY",
      ),
    });
    const requestState = await clerkClient.authenticateRequest(request, {
      acceptsToken: "session_token",
    });

    if (!requestState.isAuthenticated) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { userId } = requestState.toAuth();

    if (!userId) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as CreateCallBody;

    if (typeof body.lessonId !== "string") {
      return Response.json({ error: "A lesson is required." }, { status: 400 });
    }

    const lesson = getLessonById(body.lessonId);

    if (
      !lesson ||
      typeof body.languageCode !== "string" ||
      body.languageCode !== lesson.languageCode
    ) {
      return Response.json(
        { error: "The selected lesson is invalid." },
        { status: 400 },
      );
    }

    const callType = "default" as const;
    // Stream call IDs may contain at most 64 characters. Lesson and user
    // details are stored in the call data, so a UUID is enough for uniqueness.
    const callId = `lesson-${crypto.randomUUID()}`;
    const streamClient = new StreamClient(
      requiredEnvironmentVariable(process.env.STREAM_API_KEY, "STREAM_API_KEY"),
      requiredEnvironmentVariable(
        process.env.STREAM_API_SECRET,
        "STREAM_API_SECRET",
      ),
    );
    const call = streamClient.video.call(callType, callId);

    await call.getOrCreate({
      data: {
        created_by_id: userId,
        custom: {
          languageCode: lesson.languageCode,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
        },
        members: [{ user_id: userId }],
        settings_override: {
          audio: {
            default_device: "speaker",
            mic_default_on: true,
          },
          video: {
            camera_default_on: false,
            enabled: false,
            // Stream validates target resolution whenever a video override is
            // present, even when video is disabled for this audio-only call.
            target_resolution: {
              bitrate: 5_000_000,
              height: 1440,
              width: 2560,
            },
          },
        },
      },
      video: false,
    });

    return Response.json({ callId, callType });
  } catch (error) {
    console.error("Unable to create Stream lesson call", error);
    return Response.json(
      { error: "Unable to start this audio lesson." },
      { status: 500 },
    );
  }
}
