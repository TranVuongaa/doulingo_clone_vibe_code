import { createClerkClient } from "@clerk/backend";
import { StreamClient } from "@stream-io/node-sdk";

const TOKEN_VALIDITY_SECONDS = 60 * 60 * 4;

function requiredEnvironmentVariable(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export async function GET(request: Request) {
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

    const clerkUser = await clerkClient.users.getUser(userId);
    const streamApiKey = requiredEnvironmentVariable(
      process.env.STREAM_API_KEY,
      "STREAM_API_KEY",
    );
    const streamClient = new StreamClient(
      streamApiKey,
      requiredEnvironmentVariable(
        process.env.STREAM_API_SECRET,
        "STREAM_API_SECRET",
      ),
    );
    const userName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      clerkUser.primaryEmailAddress?.emailAddress ||
      "Learner";

    await streamClient.upsertUsers([
      {
        id: userId,
        image: clerkUser.imageUrl || undefined,
        name: userName,
        role: "user",
      },
    ]);

    const token = streamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: TOKEN_VALIDITY_SECONDS,
    });

    return Response.json(
      {
        apiKey: streamApiKey,
        token,
        userId,
        userImage: clerkUser.imageUrl || undefined,
        userName,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to create Stream session", error);
    return Response.json(
      { error: "Unable to connect to the lesson service." },
      { status: 500 },
    );
  }
}
