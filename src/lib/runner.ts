export type RunStatus = "pass" | "fail" | "error";

export interface CaseResult {
  id: string;
  label: string;
  status: RunStatus;
  actual?: unknown;
  expected?: unknown;
  error?: string;
  durationMs: number;
}

export interface RunSummary {
  results: CaseResult[];
  passed: number;
  failed: number;
  errors: number;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // For coordinate lists (e.g. Pacific Atlantic), order may vary
    if (
      a.every((x) => Array.isArray(x) && x.length === 2 && typeof x[0] === "number") &&
      b.every((x) => Array.isArray(x) && x.length === 2 && typeof x[0] === "number")
    ) {
      const key = (pair: unknown) => JSON.stringify(pair);
      const sa = [...a].map(key).sort();
      const sb = [...b].map(key).sort();
      return sa.every((v, i) => v === sb[i]);
    }
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object).sort();
    const bk = Object.keys(b as object).sort();
    if (ak.length !== bk.length) return false;
    return ak.every((k, i) => k === bk[i] && deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return false;
}

function cloneArgs(args: unknown[]): unknown[] {
  return structuredClone(args);
}

/**
 * Execute user code in a Web Worker with a timeout.
 * Falls back to Function constructor if Workers are unavailable.
 */
async function executeInSandbox(
  code: string,
  functionName: string,
  args: unknown[],
  timeoutMs = 2000
): Promise<unknown> {
  if (typeof Worker === "undefined") {
    return executeWithFunction(code, functionName, args);
  }

  const workerSource = `
    self.onmessage = function (e) {
      const { code, functionName, args } = e.data;
      try {
        const fn = new Function(
          code + "\\n; if (typeof " + functionName + " !== 'function') {" +
          " throw new Error('Expected function \\'" + functionName + "\\' to be defined.'); }" +
          "\\nreturn " + functionName + ";"
        )();
        const result = fn.apply(null, args);
        self.postMessage({ ok: true, result });
      } catch (err) {
        self.postMessage({
          ok: false,
          error: err && err.message ? String(err.message) : String(err),
        });
      }
    };
  `;

  const blob = new Blob([workerSource], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const worker = new Worker(url);
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      worker.terminate();
      URL.revokeObjectURL(url);
      reject(new Error(`Timed out after ${timeoutMs}ms (possible infinite loop)`));
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent<{ ok: boolean; result?: unknown; error?: string }>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      if (e.data.ok) resolve(e.data.result);
      else reject(new Error(e.data.error || "Runtime error"));
    };

    worker.onerror = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      reject(new Error(err.message || "Worker error"));
    };

    worker.postMessage({ code, functionName, args });
  });
}

function executeWithFunction(code: string, functionName: string, args: unknown[]): unknown {
  const fn = new Function(
    `${code}
; if (typeof ${functionName} !== 'function') {
  throw new Error("Expected function '${functionName}' to be defined.");
}
return ${functionName};`
  )();
  return fn(...args);
}

export interface RunnableCase {
  id: string;
  label: string;
  argsJson: string;
  expectedJson: string;
}

export async function runTestCases(
  code: string,
  functionName: string,
  cases: RunnableCase[]
): Promise<RunSummary> {
  const results: CaseResult[] = [];

  for (const testCase of cases) {
    const started = performance.now();
    try {
      const args = JSON.parse(testCase.argsJson) as unknown;
      if (!Array.isArray(args)) {
        throw new Error("Args must be a JSON array of function parameters");
      }
      const expected = JSON.parse(testCase.expectedJson) as unknown;
      const actual = await executeInSandbox(code, functionName, cloneArgs(args));
      const durationMs = Math.round(performance.now() - started);
      const pass = deepEqual(actual, expected);
      results.push({
        id: testCase.id,
        label: testCase.label,
        status: pass ? "pass" : "fail",
        actual,
        expected,
        durationMs,
      });
    } catch (err) {
      results.push({
        id: testCase.id,
        label: testCase.label,
        status: "error",
        error: err instanceof Error ? err.message : String(err),
        durationMs: Math.round(performance.now() - started),
      });
    }
  }

  return {
    results,
    passed: results.filter((r) => r.status === "pass").length,
    failed: results.filter((r) => r.status === "fail").length,
    errors: results.filter((r) => r.status === "error").length,
  };
}

export function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
