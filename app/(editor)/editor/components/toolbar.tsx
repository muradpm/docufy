"use client";

import type { Editor } from "@tiptap/react";
import { ToolbarInlineAdvanced } from "./text-inline-advanced";
import { ToolbarAlignment } from "./toolbar-alignment";
import { ToolbarBlock } from "./toolbar-block";
import { ToolbarCommands } from "./toolbar-commands";
import { ToolbarHeadings } from "./toolbar-headings";
import { ToolbarInline } from "./toolbar-inline";
import { ToolbarMedia } from "./toolbar-media";
import styles from "./toolbar.module.css";
import { ToolbarAi } from "./toolbar-ai";

type Props = {
  editor: Editor;
};

export function Toolbar({ editor }: Props) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarSection}>
        <ToolbarCommands editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarHeadings editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarInline editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarInlineAdvanced editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarAlignment editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarBlock editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarMedia editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarAi editor={editor} />
      </div>
    </div>
  );
}
