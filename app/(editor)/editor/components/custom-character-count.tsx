import React from "react";
import type { Editor } from "@tiptap/core";
import styles from "./custom-character-count.module.css";

interface CustomCharacterCountProps {
  editor: Editor | null;
}

const getWordCount = (editor: Editor) => {
  const text = editor.state.doc.textContent;
  return text.split(/\s+/).filter(Boolean).length;
};

const getReadingTime = (wordCount: number) => {
  const wordsPerMinute = 200; // Adjust this value to change the reading speed
  return Math.ceil(wordCount / wordsPerMinute);
};

const CustomCharacterCount: React.FC<CustomCharacterCountProps> = ({
  editor,
}) => {
  if (!editor) {
    return null;
  }

  const characterCount = editor.state.doc.textContent.length;
  const wordCount = getWordCount(editor);
  const readingTime = getReadingTime(wordCount);

  return (
    <div className={styles.tiptap}>
      <div className={styles["character-count"]}>
        <span>{readingTime} minute read</span>
        <span>{wordCount} words</span>
        <span>{characterCount} characters</span>
      </div>
    </div>
  );
};

export default CustomCharacterCount;
