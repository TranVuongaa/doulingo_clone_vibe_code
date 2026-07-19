import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { Lesson } from "@/types/learning";

export function LessonAudioCall({
  onLeave,
  onSubtitlesChange,
  showSubtitles,
}: {
  lesson: Lesson;
  onLeave: () => void;
  onSubtitlesChange: () => void;
  showSubtitles: boolean;
}) {
  return (
    <>
      <View className="flex-row justify-between px-7 pb-5 pt-5">
        <LessonControl disabled icon="video-off" label="Preview" />
        <LessonControl disabled icon="mic-off" label="Mic" />
        <LessonControl
          active={showSubtitles}
          icon="type"
          label="Subtitles"
          onPress={onSubtitlesChange}
        />
        <LessonControl disabled danger icon="phone-off" label="End Call" />
      </View>
      <View className="mx-4 mb-4 flex-row items-center rounded-[18px] border border-[#ffd9dc] bg-white px-4 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#fff0f1]">
          <Feather color="#e53942" name="smartphone" size={20} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-poppins-semibold text-[13px] text-text-primary">
            Open this lesson on iOS or Android
          </Text>
          <Text className="mt-0.5 font-poppins-regular text-[11px] text-[#68718e]">
            Stream audio calls require a native development build.
          </Text>
        </View>
        <Pressable className="rounded-full bg-[#eeeaff] px-3 py-2" onPress={onLeave}>
          <Text className="font-poppins-semibold text-[11px] text-[#6346f5]">Back</Text>
        </Pressable>
      </View>
    </>
  );
}

function LessonControl({
  active = false,
  danger = false,
  disabled = false,
  icon,
  label,
  onPress,
}: {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      className="w-[70px] items-center"
      onPress={onPress}
      style={{ opacity: disabled ? 0.45 : 1 }}
    >
      <View className={`h-[58px] w-[58px] items-center justify-center rounded-full ${danger ? "bg-[#ff3b42]" : active ? "bg-[#eeeaff]" : "bg-white"}`}>
        <Feather color={danger ? "#fff" : active ? "#6346f5" : "#101832"} name={icon} size={25} />
      </View>
      <Text className="mt-2 text-center font-poppins-medium text-[11px] text-[#6f7894]">{label}</Text>
    </Pressable>
  );
}
