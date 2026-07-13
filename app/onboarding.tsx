import { Link } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

import { images } from "@/constants/images";

export default function OnboardingScreen() {
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const availableHeight = height - insets.bottom;
  const scale = Math.min(1, Math.max(0.8, availableHeight / 820));
  const logoSize = 60 * scale;
  const mascotSize = 320 * scale;

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingBottom: insets.bottom + 18 * scale,
        paddingHorizontal: 24,
        paddingTop: 18 * scale,
      }}
    >
      <View className="w-full max-w-[460px] flex-1 self-center">
        <View className="flex-row items-center justify-center gap-3">
          <Image
            source={images.mascotLogo}
            resizeMode="contain"
            style={{ height: logoSize, width: logoSize }}
          />
          <Text
            className="font-poppins-bold text-text-primary"
            style={{ fontSize: 36 * scale, lineHeight: 44 * scale }}
          >
            muolingo
          </Text>
        </View>

        <View style={{ marginTop: 36 * scale }}>
          <Text
            className="font-poppins-bold text-text-primary"
            style={{ fontSize: 30 * scale, lineHeight: 40 * scale }}
          >
            Your AI language{"\n"}
            <Text className="text-lingua-deep-purple">teacher.</Text>
          </Text>
          <Text
            className="font-poppins-regular text-[#63677d]"
            style={{
              fontSize: 15 * scale,
              lineHeight: 26 * scale,
              marginTop: 12 * scale,
            }}
          >
            Real conversations, personalized{"\n"}
            lessons, anytime, anywhere.
          </Text>
        </View>

        <View
          className="relative w-full"
          style={{ height: 340 * scale, marginTop: 18 * scale }}
        >
          <View
            className="absolute left-0 rounded-[18px] bg-[#eef7ff] px-5 py-3"
            style={{ top: 34 * scale }}
          >
            <Text
              className="font-poppins-medium text-text-primary"
              style={{ fontSize: 21 * scale, lineHeight: 27 * scale }}
            >
              Hello!
            </Text>
            <View style={[styles.bubbleTail, styles.blueTail]} />
          </View>

          <View className="absolute right-5 top-0 rounded-[18px] bg-[#f6f4ff] px-5 py-3">
            <Text
              className="font-poppins-medium italic text-lingua-deep-purple"
              style={{ fontSize: 21 * scale, lineHeight: 27 * scale }}
            >
              ¡Hola!
            </Text>
            <View style={[styles.bubbleTail, styles.purpleTail]} />
          </View>

          <View
            className="absolute right-0 rounded-[18px] bg-[#fff2ed] px-5 py-3"
            style={{ top: 112 * scale }}
          >
            <Text
              className="font-poppins-medium text-[#ff3f2f]"
              style={{ fontSize: 21 * scale, lineHeight: 27 * scale }}
            >
              你好!
            </Text>
            <View style={[styles.bubbleTail, styles.peachTail]} />
          </View>

          <Image
            source={images.mascotWelcome}
            className="absolute bottom-0 left-1/2"
            resizeMode="contain"
            style={[
              styles.mascotImage,
              {
                height: mascotSize,
                transform: [{ translateX: mascotSize / -2 }],
                width: mascotSize,
              },
            ]}
          />
        </View>

        <View className="flex-1" />

        <Link href="/sign-up" asChild>
          <Pressable
            className="flex-row items-center justify-center rounded-[22px] border-b-[4px] border-[#4d31db] bg-lingua-deep-purple px-5"
            style={{ height: 64 * scale }}
            onPress={() => posthog.capture('onboarding_get_started_pressed')}
          >
            <Text
              className="font-poppins-semibold text-white"
              style={{ fontSize: 18 * scale, lineHeight: 24 * scale }}
            >
              Get Started
            </Text>
            <Text
              className="absolute right-7 font-poppins-regular text-white"
              style={{ fontSize: 40 * scale, lineHeight: 44 * scale }}
            >
              ›
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleTail: {
    position: "absolute",
    bottom: -10,
    height: 24,
    transform: [{ rotate: "45deg" }],
    width: 24,
  },
  mascotImage: {
    height: 320,
    width: 320,
  },
  blueTail: {
    backgroundColor: "#eef7ff",
    right: 22,
  },
  purpleTail: {
    backgroundColor: "#f6f4ff",
    left: 22,
  },
  peachTail: {
    backgroundColor: "#fff2ed",
    left: 22,
  },
});
