"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Document } from "@prisma/client";
import { SelectionMenu } from "./selection-menu";
import { Toolbar } from "./toolbar";
import { EditorContent, useEditor } from "@tiptap/react";
import CustomCharacterCount from "./custom-character-count";
import { Input } from "@/components/ui/input";
import { DocumentSaveButton } from "@/components/document-save-button";
import { DocumentBackButton } from "@/components/document-back-button";
import { DocumentStateContext } from "@/utils/document-state-serializers";
import type { Correction } from "@/app/api/openai/grammar/route";
import { debounce } from "lodash";
import { useDebouncedCallback } from "use-debounce";
import DiffMatchPatch from "diff-match-patch";
import { useAiStore } from "@/store/ai-store";
import { useSharedStore } from "@/store/shared-store";
import { useTiptapExtensions } from "./tiptap-extensions";
import { handleDocumentSharedChange } from "@/app/actions/documents";
import { DocumentShare } from "./document-share";
import { handleDocumentSave } from "@/app/actions/documents";
import { toast } from "@/components/ui/use-toast";
import styles from "./text-editor.module.css";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import { useSession } from "next-auth/react";
import {
  fetchingSimilarities,
  fetchingGrammarCorrections,
} from "@/app/actions/ai";

// Create an instance of DiffMatchPatch
const dmp = new DiffMatchPatch();

interface TextEditorProps {
  document?: Document;
  keywords?: string[];
  similarities?: any[];
}

export function TextEditor({ document, similarities = [] }: TextEditorProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isDocumentUpdated, setIsDocumentUpdated] = useState(false);
  const [similaritiesState, setSimilaritiesState] = useState<any[]>([]);
  const { sharedState, setSharedState } = useSharedStore();
  const similaritiesRef = useRef(similarities);
  similaritiesRef.current = similarities;
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedState = async () => {
      if (document && workspaceId) {
        try {
          const updatedDocument = await handleDocumentSharedChange(
            document.id,
            !sharedState[document.id],
            workspaceId
          );
          // Update the Zustand store with the fetched shared state
          setSharedState(document.id, updatedDocument.shared);
        } catch (error) {
          console.error("Failed to fetch shared state:", error);
        }
      }
    };

    fetchSharedState();
  }, [document, workspaceId, setSharedState]);

  // Define fetchSimilarities using useCallback
  const fetchSimilarities = useCallback(async () => {
    if (document) {
      try {
        const data = await fetchingSimilarities(document.id);

        const similarKeywords = data.similarities.flatMap(
          (item: any) => item.similarKeywords
        );

        setSimilaritiesState(data.similarities);
        setKeywords((prevKeywords) => [...prevKeywords, ...similarKeywords]);
        setIsDocumentUpdated(false);
      } catch (error) {
        console.error("Failed to fetch keywords", error);
        toast({
          title: "Limit of 50 daily requests reached",
          description:
            "You have reached your AI context analysis limit for the day.",
        });
      }
    }
  }, [document, isDocumentUpdated]);

  // Use fetchSimilarities inside useEffect
  useEffect(() => {
    fetchSimilarities().catch((error) => {
      console.error("Failed to fetch similarities:", error);
    });
  }, [fetchSimilarities]);

  return (
    <div>
      {document && (
        <Editor
          key={similaritiesState.length}
          document={document}
          keywords={keywords}
          setIsDocumentUpdated={setIsDocumentUpdated}
          similarities={similaritiesState}
        />
      )}
    </div>
  );
}

function Editor({
  document,
  keywords,
  setIsDocumentUpdated,
  similarities,
}: TextEditorProps & {
  setIsDocumentUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <TiptapEditor
      document={document}
      keywords={keywords}
      setIsDocumentUpdated={setIsDocumentUpdated}
      similarities={similarities}
    />
  );
}

