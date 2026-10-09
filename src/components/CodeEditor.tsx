"use client";

import dynamic from "next/dynamic";

export type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

export function EditorLoading() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-text-muted animate-pulse-soft">
      Loading Java editor…
    </div>
  );
}

// Monaco touches `window` at import time, so it must only load in the browser.
const MonacoEditor = dynamic(() => import("./MonacoEditor"), {
  ssr: false,
  loading: EditorLoading,
});

export function CodeEditor(props: CodeEditorProps) {
  return (
    <div className="h-full min-h-[280px] overflow-hidden rounded-lg border border-border bg-editor">
      <MonacoEditor {...props} />
    </div>
  );
}
