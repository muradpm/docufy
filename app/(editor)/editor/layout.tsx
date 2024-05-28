import React from "react";
import "@/styles/editor-globals.css";
import "@/styles/text-editor.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
