import type { LanguageCode, LearningUnit } from "@/types/learning";

export const units: LearningUnit[] = [
  {
    id: "es-unit-1",
    languageCode: "es",
    order: 1,
    title: "Hola basics",
    subtitle: "Greet people and be polite",
    description: "Learn the first Spanish words you can use in any friendly chat.",
    color: "#FF6B35",
    lessonIds: [
      "es-greetings-1",
      "es-cafe-1",
      "es-review-1",
      "es-travel-1",
      "es-shopping-1",
      "es-family-1",
    ],
  },
  {
    id: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    title: "Bonjour basics",
    subtitle: "Say hello and introduce yourself",
    description: "Build a tiny French toolkit for polite first conversations.",
    color: "#4D8BFF",
    lessonIds: [
      "fr-greetings-1",
      "fr-introductions-1",
      "fr-review-1",
      "fr-cafe-1",
      "fr-travel-1",
      "fr-family-1",
    ],
  },
  {
    id: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    title: "Konnichiwa basics",
    subtitle: "Use warm everyday greetings",
    description: "Practice short Japanese phrases for meeting someone new.",
    color: "#FF4D6D",
    lessonIds: [
      "ja-greetings-1",
      "ja-thanks-1",
      "ja-review-1",
      "ja-cafe-1",
      "ja-travel-1",
      "ja-family-1",
    ],
  },
  {
    id: "de-unit-1",
    languageCode: "de",
    order: 1,
    title: "Hallo basics",
    subtitle: "Greet people and get around",
    description: "Learn German greetings, cafe phrases, travel words, and people words.",
    color: "#FFC800",
    lessonIds: [
      "de-greetings-1",
      "de-cafe-1",
      "de-review-1",
      "de-travel-1",
      "de-shopping-1",
      "de-family-1",
    ],
  },
];

export function getUnitsByLanguage(languageCode: LanguageCode) {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}
