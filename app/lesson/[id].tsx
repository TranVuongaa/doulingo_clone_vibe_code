import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// eslint-disable-next-line import/no-unresolved
import { LessonAudioCall } from "@/components/lesson-audio-call";
import { images } from "@/constants/images";
import { getLanguageByCode, languages } from "@/data/languages";
import { getLessonById, getLessonsByLanguage } from "@/data/lessons";
import { useLearningStore } from "@/store/use-learning-store";

type FeatherIconName = keyof typeof Feather.glyphMap;

const tabs: { href: "/home" | "/learn" | "/ai-teacher" | "/chat" | "/profile"; icon: FeatherIconName; label: string }[] = [
  { href: "/home", icon: "home", label: "Home" },
  { href: "/learn", icon: "book-open", label: "Learn" },
  { href: "/ai-teacher", icon: "disc", label: "AI Teacher" },
  { href: "/chat", icon: "message-circle", label: "Chat" },
  { href: "/profile", icon: "user", label: "Profile" },
];

export default function AudioLessonScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const selectedLanguageCode = useLearningStore(
    (state) => state.selectedLanguageCode,
  );
  const [showSubtitles, setShowSubtitles] = useState(true);

  const lesson = useMemo(() => {
    const lessonId = Array.isArray(id) ? id[0] : id;
    const selectedLesson = lessonId ? getLessonById(lessonId) : undefined;

    return (
      selectedLesson ??
      getLessonsByLanguage(selectedLanguageCode ?? "es")[0] ??
      getLessonsByLanguage("es")[0]
    );
  }, [id, selectedLanguageCode]);

  const language =
    getLanguageByCode(lesson?.languageCode ?? selectedLanguageCode ?? "es") ??
    languages[0];
  const phrase = lesson?.phrases[0];
  const goal = lesson?.goals[0]?.text ?? "Practice a useful new phrase";
  const teacherPrompt =
    lesson?.aiTeacherPrompt.persona ?? "A friendly language coach";

  function leaveLesson() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/learn");
  }

  if (!lesson || !language) {
    return null;
  }

  return (
    <View className="flex-1 bg-[#f8f8fb]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 92 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[430px] self-center bg-[#f8f8fb]">
          <View className="h-[112px] flex-row items-center px-4">
            <Pressable
              accessibilityLabel="Back to lessons"
              accessibilityRole="button"
              className="h-12 w-12 items-start justify-center"
              onPress={leaveLesson}
            >
              <Feather color="#101832" name="chevron-left" size={34} />
            </Pressable>

            <View className="flex-1">
              <Text
                className="font-poppins-semibold text-[22px] leading-[28px] text-text-primary"
                numberOfLines={1}
              >
                AI Teacher
              </Text>
              <View className="mt-1 flex-row items-center gap-2">
                <View className="h-3 w-3 rounded-full bg-[#20c915]" />
                <Text
                  className="font-poppins-regular text-[14px] leading-[20px] text-[#68718e]"
                  numberOfLines={1}
                >
                  {language.name} • Audio lesson
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <View className="h-11 w-11 items-center justify-center rounded-full border border-[#e7e9f1] bg-white opacity-50">
                <Feather color="#101832" name="video-off" size={21} />
              </View>
              <View className="h-11 min-w-11 items-center justify-center rounded-full border border-[#e7e9f1] bg-white px-2">
                <Text className="font-poppins-medium text-[15px] text-text-primary">
                  {lesson.estimatedMinutes}:00
                </Text>
              </View>
              <View className="h-11 w-11 items-center justify-center rounded-full border border-[#e7e9f1] bg-white">
                <Feather color="#101832" name="bell" size={21} />
              </View>
            </View>
          </View>

          <View className="mx-3 overflow-hidden rounded-[24px] bg-[#d8c8b7]" style={styles.stage}>
            <ImageBackground
              className="flex-1 justify-end"
              imageStyle={styles.stageImage}
              resizeMode="cover"
              source={images.audioTeacherStage}
            >
              <View className="absolute left-4 top-4 max-w-[245px] rounded-[16px] bg-[#151a2dcc] px-4 py-3">
                <Text className="font-poppins-semibold text-[11px] uppercase leading-[15px] text-[#c9bdff]">
                  {lesson.title}
                </Text>
                <Text className="mt-1 font-poppins-medium text-[13px] leading-[18px] text-white" numberOfLines={2}>
                  Goal: {goal}
                </Text>
              </View>

              {showSubtitles ? (
                <View className="mx-5 mb-5 rounded-[20px] bg-white px-5 py-4" style={styles.speechBubble}>
                  <Text className="font-poppins-semibold text-[16px] leading-[23px] text-text-primary">
                    {phrase?.text ?? lesson.subtitle}
                  </Text>
                  <Text className="mt-1 font-poppins-medium text-[15px] leading-[22px] text-text-primary">
                    {phrase?.translation ?? lesson.description} 👏
                  </Text>
                  <View className="absolute right-4 top-1/2 h-10 w-10 items-center justify-center rounded-full bg-[#f0edff]">
                    <Feather color="#6346f5" name="volume-2" size={23} />
                  </View>
                </View>
              ) : (
                <View className="mx-5 mb-5 self-center rounded-full bg-[#151a2dcc] px-4 py-2">
                  <Text className="font-poppins-medium text-[12px] text-white">
                    Subtitles are off
                  </Text>
                </View>
              )}
            </ImageBackground>
          </View>

          <LessonAudioCall
            lesson={lesson}
            onLeave={leaveLesson}
            onSubtitlesChange={() =>
              setShowSubtitles((current) => !current)
            }
            showSubtitles={showSubtitles}
          />

          <View className="mx-4 rounded-[22px] bg-white px-3 py-5" style={styles.feedbackCard}>
            <View className="flex-row">
              <FeedbackMetric color="#20c915" label="Speaking" value="Excellent" />
              <FeedbackMetric color="#1685ff" label="Pronunciation" value="Great" withBorder />
              <FeedbackMetric color="#6346f5" label="Grammar" value="Good" withBorder />
            </View>
            <View className="mt-5 border-t border-[#eceef4] pt-4">
              <Text className="font-poppins-semibold text-[11px] uppercase leading-[15px] text-[#858da6]">
                Teacher context
              </Text>
              <Text className="mt-1 font-poppins-regular text-[12px] leading-[18px] text-[#535d79]" numberOfLines={2}>
                {teacherPrompt} {lesson.aiTeacherPrompt.lessonBrief}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-[#eef0f6] bg-white px-2 pt-2"
        style={{ paddingBottom: Math.max(insets.bottom, 6) }}
      >
        <View className="w-full max-w-[430px] flex-row self-center">
          {tabs.map((tab) => {
            const isActive = tab.label === "Learn";

            return (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                className="flex-1 items-center justify-center gap-1"
                key={tab.label}
                onPress={() => router.replace(tab.href)}
              >
                <Feather
                  color={isActive ? "#6346f5" : "#7e87a3"}
                  name={tab.icon}
                  size={22}
                  strokeWidth={isActive ? 2.8 : 2.1}
                />
                <Text
                  className={`font-poppins-medium text-[9px] leading-[12px] ${isActive ? "text-[#6346f5]" : "text-[#7e87a3]"}`}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function FeedbackMetric({
  color,
  label,
  value,
  withBorder = false,
}: {
  color: string;
  label: string;
  value: string;
  withBorder?: boolean;
}) {
  return (
    <View className={`flex-1 items-center px-1 ${withBorder ? "border-l border-[#e8eaf1]" : ""}`}>
      <Text className="text-center font-poppins-medium text-[12px] leading-[17px] text-text-primary">
        {label}
      </Text>
      <Text className="mt-2 text-center font-poppins-medium text-[12px] leading-[17px]" style={{ color }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackCard: {
    boxShadow: "0 8px 22px rgba(61, 72, 104, 0.08)",
  },
  speechBubble: {
    paddingRight: 62,
    boxShadow: "0 8px 16px rgba(32, 40, 63, 0.16)",
  },
  stage: {
    height: 560,
  },
  stageImage: {
    borderRadius: 24,
  },
});
