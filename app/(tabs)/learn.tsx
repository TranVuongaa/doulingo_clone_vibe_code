import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LessonCard, type LessonCardStatus } from "@/components/lesson-card";
import { images } from "@/constants/images";
import { getLanguageByCode, languages } from "@/data/languages";
import { getLessonsByLanguage } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { useLearningStore } from "@/store/use-learning-store";
import type { Lesson } from "@/types/learning";

type LessonSceneKey = keyof typeof images.lessonScenes;

const cardArtwork: ImageSourcePropType[] = [
  images.mascotWelcome,
  images.treasure,
  images.palace,
  images.earth,
  images.mascotAuth,
  images.mascotLogo,
];

function getDefaultLesson(lessons: Lesson[]) {
  return lessons[2] ?? lessons[0] ?? null;
}

function getCardArtwork(lesson: Lesson) {
  return cardArtwork[(lesson.order - 1) % cardArtwork.length];
}

function getLessonSceneKey(lesson: Lesson): LessonSceneKey {
  const searchableText = `${lesson.title} ${lesson.subtitle} ${lesson.icon}`.toLowerCase();

  if (searchableText.includes("cafe") || searchableText.includes("coffee")) {
    return "cafe";
  }

  if (searchableText.includes("travel") || searchableText.includes("map")) {
    return "travel";
  }

  if (searchableText.includes("shopping")) {
    return "shopping";
  }

  if (searchableText.includes("family") || searchableText.includes("friends")) {
    return "family";
  }

  if (
    searchableText.includes("introduce") ||
    searchableText.includes("conversation")
  ) {
    return "conversation";
  }

  return "vocabulary";
}

function getLessonStatus(
  lesson: Lesson,
  selectedLesson: Lesson,
): LessonCardStatus {
  if (lesson.id === selectedLesson.id) {
    return "in-progress";
  }

  return lesson.order < selectedLesson.order ? "completed" : "upcoming";
}

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const selectedLanguageCode = useLearningStore(
    (state) => state.selectedLanguageCode,
  );

  const selectedLanguage =
    getLanguageByCode(selectedLanguageCode ?? "es") ?? languages[0];
  const languageCode = selectedLanguage.code;
  const lessons = useMemo(
    () => getLessonsByLanguage(languageCode),
    [languageCode],
  );
  const units = useMemo(() => getUnitsByLanguage(languageCode), [languageCode]);
  const unit = units[0];
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    const defaultLesson = getDefaultLesson(lessons);

    if (!defaultLesson) {
      setSelectedLessonId(null);
      return;
    }

    setSelectedLessonId((currentLessonId) => {
      const currentLessonStillExists = lessons.some(
        (lesson) => lesson.id === currentLessonId,
      );

      return currentLessonStillExists ? currentLessonId : defaultLesson.id;
    });
  }, [lessons]);

  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) ??
    getDefaultLesson(lessons);
  const selectedScene = selectedLesson
    ? images.lessonScenes[getLessonSceneKey(selectedLesson)]
    : images.lessonScenes.vocabulary;
  const completedLessonCount = selectedLesson
    ? Math.max(selectedLesson.order - 1, 0)
    : 0;
  const unitTitle = unit?.title ?? `${selectedLanguage.name} basics`;

  function handleBackPress() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/home");
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[430px] self-center">
          <View className="h-[66px] flex-row items-center px-4">
            <Pressable
              accessibilityLabel="Go back"
              className="h-11 w-11 items-start justify-center"
              onPress={handleBackPress}
            >
              <Feather color="#101832" name="chevron-left" size={32} />
            </Pressable>

            <View className="flex-1">
              <Text
                className="font-poppins-semibold text-[21px] leading-[28px] text-text-primary"
                numberOfLines={1}
              >
                {selectedLesson?.title ?? unitTitle}
              </Text>
              <Text
                className="mt-0.5 font-poppins-medium text-[15px] leading-[21px] text-[#6f7897]"
                numberOfLines={1}
              >
                Unit {unit?.order ?? 1} • {completedLessonCount + 1} /{" "}
                {lessons.length} lessons
              </Text>
            </View>

            <Pressable
              accessibilityLabel="Save unit"
              className="h-11 w-9 items-end justify-center"
            >
              <Feather color="#6C4EF5" name="bookmark" size={27} />
            </Pressable>
          </View>

          <View className="h-[268px] overflow-hidden bg-[#eaf6ff]">
            <Image
              className="h-full w-full"
              resizeMode="cover"
              source={{ uri: selectedScene }}
            />
            <View className="absolute inset-0 bg-white opacity-25" />
            <View className="absolute left-[-34px] top-[110px] h-[138px] w-[138px] rounded-full bg-[#b9e36f] opacity-80" />
            <View className="absolute right-[-58px] top-[132px] h-[172px] w-[172px] rounded-full bg-[#93d85a] opacity-80" />

            <Image
              className="absolute bottom-[-22px] left-[90px] h-[190px] w-[190px]"
              resizeMode="contain"
              source={images.mascotLogo}
            />
            <Image
              className="absolute bottom-[-12px] right-[-12px] h-[150px] w-[150px]"
              resizeMode="contain"
              source={getCardArtwork(selectedLesson ?? lessons[0])}
            />
          </View>

          <View style={styles.segmentedControl}>
            <View className="flex-1 items-center justify-center border-b-[4px] border-lingua-deep-purple">
              <Text className="font-poppins-semibold text-[16px] leading-[22px] text-lingua-deep-purple">
                Lessons
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              className="flex-1 items-center justify-center"
            >
              <Text className="font-poppins-medium text-[16px] leading-[22px] text-[#4f5a78]">
                Practice
              </Text>
            </Pressable>
          </View>

          <View className="mt-[20px] gap-[8px] px-4">
            {lessons.map((lesson) => {
              const status = selectedLesson
                ? getLessonStatus(lesson, selectedLesson)
                : "upcoming";

              return (
                <LessonCard
                  artworkSource={getCardArtwork(lesson)}
                  key={lesson.id}
                  lessonNumber={lesson.order}
                  onPress={() => setSelectedLessonId(lesson.id)}
                  progressLabel={
                    status === "in-progress"
                      ? "In progress"
                      : `0 / ${lessons.length} lessons`
                  }
                  status={status}
                  title={lesson.title}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  segmentedControl: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    height: 70,
    marginHorizontal: 14,
    marginTop: -46,
    overflow: "hidden",
    shadowColor: "#4E5A80",
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
  },
});
