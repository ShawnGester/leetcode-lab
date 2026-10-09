"use client";

import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatJson, type RunSummary } from "@/lib/runner";
import { cn } from "@/lib/utils";

interface ResultsPanelProps {
  summary: RunSummary | null;
  loading: boolean;
  error: string | null;
}

export function ResultsPanel({ summary, loading, error }: ResultsPanelProps) {
  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-teal-400" />
        <p className="text-sm">Running tests…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Could not run</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="font-heading text-sm font-medium text-foreground/90">
          Ready when you are
        </p>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          Edit your solution, adjust test cases, then hit Run. Results appear here.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              summary.failed + summary.errors === 0
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : "border-amber-500/40 bg-amber-500/10 text-amber-200"
            )}
          >
            {summary.passed}/{summary.results.length} passed
          </Badge>
          {summary.failed > 0 && (
            <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-200">
              {summary.failed} failed
            </Badge>
          )}
          {summary.errors > 0 && (
            <Badge variant="outline" className="border-orange-500/40 bg-orange-500/10 text-orange-200">
              {summary.errors} errors
            </Badge>
          )}
        </div>

        <ul className="space-y-2">
          {summary.results.map((result) => (
            <li
              key={result.id}
              className="result-row rounded-lg border border-border/70 bg-surface-inset/80 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {result.status === "pass" && (
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  )}
                  {result.status === "fail" && (
                    <XCircle className="size-4 text-rose-400" />
                  )}
                  {result.status === "error" && (
                    <AlertCircle className="size-4 text-orange-400" />
                  )}
                  <span>{result.label}</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {result.durationMs}ms
                </span>
              </div>

              {result.status === "error" ? (
                <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-orange-200/90">
                  {result.error}
                </pre>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Actual
                    </p>
                    <pre className="overflow-x-auto rounded bg-black/25 px-2 py-1.5 font-mono text-[11px]">
                      {formatJson(result.actual)}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Expected
                    </p>
                    <pre className="overflow-x-auto rounded bg-black/25 px-2 py-1.5 font-mono text-[11px]">
                      {formatJson(result.expected)}
                    </pre>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  );
}
