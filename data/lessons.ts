import type { LanguageCode, Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  {
    id: "es-greetings-1",
    languageCode: "es",
    unitId: "es-unit-1",
    order: 1,
    kind: "ai-teacher",
    title: "Say hello",
    subtitle: "Hola, adios, and gracias",
    description: "Meet your first Spanish greetings and practice saying them aloud.",
    icon: "wave",
    xpReward: 15,
    estimatedMinutes: 4,
    goals: [
      { id: "es-greetings-goal-1", text: "Recognize three common greetings" },
      { id: "es-greetings-goal-2", text: "Say hello and goodbye clearly" },
      { id: "es-greetings-goal-3", text: "Use gracias in a simple sentence" },
    ],
    vocabulary: [
      {
        id: "es-vocab-hola",
        term: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
        partOfSpeech: "interjection",
        example: "Hola, Sofia.",
      },
      {
        id: "es-vocab-adios",
        term: "adios",
        translation: "goodbye",
        pronunciation: "ah-DYOS",
        partOfSpeech: "interjection",
        example: "Adios, Marco.",
      },
      {
        id: "es-vocab-gracias",
        term: "gracias",
        translation: "thank you",
        pronunciation: "GRAH-syahs",
        partOfSpeech: "interjection",
        example: "Gracias, Ana.",
      },
    ],
    phrases: [
      {
        id: "es-phrase-hola",
        text: "Hola.",
        translation: "Hello.",
        pronunciation: "OH-lah",
        usageNote: "Use it with friends, classmates, and teachers.",
      },
      {
        id: "es-phrase-gracias",
        text: "Gracias.",
        translation: "Thank you.",
        pronunciation: "GRAH-syahs",
        usageNote: "A polite word you can use all day.",
      },
    ],
    activities: [
      {
        id: "es-greetings-activity-1",
        kind: "vocabulary-card",
        title: "Meet the words",
        prompt: "Tap through each new greeting.",
        xp: 3,
        vocabularyIds: ["es-vocab-hola", "es-vocab-adios", "es-vocab-gracias"],
      },
      {
        id: "es-greetings-activity-2",
        kind: "multiple-choice",
        title: "Choose the meaning",
        prompt: "Pick the English meaning.",
        xp: 4,
        question: "What does hola mean?",
        options: [
          { id: "hello", text: "hello" },
          { id: "goodbye", text: "goodbye" },
          { id: "please", text: "please" },
        ],
        correctOptionId: "hello",
        explanation: "Hola means hello.",
      },
      {
        id: "es-greetings-activity-3",
        kind: "listen-repeat",
        title: "Listen and repeat",
        prompt: "Repeat the greeting after your teacher.",
        xp: 4,
        phraseId: "es-phrase-hola",
        audioScript: "Hola.",
        coachTip: "Keep the h sound silent and open the final a.",
      },
      {
        id: "es-greetings-activity-4",
        kind: "speaking-practice",
        title: "Say thanks",
        prompt: "Say the phrase out loud.",
        xp: 4,
        phraseId: "es-phrase-gracias",
        targetText: "Gracias.",
        coachPrompt: "Smile as you say it. Spanish vowels stay bright and clear.",
      },
    ],
    aiTeacherPrompt: {
      persona: "A warm Spanish teacher who keeps the learner relaxed and smiling.",
      lessonBrief:
        "Teach hola, adios, and gracias with short audio-first practice.",
      objectives: [
        "Model each word slowly, then at natural speed.",
        "Ask the learner to repeat hola and gracias.",
        "Celebrate effort and correct pronunciation gently.",
      ],
      teachingStyle:
        "Use short English instructions and tiny Spanish examples. Keep turns under 15 seconds.",
      correctionStyle:
        "Correct only one sound at a time and immediately let the learner try again.",
      wrapUpPrompt:
        "End by asking the learner to say Hola and Gracias together in one friendly exchange.",
    },
  },
  {
    id: "es-cafe-1",
    languageCode: "es",
    unitId: "es-unit-1",
    order: 2,
    kind: "phrases",
    title: "Cafe words",
    subtitle: "Please, water, and coffee",
    description: "Practice tiny phrases for ordering something simple.",
    icon: "coffee",
    xpReward: 15,
    estimatedMinutes: 5,
    goals: [
      { id: "es-cafe-goal-1", text: "Recognize cafe vocabulary" },
      { id: "es-cafe-goal-2", text: "Ask for water politely" },
    ],
    vocabulary: [
      {
        id: "es-vocab-agua",
        term: "agua",
        translation: "water",
        pronunciation: "AH-gwah",
        partOfSpeech: "noun",
        example: "Agua, por favor.",
      },
      {
        id: "es-vocab-cafe",
        term: "cafe",
        translation: "coffee",
        pronunciation: "kah-FEH",
        partOfSpeech: "noun",
        example: "Cafe, por favor.",
      },
      {
        id: "es-vocab-por-favor",
        term: "por favor",
        translation: "please",
        pronunciation: "por fah-VOR",
        partOfSpeech: "phrase",
        example: "Agua, por favor.",
      },
    ],
    phrases: [
      {
        id: "es-phrase-water-please",
        text: "Agua, por favor.",
        translation: "Water, please.",
        pronunciation: "AH-gwah, por fah-VOR",
        usageNote: "A short polite order at a cafe or restaurant.",
      },
      {
        id: "es-phrase-coffee-please",
        text: "Cafe, por favor.",
        translation: "Coffee, please.",
        pronunciation: "kah-FEH, por fah-VOR",
        usageNote: "Use this when ordering a coffee.",
      },
    ],
    activities: [
      {
        id: "es-cafe-activity-1",
        kind: "match-pairs",
        title: "Match cafe words",
        prompt: "Match each Spanish word to English.",
        xp: 5,
        pairs: [
          { id: "agua", left: "agua", right: "water" },
          { id: "cafe", left: "cafe", right: "coffee" },
          { id: "por-favor", left: "por favor", right: "please" },
        ],
      },
      {
        id: "es-cafe-activity-2",
        kind: "translate",
        title: "Translate the order",
        prompt: "Translate: Water, please.",
        xp: 5,
        phraseId: "es-phrase-water-please",
        acceptedAnswers: ["Agua, por favor.", "Agua por favor"],
      },
      {
        id: "es-cafe-activity-3",
        kind: "listen-repeat",
        title: "Order coffee",
        prompt: "Repeat the cafe phrase.",
        xp: 5,
        phraseId: "es-phrase-coffee-please",
        audioScript: "Cafe, por favor.",
        coachTip: "Put the stress at the end of cafe.",
      },
    ],
    aiTeacherPrompt: {
      persona: "A patient cafe roleplay coach for beginner Spanish.",
      lessonBrief:
        "Help the learner order water and coffee using por favor.",
      objectives: [
        "Review agua, cafe, and por favor.",
        "Practice one water order and one coffee order.",
        "Run a tiny cafe roleplay.",
      ],
      teachingStyle:
        "Act like a friendly cafe worker. Give the learner one phrase at a time.",
      correctionStyle:
        "If the learner misses por favor, remind them that politeness is the goal.",
      wrapUpPrompt:
        "Finish with a mini order: the learner asks for either water or coffee.",
    },
  },
  {
    id: "es-review-1",
    languageCode: "es",
    unitId: "es-unit-1",
    order: 3,
    kind: "review",
    title: "First review",
    subtitle: "Greetings and cafe basics",
    description: "Review your first Spanish words in quick mixed practice.",
    icon: "star",
    xpReward: 20,
    estimatedMinutes: 5,
    goals: [
      { id: "es-review-goal-1", text: "Recall greetings without hints" },
      { id: "es-review-goal-2", text: "Use one polite cafe phrase" },
    ],
    vocabulary: [
      {
        id: "es-review-hola",
        term: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
        partOfSpeech: "interjection",
        example: "Hola!",
      },
      {
        id: "es-review-agua",
        term: "agua",
        translation: "water",
        pronunciation: "AH-gwah",
        partOfSpeech: "noun",
        example: "Agua, por favor.",
      },
    ],
    phrases: [
      {
        id: "es-review-phrase",
        text: "Hola. Agua, por favor.",
        translation: "Hello. Water, please.",
        pronunciation: "OH-lah. AH-gwah, por fah-VOR",
        usageNote: "A simple greeting plus a polite request.",
      },
    ],
    activities: [
      {
        id: "es-review-activity-1",
        kind: "multiple-choice",
        title: "Quick check",
        prompt: "Choose the meaning.",
        xp: 5,
        question: "What does agua mean?",
        options: [
          { id: "coffee", text: "coffee" },
          { id: "water", text: "water" },
          { id: "hello", text: "hello" },
        ],
        correctOptionId: "water",
        explanation: "Agua means water.",
      },
      {
        id: "es-review-activity-2",
        kind: "speaking-practice",
        title: "Say a full line",
        prompt: "Say the greeting and request.",
        xp: 7,
        phraseId: "es-review-phrase",
        targetText: "Hola. Agua, por favor.",
        coachPrompt: "Pause after Hola, then ask for water politely.",
      },
    ],
    aiTeacherPrompt: {
      persona: "A cheerful Spanish review coach.",
      lessonBrief:
        "Review greetings and cafe phrases with a short confidence-building drill.",
      objectives: [
        "Ask the learner to recall hola and agua.",
        "Practice Agua, por favor in a natural voice.",
      ],
      teachingStyle:
        "Keep the pace upbeat and turn mistakes into quick retries.",
      correctionStyle:
        "Praise the remembered words first, then correct pronunciation.",
      wrapUpPrompt:
        "Ask the learner to say one thing they can now order in Spanish.",
    },
  },
  {
    id: "fr-greetings-1",
    languageCode: "fr",
    unitId: "fr-unit-1",
    order: 1,
    kind: "ai-teacher",
    title: "Say bonjour",
    subtitle: "Hello, goodbye, and thanks",
    description: "Learn polite French greetings for a first conversation.",
    icon: "wave",
    xpReward: 15,
    estimatedMinutes: 4,
    goals: [
      { id: "fr-greetings-goal-1", text: "Recognize bonjour and merci" },
      { id: "fr-greetings-goal-2", text: "Practice a polite greeting aloud" },
    ],
    vocabulary: [
      {
        id: "fr-vocab-bonjour",
        term: "bonjour",
        translation: "hello",
        pronunciation: "bohn-ZHOOR",
        partOfSpeech: "interjection",
        example: "Bonjour, Emma.",
      },
      {
        id: "fr-vocab-merci",
        term: "merci",
        translation: "thank you",
        pronunciation: "mehr-SEE",
        partOfSpeech: "interjection",
        example: "Merci, Leo.",
      },
      {
        id: "fr-vocab-au-revoir",
        term: "au revoir",
        translation: "goodbye",
        pronunciation: "oh ruh-VWAHR",
        partOfSpeech: "interjection",
        example: "Au revoir!",
      },
    ],
    phrases: [
      {
        id: "fr-phrase-bonjour",
        text: "Bonjour.",
        translation: "Hello.",
        pronunciation: "bohn-ZHOOR",
        usageNote: "A polite hello for most daytime situations.",
      },
      {
        id: "fr-phrase-merci",
        text: "Merci.",
        translation: "Thank you.",
        pronunciation: "mehr-SEE",
        usageNote: "Use it whenever someone helps you.",
      },
    ],
    activities: [
      {
        id: "fr-greetings-activity-1",
        kind: "vocabulary-card",
        title: "Meet the words",
        prompt: "Read each French greeting.",
        xp: 3,
        vocabularyIds: [
          "fr-vocab-bonjour",
          "fr-vocab-merci",
          "fr-vocab-au-revoir",
        ],
      },
      {
        id: "fr-greetings-activity-2",
        kind: "multiple-choice",
        title: "Choose the meaning",
        prompt: "Pick the English meaning.",
        xp: 4,
        question: "What does merci mean?",
        options: [
          { id: "hello", text: "hello" },
          { id: "thank-you", text: "thank you" },
          { id: "goodbye", text: "goodbye" },
        ],
        correctOptionId: "thank-you",
        explanation: "Merci means thank you.",
      },
      {
        id: "fr-greetings-activity-3",
        kind: "listen-repeat",
        title: "Repeat bonjour",
        prompt: "Listen, then repeat.",
        xp: 4,
        phraseId: "fr-phrase-bonjour",
        audioScript: "Bonjour.",
        coachTip: "Round your lips softly on the final sound.",
      },
    ],
    aiTeacherPrompt: {
      persona: "A kind French teacher who makes pronunciation feel approachable.",
      lessonBrief:
        "Teach bonjour, merci, and au revoir with short repeat-after-me practice.",
      objectives: [
        "Model each word slowly.",
        "Invite the learner to repeat bonjour and merci.",
        "Explain when bonjour is polite and useful.",
      ],
      teachingStyle:
        "Use simple English with gentle French modeling. Keep the lesson audio-first.",
      correctionStyle:
        "Focus on one mouth shape at a time and keep feedback encouraging.",
      wrapUpPrompt:
        "Ask the learner to greet the teacher with Bonjour and respond with Merci.",
    },
  },
  {
    id: "fr-introductions-1",
    languageCode: "fr",
    unitId: "fr-unit-1",
    order: 2,
    kind: "conversation",
    title: "Introduce yourself",
    subtitle: "Say your name",
    description: "Use a tiny French sentence to share your name.",
    icon: "chat",
    xpReward: 15,
    estimatedMinutes: 5,
    goals: [
      { id: "fr-intro-goal-1", text: "Understand je m'appelle" },
      { id: "fr-intro-goal-2", text: "Introduce yourself by name" },
    ],
    vocabulary: [
      {
        id: "fr-vocab-je",
        term: "je",
        translation: "I",
        pronunciation: "zhuh",
        partOfSpeech: "phrase",
        example: "Je m'appelle Alex.",
      },
      {
        id: "fr-vocab-appelle",
        term: "je m'appelle",
        translation: "my name is",
        pronunciation: "zhuh mah-PELL",
        partOfSpeech: "phrase",
        example: "Je m'appelle Alex.",
      },
    ],
    phrases: [
      {
        id: "fr-phrase-name",
        text: "Je m'appelle Alex.",
        translation: "My name is Alex.",
        pronunciation: "zhuh mah-PELL Alex",
        usageNote: "Swap Alex for your own name.",
      },
    ],
    activities: [
      {
        id: "fr-intro-activity-1",
        kind: "translate",
        title: "Name sentence",
        prompt: "Translate: My name is Alex.",
        xp: 5,
        phraseId: "fr-phrase-name",
        acceptedAnswers: ["Je m'appelle Alex.", "Je m'appelle Alex"],
      },
      {
        id: "fr-intro-activity-2",
        kind: "speaking-practice",
        title: "Say your name",
        prompt: "Say the phrase with your own name.",
        xp: 6,
        phraseId: "fr-phrase-name",
        targetText: "Je m'appelle Alex.",
        coachPrompt: "Use your real name after je m'appelle.",
      },
    ],
    aiTeacherPrompt: {
      persona: "A friendly French conversation partner.",
      lessonBrief:
        "Teach the learner to introduce themselves with je m'appelle.",
      objectives: [
        "Break je m'appelle into easy sounds.",
        "Let the learner replace Alex with their own name.",
        "Run a one-line introduction exchange.",
      ],
      teachingStyle:
        "Use call-and-response and keep the learner speaking often.",
      correctionStyle:
        "Accept understandable attempts and only refine the hardest syllable.",
      wrapUpPrompt:
        "Ask the learner to say Bonjour, then introduce themselves.",
    },
  },
  {
    id: "fr-review-1",
    languageCode: "fr",
    unitId: "fr-unit-1",
    order: 3,
    kind: "review",
    title: "First review",
    subtitle: "Greetings and names",
    description: "Review French greetings and your first introduction.",
    icon: "star",
    xpReward: 20,
    estimatedMinutes: 5,
    goals: [
      { id: "fr-review-goal-1", text: "Recall merci and bonjour" },
      { id: "fr-review-goal-2", text: "Say one introduction phrase" },
    ],
    vocabulary: [
      {
        id: "fr-review-bonjour",
        term: "bonjour",
        translation: "hello",
        pronunciation: "bohn-ZHOOR",
        partOfSpeech: "interjection",
        example: "Bonjour!",
      },
      {
        id: "fr-review-name",
        term: "je m'appelle",
        translation: "my name is",
        pronunciation: "zhuh mah-PELL",
        partOfSpeech: "phrase",
        example: "Je m'appelle Mia.",
      },
    ],
    phrases: [
      {
        id: "fr-review-phrase",
        text: "Bonjour. Je m'appelle Mia.",
        translation: "Hello. My name is Mia.",
        pronunciation: "bohn-ZHOOR. zhuh mah-PELL Mia",
        usageNote: "A complete tiny introduction.",
      },
    ],
    activities: [
      {
        id: "fr-review-activity-1",
        kind: "multiple-choice",
        title: "Quick check",
        prompt: "Choose the meaning.",
        xp: 5,
        question: "What does bonjour mean?",
        options: [
          { id: "hello", text: "hello" },
          { id: "water", text: "water" },
          { id: "coffee", text: "coffee" },
        ],
        correctOptionId: "hello",
        explanation: "Bonjour means hello.",
      },
      {
        id: "fr-review-activity-2",
        kind: "speaking-practice",
        title: "Full intro",
        prompt: "Say the full introduction.",
        xp: 7,
        phraseId: "fr-review-phrase",
        targetText: "Bonjour. Je m'appelle Mia.",
        coachPrompt: "Say bonjour first, then introduce yourself.",
      },
    ],
    aiTeacherPrompt: {
      persona: "A supportive French review coach.",
      lessonBrief:
        "Review bonjour, merci, and je m'appelle in one short speaking flow.",
      objectives: [
        "Prompt the learner to remember each phrase.",
        "Practice a complete introduction.",
      ],
      teachingStyle:
        "Use quick review questions and short speaking turns.",
      correctionStyle:
        "Let the learner finish before giving one clear pronunciation tip.",
      wrapUpPrompt:
        "Finish with the learner introducing themselves confidently.",
    },
  },
  {
    id: "ja-greetings-1",
    languageCode: "ja",
    unitId: "ja-unit-1",
    order: 1,
    kind: "ai-teacher",
    title: "Say hello",
    subtitle: "Konnichiwa and goodbye",
    description: "Start Japanese with friendly everyday greetings.",
    icon: "wave",
    xpReward: 15,
    estimatedMinutes: 4,
    goals: [
      { id: "ja-greetings-goal-1", text: "Recognize konnichiwa" },
      { id: "ja-greetings-goal-2", text: "Practice a clear greeting" },
    ],
    vocabulary: [
      {
        id: "ja-vocab-konnichiwa",
        term: "konnichiwa",
        translation: "hello",
        pronunciation: "kohn-nee-chee-wah",
        partOfSpeech: "interjection",
        example: "Konnichiwa, Aki.",
      },
      {
        id: "ja-vocab-sayonara",
        term: "sayonara",
        translation: "goodbye",
        pronunciation: "sah-yoh-nah-rah",
        partOfSpeech: "interjection",
        example: "Sayonara!",
      },
    ],
    phrases: [
      {
        id: "ja-phrase-konnichiwa",
        text: "Konnichiwa.",
        translation: "Hello.",
        pronunciation: "kohn-nee-chee-wah",
        usageNote: "A common daytime hello.",
      },
      {
        id: "ja-phrase-sayonara",
        text: "Sayonara.",
        translation: "Goodbye.",
        pronunciation: "sah-yoh-nah-rah",
        usageNote: "A clear goodbye, often used when parting for a while.",
      },
    ],
    activities: [
      {
        id: "ja-greetings-activity-1",
        kind: "vocabulary-card",
        title: "Meet the words",
        prompt: "Read each Japanese greeting.",
        xp: 3,
        vocabularyIds: ["ja-vocab-konnichiwa", "ja-vocab-sayonara"],
      },
      {
        id: "ja-greetings-activity-2",
        kind: "multiple-choice",
        title: "Choose the meaning",
        prompt: "Pick the English meaning.",
        xp: 4,
        question: "What does konnichiwa mean?",
        options: [
          { id: "hello", text: "hello" },
          { id: "thank-you", text: "thank you" },
          { id: "please", text: "please" },
        ],
        correctOptionId: "hello",
        explanation: "Konnichiwa means hello.",
      },
      {
        id: "ja-greetings-activity-3",
        kind: "listen-repeat",
        title: "Repeat hello",
        prompt: "Listen, then repeat.",
        xp: 4,
        phraseId: "ja-phrase-konnichiwa",
        audioScript: "Konnichiwa.",
        coachTip: "Keep each syllable light and even.",
      },
    ],
    aiTeacherPrompt: {
      persona: "A calm Japanese teacher who teaches with clear rhythm.",
      lessonBrief:
        "Teach konnichiwa and sayonara with slow rhythmic repetition.",
      objectives: [
        "Model each syllable evenly.",
        "Ask the learner to repeat konnichiwa.",
        "Explain that Japanese pronunciation is steady and clear.",
      ],
      teachingStyle:
        "Use simple English, clap-like rhythm cues, and short speaking turns.",
      correctionStyle:
        "Correct rhythm gently before individual sounds.",
      wrapUpPrompt:
        "Ask the learner to say Konnichiwa, then Sayonara.",
    },
  },
  {
    id: "ja-thanks-1",
    languageCode: "ja",
    unitId: "ja-unit-1",
    order: 2,
    kind: "phrases",
    title: "Say thanks",
    subtitle: "Arigato and please",
    description: "Practice two useful polite words in Japanese.",
    icon: "thanks",
    xpReward: 15,
    estimatedMinutes: 5,
    goals: [
      { id: "ja-thanks-goal-1", text: "Recognize arigato" },
      { id: "ja-thanks-goal-2", text: "Use please in a simple request" },
    ],
    vocabulary: [
      {
        id: "ja-vocab-arigato",
        term: "arigato",
        translation: "thank you",
        pronunciation: "ah-ree-gah-toh",
        partOfSpeech: "interjection",
        example: "Arigato.",
      },
      {
        id: "ja-vocab-onegaishimasu",
        term: "onegaishimasu",
        translation: "please",
        pronunciation: "oh-neh-guy-shee-mahss",
        partOfSpeech: "phrase",
        example: "Mizu, onegaishimasu.",
      },
      {
        id: "ja-vocab-mizu",
        term: "mizu",
        translation: "water",
        pronunciation: "mee-zoo",
        partOfSpeech: "noun",
        example: "Mizu, onegaishimasu.",
      },
    ],
    phrases: [
      {
        id: "ja-phrase-arigato",
        text: "Arigato.",
        translation: "Thank you.",
        pronunciation: "ah-ree-gah-toh",
        usageNote: "A friendly thanks for casual situations.",
      },
      {
        id: "ja-phrase-water-please",
        text: "Mizu, onegaishimasu.",
        translation: "Water, please.",
        pronunciation: "mee-zoo, oh-neh-guy-shee-mahss",
        usageNote: "A polite way to ask for water.",
      },
    ],
    activities: [
      {
        id: "ja-thanks-activity-1",
        kind: "match-pairs",
        title: "Match polite words",
        prompt: "Match Japanese to English.",
        xp: 5,
        pairs: [
          { id: "arigato", left: "arigato", right: "thank you" },
          { id: "mizu", left: "mizu", right: "water" },
          { id: "onegaishimasu", left: "onegaishimasu", right: "please" },
        ],
      },
      {
        id: "ja-thanks-activity-2",
        kind: "translate",
        title: "Ask for water",
        prompt: "Translate: Water, please.",
        xp: 5,
        phraseId: "ja-phrase-water-please",
        acceptedAnswers: ["Mizu, onegaishimasu.", "Mizu onegaishimasu"],
      },
    ],
    aiTeacherPrompt: {
      persona: "A gentle Japanese politeness coach.",
      lessonBrief:
        "Teach arigato, mizu, and onegaishimasu through short polite requests.",
      objectives: [
        "Model arigato with even syllables.",
        "Practice Mizu, onegaishimasu as one polite request.",
      ],
      teachingStyle:
        "Use slow call-and-response and explain politeness simply.",
      correctionStyle:
        "Keep corrections brief and repeat the phrase naturally after feedback.",
      wrapUpPrompt:
        "Ask the learner to request water and then say thank you.",
    },
  },
  {
    id: "ja-review-1",
    languageCode: "ja",
    unitId: "ja-unit-1",
    order: 3,
    kind: "review",
    title: "First review",
    subtitle: "Greetings and thanks",
    description: "Review your first Japanese greetings and polite words.",
    icon: "star",
    xpReward: 20,
    estimatedMinutes: 5,
    goals: [
      { id: "ja-review-goal-1", text: "Recall hello and thank you" },
      { id: "ja-review-goal-2", text: "Say one polite request" },
    ],
    vocabulary: [
      {
        id: "ja-review-konnichiwa",
        term: "konnichiwa",
        translation: "hello",
        pronunciation: "kohn-nee-chee-wah",
        partOfSpeech: "interjection",
        example: "Konnichiwa!",
      },
      {
        id: "ja-review-arigato",
        term: "arigato",
        translation: "thank you",
        pronunciation: "ah-ree-gah-toh",
        partOfSpeech: "interjection",
        example: "Arigato.",
      },
    ],
    phrases: [
      {
        id: "ja-review-phrase",
        text: "Konnichiwa. Arigato.",
        translation: "Hello. Thank you.",
        pronunciation: "kohn-nee-chee-wah. ah-ree-gah-toh",
        usageNote: "A simple friendly pair of phrases.",
      },
    ],
    activities: [
      {
        id: "ja-review-activity-1",
        kind: "multiple-choice",
        title: "Quick check",
        prompt: "Choose the meaning.",
        xp: 5,
        question: "What does arigato mean?",
        options: [
          { id: "hello", text: "hello" },
          { id: "thank-you", text: "thank you" },
          { id: "goodbye", text: "goodbye" },
        ],
        correctOptionId: "thank-you",
        explanation: "Arigato means thank you.",
      },
      {
        id: "ja-review-activity-2",
        kind: "speaking-practice",
        title: "Say both phrases",
        prompt: "Say hello and thank you.",
        xp: 7,
        phraseId: "ja-review-phrase",
        targetText: "Konnichiwa. Arigato.",
        coachPrompt: "Keep the rhythm even from start to finish.",
      },
    ],
    aiTeacherPrompt: {
      persona: "A calm Japanese review coach.",
      lessonBrief:
        "Review konnichiwa and arigato with a simple speaking drill.",
      objectives: [
        "Prompt recall before showing the answer.",
        "Practice both phrases aloud.",
      ],
      teachingStyle:
        "Use slow examples and warm encouragement.",
      correctionStyle:
        "Correct rhythm first, then vowel clarity if needed.",
      wrapUpPrompt:
        "End with the learner saying Konnichiwa and Arigato confidently.",
    },
  },
];

export function getLessonsByLanguage(languageCode: LanguageCode) {
  return lessons
    .filter((lesson) => lesson.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}

export function getLessonsByUnit(unitId: string) {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}
