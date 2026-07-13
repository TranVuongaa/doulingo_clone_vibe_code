import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-5 pb-20">
      <Text className="text-center font-poppins-bold text-[26px] leading-[33px] text-text-primary">
        Profile
      </Text>
      <Text className="mt-2 text-center font-poppins-regular text-[14px] leading-[21px] text-text-secondary">
        Profile placeholder.
      </Text>
    </View>
  );
}
