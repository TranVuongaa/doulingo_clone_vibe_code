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
    lessonIds: ["es-greetings-1", "es-cafe-1", "es-review-1"],
  },
  {
    id: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    title: "Bonjour basics",
    subtitle: "Say hello and introduce yourself",
    description: "Build a tiny French toolkit for polite first conversations.",
    color: "#4D8BFF",
    lessonIds: ["fr-greetings-1", "fr-introductions-1", "fr-review-1"],
  },
  {
    id: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    title: "Konnichiwa basics",
    subtitle: "Use warm everyday greetings",
    description: "Practice short Japanese phrases for meeting someone new.",
    color: "#FF4D6D",
    lessonIds: ["ja-greetings-1", "ja-thanks-1", "ja-review-1"],
  },
];

export function getUnitsByLanguage(languageCode: LanguageCode) {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}
