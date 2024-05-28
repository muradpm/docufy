import type { Editor } from "@tiptap/react";
import { Sparkles } from "lucide-react";
import { Button } from "./primitives/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import styles from "./toolbar.module.css";
import { AiAssistant } from "./ai-assistant";

type Props = {
  editor: Editor;
};

export function ToolbarAi({ editor }: Props) {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className={styles.toolbarButton}
            variant="subtle"
            aria-label="AI Assistant"
            style={{ color: "plum" }}
          >
            <Sparkles />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>AI Assistant</SheetTitle>
            <SheetDescription>
              Enhance your writing process with AI-powered tools.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <AiAssistant editor={editor} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
