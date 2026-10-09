"use client";

import Editor from "@monaco-editor/react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

export function CodeEditor({ value, onChange, readOnly }: Props) {
  return (
    <div className="h-full min-h-[280px] overflow-hidden rounded-lg border border-border bg-editor">
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
        loading={
          <div className="flex h-full items-center justify-center text-sm text-text-muted animate-pulse-soft">
            Loading Java editor…
          </div>
        }
      />
    </div>
  );
}
