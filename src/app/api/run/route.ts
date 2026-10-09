import { NextResponse } from "next/server";
import { getProblem, type TestCase } from "@/lib/problems";
import { runJavaTests } from "@/lib/java/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  problemId?: string;
  code?: string;
  tests?: TestCase[];
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const problem = body.problemId ? getProblem(body.problemId) : undefined;
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem" }, { status: 400 });
  }
  if (typeof body.code !== "string" || !body.code.trim()) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }
  if (!Array.isArray(body.tests) || body.tests.length === 0) {
    return NextResponse.json({ error: "At least one test case is required" }, { status: 400 });
  }
  if (body.tests.length > 20) {
    return NextResponse.json({ error: "Too many test cases (max 20)" }, { status: 400 });
  }

  try {
    const result = await runJavaTests(problem, body.code, body.tests);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Runner failed" },
      { status: 500 },
    );
  }
}
