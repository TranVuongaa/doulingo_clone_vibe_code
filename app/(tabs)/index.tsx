import { Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

import { images } from "@/constants/images";
import { getLanguageByCode, languages } from "@/data/languages";
import { getLessonsByLanguage } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { useLearningStore } from "@/store/use-learning-store";
import type { LanguageCode } from "@/types/learning";

type PlanItem = {
  accentClassName: string;
  icon: keyof typeof Feather.glyphMap;
  isComplete: boolean;
  subtitle: string;
  title: string;
};

const DAILY_GOAL_XP = 20;

const greetings: Record<LanguageCode, string> = {
  de: "Hallo",
  es: "Hola",
  fr: "Salut",
  ja: "Konnichiwa",
  ko: "Annyeong",
  zh: "Ni hao",
};

function getFirstName(fallback: string, userName?: string | null) {
  const trimmedName = userName?.trim();

  if (!trimmedName) {
    return fallback;
  }

  return trimmedName.split(/\s+/)[0];
}

export default function HomeScreen() {
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const selectedLanguageCode = useLearningStore(
    (state) => state.selectedLanguageCode,
  );

  const languageCode = selectedLanguageCode ?? "es";
  const selectedLanguage = getLanguageByCode(languageCode) ?? languages[0];
  const lessons = getLessonsByLanguage(selectedLanguage.code);
  const units = getUnitsByLanguage(selectedLanguage.code);
  const currentUnit = units[0];
  const completedLessonCount = lessons.length > 1 ? 1 : 0;
  const currentLesson = lessons[completedLessonCount] ?? lessons[0];
  const xpToday = Math.min(currentLesson?.xpReward ?? 0, DAILY_GOAL_XP);
  const progressPercentage = Math.min((xpToday / DAILY_GOAL_XP) * 100, 100);
  const learnerName = getFirstName(
    "Alex",
    user?.firstName ?? user?.fullName ?? user?.username,
  );
  const greeting = greetings[selectedLanguage.code] ?? "Hello";
  const unitLabel = `${selectedLanguage.beginnerLevel.replace("Beginner ", "")} - Unit ${
    currentUnit?.order ?? 1
  }`;
  const vocabularyCount = currentLesson?.vocabulary.length ?? 0;

  const planItems: PlanItem[] = [
    {
      accentClassName: "bg-lingua-deep-purple",
      icon: "book-open",
      isComplete: true,
      subtitle: currentLesson?.title ?? "Start lesson",
      title: "Lesson",
    },
    {
      accentClassName: "bg-lingua-deep-purple",
      icon: "headphones",
      isComplete: false,
      subtitle: "Talk about your day",
      title: "AI Conversation",
    },
    {
      accentClassName: "bg-[#ff4d5f]",
      icon: "message-square",
      isComplete: false,
      subtitle: `${vocabularyCount || 10} words`,
      title: "New words",
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 118,
            paddingTop: 18,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[430px] self-center">
          <View className="h-[52px] flex-row items-center">
            <View className="h-[42px] w-[42px] overflow-hidden rounded-full border border-[#fff0df] bg-[#fff8ef]">
              <Image
                className="h-full w-full"
                resizeMode="cover"
                source={{ uri: selectedLanguage.flag }}
              />
            </View>

            <Text
              className="ml-4 flex-1 font-poppins-semibold text-[19px] leading-[25px] text-text-primary"
              numberOfLines={1}
            >
              {greeting}, {learnerName}!
            </Text>

            <View className="mr-6 flex-row items-center gap-2">
              <Image
                className="h-[32px] w-[32px]"
                resizeMode="contain"
                source={images.streakFire}
              />
              <Text className="font-poppins-semibold text-[18px] leading-[24px] text-[#323b5f]">
                12
              </Text>
            </View>

            <Pressable
              accessibilityLabel="Notifications"
              className="h-11 w-9 items-end justify-center"
            >
              <Feather color="#0D132B" name="bell" size={27} strokeWidth={2.4} />
            </Pressable>
          </View>

          <View className="mt-[26px] h-[136px] overflow-hidden rounded-[20px] bg-[#fff8ef] px-6 py-5">
            <View className="flex-row">
              <View className="flex-1">
                <Text className="font-poppins-medium text-[17px] leading-[23px] text-[#323b5f]">
                  Daily goal
                </Text>
                <View className="mt-4 flex-row items-end">
                  <Text className="font-poppins-bold text-[32px] leading-[38px] text-text-primary">
                    {xpToday}
                  </Text>
                  <Text className="pb-1 pl-2 font-poppins-medium text-[18px] leading-[24px] text-[#7f8aa8]">
                    / {DAILY_GOAL_XP} XP
                  </Text>
                </View>
              </View>

              <Image
                className="h-[92px] w-[116px]"
                resizeMode="contain"
                source={images.treasure}
              />
            </View>

            <View className="mt-3 h-[8px] overflow-hidden rounded-full bg-[#ffe4c4]">
              <View
                className="h-full rounded-full bg-[#ff7a16]"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
          </View>

          <View className="mt-[26px] h-[184px] overflow-hidden rounded-[20px] bg-lingua-deep-purple">
            <View className="absolute bottom-0 right-0 h-[148px] w-[238px] opacity-95">
              <Image
                className="h-full w-full"
                resizeMode="contain"
                source={images.palace}
              />
            </View>
            <View className="absolute bottom-0 left-[170px] h-[118px] w-[128px] rounded-tl-[60px] bg-[#4534d7] opacity-45" />
            <View className="h-full justify-between px-6 py-6">
              <View>
                <Text className="font-poppins-medium text-[18px] leading-[24px] text-white">
                  Continue learning
                </Text>
                <Text
                  className="mt-3 font-poppins-semibold text-[29px] leading-[35px] text-white"
                  numberOfLines={1}
                >
                  {selectedLanguage.name}
                </Text>
                <Text className="mt-1 font-poppins-medium text-[20px] leading-[27px] text-white">
                  {unitLabel}
                </Text>
              </View>

              <Pressable
                className="h-[48px] w-[120px] items-center justify-center rounded-[14px] bg-white"
                onPress={() =>
                  posthog.capture('lesson_continued', {
                    language_code: languageCode,
                    language_name: selectedLanguage?.name ?? languageCode,
                    lesson_title: currentLesson?.title ?? '',
                  })
                }
              >
                <Text className="font-poppins-semibold text-[18px] leading-[24px] text-lingua-deep-purple">
                  Continue
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-[30px] flex-row items-center justify-between">
            <Text className="font-poppins-semibold text-[20px] leading-[27px] text-text-primary">
              {"Today's plan"}
            </Text>
            <Pressable accessibilityRole="button" className="px-1 py-1">
              <Text className="font-poppins-semibold text-[18px] leading-[24px] text-lingua-deep-purple">
                View all
              </Text>
            </Pressable>
          </View>

          <View className="mt-[22px] gap-[22px]">
            {planItems.map((item) => (
              <View className="flex-row items-center" key={item.title}>
                <View
                  className={`h-[50px] w-[50px] items-center justify-center rounded-[11px] ${item.accentClassName}`}
                >
                  <Feather color="#FFFFFF" name={item.icon} size={28} strokeWidth={2.5} />
                </View>

                <View className="ml-5 flex-1">
                  <Text className="font-poppins-semibold text-[17px] leading-[23px] text-text-primary">
                    {item.title}
                  </Text>
                  <Text
                    className="mt-1 font-poppins-regular text-[16px] leading-[21px] text-[#79839f]"
                    numberOfLines={1}
                  >
                    {item.subtitle}
                  </Text>
                </View>

                <View
                  className={`h-[28px] w-[28px] items-center justify-center rounded-full ${
                    item.isComplete
                      ? "bg-lingua-deep-purple"
                      : "border-2 border-[#8b94ad] bg-white"
                  }`}
                >
                  {item.isComplete ? (
                    <Feather color="#FFFFFF" name="check" size={19} strokeWidth={3} />
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <View className="mt-[36px] h-[126px] flex-row items-center overflow-hidden rounded-[18px] bg-[#f5fde9] px-5">
            <View className="flex-1">
              <Text className="font-poppins-medium text-[16px] leading-[22px] text-[#6e7895]">
                Next up
              </Text>
              <Text className="mt-2 font-poppins-semibold text-[21px] leading-[28px] text-text-primary">
                AI Video Call
              </Text>
              <Text className="mt-1 font-poppins-regular text-[16px] leading-[22px] text-[#59637f]">
                Practice speaking
              </Text>
            </View>

            <Image
              className="h-[96px] w-[96px] rounded-full"
              resizeMode="cover"
              source={{ uri: images.teacherPortrait }}
            />

            <Pressable
              accessibilityLabel="Start AI video call"
              className="ml-4 h-[54px] w-[54px] items-center justify-center rounded-full bg-[#45c61a]"
              onPress={() =>
                posthog.capture('ai_video_call_started', {
                  language_code: languageCode,
                  language_name: selectedLanguage?.name ?? languageCode,
                })
              }
            >
              <Feather color="#FFFFFF" name="video" size={29} strokeWidth={3} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },
});
