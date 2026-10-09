export type CaseResult = {
  id: string;
  label: string;
  passed: boolean;
  expected: unknown;
  actual?: unknown;
  stdout?: string;
  stderr?: string;
  error?: string;
  durationMs: number;
};

export type RunResponse = {
  ok: boolean;
  compileError?: string;
  results: CaseResult[];
};
