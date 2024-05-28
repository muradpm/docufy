"use client";

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import type { Transaction, EditorState } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { createPopper } from "@popperjs/core";
import type { Instance, OptionsGeneric, Modifier } from "@popperjs/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    keywordHighlighter: {
      highlightKeywords: (keywords: string[]) => ReturnType;
      removeKeywordHighlights: () => ReturnType;
    };
  }
}

export const createKeywordHighlighter = (
  similaritiesRef: React.RefObject<
    {
      sourceDocumentId: string;
      documentId: string;
      documentTitle: string;
      similarity: number;
      similarKeywords: string[];
    }[]
  >
) => {
  const pluginKey = new PluginKey("keywordHighlighter");

  return Extension.create({
    name: "keywordHighlighter",

    addCommands() {
      return {
        highlightKeywords:
          (keywords) =>
          ({ tr, state }) => {
            const isContextualizationEnabled = JSON.parse(
              localStorage.getItem("context") ?? "false"
            );
            if (!isContextualizationEnabled) {
              return false;
            }
            const nonEmptyKeywords = keywords.filter(
              (keyword) => typeof keyword === "string" && keyword.trim() !== ""
            );

            if (nonEmptyKeywords.length === 0) {
              return true;
            }

            const decorations: Decoration[] = [];
            const regex = new RegExp(
              `\\b(${nonEmptyKeywords.join("|")})\\b`,
              "gi"
            );

            state.doc.descendants((node, pos) => {
              if (!node.isText) return;

              let match;
              while ((match = regex.exec(node.text ?? "")) !== null) {
                const from = pos + match.index;
                const to = from + match[0].length;
                decorations.push(
                  Decoration.inline(from, to, {
                    class: "highlight",
                    "data-id": `keyword-${match.index}`,
                  })
                );
              }
            });

            const decorationSet = DecorationSet.create(state.doc, decorations);
            tr.setMeta(pluginKey, decorationSet);
            return true;
          },
        removeKeywordHighlights:
          () =>
          ({ tr }: { tr: Transaction; state: EditorState }) => {
            tr.setMeta(pluginKey, DecorationSet.empty);
            return true;
          },
      };
    },

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: pluginKey,
          props: {
            decorations(state) {
              return this.getState(state);
            },
          },
          state: {
            init() {
              return DecorationSet.empty;
            },
            apply(tr, decorationSet) {
              const decorationSetMeta = tr.getMeta(pluginKey);
              if (decorationSetMeta) {
                return decorationSetMeta;
              }

              if (tr.docChanged) {
                return decorationSet.map(tr.mapping, tr.doc);
              }

              return decorationSet;
            },
          },
          view() {
            let popperInstance: Instance | null = null;
            let hoverCardElement: HTMLDivElement | null = null;
            let hideTimeout: NodeJS.Timeout;

            function show() {
              clearTimeout(hideTimeout); // Clear any existing hide timeout
              if (hoverCardElement && popperInstance) {
                hoverCardElement.setAttribute("data-show", "");
                popperInstance.setOptions(
                  (options: Partial<OptionsGeneric<Modifier<any, any>>>) => ({
                    ...options,
                    modifiers: [
                      ...(options.modifiers ?? []),
                      { name: "eventListeners", enabled: true },
                      {
                        name: "offset",
                        options: {
                          offset: [0, 10], // x-axis, y-axis
                        },
                      },
                    ],
                  })
                );
                popperInstance.update();
              }
            }

            function hide() {
              // Set a timeout to delay hiding the popper
              hideTimeout = setTimeout(() => {
                if (hoverCardElement && popperInstance) {
                  hoverCardElement.removeAttribute("data-show");
                  popperInstance.setOptions(
                    (options: Partial<OptionsGeneric<Modifier<any, any>>>) => ({
                      ...options,
                      modifiers: [
                        ...(options.modifiers ?? []),
                        { name: "eventListeners", enabled: false },
                      ],
                    })
                  );
                }
              }, 1000); // Delay in milliseconds
            }

            // Keep track of the event listeners
            const eventListeners: {
              highlight: Element;
              type: string;
              listener: EventListener;
            }[] = [];

            return {
              update(view) {
                const highlights = view.dom.querySelectorAll(".highlight");

                // Remove previous event listeners
                eventListeners.forEach(({ highlight, type, listener }) => {
                  highlight.removeEventListener(type, listener);
                });
                eventListeners.length = 0;

                highlights.forEach((highlight) => {
                  const mouseEnterListener = () => {
                    // Remove existing hover card
                    if (hoverCardElement) {
                      document.body.removeChild(hoverCardElement);
                      hoverCardElement = null;
                    }

                    // Create new hover card
                    hoverCardElement = document.createElement("div");
                    hoverCardElement.className = "hover-card-container";
                    document.body.appendChild(hoverCardElement);

                    // Find all similarities that include the keyword
                    const similaritiesWithKeyword = similaritiesRef.current
                      ? similaritiesRef.current.filter((similarity) =>
                          similarity.similarKeywords
                            .map((keyword) => keyword.toLowerCase())
                            .includes(
                              (highlight.textContent ?? "").toLowerCase()
                            )
                        )
                      : [];

                    // Map over these similarities to create a list of document titles
                    const documentTitles = similaritiesWithKeyword.map(
                      (similarity) => {
                        const documentTitle = similarity.documentTitle;
                        const documentId = similarity.documentId;

                        return `<a class="keyword-topic" href="/editor/${documentId}${
                          highlight.getAttribute("data-id")
                            ? "#" + highlight.getAttribute("data-id")
                            : ""
                        }" target="_blank">${documentTitle}</a>`;
                      }
                    );

                    // Add document titles to hover card
                    hoverCardElement.innerHTML = documentTitles.length
                      ? `<div class="keyword-instruction">This key topic is also present in the documents:</div>
                      <div> Click to preview: ${documentTitles.join(
                        ", "
                      )} </div>`
                      : "Document title not found";

                    // Create new popper instance
                    popperInstance = createPopper(highlight, hoverCardElement, {
                      placement: "bottom",
                    });

                    // Show popper
                    show();
                  };
                  highlight.addEventListener("mouseenter", mouseEnterListener);
                  eventListeners.push({
                    highlight,
                    type: "mouseenter",
                    listener: mouseEnterListener,
                  });

                  const mouseLeaveListener = hide;
                  highlight.addEventListener("mouseleave", mouseLeaveListener);
                  eventListeners.push({
                    highlight,
                    type: "mouseleave",
                    listener: mouseLeaveListener,
                  });
                });
              },
              destroy() {
                // Remove the event listeners
                for (const { highlight, type, listener } of eventListeners) {
                  highlight.removeEventListener(type, listener);
                }
                eventListeners.length = 0;

                // Destroy the popper instance
                if (popperInstance) {
                  popperInstance.destroy();
                  popperInstance = null;
                }

                // Remove the hover card element from the DOM
                if (hoverCardElement) {
                  document.body.removeChild(hoverCardElement);
                  hoverCardElement = null;
                }
              },
            };
          },
        }),
      ];
    },
  });
};
