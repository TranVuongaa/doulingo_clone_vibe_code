import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageCode } from "@/types/learning";

type LearningStore = {
  clearSelectedLanguage: () => void;
  hasHydrated: boolean;
  selectedLanguageCode: LanguageCode | null;
  selectLanguage: (languageCode: LanguageCode) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useLearningStore = create<LearningStore>()(
  persist(
    (set) => ({
      clearSelectedLanguage: () => set({ selectedLanguageCode: null }),
      hasHydrated: false,
      selectedLanguageCode: null,
      selectLanguage: (languageCode) =>
        set({ selectedLanguageCode: languageCode }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "lingua-learning-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        selectedLanguageCode: state.selectedLanguageCode,
      }),
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
