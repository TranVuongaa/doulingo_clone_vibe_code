export type LanguageCode = "es" | "fr" | "ja" | "ko" | "de" | "zh";

export type LessonKind =
  | "vocabulary"
  | "phrases"
  | "conversation"
  | "review"
  | "ai-teacher";

export type ActivityKind =
  | "vocabulary-card"
  | "multiple-choice"
  | "translate"
  | "listen-repeat"
  | "match-pairs"
  | "speaking-practice";

export type LearningLanguage = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  courseTitle: string;
  description: string;
  accentColor: string;
  learnerCountLabel: string;
  beginnerLevel: string;
  estimatedLessons: number;
};

export type LearningUnit = {
  id: string;
  languageCode: LanguageCode;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  lessonIds: string[];
};

export type LessonGoal = {
  id: string;
  text: string;
};

export type VocabularyItem = {
  id: string;
  term: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "phrase" | "interjection";
  example: string;
};

export type PhraseItem = {
  id: string;
  text: string;
  translation: string;
  pronunciation: string;
  usageNote: string;
};

export type ActivityOption = {
  id: string;
  text: string;
};

export type MatchPair = {
  id: string;
  left: string;
  right: string;
};

type BaseActivity = {
  id: string;
  kind: ActivityKind;
  title: string;
  prompt: string;
  xp: number;
};

export type VocabularyCardActivity = BaseActivity & {
  kind: "vocabulary-card";
  vocabularyIds: string[];
};

export type MultipleChoiceActivity = BaseActivity & {
  kind: "multiple-choice";
  question: string;
  options: ActivityOption[];
  correctOptionId: string;
  explanation: string;
};

export type TranslateActivity = BaseActivity & {
  kind: "translate";
  phraseId: string;
  acceptedAnswers: string[];
};

export type ListenRepeatActivity = BaseActivity & {
  kind: "listen-repeat";
  phraseId: string;
  audioScript: string;
  coachTip: string;
};

export type MatchPairsActivity = BaseActivity & {
  kind: "match-pairs";
  pairs: MatchPair[];
};

export type SpeakingPracticeActivity = BaseActivity & {
  kind: "speaking-practice";
  phraseId: string;
  targetText: string;
  coachPrompt: string;
};

export type LessonActivity =
  | VocabularyCardActivity
  | MultipleChoiceActivity
  | TranslateActivity
  | ListenRepeatActivity
  | MatchPairsActivity
  | SpeakingPracticeActivity;

export type AiTeacherPrompt = {
  persona: string;
  lessonBrief: string;
  objectives: string[];
  teachingStyle: string;
  correctionStyle: string;
  wrapUpPrompt: string;
};

export type Lesson = {
  id: string;
  languageCode: LanguageCode;
  unitId: string;
  order: number;
  kind: LessonKind;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  xpReward: number;
  estimatedMinutes: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  activities: LessonActivity[];
  aiTeacherPrompt: AiTeacherPrompt;
};
