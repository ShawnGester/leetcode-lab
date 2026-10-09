"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useCallback, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  height = "100%",
}: CodeEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleMount: OnMount = useCallback((editor) => {
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "var(--font-mono), ui-monospace, monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      renderLineHighlight: "gutter",
      tabSize: 2,
      automaticLayout: true,
    });
    // Keep React state in sync even when value is set programmatically
    editor.onDidChangeModelContent(() => {
      onChangeRef.current(editor.getValue());
    });
  }, []);

  return (
    <div className="editor-shell h-full min-h-[240px] overflow-hidden rounded-lg border border-border/80 bg-[#0f1419]">
      <Editor
        height={height}
        defaultLanguage="javascript"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        loading={
          <div className="flex h-full items-center justify-center bg-[#0f1419] text-sm text-muted-foreground">
            Loading editor…
          </div>
        }
        options={{
          readOnly,
          wordWrap: "on",
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        }}
      />
    </div>
  );
}
