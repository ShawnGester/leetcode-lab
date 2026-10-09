"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Problem } from "@/lib/problems";

const difficultyClass: Record<Problem["difficulty"], string> = {
  Easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Hard: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export function ProblemPanel({ problem }: { problem: Problem }) {
  return (
    <ScrollArea className="h-full">
      <div className="panel-enter space-y-5 p-4 md:p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {problem.number}. {problem.title}
            </h2>
            <Badge
              variant="outline"
              className={difficultyClass[problem.difficulty]}
            >
              {problem.difficulty}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {problem.description}
          </p>
        </div>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.14em] text-accent-label uppercase">
            Examples
          </h3>
          {problem.examples.map((example, i) => (
            <pre
              key={i}
              className="overflow-x-auto rounded-md border border-border/60 bg-surface-inset px-3 py-2.5 font-mono text-[12px] leading-relaxed text-foreground/90"
            >
              {example}
            </pre>
          ))}
        </section>

        <section className="space-y-2">
          <h3 className="text-xs font-semibold tracking-[0.14em] text-accent-label uppercase">
            Constraints
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {problem.constraints.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-teal-400/70" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ScrollArea>
  );
}
