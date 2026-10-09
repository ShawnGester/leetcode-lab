import type { Problem } from "./types";

export const pacificAtlantic: Problem = {
  id: "pacific-atlantic",
  number: 417,
  title: "Pacific Atlantic Water Flow",
  difficulty: "Medium",
  description:
    "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.\n\nThe island is partitioned into a grid of square cells. You are given an m x n integer matrix heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c).\n\nThe island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.\n\nReturn a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.",
  examples: [
    "Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
    "Input: heights = [[1]]\nOutput: [[0,0]]",
  ],
  constraints: [
    "m == heights.length",
    "n == heights[r].length",
    "1 <= m, n <= 200",
    "0 <= heights[r][c] <= 10^5",
  ],
  functionName: "pacificAtlantic",
  starterCode: `/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
function pacificAtlantic(heights) {
  // Write your solution here
}
`,
  sampleTests: [
    {
      id: "t1",
      label: "Example 1",
      argsJson:
        "[[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]]",
      expectedJson: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
    },
    {
      id: "t2",
      label: "Single cell",
      argsJson: "[[[1]]]",
      expectedJson: "[[0,0]]",
    },
    {
      id: "t3",
      label: "2x2 plateau",
      argsJson: "[[[1,1],[1,1]]]",
      expectedJson: "[[0,0],[0,1],[1,0],[1,1]]",
    },
  ],
  optimal: {
    time: "O(m · n)",
    space: "O(m · n)",
    notes:
      "Reverse thinking: multi-source DFS/BFS inland from each ocean, then intersect reachable sets.",
    code: `function pacificAtlantic(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
  const pacific = Array.from({ length: rows }, () => Array(cols).fill(false));
  const atlantic = Array.from({ length: rows }, () => Array(cols).fill(false));
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  function dfs(r, c, ocean) {
    ocean[r][c] = true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (
        nr < 0 || nc < 0 || nr >= rows || nc >= cols ||
        ocean[nr][nc] || heights[nr][nc] < heights[r][c]
      ) continue;
      dfs(nr, nc, ocean);
    }
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pacific);
    dfs(r, cols - 1, atlantic);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pacific);
    dfs(rows - 1, c, atlantic);
  }

  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pacific[r][c] && atlantic[r][c]) result.push([r, c]);
    }
  }
  return result;
}`,
  },
  bruteForce: {
    time: "O(m² · n²)",
    space: "O(m · n)",
    notes:
      "From every cell, DFS whether water can reach both oceans by flowing downhill or flat.",
    code: `function pacificAtlantic(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const result = [];

  function canReach(sr, sc) {
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let pacific = false;
    let atlantic = false;
    const stack = [[sr, sc]];
    visited[sr][sc] = true;

    while (stack.length) {
      const [r, c] = stack.pop();
      if (r === 0 || c === 0) pacific = true;
      if (r === rows - 1 || c === cols - 1) atlantic = true;
      if (pacific && atlantic) return true;

      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (
          nr < 0 || nc < 0 || nr >= rows || nc >= cols ||
          visited[nr][nc] || heights[nr][nc] > heights[r][c]
        ) continue;
        visited[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return pacific && atlantic;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (canReach(r, c)) result.push([r, c]);
    }
  }
  return result;
}`,
  },
};
