"use client";

import type { TestCase } from "@/lib/problems";
import type { CaseResult } from "@/lib/java/types";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { JsonField } from "./JsonField";

type Props = {
  tests: TestCase[];
  onChange: (tests: TestCase[]) => void;
  results: CaseResult[] | null;
  running: boolean;
  compileError?: string | null;
  onRun: () => void;
  onResetTests: () => void;
};

function newId() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function TestPanel({
  tests,
  onChange,
  results,
  running,
  compileError,
  onRun,
  onResetTests,
}: Props) {
  const updateTest = (id: string, patch: Partial<TestCase>) => {
    onChange(tests.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const removeTest = (id: string) => {
    onChange(tests.filter((t) => t.id !== id));
  };

  const addTest = () => {
    const template = tests[0];
    onChange([
      ...tests,
      {
        id: newId(),
        label: `Custom ${tests.length + 1}`,
        args: template ? structuredClone(template.args) : [],
        expected: template ? structuredClone(template.expected) : null,
      },
    ]);
  };

  const resultById = new Map(results?.map((r) => [r.id, r]) ?? []);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-panel/80">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-text">Test cases</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onResetTests}
            className="rounded-md border border-border px-2.5 py-1.5 text-xs text-text-muted hover:border-text-muted hover:text-text"
          >
            Reset samples
          </button>
          <button
            type="button"
            onClick={addTest}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-text-muted hover:border-accent hover:text-accent"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
          <button
            type="button"
            onClick={onRun}
            disabled={running || tests.length === 0}
            className={cn(
              "rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-bg transition",
              (running || tests.length === 0) && "opacity-60",
              !running && "hover:bg-accent-dim",
            )}
          >
            {running ? "Running…" : "Run Java"}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {compileError ? (
          <div className="animate-fade-up rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger whitespace-pre-wrap font-mono">
            {compileError}
          </div>
        ) : null}

        {tests.length === 0 ? (
          <p className="text-sm text-text-muted">
            No tests yet. Add a case or reset samples.
          </p>
        ) : null}

        {tests.map((test) => {
          const result = resultById.get(test.id);
          return (
            <div
              key={test.id}
              className={cn(
                "animate-fade-up rounded-lg border p-3",
                result?.passed === true && "border-pass/40 bg-pass/5",
                result?.passed === false && "border-danger/40 bg-danger/5",
                result == null && "border-border bg-bg/30",
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <input
                  value={test.label}
                  onChange={(e) => updateTest(test.id, { label: e.target.value })}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-text outline-none"
                />
                <div className="flex items-center gap-2">
                  {result ? (
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        result.passed ? "text-pass" : "text-danger",
                      )}
                    >
                      {result.passed ? "Passed" : "Failed"}
                      {result.durationMs != null ? ` · ${result.durationMs}ms` : ""}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-label="Delete test"
                    onClick={() => removeTest(test.id)}
                    className="rounded p-1 text-text-muted hover:bg-bg-elevated hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <JsonField
                  label="Args (JSON array)"
                  value={test.args}
                  validate={(v) => Array.isArray(v)}
                  onValidChange={(v) => updateTest(test.id, { args: v as unknown[] })}
                />
              </div>

              <JsonField
                label="Expected (JSON)"
                value={test.expected}
                onValidChange={(v) => updateTest(test.id, { expected: v })}
              />

              {result && !result.passed ? (
                <div className="mt-2 space-y-1 font-mono text-[11px] text-text-muted">
                  {result.actual !== undefined ? (
                    <p>
                      Actual:{" "}
                      <span className="text-danger">{JSON.stringify(result.actual)}</span>
                    </p>
                  ) : null}
                  {result.error ? <p className="text-danger">{result.error}</p> : null}
                  {result.stderr ? (
                    <pre className="max-h-24 overflow-auto whitespace-pre-wrap text-danger/90">
                      {result.stderr}
                    </pre>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
