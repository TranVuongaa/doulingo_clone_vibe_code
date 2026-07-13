import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
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

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
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
      className={`h-[88px] flex-row items-center rounded-[22px] bg-white px-4 ${
        isSelected
          ? "border-2 border-lingua-purple bg-[#fbfaff]"
          : "border border-[#f2f3f8]"
      }`}
      onPress={onPress}
    >
      <View className="h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border border-[#eef0f6] bg-white">
        <Image
          source={{ uri: language.flag }}
          className="h-[52px] w-[52px]"
          resizeMode="cover"
        />
      </View>

      <View className="ml-5 flex-1">
        <Text className="font-poppins-semibold text-[20px] leading-[26px] text-text-primary">
          {language.name}
        </Text>
        <Text className="mt-1 font-poppins-regular text-[15px] leading-[20px] text-[#6f7897]">
          {language.learnerCountLabel}
        </Text>
      </View>

      {isSelected ? (
        <View className="h-[38px] w-[38px] items-center justify-center rounded-full border-b-[3px] border-[#4e34de] bg-lingua-deep-purple">
          <Feather color="#FFFFFF" name="check" size={24} strokeWidth={3} />
        </View>
      ) : (
        <Feather color="#626b89" name="chevron-right" size={30} />
      )}
    </Pressable>
  );
}

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [selectedLanguageCode, setSelectedLanguageCode] =
    useState<LanguageCode>("es");

  const selectedLanguage =
    languages.find((language) => language.code === selectedLanguageCode) ??
    languages[0];

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

    router.replace("/");
  }

  function handleConfirmPress() {
    router.replace("/");
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 22,
            paddingTop: insets.top + 16,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[430px] flex-1 self-center">
          <View className="h-14 flex-row items-center">
            <Pressable
              accessibilityLabel="Go back"
              className="h-12 w-12 items-start justify-center"
              onPress={handleBackPress}
            >
              <Feather color="#0D132B" name="chevron-left" size={36} />
            </Pressable>
            <Text className="flex-1 pr-12 text-center font-poppins-semibold text-[24px] leading-[32px] text-text-primary">
              Choose a language
            </Text>
          </View>

          <View className="mt-7 h-[68px] flex-row items-center rounded-[32px] border border-[#e9ebf2] bg-[#fbfbfd] px-5">
            <Feather color="#53617e" name="search" size={29} />
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

          <Text className="mt-9 font-poppins-semibold text-[20px] leading-[26px] text-text-primary">
            Popular
          </Text>

          <View className="mt-6 gap-1">
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
            className="mt-6 h-[78px] flex-row items-center justify-center gap-3 rounded-[24px] border-b-[4px] border-[#4e34de] bg-lingua-deep-purple px-6"
            onPress={handleConfirmPress}
          >
            <Feather color="#FFFFFF" name="check-circle" size={27} />
            <Text className="font-poppins-semibold text-[19px] leading-[25px] text-white">
              Continue with {selectedLanguage.name}
            </Text>
          </Pressable>

          <View className="mt-5 h-[184px] overflow-hidden">
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
    paddingHorizontal: 28,
  },
  searchInput: {
    color: "#0D132B",
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 19,
    lineHeight: 25,
    marginLeft: 16,
    padding: 0,
  },
});
