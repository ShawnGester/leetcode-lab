"use client";

import { CodeEditor } from "./CodeEditor";
import type { Problem } from "@/lib/problems";

type Props = {
  problem: Problem;
  mode: "optimal" | "brute";
};

export function SolutionView({ problem, mode }: Props) {
  const code = mode === "optimal" ? problem.optimalSolution : problem.bruteForceSolution;
  const note =
    mode === "optimal" ? problem.complexity.optimal : problem.complexity.bruteForce;

  return (
    <div className="animate-fade-up flex h-full min-h-0 flex-col gap-3">
      <div className="rounded-xl border border-border bg-bg-panel/80 px-4 py-3">
        <p className="text-sm font-semibold text-text">
          {mode === "optimal" ? "Optimal solution" : "Brute force solution"}
        </p>
        <p className="mt-1 text-sm text-text-muted">{note}</p>
        <p className="mt-2 text-xs text-text-muted">
          Read-only Java reference — switch back to Practice to edit and run your own code.
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor value={code} onChange={() => {}} readOnly />
      </div>
    </div>
  );
}
