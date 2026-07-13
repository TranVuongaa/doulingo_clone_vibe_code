import { useEffect } from "react";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { useLearningStore } from "@/store/use-learning-store";
import { colors, fontAssets } from "@/theme";
import "../global.css";

void SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

function AuthRedirects() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const hasHydrated = useLearningStore((state) => state.hasHydrated);
  const selectedLanguageCode = useLearningStore(
    (state) => state.selectedLanguageCode,
  );

  useEffect(() => {
    if (!isLoaded || !hasHydrated) {
      return;
    }

    const firstSegment = segments[0];
    const isAuthRoute = firstSegment === "(auth)";
    const isLanguageRoute = firstSegment === "language";
    const isOnboardingRoute = firstSegment === "onboarding";

    if (!isSignedIn && !isAuthRoute && !isOnboardingRoute) {
      router.replace("/onboarding");
      return;
    }

    if (isSignedIn && isAuthRoute) {
      router.replace(selectedLanguageCode ? "/(tabs)/index" : "/language");
      return;
    }

    if (isSignedIn && !selectedLanguageCode && !isLanguageRoute) {
      router.replace("/language");
      return;
    }

  }, [hasHydrated, isLoaded, isSignedIn, segments, selectedLanguageCode]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <AuthRedirects />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.neutral.surface },
          headerShown: false,
        }}
      />
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
