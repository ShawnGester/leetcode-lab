export type Difficulty = "Easy" | "Medium" | "Hard";

export type ViewTab = "practice" | "optimal" | "brute";

export interface TestCase {
  id: string;
  label: string;
  /** JSON array of arguments matching the function signature */
  argsJson: string;
  /** JSON value for the expected return */
  expectedJson: string;
}

export interface SolutionInfo {
  code: string;
  time: string;
  space: string;
  notes: string;
}

export interface Problem {
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: string[];
  constraints: string[];
  functionName: string;
  starterCode: string;
  sampleTests: TestCase[];
  optimal: SolutionInfo;
  bruteForce: SolutionInfo;
}
