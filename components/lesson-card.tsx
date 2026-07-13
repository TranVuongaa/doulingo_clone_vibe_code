import { Feather } from "@expo/vector-icons";
import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type LessonCardStatus = "completed" | "in-progress" | "upcoming";

type LessonCardProps = {
  artworkSource: ImageSourcePropType;
  lessonNumber: number;
  onPress: () => void;
  progressLabel: string;
  status: LessonCardStatus;
  title: string;
};

export function LessonCard({
  artworkSource,
  lessonNumber,
  onPress,
  progressLabel,
  status,
  title,
}: LessonCardProps) {
  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isInProgress ? styles.activeCard : null,
        pressed ? styles.pressedCard : null,
      ]}
    >
      <View className="flex-1 justify-center pr-3">
        <Text
          className={`font-poppins-semibold text-[14px] leading-[19px] ${
            isInProgress ? "text-lingua-deep-purple" : "text-[#8791ad]"
          }`}
        >
          Lesson {lessonNumber}
        </Text>

        <Text
          className="mt-2 font-poppins-medium text-[17px] leading-[23px] text-text-primary"
          numberOfLines={1}
        >
          {title}
        </Text>

        {!isCompleted ? (
          <Text
            className={`mt-1.5 font-poppins-semibold text-[14px] leading-[19px] ${
              isInProgress ? "text-lingua-deep-purple" : "text-[#8791ad]"
            }`}
          >
            {progressLabel}
          </Text>
        ) : null}
      </View>

      <View className="h-[52px] w-[52px] items-center justify-center">
        {isCompleted ? (
          <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-[#20c915]">
            <Feather color="#FFFFFF" name="check" size={20} strokeWidth={3.4} />
          </View>
        ) : null}

        {isInProgress ? (
          <Image
            className="h-[52px] w-[52px]"
            resizeMode="contain"
            source={artworkSource}
          />
        ) : null}

        {status === "upcoming" ? (
          <Feather color="#59627d" name="lock" size={26} strokeWidth={2.4} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activeCard: {
    backgroundColor: "#FBFAFF",
    borderColor: "#8B6CFF",
    borderWidth: 2,
    minHeight: 116,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF0F6",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 96,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  pressedCard: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});
