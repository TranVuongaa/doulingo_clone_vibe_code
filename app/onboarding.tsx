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

import { images } from "@/constants/images";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const availableHeight = height - insets.top - insets.bottom;
  const scale = Math.min(1, Math.max(0.8, availableHeight / 820));
  const logoSize = 60 * scale;
  const mascotSize = 320 * scale;

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingBottom: insets.bottom + 24 * scale,
        paddingHorizontal: 40,
        paddingTop: insets.top + 24 * scale,
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
            style={{ fontSize: 42 * scale, lineHeight: 52 * scale }}
          >
            muolingo
          </Text>
        </View>

        <View style={{ marginTop: 56 * scale }}>
          <Text
            className="font-poppins-bold text-text-primary"
            style={{ fontSize: 36 * scale, lineHeight: 50 * scale }}
          >
            Your AI language{"\n"}
            <Text className="text-lingua-deep-purple">teacher.</Text>
          </Text>
          <Text
            className="font-poppins-regular text-[#63677d]"
            style={{
              fontSize: 18 * scale,
              lineHeight: 34 * scale,
              marginTop: 18 * scale,
            }}
          >
            Real conversations, personalized{"\n"}
            lessons, anytime, anywhere.
          </Text>
        </View>

        <View
          className="relative w-full"
          style={{ height: 360 * scale, marginTop: 24 * scale }}
        >
          <View
            className="absolute left-0 rounded-[20px] bg-[#eef7ff] px-6 py-4"
            style={{ top: 34 * scale }}
          >
            <Text
              className="font-poppins-medium text-text-primary"
              style={{ fontSize: 25 * scale, lineHeight: 31 * scale }}
            >
              Hello!
            </Text>
            <View style={[styles.bubbleTail, styles.blueTail]} />
          </View>

          <View className="absolute right-5 top-0 rounded-[20px] bg-[#f6f4ff] px-6 py-4">
            <Text
              className="font-poppins-medium italic text-lingua-deep-purple"
              style={{ fontSize: 25 * scale, lineHeight: 31 * scale }}
            >
              ¡Hola!
            </Text>
            <View style={[styles.bubbleTail, styles.purpleTail]} />
          </View>

          <View
            className="absolute right-0 rounded-[20px] bg-[#fff2ed] px-6 py-4"
            style={{ top: 112 * scale }}
          >
            <Text
              className="font-poppins-medium text-[#ff3f2f]"
              style={{ fontSize: 25 * scale, lineHeight: 31 * scale }}
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
            className="flex-row items-center justify-center rounded-[24px] border-b-[5px] border-[#4d31db] bg-lingua-deep-purple px-8"
            style={{ height: 76 * scale }}
          >
            <Text
              className="font-poppins-semibold text-white"
              style={{ fontSize: 22 * scale, lineHeight: 28 * scale }}
            >
              Get Started
            </Text>
            <Text
              className="absolute right-9 font-poppins-regular text-white"
              style={{ fontSize: 48 * scale, lineHeight: 52 * scale }}
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
