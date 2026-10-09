"use client";

import { useMemo, useState } from "react";
import type { Problem } from "@/lib/problems";
import { Navbar, type ViewTab } from "./Navbar";
import { ProblemPanel } from "./ProblemPanel";
import { ProblemSession } from "./ProblemSession";

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

  const handleProblemChange = (id: string) => {
    setProblemId(id);
    setTab("practice");
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

      <main className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:grid-cols-[minmax(280px,360px)_1fr] lg:px-6">
        <div className="max-h-[45vh] min-h-[240px] lg:h-[calc(100vh-7.5rem)] lg:max-h-none lg:min-h-0">
          <ProblemPanel problem={problem} />
        </div>

        <div className="flex min-h-0 flex-col gap-4 lg:h-[calc(100vh-7.5rem)]">
          <ProblemSession key={problem.id} problem={problem} tab={tab} />
        </div>
      </main>
    </div>
  );
}
