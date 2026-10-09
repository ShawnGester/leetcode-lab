export type TestCase = {
  id: string;
  label: string;
  args: unknown[];
  expected: unknown;
};

export type Problem = {
  id: string;
  number: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  methodName: string;
  paramTypes: string[];
  returnType: string;
  starterCode: string;
  optimalSolution: string;
  bruteForceSolution: string;
  complexity: { optimal: string; bruteForce: string };
  sampleTests: TestCase[];
};
