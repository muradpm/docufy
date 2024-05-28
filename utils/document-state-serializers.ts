import { createContext, Dispatch, SetStateAction } from "react";

interface DocumentStateContextProps {
  setTitle: Dispatch<SetStateAction<string>>;
  setHasChanges: Dispatch<SetStateAction<boolean>>;
}

export const DocumentStateContext = createContext<
  DocumentStateContextProps | undefined
>(undefined);
