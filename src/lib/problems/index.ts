import { findMinimumRotated } from "./find-minimum-rotated";
import { numberOfIslands } from "./number-of-islands";
import { pacificAtlantic } from "./pacific-atlantic";
import { searchRotated } from "./search-rotated";
import type { Problem } from "./types";

export type { Problem, TestCase } from "./types";

export const problems: Problem[] = [
  searchRotated,
  findMinimumRotated,
  numberOfIslands,
  pacificAtlantic,
];

export function getProblem(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}
