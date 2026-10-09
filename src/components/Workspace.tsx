"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Problem, TestCase } from "@/lib/problems";
import type { CaseResult, RunResponse } from "@/lib/java/types";
import { CodeEditor } from "./CodeEditor";
import { Navbar, type ViewTab } from "./Navbar";
import { ProblemPanel } from "./ProblemPanel";
import { SolutionView } from "./SolutionView";
import { TestPanel } from "./TestPanel";

const STORAGE_PREFIX = "leetlab-java-code:";

type Props = {
  problems: Problem[];
};

export function Workspace({ problems }: Props) {
  const [problemId, setProblemId] = useState(problems[0]!.id);
  const [tab, setTab] = useState<ViewTab>("practice");
  const problem = useMemo(
    () => problems.find((p) => p.id === problemId) ?? problems[0]!,
    [problems, problemId],
  );

  const [code, setCode] = useState(problem.starterCode);
  const [tests, setTests] = useState<TestCase[]>(() =>
    structuredClone(problem.sampleTests),
  );
  const [results, setResults] = useState<CaseResult[] | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const key = STORAGE_PREFIX + problem.id;
    const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    setCode(saved && saved.trim() ? saved : problem.starterCode);
    setTests(structuredClone(problem.sampleTests));
    setResults(null);
    setCompileError(null);
    setRunError(null);
  }, [problem]);

  useEffect(() => {
    const key = STORAGE_PREFIX + problem.id;
    localStorage.setItem(key, code);
  }, [code, problem.id]);

  const handleProblemChange = (id: string) => {
    setProblemId(id);
    setTab("practice");
  };

  const runTests = () => {
    setRunError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problemId: problem.id,
            code,
            tests,
          }),
        });
        const data = (await res.json()) as RunResponse & { error?: string };
        if (!res.ok) {
          setCompileError(null);
          setResults(null);
          setRunError(data.error ?? "Request failed");
          return;
        }
        setCompileError(data.compileError ?? null);
        setResults(data.results ?? []);
      } catch (e) {
        setRunError(e instanceof Error ? e.message : "Network error");
        setResults(null);
      }
    });
  };

  return (
    <div className="flex min-h-full flex-col">
      <Navbar
        problems={problems}
        problemId={problem.id}
        onProblemChange={handleProblemChange}
        tab={tab}
        onTabChange={setTab}
      />

      <main className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[minmax(280px,360px)_1fr] lg:px-6">
        <div className="min-h-[320px] lg:min-h-0 lg:h-[calc(100vh-7.5rem)]">
          <ProblemPanel problem={problem} />
        </div>

        <div className="flex min-h-0 flex-col gap-4 lg:h-[calc(100vh-7.5rem)]">
          {tab === "practice" ? (
            <>
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text">Solution.java</p>
                  <button
                    type="button"
                    onClick={() => setCode(problem.starterCode)}
                    className="text-xs text-text-muted hover:text-accent"
                  >
                    Reset starter
                  </button>
                </div>
                <div className="min-h-[280px] flex-1">
                  <CodeEditor value={code} onChange={setCode} />
                </div>
              </div>

              {runError ? (
                <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {runError}
                </p>
              ) : null}

              <div className="min-h-[260px] flex-[0.9]">
                <TestPanel
                  tests={tests}
                  onChange={setTests}
                  results={results}
                  running={isPending}
                  compileError={compileError}
                  onRun={runTests}
                  onResetTests={() => {
                    setTests(structuredClone(problem.sampleTests));
                    setResults(null);
                    setCompileError(null);
                  }}
                />
              </div>
            </>
          ) : (
            <SolutionView problem={problem} mode={tab === "optimal" ? "optimal" : "brute"} />
          )}
        </div>
      </main>
    </div>
  );
}
