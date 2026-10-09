"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: unknown;
  onValidChange: (value: unknown) => void;
  rows?: number;
  validate?: (value: unknown) => boolean;
};

export function JsonField({
  label,
  value,
  onValidChange,
  rows = 2,
  validate,
}: Props) {
  const [text, setText] = useState(() => JSON.stringify(value));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setText(JSON.stringify(value));
    setInvalid(false);
  }, [value]);

  return (
    <label className="block text-[11px] uppercase tracking-wider text-text-muted">
      {label}
      <textarea
        value={text}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          try {
            const parsed = JSON.parse(next) as unknown;
            if (validate && !validate(parsed)) {
              setInvalid(true);
              return;
            }
            setInvalid(false);
            onValidChange(parsed);
          } catch {
            setInvalid(true);
          }
        }}
        rows={rows}
        spellCheck={false}
        className={cn(
          "mt-1 w-full resize-y rounded-md border bg-editor px-2 py-1.5 font-mono text-xs text-text outline-none focus:border-accent",
          invalid ? "border-danger" : "border-border",
        )}
      />
    </label>
  );
}
