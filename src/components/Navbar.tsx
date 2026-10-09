"use client";

import { cn } from "@/lib/utils";
import type { Problem } from "@/lib/problems";

export type ViewTab = "practice" | "optimal" | "brute";

type Props = {
  problems: Problem[];
  problemId: string;
  onProblemChange: (id: string) => void;
  tab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
};

const tabs: { id: ViewTab; label: string }[] = [
  { id: "practice", label: "Practice" },
  { id: "optimal", label: "Optimal" },
  { id: "brute", label: "Brute Force" },
];

export function Navbar({
  problems,
  problemId,
  onProblemChange,
  tab,
  onTabChange,
}: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-bg-elevated/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-sm font-bold text-accent">
            LL
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-text">LeetLab</p>
            <p className="text-xs text-text-muted">Local Java · offline practice</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Solution views">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-accent text-bg"
                  : "text-text-muted hover:bg-bg-panel hover:text-text",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-text-muted lg:max-w-md lg:items-end">
          <span className="uppercase tracking-wider">Problem</span>
          <select
            value={problemId}
            onChange={(e) => onProblemChange(e.target.value)}
            className="w-full truncate rounded-md border border-border bg-bg-panel px-3 py-2 text-sm text-text outline-none focus:border-accent"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.number}. {p.title}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
