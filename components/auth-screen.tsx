import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
  useSSO,
} from "@clerk/expo";
import * as Linking from "expo-linking";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { usePostHog } from "posthog-react-native";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { images } from "@/constants/images";

void WebBrowser.maybeCompleteAuthSession();

type AuthMode = "sign-up" | "sign-in";

type AuthScreenProps = {
  mode: AuthMode;
};

type SocialProvider = {
  color: string;
  icon: (color: string) => ReactNode;
  label: string;
  strategy: "oauth_google" | "oauth_facebook" | "oauth_apple";
};

type SetActiveSession = (params: { session: string }) => Promise<void> | void;

const codeLength = 6;

const socialProviders: SocialProvider[] = [
  {
    color: "#4285F4",
    icon: (color) => <AntDesign color={color} name="google" size={26} />,
    label: "Continue with Google",
    strategy: "oauth_google",
  },
  {
    color: "#1877F2",
    icon: (color) => <FontAwesome color={color} name="facebook" size={28} />,
    label: "Continue with Facebook",
    strategy: "oauth_facebook",
  },
  {
    color: "#07122E",
    icon: (color) => <AntDesign color={color} name="apple" size={28} />,
    label: "Continue with Apple",
    strategy: "oauth_apple",
  },
];

function getAuthErrorMessage(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return (
      error.errors[0]?.longMessage ??
      error.errors[0]?.message ??
      "Authentication failed. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const insets = useSafeAreaInsets();
  const posthog = usePostHog();
  const { fetchStatus: signInFetchStatus, signIn } = useSignIn();
  const { fetchStatus: signUpFetchStatus, signUp } = useSignUp();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const isSignUp = mode === "sign-up";
  const isBusy =
    isSubmitting ||
    signInFetchStatus === "fetching" ||
    signUpFetchStatus === "fetching";

  const copy = useMemo(
    () =>
      isSignUp
        ? {
            button: "Sign Up",
            footerAction: "Log in",
            footerCopy: "Already have an account?",
            footerHref: "/sign-in" as const,
            modalTitle: "Verify your email",
            subtitle: "Start your language journey today ✨",
            title: "Create your account",
          }
        : {
            button: "Sign In",
            footerAction: "Sign up",
            footerCopy: "New to muolingo?",
            footerHref: "/sign-up" as const,
            modalTitle: "Check your inbox",
            subtitle: "Continue your language journey today ✨",
            title: "Welcome back",
          },
    [isSignUp],
  );

  function showVerificationModal() {
    setVerificationCode("");
    setIsVerificationVisible(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  async function activateSocialSession(
    sessionId: string | null,
    setActiveSession: SetActiveSession | undefined,
  ) {
    if (!sessionId || !setActiveSession) {
      throw new Error("Clerk did not return a session for this sign-in.");
    }

    await setActiveSession({ session: sessionId });
    setIsVerificationVisible(false);
    router.replace("/home");
  }

  async function finalizeEmailAuth(
    finalizeAuth: () => Promise<{ error: unknown | null }>,
  ) {
    const { error } = await finalizeAuth();

    if (error) {
      throw error;
    }

    setIsVerificationVisible(false);
    router.replace("/home");
  }

  async function handleSignUp() {
    if (!signUp) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setAuthError("Enter your email and password to continue.");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    try {
      const { error: signUpError } = await signUp.password({
        emailAddress: trimmedEmail,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      const { error: codeError } =
        await signUp.verifications.sendEmailCode();

      if (codeError) {
        throw codeError;
      }

      showVerificationModal();
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignIn() {
    if (!signIn) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAuthError("Enter your email to continue.");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    try {
      const { error: codeError } = await signIn.emailCode.sendCode({
        emailAddress: trimmedEmail,
      });

      if (codeError) {
        throw codeError;
      }

      showVerificationModal();
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePrimaryPress() {
    if (isBusy) {
      return;
    }

    if (isSignUp) {
      await handleSignUp();
      return;
    }

    await handleSignIn();
  }

  async function handleVerify(code: string) {
    setIsSubmitting(true);
    setAuthError("");

    try {
      if (isSignUp) {
        if (!signUp) {
          return;
        }

        const { error } = await signUp.verifications.verifyEmailCode({
          code,
        });

        if (error) {
          throw error;
        }

        if (signUp.status !== "complete") {
          throw new Error("Sign-up is not complete yet. Please try again.");
        }

        await finalizeEmailAuth(() => signUp.finalize());

        posthog.identify(email.trim(), {
          $set: { email: email.trim(), signup_method: 'email' },
          $set_once: { first_signup_date: new Date().toISOString() },
        });
        posthog.capture('user_signed_up', { signup_method: 'email' });
        return;
      }

      if (!signIn) {
        return;
      }

      const { error } = await signIn.emailCode.verifyCode({ code });

      if (error) {
        throw error;
      }

      if (signIn.status !== "complete") {
        throw new Error(
          "This account needs another verification step before signing in.",
        );
      }

      await finalizeEmailAuth(() => signIn.finalize());

      posthog.identify(email.trim(), {
        $set: { email: email.trim(), login_method: 'email' },
      });
      posthog.capture('user_signed_in', { login_method: 'email' });
    } catch (error) {
      setVerificationCode("");
      setAuthError(getAuthErrorMessage(error));
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialAuth(strategy: SocialProvider["strategy"]) {
    if (isBusy) {
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        redirectUrl: Linking.createURL("/"),
        strategy,
      });

      await activateSocialSession(createdSessionId, setActive);

      posthog.capture('social_auth_completed', { provider: strategy });
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCodeChange(value: string) {
    if (isSubmitting) {
      return;
    }

    const nextCode = value.replace(/\D/g, "").slice(0, codeLength);
    setVerificationCode(nextCode);

    if (nextCode.length === codeLength) {
      void handleVerify(nextCode);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 24,
            paddingTop: 14,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[470px] flex-1 self-center">
          <Pressable
            accessibilityLabel="Go back"
            className="h-12 w-12 items-start justify-center"
            onPress={() => router.back()}
          >
            <Feather color="#0D132B" name="chevron-left" size={34} />
          </Pressable>

          <View className="mt-5 gap-2">
            <Text className="font-poppins-bold text-[25px] leading-[32px] text-text-primary">
              {copy.title}
            </Text>
            <Text className="font-poppins-regular text-[14px] leading-[21px] text-[#76809f]">
              {copy.subtitle}
            </Text>
          </View>

          <View className="mt-5 h-[124px] items-center justify-end overflow-hidden">
            <View className="absolute left-[85px] top-6">
              <Text className="font-poppins-semibold text-[19px] leading-[23px] text-[#ff9400]">
                ✦
              </Text>
            </View>
            <View className="absolute right-[84px] top-8">
              <Text className="font-poppins-semibold text-[17px] leading-[22px] text-[#61a2ff]">
                ✦
              </Text>
            </View>
            <View className="absolute right-[100px] top-[76px]">
              <Text className="font-poppins-semibold text-[17px] leading-[22px] text-[#ffd553]">
                ✦
              </Text>
            </View>
            <Image
              source={images.mascotAuth}
              resizeMode="contain"
              style={styles.mascot}
            />
          </View>

          <View className="-mt-1 gap-2.5">
            <View className="h-[72px] justify-center rounded-[16px] border border-border bg-white px-4">
              <Text className="font-poppins-medium text-[12px] leading-[17px] text-[#8187a2]">
                Email
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                className="mt-2 font-poppins-regular text-[15px] leading-[21px] text-text-primary"
                inputMode="email"
                keyboardType="email-address"
                onChangeText={(value) => {
                  setEmail(value);
                  setAuthError("");
                }}
                style={styles.textInput}
                value={email}
              />
            </View>

            {isSignUp ? (
              <View className="h-[72px] flex-row items-center rounded-[16px] border border-border bg-white px-4">
                <View className="flex-1 justify-center">
                  <Text className="font-poppins-medium text-[12px] leading-[17px] text-[#8187a2]">
                    Password
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="new-password"
                    className="mt-2 font-poppins-regular text-[15px] leading-[21px] text-text-primary"
                    onChangeText={(value) => {
                      setPassword(value);
                      setAuthError("");
                    }}
                    secureTextEntry={!isPasswordVisible}
                    style={styles.textInput}
                    value={password}
                  />
                </View>
                <Pressable
                  accessibilityLabel={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  className="h-12 w-12 items-end justify-center"
                  onPress={() => setIsPasswordVisible((value) => !value)}
                >
                  <Feather color="#8187A2" name="eye" size={28} />
                </Pressable>
              </View>
            ) : null}
          </View>

          {isSignUp ? <View nativeID="clerk-captcha" /> : null}

          <Pressable
            className={`mt-5 h-[56px] items-center justify-center rounded-[16px] border-b-[3px] border-[#4e34de] bg-lingua-deep-purple ${isBusy ? "opacity-70" : ""}`}
            disabled={isBusy}
            onPress={() => {
              void handlePrimaryPress();
            }}
          >
            <Text className="font-poppins-semibold text-[17px] leading-[23px] text-white">
              {isSubmitting ? "Please wait..." : copy.button}
            </Text>
          </Pressable>

          {authError ? (
            <Text className="mt-2 text-center font-poppins-regular text-[12px] leading-[18px] text-error">
              {authError}
            </Text>
          ) : null}

          <View className="my-5 flex-row items-center gap-2.5">
            <View className="h-px flex-1 bg-border" />
            <Text className="font-poppins-regular text-[13px] leading-[18px] text-[#8187a2]">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="gap-2.5">
            {socialProviders.map((provider) => (
              <Pressable
                className={`h-[52px] flex-row items-center rounded-[16px] border border-border bg-white px-5 ${isBusy ? "opacity-70" : ""}`}
                disabled={isBusy}
                key={provider.label}
                onPress={() => {
                  void handleSocialAuth(provider.strategy);
                }}
              >
                <View className="w-11 items-center">
                  {provider.icon(provider.color)}
                </View>
                <Text className="flex-1 text-center font-poppins-medium text-[14px] leading-[20px] text-text-primary">
                  {provider.label}
                </Text>
                <View className="w-11" />
              </Pressable>
            ))}
          </View>

          <View className="flex-1" />

          <Text className="mt-10 text-center font-poppins-regular text-[13px] leading-[21px] text-[#8187a2]">
            {copy.footerCopy}{" "}
            <Link href={copy.footerHref} asChild>
              <Text className="font-poppins-semibold text-lingua-deep-purple">
                {copy.footerAction}
              </Text>
            </Link>
          </Text>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={isVerificationVisible}
        onRequestClose={() => setIsVerificationVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={process.env.EXPO_OS === "ios" ? "padding" : "height"}
          style={styles.modalRoot}
        >
          <Pressable
            className="flex-1 bg-black/35"
            onPress={() => setIsVerificationVisible(false)}
          />
          <View className="bg-black/35 px-4 pb-5">
            <View className="w-full max-w-[470px] self-center rounded-[24px] bg-white px-4 py-5">
              <Text className="text-center font-poppins-bold text-[22px] leading-[29px] text-text-primary">
                {copy.modalTitle}
              </Text>
              <Text className="mt-2 text-center font-poppins-regular text-[14px] leading-[22px] text-[#76809f]">
                You have received an email. Enter the verification code to
                continue.
              </Text>

              {authError ? (
                <Text className="mt-2 text-center font-poppins-regular text-[12px] leading-[18px] text-error">
                  {authError}
                </Text>
              ) : null}

              <Pressable
                className="mt-5 flex-row justify-center gap-1.5"
                onPress={() => inputRef.current?.focus()}
              >
                {Array.from({ length: codeLength }).map((_, index) => (
                  <View
                    className="h-[52px] w-[40px] items-center justify-center rounded-[14px] border border-border bg-surface"
                    key={index}
                  >
                    <Text className="font-poppins-semibold text-[20px] leading-[26px] text-text-primary">
                      {verificationCode[index] ?? ""}
                    </Text>
                  </View>
                ))}
              </Pressable>

              <TextInput
                caretHidden
                keyboardType="number-pad"
                maxLength={codeLength}
                onChangeText={handleCodeChange}
                ref={inputRef}
                style={styles.hiddenCodeInput}
                textContentType="oneTimeCode"
                value={verificationCode}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  hiddenCodeInput: {
    height: 1,
    opacity: 0,
    position: "absolute",
    width: 1,
  },
  mascot: {
    height: 160,
    width: 192,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  textInput: {
    padding: 0,
  },
});
