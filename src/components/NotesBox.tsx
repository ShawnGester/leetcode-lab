"use client";

import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_PREFIX = "leetlab-notes:";

function loadNotes(problemId: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_PREFIX + problemId) ?? "";
}

type Props = {
  problemId: string;
};

export function NotesBox({ problemId }: Props) {
  const [notes, setNotes] = useState(() => loadNotes(problemId));
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!justSaved) return;
    const t = setTimeout(() => setJustSaved(false), 1500);
    return () => clearTimeout(t);
  }, [justSaved, notes]);

  const save = (next: string) => {
    setNotes(next);
    if (next) localStorage.setItem(STORAGE_PREFIX + problemId, next);
    else localStorage.removeItem(STORAGE_PREFIX + problemId);
    setJustSaved(true);
  };

  const clear = () => {
    if (!notes) return;
    if (window.confirm("Clear your notes for this problem? This can't be undone.")) save("");
  };

  return (
    <section className="rounded-xl border border-border bg-bg-panel/80">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <label htmlFor={`notes-${problemId}`} className="text-sm font-semibold text-text">
            My notes / LeetCode Premium editorial
          </label>
          <p className="text-xs text-text-muted">
            Stored only in this browser (localStorage). Never sent to the server or saved to git.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            aria-live="polite"
            className={cn(
              "inline-flex items-center gap-1 text-xs transition-opacity duration-500",
              justSaved ? "text-pass opacity-100" : "text-text-muted opacity-70",
            )}
          >
            {justSaved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Saved
              </>
            ) : notes ? (
              `${notes.length.toLocaleString()} chars · autosaved`
            ) : (
              "Autosaves as you type"
            )}
          </span>
          <button
            type="button"
            onClick={clear}
            disabled={!notes}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-text-muted hover:border-danger hover:text-danger disabled:pointer-events-none disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>
      <textarea
        id={`notes-${problemId}`}
        value={notes}
        onChange={(e) => save(e.target.value)}
        spellCheck={false}
        placeholder={
          "Paste the Premium editorial, hints, or your own notes here.\n\nWhitespace and code indentation are kept as-is, e.g.\n\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n    }"
        }
        className="block min-h-[220px] w-full resize-y whitespace-pre-wrap rounded-b-xl bg-editor px-4 py-3 font-mono text-[13px] leading-relaxed text-text outline-none [field-sizing:content] [tab-size:4] placeholder:text-text-muted/60 focus:ring-1 focus:ring-accent/60 max-h-[70vh] overflow-auto"
      />
    </section>
  );
}
