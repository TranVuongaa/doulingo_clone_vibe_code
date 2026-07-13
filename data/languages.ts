import type { LanguageCode, LearningLanguage } from "@/types/learning";

export const languages: LearningLanguage[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Espanol",
    flag: "https://flagcdn.com/w320/es.png",
    courseTitle: "Spanish for everyday travel",
    description:
      "Start with friendly greetings, cafe phrases, and simple chats.",
    accentColor: "#FF6B35",
    learnerCountLabel: "28.4M learners",
    beginnerLevel: "Beginner A1",
    estimatedLessons: 3,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Francais",
    flag: "https://flagcdn.com/w320/fr.png",
    courseTitle: "French for first conversations",
    description: "Practice polite greetings, introductions, and useful basics.",
    accentColor: "#4D8BFF",
    learnerCountLabel: "19.4M learners",
    beginnerLevel: "Beginner A1",
    estimatedLessons: 3,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "Nihongo",
    flag: "https://flagcdn.com/w320/jp.png",
    courseTitle: "Japanese for warm introductions",
    description: "Learn simple greetings, thanks, and first-meeting phrases.",
    accentColor: "#FF4D6D",
    learnerCountLabel: "12.7M learners",
    beginnerLevel: "Beginner A1",
    estimatedLessons: 3,
  },
  // {
  //   code: "ko",
  //   name: "Korean",
  //   nativeName: "Hanguk-eo",
  //   flag: "https://flagcdn.com/w320/kr.png",
  //   courseTitle: "Korean for everyday greetings",
  //   description: "Practice friendly hellos, thanks, and simple introductions.",
  //   accentColor: "#6C4EF5",
  //   learnerCountLabel: "9.3M learners",
  //   beginnerLevel: "Beginner A1",
  //   estimatedLessons: 0,
  // },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "https://flagcdn.com/w320/de.png",
    courseTitle: "German for first conversations",
    description:
      "Learn polite greetings and useful phrases for everyday chats.",
    accentColor: "#FFC800",
    learnerCountLabel: "8.1M learners",
    beginnerLevel: "Beginner A1",
    estimatedLessons: 0,
  },
  // {
  //   code: "zh",
  //   name: "Chinese",
  //   nativeName: "Zhongwen",
  //   flag: "https://flagcdn.com/w320/cn.png",
  //   courseTitle: "Chinese for warm introductions",
  //   description: "Start with simple greetings, thanks, and first phrases.",
  //   accentColor: "#FF4D4F",
  //   learnerCountLabel: "7.4M learners",
  //   beginnerLevel: "Beginner A1",
  //   estimatedLessons: 0,
  // },
];

export function getLanguageByCode(code: LanguageCode) {
  return languages.find((language) => language.code === code);
}
