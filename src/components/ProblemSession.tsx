"use client";

import { useState, useTransition } from "react";
import type { Problem, TestCase } from "@/lib/problems";
import type { CaseResult, RunResponse } from "@/lib/java/types";
import { CodeEditor } from "./CodeEditor";
import type { ViewTab } from "./Navbar";
import { SolutionView } from "./SolutionView";
import { TestPanel } from "./TestPanel";

const STORAGE_PREFIX = "leetlab-java-code:";

function loadSavedCode(problem: Problem) {
  if (typeof window === "undefined") return problem.starterCode;
  const saved = localStorage.getItem(STORAGE_PREFIX + problem.id);
  return saved && saved.trim() ? saved : problem.starterCode;
}

type Props = {
  problem: Problem;
  tab: ViewTab;
};

export function ProblemSession({ problem, tab }: Props) {
  const [code, setCode] = useState(() => loadSavedCode(problem));
  const [tests, setTests] = useState<TestCase[]>(() => structuredClone(problem.sampleTests));
  const [results, setResults] = useState<CaseResult[] | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateCode = (next: string) => {
    setCode(next);
    localStorage.setItem(STORAGE_PREFIX + problem.id, next);
  };

  const clearRun = () => {
    setResults(null);
    setCompileError(null);
    setRunError(null);
  };

  const runTests = () => {
    clearRun();
    startTransition(async () => {
      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemId: problem.id, code, tests }),
        });
        const data = (await res.json()) as RunResponse & { error?: string };
        if (!res.ok) {
          setRunError(data.error ?? `Runner returned HTTP ${res.status}`);
          return;
        }
        setCompileError(data.compileError ?? null);
        setResults(data.compileError ? null : (data.results ?? []));
      } catch {
        setRunError(
          "Couldn't reach the local Java runner. Make sure `npm run dev` is still running.",
        );
      }
    });
  };

  if (tab !== "practice") {
    return <SolutionView problem={problem} mode={tab === "optimal" ? "optimal" : "brute"} />;
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="font-mono text-sm font-medium text-text">Solution.java</p>
          <button
            type="button"
            onClick={() => updateCode(problem.starterCode)}
            className="text-xs text-text-muted hover:text-accent"
          >
            Reset starter
          </button>
        </div>
        <div className="h-[340px] lg:h-auto lg:min-h-[280px] lg:flex-1">
          <CodeEditor value={code} onChange={updateCode} />
        </div>
      </div>

      <div className="min-h-[260px] lg:flex-[0.9]">
        <TestPanel
          tests={tests}
          onChange={setTests}
          results={results}
          running={isPending}
          compileError={compileError}
          runError={runError}
          onRun={runTests}
          onResetTests={() => {
            setTests(structuredClone(problem.sampleTests));
            clearRun();
          }}
        />
      </div>
    </>
  );
}
