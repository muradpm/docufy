import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import History from "@tiptap/extension-history";
import { CustomTaskItem } from "../components/custom-task-item";

export const useTiptapExtensions = () => [
  History,
  StarterKit.configure({
    blockquote: {
      HTMLAttributes: {
        class: "tiptap-blockquote",
      },
    },
    code: {
      HTMLAttributes: {
        class: "tiptap-code",
      },
    },
    codeBlock: {
      languageClassPrefix: "language-",
      HTMLAttributes: {
        class: "tiptap-code-block",
        spellcheck: false,
      },
    },
    heading: {
      levels: [1, 2, 3],
      HTMLAttributes: {
        class: "tiptap-heading",
      },
    },
    history: false,
    horizontalRule: {
      HTMLAttributes: {
        class: "tiptap-hr",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "tiptap-list-item",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "tiptap-ordered-list",
      },
    },
    paragraph: {
      HTMLAttributes: {
        class: "tiptap-paragraph",
      },
    },
  }),
  Highlight.configure({
    HTMLAttributes: {
      class: "tiptap-highlight",
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: "tiptap-image",
    },
  }),
  Link.configure({
    HTMLAttributes: {
      class: "tiptap-link",
    },
  }),
  Placeholder.configure({
    placeholder: "Start writing…",
    emptyEditorClass: "tiptap-empty",
  }),
  CustomTaskItem,
  TaskList.configure({
    HTMLAttributes: {
      class: "tiptap-task-list",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Typography,
];
