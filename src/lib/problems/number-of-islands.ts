import type { Problem } from "./types";

export const numberOfIslands: Problem = {
  id: "number-of-islands",
  number: 200,
  title: "Number of Islands",
  difficulty: "Medium",
  description:
    'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
  examples: [
    'Input: grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]\nOutput: 1',
    'Input: grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]\nOutput: 3',
  ],
  constraints: [
    "m == grid.length",
    "n == grid[i].length",
    "1 <= m, n <= 300",
    "grid[i][j] is '0' or '1'.",
  ],
  functionName: "numIslands",
  starterCode: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Write your solution here
}
`,
  sampleTests: [
    {
      id: "t1",
      label: "Example 1",
      argsJson:
        '[[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]]',
      expectedJson: "1",
    },
    {
      id: "t2",
      label: "Example 2",
      argsJson:
        '[[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]]',
      expectedJson: "3",
    },
    {
      id: "t3",
      label: "All water",
      argsJson: '[[["0","0"],["0","0"]]]',
      expectedJson: "0",
    },
    {
      id: "t4",
      label: "Single land",
      argsJson: '[[["1"]]]',
      expectedJson: "1",
    },
  ],
  optimal: {
    time: "O(m · n)",
    space: "O(m · n)",
    notes:
      "DFS/BFS flood-fill: each unvisited land cell starts an island; mark the whole component visited.",
    code: `function numIslands(grid) {
  if (!grid.length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") return;
    grid[r][c] = "0";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}`,
  },
  bruteForce: {
    time: "O(m · n)",
    space: "O(m · n)",
    notes:
      "Same asymptotic cost as DFS, but uses an explicit visited matrix and BFS queue per island.",
    code: `function numIslands(grid) {
  if (!grid.length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let count = 0;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  function bfs(sr, sc) {
    const q = [[sr, sc]];
    visited[sr][sc] = true;
    while (q.length) {
      const [r, c] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (
          nr >= 0 && nc >= 0 && nr < rows && nc < cols &&
          !visited[nr][nc] && grid[nr][nc] === "1"
        ) {
          visited[nr][nc] = true;
          q.push([nr, nc]);
        }
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1" && !visited[r][c]) {
        count++;
        bfs(r, c);
      }
    }
  }

  return count;
}`,
  },
};