function TiptapEditor({
  document,
  keywords,
  setIsDocumentUpdated,
  similarities = [],
}: TextEditorProps & {
  setIsDocumentUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const defaultTitle = document ? document.title : "Untitled document";
  const defaultContent = document ? document.content : "";
  const [hasChanges, setHasChanges] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [lastSavedContent, setLastSavedContent] = useState(defaultContent);
  const { contextEnabled, grammarEnabled } = useAiStore();
  const [grammarCorrections, setGrammarCorrections] = useState<Correction[]>(
    []
  );
  const [recheckGrammar, setRecheckGrammar] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<string>("Saved");
  const { data: session } = useSession(); // Get the current session
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the workspaceId when the component mounts
    const fetchWorkspaceId = async () => {
      if (session?.user?.id) {
        const fetchedWorkspaceId = await getCurrentWorkspaceId(session.user.id);
        setWorkspaceId(fetchedWorkspaceId);
      }
    };

    fetchWorkspaceId().catch(console.error);
  }, [session?.user?.id]);

  const fetchGrammarCorrections = useCallback(
    debounce(async () => {
      if (grammarEnabled && document?.content) {
        try {
          const correctionsResponse = await fetchingGrammarCorrections(
            document.content
          );
          // console.log("Corrections fetched:", correctionsResponse.corrections);

          setGrammarCorrections(correctionsResponse.corrections);
        } catch (error) {
          console.error("Failed to fetch grammar corrections", error);
          toast({
            title: "Limit of 50 daily requests reached",
            description:
              "You have reached your AI spelling and grammar checkers limit for the day.",
          });
        }
      }
    }, 1000),
    [grammarEnabled, document?.content]
  );

  useEffect(() => {
    fetchGrammarCorrections();
    // Cancel the debounce on unmount
    return () => fetchGrammarCorrections.cancel();
  }, [fetchGrammarCorrections]);

  const triggerGrammarRecheck = useCallback(() => {
    // console.log("Grammar recheck triggered");
    setRecheckGrammar((count) => count + 1);
  }, [setRecheckGrammar]);

  const similaritiesRef = useRef(similarities);
  useEffect(() => {
    similaritiesRef.current = similarities;
  }, [similarities]);

  // Debounce the highlight function
  const debouncedHighlight = useCallback(
    debounce((editor, keywords) => {
      if (editor && keywords && keywords.length > 0) {
        editor.commands.highlightKeywords(keywords);
      }
    }, 1000),
    []
  );

  // Set up TipTap extensions
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
    extensions: useTiptapExtensions(similaritiesRef, triggerGrammarRecheck),
    content: defaultContent,
    onUpdate({ editor }) {
      fetchGrammarCorrections();

      if (editor && keywords) {
        editor.commands.highlightKeywords(keywords);
      }
    },
  });

  useEffect(() => {
    // If the editor is available and there are grammar corrections, highlight them
    if (editor && grammarCorrections.length > 0) {
      // Pass the entire array of Correction objects to the highlightGrammar command
      editor.commands.highlightGrammar(grammarCorrections);
    }
  }, [editor, grammarCorrections]);

  useEffect(() => {
    if (editor && grammarEnabled && grammarCorrections.length > 0) {
      editor.commands.highlightGrammar(grammarCorrections);
    } else if (editor) {
      editor.commands.removeGrammarHighlights();
    }
  }, [editor, grammarEnabled, grammarCorrections]);

  useEffect(() => {
    if (contextEnabled && editor) {
      debouncedHighlight(editor, keywords);
    } else if (editor) {
      editor.commands.removeKeywordHighlights();
    }
  }, [contextEnabled, editor, keywords, editor?.state.doc]);

  useEffect(() => {
    const keywordId = window.location.hash;
    if (keywordId) {
      const keywordElement = window.document.querySelector(keywordId);
      if (keywordElement) {
        keywordElement.scrollIntoView();
      }
    }
  }, []);

  // Function to auto save document
  const autoSaveDocument = async () => {
    // console.log("Auto-saving after inactivity...");
    if (!workspaceId) {
      console.error("Workspace ID is undefined, cannot save.");
      return;
    }

    const currentContent = editor?.getHTML() ?? "";
    const diff = dmp.diff_main(lastSavedContent, currentContent);
    dmp.diff_cleanupSemantic(diff);

    const hasContentChanges = diff.some(([op]) => op !== 0);
    if (!hasContentChanges) {
      return;
    }

    setSaveStatus("Saving...");

    if (document && document.id) {
      try {
        await handleDocumentSave(
          document.id,
          workspaceId,
          title,
          currentContent,
          contextEnabled
        );
        setLastSavedContent(currentContent);
        setHasChanges(false);
        setIsDocumentUpdated(true);
        setSaveStatus("Saved");
      } catch (error) {
        console.error("Failed to auto save document:", error);
        setSaveStatus("Error");
      }
    } else {
      console.error("Document ID is undefined, cannot save.");
      setSaveStatus("Error");
    }
  };

  // Debounced auto-save
  const debouncedAutoSave = useDebouncedCallback(autoSaveDocument, 5000);

  //[document, title, lastSavedContent, editor, contextEnabled]);

  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      if (currentContent !== defaultContent) {
        // console.log("Change detected in content.");
        setHasChanges(true);
        // Call debounced auto-save directly here
        debouncedAutoSave();
      } else {
        setHasChanges(false);
      }
    }
  }, [editor, editor?.state.doc, defaultContent, debouncedAutoSave]);

  // Track changes in title
  useEffect(() => {
    if (title !== defaultTitle) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [title, defaultTitle]);

  // Track changes in content
  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      if (currentContent !== defaultContent) {
        // console.log("Change detected in content.");

        setHasChanges(true);
      } else {
        setHasChanges(false);
      }
    }
  }, [editor, editor?.state.doc, defaultContent]);

  return (
    <div className="editor-container">
      <div className={styles.container}>
        <div className="border-b pl-5 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <DocumentStateContext.Provider value={{ setTitle, setHasChanges }}>
            {editor && (
              <div className="mr-4">
                <DocumentBackButton
                  document={document}
                  editor={editor}
                  title={title}
                  defaultTitle={defaultTitle}
                  defaultContent={defaultContent}
                  hasChanges={hasChanges}
                />
              </div>
            )}
            <Input
              type="text"
              id="documentTitle"
              placeholder="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="ml-auto flex w-full space-x-2 sm:justify-end pr-5">
              {document && <DocumentShare documentId={document.id} />}
              {editor && (
                <DocumentSaveButton
                  document={document}
                  editor={editor}
                  title={title}
                  contextEnabled={contextEnabled}
                />
              )}
            </div>
          </DocumentStateContext.Provider>
        </div>
        <div className={styles.editorHeader}>
          {editor && <Toolbar editor={editor} />}
        </div>
        <div className={styles.editorPanel}>
          {editor && <SelectionMenu editor={editor} />}
          <div className={styles.editorContainer}>
            <div className={styles.saveStatus}>{saveStatus}</div>
            <EditorContent editor={editor} />
            <CustomCharacterCount editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
