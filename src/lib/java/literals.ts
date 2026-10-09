/** Convert a JSON value into a Java source literal for the harness. */

export function toJavaLiteral(value: unknown, javaType: string): string {
  if (javaType === "int") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new Error(`Expected int, got ${JSON.stringify(value)}`);
    }
    return String(value);
  }

  if (javaType === "int[]") {
    if (!Array.isArray(value)) throw new Error("Expected int[]");
    return `new int[]{${value.map((v) => toJavaLiteral(v, "int")).join(", ")}}`;
  }

  if (javaType === "int[][]") {
    if (!Array.isArray(value)) throw new Error("Expected int[][]");
    const rows = value.map((row) => toJavaLiteral(row, "int[]"));
    return `new int[][]{${rows.join(", ")}}`;
  }

  if (javaType === "char[][]") {
    if (!Array.isArray(value)) throw new Error("Expected char[][]");
    const rows = (value as unknown[]).map((row) => {
      if (!Array.isArray(row)) throw new Error("Expected char[] row");
      const cells = row.map((cell) => {
        const ch = String(cell);
        if (ch.length !== 1) throw new Error(`Expected single char, got ${ch}`);
        return `'${ch}'`;
      });
      return `new char[]{${cells.join(", ")}}`;
    });
    return `new char[][]{${rows.join(", ")}}`;
  }

  throw new Error(`Unsupported Java type for literal: ${javaType}`);
}

export function buildCallArgs(args: unknown[], paramTypes: string[]): string {
  if (args.length !== paramTypes.length) {
    throw new Error(
      `Arity mismatch: got ${args.length} args for ${paramTypes.length} params`,
    );
  }
  return args.map((arg, i) => toJavaLiteral(arg, paramTypes[i]!)).join(", ");
}
