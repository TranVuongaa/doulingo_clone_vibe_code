import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLearningStore } from "@/store/use-learning-store";
import type { LanguageCode, LearningLanguage } from "@/types/learning";

function LanguageRow({
  isSelected,
  language,
  onPress,
}: {
  isSelected: boolean;
  language: LearningLanguage;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`h-[76px] flex-row items-center rounded-[18px] bg-white px-3.5 ${
        isSelected
          ? "border-2 border-lingua-purple bg-[#fbfaff]"
          : "border border-[#f2f3f8]"
      }`}
      onPress={onPress}
    >
      <View className="h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-full border border-[#eef0f6] bg-white">
        <Image
          source={{ uri: language.flag }}
          className="h-[46px] w-[46px]"
          resizeMode="cover"
        />
      </View>

      <View className="ml-4 flex-1">
        <Text className="font-poppins-semibold text-[17px] leading-[23px] text-text-primary">
          {language.name}
        </Text>
        <Text className="mt-0.5 font-poppins-regular text-[13px] leading-[18px] text-[#6f7897]">
          {language.learnerCountLabel}
        </Text>
      </View>

      {isSelected ? (
        <View className="h-[34px] w-[34px] items-center justify-center rounded-full border-b-[2px] border-[#4e34de] bg-lingua-deep-purple">
          <Feather color="#FFFFFF" name="check" size={21} strokeWidth={3} />
        </View>
      ) : (
        <Feather color="#626b89" name="chevron-right" size={26} />
      )}
    </Pressable>
  );
}

export default function LanguageScreen() {
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
  const savedLanguageCode = useLearningStore(
    (state) => state.selectedLanguageCode,
  );
  const selectLanguage = useLearningStore((state) => state.selectLanguage);
  const [query, setQuery] = useState("");
  const [selectedLanguageCode, setSelectedLanguageCode] =
    useState<LanguageCode>(savedLanguageCode ?? "es");

  const selectedLanguage =
    languages.find((language) => language.code === selectedLanguageCode) ??
    languages[0];

  useEffect(() => {
    if (savedLanguageCode) {
      setSelectedLanguageCode(savedLanguageCode);
    }
  }, [savedLanguageCode]);

  const visibleLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return languages;
    }

    return languages.filter((language) => {
      const searchableText = `${language.name} ${language.nativeName}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [query]);

  function handleBackPress() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/home");
  }

  function handleConfirmPress() {
    selectLanguage(selectedLanguageCode);
    posthog.capture('language_selected', {
      language_code: selectedLanguageCode,
      language_name: selectedLanguage?.name ?? selectedLanguageCode,
    });
    router.replace("/home");
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 18,
            paddingTop: 12,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[430px] flex-1 self-center">
          <View className="h-14 flex-row items-center">
            <Pressable
              accessibilityLabel="Go back"
              className="h-11 w-11 items-start justify-center"
              onPress={handleBackPress}
            >
              <Feather color="#0D132B" name="chevron-left" size={31} />
            </Pressable>
            <Text className="flex-1 pr-10 text-center font-poppins-semibold text-[21px] leading-[28px] text-text-primary">
              Choose a language
            </Text>
          </View>

          <View className="mt-5 h-[58px] flex-row items-center rounded-[28px] border border-[#e9ebf2] bg-[#fbfbfd] px-4">
            <Feather color="#53617e" name="search" size={25} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Search languages"
              placeholderTextColor="#717a96"
              style={styles.searchInput}
              value={query}
            />
          </View>

          <Text className="mt-6 font-poppins-semibold text-[17px] leading-[23px] text-text-primary">
            Popular
          </Text>

          <View className="mt-4 gap-1">
            {visibleLanguages.map((language) => (
              <LanguageRow
                isSelected={language.code === selectedLanguageCode}
                key={language.code}
                language={language}
                onPress={() => setSelectedLanguageCode(language.code)}
              />
            ))}
          </View>

          <Pressable
            className="mt-5 h-[66px] flex-row items-center justify-center gap-2 rounded-[20px] border-b-[3px] border-[#4e34de] bg-lingua-deep-purple px-5"
            onPress={handleConfirmPress}
          >
            <Feather color="#FFFFFF" name="check-circle" size={23} />
            <Text className="font-poppins-semibold text-[16px] leading-[22px] text-white">
              Continue with {selectedLanguage.name}
            </Text>
          </Pressable>

          <View className="mt-4 h-[160px] overflow-hidden">
            <Image
              source={images.earth}
              className="absolute bottom-[-8px] h-[210px] w-full"
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  searchInput: {
    color: "#0D132B",
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 12,
    padding: 0,
  },
});
