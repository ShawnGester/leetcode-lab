import { findMinRotated } from "./find-min-rotated";
import { numberOfIslands } from "./number-of-islands";
import { pacificAtlantic } from "./pacific-atlantic";
import { searchRotated } from "./search-rotated";
import type { Problem } from "./types";

export type { Difficulty, Problem, SolutionInfo, TestCase, ViewTab } from "./types";

export const problems: Problem[] = [
  searchRotated,
  findMinRotated,
  numberOfIslands,
  pacificAtlantic,
];

export function getProblem(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}
