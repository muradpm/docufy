import { create } from "zustand";

interface AiState {
  contextEnabled: boolean;
  grammarEnabled: boolean;
  completionEnabled: boolean;
  setContextEnabled: (value: boolean) => void;
  setGrammarEnabled: (value: boolean) => void;
  setCompletionEnabled: (value: boolean) => void;
}

export const useAiStore = create<AiState>((set) => ({
  contextEnabled:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("context") || "false")
      : false,
  grammarEnabled:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("grammar") || "false")
      : false,
  completionEnabled:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("completion") || "false")
      : false,
  setContextEnabled: (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("context", JSON.stringify(value));
    }
    set({ contextEnabled: value });
  },
  setGrammarEnabled: (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("grammar", JSON.stringify(value));
    }
    set({ grammarEnabled: value });
  },
  setCompletionEnabled: (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("completion", JSON.stringify(value));
    }
    set({ completionEnabled: value });
  },
}));
