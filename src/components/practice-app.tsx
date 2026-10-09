"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Play, RotateCcw } from "lucide-react";
import { CodeEditor } from "@/components/code-editor";
import { ProblemPanel } from "@/components/problem-panel";
import { ResultsPanel } from "@/components/results-panel";
import { SolutionView } from "@/components/solution-view";
import { TestCasesPanel } from "@/components/test-cases-panel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { problems, type Problem, type TestCase, type ViewTab } from "@/lib/problems";
import { runTestCases, type RunSummary } from "@/lib/runner";
import { cn } from "@/lib/utils";

function cloneTests(tests: TestCase[]): TestCase[] {
  return tests.map((t) => ({ ...t }));
}

const tabs: { id: ViewTab; label: string }[] = [
  { id: "practice", label: "Practice" },
  { id: "optimal", label: "Optimal" },
  { id: "brute", label: "Brute Force" },
];

export function PracticeApp() {
  const [problemId, setProblemId] = useState(problems[0]?.id ?? "");
  const [tab, setTab] = useState<ViewTab>("practice");
  const [codeByProblem, setCodeByProblem] = useState<Record<string, string>>(() =>
    Object.fromEntries(problems.map((p) => [p.id, p.starterCode]))
  );
  const [testsByProblem, setTestsByProblem] = useState<Record<string, TestCase[]>>(
    () => Object.fromEntries(problems.map((p) => [p.id, cloneTests(p.sampleTests)]))
  );
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(
    problems[0]?.sampleTests[0]?.id ?? null
  );
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mobilePane, setMobilePane] = useState<"problem" | "workspace">("workspace");

  const problem = useMemo(
    () => problems.find((p) => p.id === problemId) as Problem,
    [problemId]
  );

  useEffect(() => {
    setSummary(null);
    setRunError(null);
    setTab("practice");
    const first = testsByProblem[problemId]?.[0]?.id ?? null;
    setSelectedCaseId(first);
  }, [problemId]); // eslint-disable-line react-hooks/exhaustive-deps

  const code = codeByProblem[problem.id] ?? problem.starterCode;
  const cases = testsByProblem[problem.id] ?? [];

  function updateCode(next: string) {
    setCodeByProblem((prev) => ({ ...prev, [problem.id]: next }));
  }

  function updateTests(updater: (prev: TestCase[]) => TestCase[]) {
    setTestsByProblem((prev) => ({
      ...prev,
      [problem.id]: updater(prev[problem.id] ?? []),
    }));
  }

  function handleReset() {
    updateCode(problem.starterCode);
    updateTests(() => cloneTests(problem.sampleTests));
    setSelectedCaseId(problem.sampleTests[0]?.id ?? null);
    setSummary(null);
    setRunError(null);
  }

  function handleRun() {
    setRunError(null);
    startTransition(async () => {
      try {
        const result = await runTestCases(code, problem.functionName, cases);
        setSummary(result);
      } catch (err) {
        setSummary(null);
        setRunError(err instanceof Error ? err.message : String(err));
      }
    });
  }

  return (
    <TooltipProvider>
      <div className="app-shell flex min-h-dvh flex-col text-foreground">
        <header className="sticky top-0 z-20 border-b border-border/80 bg-[color-mix(in_oklch,var(--background)_88%,transparent)] backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-5">
            <div className="flex items-center gap-3">
              <div className="brand-mark flex size-9 items-center justify-center rounded-lg bg-teal-500/15 ring-1 ring-teal-400/30">
                <span className="font-heading text-sm font-bold tracking-tight text-teal-300">
                  LC
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-heading text-base font-semibold tracking-tight md:text-lg">
                  LeetCode Lab
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Offline practice · local sandbox
                </p>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden h-8 md:block" />

            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={problemId}
                onValueChange={(v) => {
                  if (v) setProblemId(v);
                }}
              >
                <SelectTrigger className="w-full sm:max-w-md" size="default">
                  <SelectValue placeholder="Select a problem">
                    {problem ? `${problem.number}. ${problem.title}` : "Select a problem"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {problems.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.number}. {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <nav
                className="flex rounded-lg border border-border/70 bg-surface-inset p-0.5"
                aria-label="View mode"
              >
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:flex-none",
                      tab === item.id
                        ? "bg-teal-500/20 text-teal-100 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col min-h-0 px-3 py-3 md:px-5 md:py-4">
          <div className="mb-3 flex gap-1 rounded-lg border border-border/70 bg-surface-inset p-0.5 md:hidden">
            {(
              [
                ["problem", "Problem"],
                ["workspace", "Workspace"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobilePane(id)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  mobilePane === id
                    ? "bg-background text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[minmax(260px,34%)_1fr] lg:grid-cols-[minmax(280px,32%)_1fr]">
            <aside
              className={cn(
                "min-h-[40vh] overflow-hidden rounded-xl border border-border/70 bg-panel md:min-h-0 md:block",
                mobilePane === "problem" ? "block" : "hidden md:block"
              )}
            >
              <ProblemPanel problem={problem} />
            </aside>

            <section
              className={cn(
                "flex min-h-[55vh] min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-panel md:min-h-0",
                mobilePane === "workspace" ? "flex" : "hidden md:flex"
              )}
            >
              {tab === "practice" && (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                      Define <code className="text-teal-300">{problem.functionName}</code>{" "}
                      and run against custom cases
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={isPending}
                      >
                        <RotateCcw data-icon="inline-start" />
                        Reset
                      </Button>
                      <Button size="sm" onClick={handleRun} disabled={isPending}>
                        <Play data-icon="inline-start" />
                        Run
                      </Button>
                    </div>
                  </div>

                  <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
                    <div className="min-h-[280px] border-b border-border/70 p-2 lg:min-h-0 lg:border-r lg:border-b-0">
                      <CodeEditor value={code} onChange={updateCode} height="100%" />
                    </div>

                    <div className="grid min-h-[320px] grid-rows-[minmax(180px,1fr)_minmax(180px,1fr)] lg:min-h-0">
                      <div className="min-h-0 border-b border-border/70">
                        <TestCasesPanel
                          cases={cases}
                          selectedId={selectedCaseId}
                          onSelect={setSelectedCaseId}
                          onChange={(id, patch) =>
                            updateTests((prev) =>
                              prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
                            )
                          }
                          onAdd={() => {
                            const id = `custom-${Date.now()}`;
                            updateTests((prev) => [
                              ...prev,
                              {
                                id,
                                label: `Custom ${prev.length + 1}`,
                                argsJson: "[]",
                                expectedJson: "null",
                              },
                            ]);
                            setSelectedCaseId(id);
                          }}
                          onRemove={(id) => {
                            updateTests((prev) => {
                              if (prev.length <= 1) return prev;
                              const next = prev.filter((c) => c.id !== id);
                              setSelectedCaseId(next[0]?.id ?? null);
                              return next;
                            });
                          }}
                        />
                      </div>
                      <div className="min-h-0">
                        <ResultsPanel
                          summary={summary}
                          loading={isPending}
                          error={runError}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "optimal" && (
                <SolutionView title="Optimal solution" solution={problem.optimal} />
              )}
              {tab === "brute" && (
                <SolutionView
                  title="Brute-force solution"
                  solution={problem.bruteForce}
                />
              )}
            </section>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
