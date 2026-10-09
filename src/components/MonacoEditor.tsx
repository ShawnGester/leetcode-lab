"use client";

import "@/lib/monaco-setup";
import Editor from "@monaco-editor/react";
import { EditorLoading, type CodeEditorProps } from "./CodeEditor";

export default function MonacoEditor({ value, onChange, readOnly }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="java"
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "var(--font-code), Menlo, monospace",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        padding: { top: 12, bottom: 12 },
        wordWrap: "on",
        renderLineHighlight: "gutter",
      }}
      loading={<EditorLoading />}
    />
  );
}
