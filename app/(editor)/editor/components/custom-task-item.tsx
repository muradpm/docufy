import TaskItem from "@tiptap/extension-task-item";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Checkbox } from "./primitives/checkbox";
import styles from "./custom-task-item.module.css";

// A custom task item that uses the checkbox primitive
export const CustomTaskItem = TaskItem.extend({
  addNodeView: () => {
    return ReactNodeViewRenderer(TiptapCheckbox);
  },
});

function TiptapCheckbox({ node, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper className={styles.tiptapTaskItem}>
      <label className={styles.tiptipTaskItemCheckbox} contentEditable={false}>
        <Checkbox
          initialValue={false}
          checked={node.attrs.checked}
          onValueChange={(checked: boolean) => updateAttributes({ checked })}
        />
      </label>
      <NodeViewContent className={styles.tiptipTaskItemContent} />
    </NodeViewWrapper>
  );
}
