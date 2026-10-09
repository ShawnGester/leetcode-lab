"use client";

import { CodeEditor } from "@/components/code-editor";
import { Badge } from "@/components/ui/badge";
import type { SolutionInfo } from "@/lib/problems";

interface SolutionViewProps {
  title: string;
  solution: SolutionInfo;
}

export function SolutionView({ title, solution }: SolutionViewProps) {
  return (
    <div className="panel-enter flex h-full min-h-0 flex-col gap-4 p-4 md:p-5">
      <div className="space-y-2">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {solution.notes}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-200">
            Time {solution.time}
          </Badge>
          <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-sky-200">
            Space {solution.space}
          </Badge>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor value={solution.code} onChange={() => {}} readOnly height="100%" />
      </div>
    </div>
  );
}
