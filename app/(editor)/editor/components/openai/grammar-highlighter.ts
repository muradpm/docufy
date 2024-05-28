"use client";

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import type { Correction } from "@/app/api/openai/grammar/route";
import { createPopper } from "@popperjs/core";
import type { Instance, OptionsGeneric, Modifier } from "@popperjs/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    grammarHighlighter: {
      highlightGrammar: (corrections: Correction[]) => ReturnType;
      removeGrammarHighlights: () => ReturnType;
    };
  }
}

export const createGrammarHighlighter = (triggerGrammarRecheck: () => void) => {
  const pluginKey = new PluginKey("grammarHighlighter");
  let popperInstance: Instance | null = null;
  let hoverCardElement: HTMLDivElement | null = null;

  return Extension.create({
    name: "grammarHighlighter",

    addCommands() {
      return {
        highlightGrammar:
          (corrections) =>
          ({ tr, state }) => {
            const decorations: Decoration[] = [];
            corrections.forEach((correction) => {
              const regex = new RegExp(`\\b(${correction.original})\\b`, "gi");

              state.doc.descendants((node, pos) => {
                if (!node.isText) return;

                let match;
                while ((match = regex.exec(node.text ?? "")) !== null) {
                  const from = pos + match.index;
                  const to = from + match[0].length;
                  decorations.push(
                    Decoration.inline(from, to, {
                      class: "grammar-highlight",
                      "data-error": correction.corrected,
                      "data-reason": correction.reason,
                      "data-from": String(from),
                      "data-to": String(to),
                    })
                  );
                }
              });
            });

            if (decorations.length > 0) {
              const decorationSet = DecorationSet.create(
                state.doc,
                decorations
              );
              tr.setMeta(pluginKey, decorationSet);
            }

            return true;
          },
        removeGrammarHighlights:
          () =>
          ({ tr }) => {
            // Check if the hover card element and popper instance exist
            if (hoverCardElement && popperInstance) {
              // Remove the hover card element from the DOM
              document.body.removeChild(hoverCardElement);
              hoverCardElement = null;

              // Destroy the popper instance
              popperInstance.destroy();
              popperInstance = null;
            }

            // Set the meta to an empty DecorationSet to remove all grammar highlights
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
              const decorations = this.getState(state);

              return decorations;
            },
          },
          state: {
            init(_, { doc }) {
              return DecorationSet.create(doc, []);
            },
            apply(tr, decorationSet) {
              const meta = tr.getMeta(pluginKey);
              if (meta) {
                return meta;
              } else if (tr.docChanged) {
                const mappedDecorationSet = decorationSet.map(
                  tr.mapping,
                  tr.doc
                );

                return mappedDecorationSet;
              }

              return decorationSet;
            },
          },
          view() {
            const eventListeners: Array<{
              highlight: Element;
              type: string;
              listener: EventListener;
            }> = [];
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
                          offset: [0, 10],
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

            return {
              update(view) {
                const highlights =
                  view.dom.querySelectorAll(".grammar-highlight");

                // Remove previous event listeners
                eventListeners.forEach(({ highlight, type, listener }) => {
                  highlight.removeEventListener(type, listener);
                });
                eventListeners.length = 0;

                highlights.forEach((highlight: Element) => {
                  const mouseEnterListener = () => {
                    // Remove existing hover card
                    if (hoverCardElement) {
                      document.body.removeChild(hoverCardElement);
                      hoverCardElement = null;
                    }

                    // Create new hover card
                    hoverCardElement = document.createElement("div");
                    hoverCardElement.className = "grammar-hover-card-container";
                    hoverCardElement.innerHTML = `
                    <div class="hover-card-instruction">Click on the correct word to replace:</div>
                    <div class="hover-card-correct-word">Correct word: <span class="grammar-correct-word">${highlight.getAttribute(
                      "data-error"
                    )}</span></div>
                    <div class="grammar-hover-card-reason">Reason: ${highlight.getAttribute(
                      "data-reason"
                    )}</div>
                  `;
                    document.body.appendChild(hoverCardElement);

                    // Add the click event listener to the correct word span
                    const correctWordSpan =
                      hoverCardElement?.querySelector<HTMLSpanElement>(
                        ".grammar-correct-word"
                      );
                    if (correctWordSpan) {
                      const clickListener = () => {
                        const correction = highlight.getAttribute("data-error");
                        const fromAttr = highlight.getAttribute("data-from");
                        const toAttr = highlight.getAttribute("data-to");

                        if (correction && fromAttr && toAttr) {
                          const from = parseInt(fromAttr, 10);
                          const to = parseInt(toAttr, 10);

                          if (!isNaN(from) && !isNaN(to)) {
                            const transaction = view.state.tr;
                            transaction.replaceWith(
                              from,
                              to,
                              view.state.schema.text(correction)
                            );
                            view.dispatch(transaction);
                            hide();

                            triggerGrammarRecheck();
                          }
                        }
                      };
                      correctWordSpan.addEventListener("click", clickListener);
                      eventListeners.push({
                        highlight: correctWordSpan,
                        type: "click",
                        listener: clickListener,
                      });
                    }

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
                eventListeners.forEach(({ highlight, type, listener }) => {
                  highlight.removeEventListener(type, listener);
                });
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
