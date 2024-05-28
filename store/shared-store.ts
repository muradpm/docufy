import { create } from "zustand";

type State = {
  sharedState: Record<string, boolean>;
  setSharedState: (documentId: string, isShared: boolean) => void;
};

export const useSharedStore = create<State>((set) => ({
  sharedState: {},
  setSharedState: (documentId, isShared) =>
    set((state) => ({
      sharedState: {
        ...state.sharedState,
        [documentId]: isShared,
      },
    })),
}));
