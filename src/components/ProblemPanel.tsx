"use client";

import type { Problem } from "@/lib/problems";
import { cn } from "@/lib/utils";

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

type Props = {
  problem: Problem;
};

export function ProblemPanel({ problem }: Props) {
  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-panel/80">
      <div className="border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-text">
            {problem.number}. {problem.title}
          </h2>
          <span
            className={cn(
              "rounded px-2 py-0.5 text-xs font-medium",
              problem.difficulty === "Easy" && "bg-pass/15 text-pass",
              problem.difficulty === "Medium" && "bg-warn/15 text-warn",
              problem.difficulty === "Hard" && "bg-danger/15 text-danger",
            )}
          >
            {problem.difficulty}
          </span>
          <span className="rounded px-2 py-0.5 text-xs font-medium bg-accent/15 text-accent">
            Java
          </span>
        </div>
      </div>
      <div className="prose-problem flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm leading-relaxed text-text-muted">
        {problem.description.split("\n\n").map((para, i) => (
          <p key={i} className="text-text/90">
            {renderInline(para)}
          </p>
        ))}

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text">
            Examples
          </h3>
          <ul className="space-y-3">
            {problem.examples.map((ex, i) => (
              <li key={i} className="rounded-lg border border-border/70 bg-bg/40 p-3 font-mono text-xs">
                <p>
                  <span className="text-text-muted">Input: </span>
                  <span className="text-text">{ex.input}</span>
                </p>
                <p className="mt-1">
                  <span className="text-text-muted">Output: </span>
                  <span className="text-accent">{ex.output}</span>
                </p>
                {ex.explanation ? (
                  <p className="mt-1 font-sans text-text-muted">{ex.explanation}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text">
            Constraints
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            {problem.constraints.map((c) => (
              <li key={c}>{renderInline(c)}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
