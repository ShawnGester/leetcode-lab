/** Compare expected vs actual JSON values for LeetCode-style outputs. */

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  return false;
}

function sortCoordList(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  if (!value.every((row) => Array.isArray(row) && row.length === 2)) {
    return value;
  }
  const copy = value.map((row) => [...(row as number[])]);
  copy.sort((a, b) => a[0]! - b[0]! || a[1]! - b[1]!);
  return copy;
}

export function compareResults(
  expected: unknown,
  actual: unknown,
  returnType: string,
): boolean {
  if (returnType === "List<List<Integer>>") {
    return deepEqual(sortCoordList(expected), sortCoordList(actual));
  }
  return deepEqual(expected, actual);
}

export function parseStdout(stdout: string, returnType: string): unknown {
  const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "";
  if (returnType === "int") {
    const n = Number(line);
    if (!Number.isInteger(n)) {
      throw new Error(`Could not parse integer from output: ${JSON.stringify(line)}`);
    }
    return n;
  }
  if (returnType === "List<List<Integer>>") {
    return JSON.parse(line) as unknown;
  }
  throw new Error(`Unsupported return type: ${returnType}`);
}
