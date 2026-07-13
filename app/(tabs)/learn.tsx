import { Text, View } from "react-native";

export default function LearnScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-8 pb-28">
      <Text className="text-center font-poppins-bold text-[30px] leading-[38px] text-text-primary">
        Learn
      </Text>
      <Text className="mt-3 text-center font-poppins-regular text-[16px] leading-[24px] text-text-secondary">
        Lesson path placeholder.
      </Text>
    </View>
  );
}
