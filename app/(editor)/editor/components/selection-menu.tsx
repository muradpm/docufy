import { BubbleMenu } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { ToolbarInlineAdvanced } from "./text-inline-advanced";
import { ToolbarInline } from "./toolbar-inline";
import styles from "./text-editor.module.css";

type Props = {
  editor: Editor;
};

export function SelectionMenu({ editor }: Props) {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ zIndex: 99, appendTo: document.body }}
    >
      {shouldShowBubbleMenu(editor) ? (
        <div className={styles.bubbleMenuWrapper}>
          <ToolbarInline editor={editor} />
          <ToolbarInlineAdvanced editor={editor} />
        </div>
      ) : null}
    </BubbleMenu>
  );
}

export function shouldShowBubbleMenu(editor: Editor) {
  const canBold = editor.can().chain().focus().toggleBold().run();
  const canItalic = editor.can().chain().focus().toggleItalic().run();
  const canStrike = editor.can().chain().focus().toggleStrike().run();
  const canCode = editor.can().chain().focus().toggleCode().run();
  return canBold || canItalic || canStrike || canCode;
}
