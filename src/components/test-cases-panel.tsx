"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { TestCase } from "@/lib/problems";
import { cn } from "@/lib/utils";

interface TestCasesPanelProps {
  cases: TestCase[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<TestCase>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function TestCasesPanel({
  cases,
  selectedId,
  onSelect,
  onChange,
  onAdd,
  onRemove,
}: TestCasesPanelProps) {
  const selected = cases.find((c) => c.id === selectedId) ?? cases[0];

  if (!selected) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-muted-foreground">No test cases yet.</p>
        <Button size="sm" onClick={onAdd}>
          <Plus data-icon="inline-start" />
          Add test case
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {cases.map((c, index) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                c.id === selected.id
                  ? "bg-teal-500/20 text-teal-100"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Case {index + 1}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button size="icon-xs" variant="ghost" onClick={onAdd} aria-label="Add test case">
            <Plus />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onRemove(selected.id)}
            disabled={cases.length <= 1}
            aria-label="Remove test case"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-auto p-3">
        <label className="space-y-1.5">
          <span className="text-[11px] font-semibold tracking-[0.12em] text-accent-label uppercase">
            Args (JSON array)
          </span>
          <Textarea
            value={selected.argsJson}
            onChange={(e) => onChange(selected.id, { argsJson: e.target.value })}
            className="min-h-[88px] font-mono text-xs"
            spellCheck={false}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-[11px] font-semibold tracking-[0.12em] text-accent-label uppercase">
            Expected (JSON)
          </span>
          <Textarea
            value={selected.expectedJson}
            onChange={(e) =>
              onChange(selected.id, { expectedJson: e.target.value })
            }
            className="min-h-[64px] font-mono text-xs"
            spellCheck={false}
          />
        </label>
      </div>
    </div>
  );
}
