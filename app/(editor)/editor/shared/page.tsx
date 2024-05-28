"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import NotFound from "./not-found";
import { useTiptapExtensions } from "./extensions";
import type { Document } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { fetchSharedDocument } from "@/app/actions/documents";
import styles from "../components/text-editor.module.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import CustomCharacterCount from "../components/custom-character-count";

export default function SharedDocumentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const documentId = searchParams.documentId;

  const [document, setDocument] = React.useState<Document | null>(null);

  React.useEffect(() => {
    if (typeof documentId === "string") {
      fetchSharedDocument(documentId).then((doc) => {
        if (doc && doc.shared) {
          setDocument(doc);
        }
      });
    }
  }, [documentId]);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: styles.editor,
      },
      editable: () => false,
    },
    extensions: useTiptapExtensions(),
    content: document ? document.content : "",
  });

  React.useEffect(() => {
    if (editor && document) {
      editor.commands.setContent(document.content);
    }
  }, [document, editor]);

  if (!document) {
    return <NotFound />;
  }

  return (
    <div className={styles.container}>
      <div className="px-5 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <div className="mr-4">
          <Link href="/">
            <Button variant="ghost">
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
        <Input type="text" id="documentTitle" value={document.title} readOnly />
        {/* Remove empty div when find input position */}
        <div className="ml-auto flex w-full space-x-2 sm:justify-end pr-5"></div>
      </div>
      <div className={styles.editorContainer}>
        {editor && <EditorContent editor={editor} />}
        <CustomCharacterCount editor={editor} />
      </div>
    </div>
  );
}
