"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { CodeBlockIcon, ImageIcon } from "./icons";
import { Button } from "./primitives/button";
import { Input } from "./primitives/input";
import { Popover } from "./primitives/popover";
import styles from "./toolbar.module.css";

type Props = {
  editor: Editor;
};

export function ToolbarMedia({ editor }: Props) {
  function addImage(url: string) {
    if (!url.length) {
      return;
    }

    editor.chain().setImage({ src: url }).run();
  }

  return (
    <>
      <Button
        className={styles.toolbarButton}
        variant="subtle"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        data-active={editor.isActive("codeBlock") ? "is-active" : undefined}
        aria-label="Code block"
      >
        <CodeBlockIcon />
      </Button>

      <Popover content={<MediaPopover variant="image" onSubmit={addImage} />}>
        <Button
          className={styles.toolbarButton}
          variant="subtle"
          disabled={!editor.can().chain().setImage({ src: "" }).run()}
          data-active={editor.isActive("image") ? "is-active" : undefined}
          aria-label="Image"
        >
          <ImageIcon />
        </Button>
      </Popover>
    </>
  );
}

type MediaPopoverProps = {
  variant: string;
  onSubmit: (value: string) => void;
};

function MediaPopover({ variant, onSubmit }: MediaPopoverProps) {
  const [value, setValue] = useState("");

  return (
    <form
      className={styles.toolbarPopover}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <label className={styles.toolbarPopoverLabel} htmlFor="linkInput">
        Add {variant === "image" ? "image" : ""} URL
      </label>
      <div className={styles.toolbarPopoverBar}>
        <Input
          id="linkInput"
          className={styles.toolbarPopoverInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button className={styles.toolbarPopoverButton}>
          Add {variant === "image" ? "image" : ""}
        </Button>
      </div>
    </form>
  );
}
