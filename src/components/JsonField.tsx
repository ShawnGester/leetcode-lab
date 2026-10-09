"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function sameJson(text: string, serialized: string) {
  try {
    return JSON.stringify(JSON.parse(text)) === serialized;
  } catch {
    return false;
  }
}

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
  const serialized = JSON.stringify(value);
  const [text, setText] = useState(serialized);
  const [syncedValue, setSyncedValue] = useState(serialized);
  const [invalid, setInvalid] = useState(false);

  // Only overwrite the textarea when the value changed from outside (e.g. reset),
  // so the user's own formatting survives while they type.
  if (serialized !== syncedValue) {
    setSyncedValue(serialized);
    if (!sameJson(text, serialized)) {
      setText(serialized);
      setInvalid(false);
    }
  }

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
      {invalid ? (
        <span className="mt-0.5 block text-[11px] normal-case tracking-normal text-danger">
          Invalid JSON — the last valid value will be used.
        </span>
      ) : null}
    </label>
  );
}
