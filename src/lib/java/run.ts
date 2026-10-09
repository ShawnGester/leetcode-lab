import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { compareResults, parseStdout } from "./compare";
import { buildRunnerSource, prepareSolutionSource } from "./harness";
import type { Problem, TestCase } from "@/lib/problems";
import type { CaseResult, RunResponse } from "./types";

export type { CaseResult, RunResponse } from "./types";

function runCommand(
  cmd: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
): Promise<{ code: number | null; stdout: string; stderr: string; timedOut: boolean }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);
    child.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    child.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut });
    });
  });
}

export async function runJavaTests(
  problem: Problem,
  code: string,
  tests: TestCase[],
): Promise<RunResponse> {
  const workDir = await mkdtemp(join(tmpdir(), "leetcode-java-"));
  const results: CaseResult[] = [];
  try {
    let solutionSrc: string;
    try {
      solutionSrc = prepareSolutionSource(code);
    } catch (e) {
      return { ok: false, compileError: e instanceof Error ? e.message : String(e), results: [] };
    }
    await writeFile(join(workDir, "Solution.java"), solutionSrc, "utf8");
    for (const test of tests) {
      const started = Date.now();
      try {
        const runnerSrc = buildRunnerSource({
          methodName: problem.methodName,
          paramTypes: problem.paramTypes,
          returnType: problem.returnType,
          args: test.args,
        });
        await writeFile(join(workDir, "Runner.java"), runnerSrc, "utf8");
        const compile = await runCommand("javac", ["Solution.java", "Runner.java"], workDir, 15_000);
        if (compile.timedOut) {
          results.push({ id: test.id, label: test.label, passed: false, expected: test.expected, error: "Compilation timed out", stderr: compile.stderr, durationMs: Date.now() - started });
          continue;
        }
        if (compile.code !== 0) {
          results.push({ id: test.id, label: test.label, passed: false, expected: test.expected, error: "Compilation failed", stderr: compile.stderr || compile.stdout, durationMs: Date.now() - started });
          if (compile.stderr.includes("Solution.java")) {
            return { ok: false, compileError: compile.stderr || compile.stdout, results };
          }
          continue;
        }
        const exec = await runCommand("java", ["Runner"], workDir, 5_000);
        if (exec.timedOut) {
          results.push({ id: test.id, label: test.label, passed: false, expected: test.expected, error: "Execution timed out (5s)", stderr: exec.stderr, durationMs: Date.now() - started });
          continue;
        }
        if (exec.code !== 0) {
          results.push({ id: test.id, label: test.label, passed: false, expected: test.expected, stdout: exec.stdout, stderr: exec.stderr, error: "Runtime error", durationMs: Date.now() - started });
          continue;
        }
        const actual = parseStdout(exec.stdout, problem.returnType);
        const passed = compareResults(test.expected, actual, problem.returnType);
        results.push({ id: test.id, label: test.label, passed, expected: test.expected, actual, stdout: exec.stdout.trim(), durationMs: Date.now() - started });
      } catch (e) {
        results.push({ id: test.id, label: test.label, passed: false, expected: test.expected, error: e instanceof Error ? e.message : String(e), durationMs: Date.now() - started });
      }
    }
    return { ok: results.every((r) => r.passed), results };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
