import type { Problem } from "./types";

export const numberOfIslands: Problem = {
  id: "number-of-islands",
  number: 200,
  title: "Number of Islands",
  difficulty: "Medium",
  description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
  examples: [
    { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1" },
    { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3" },
  ],
  constraints: [
    "m == grid.length",
    "n == grid[i].length",
    "1 <= m, n <= 300",
    "grid[i][j] is '0' or '1'.",
  ],
  methodName: "numIslands",
  paramTypes: ["char[][]"],
  returnType: "int",
  starterCode: `class Solution {
    public int numIslands(char[][] grid) {
        
    }
}
`,
  optimalSolution: `class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c); dfs(grid, r - 1, c); dfs(grid, r, c + 1); dfs(grid, r, c - 1);
    }
}
`,
  bruteForceSolution: `class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length, count = 0;
        boolean[][] visited = new boolean[m][n];
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == '1' && !visited[r][c]) {
                    count++;
                    java.util.ArrayDeque<int[]> q = new java.util.ArrayDeque<>();
                    q.offer(new int[]{r, c});
                    visited[r][c] = true;
                    while (!q.isEmpty()) {
                        int[] cur = q.poll();
                        for (int[] d : dirs) {
                            int nr = cur[0] + d[0], nc = cur[1] + d[1];
                            if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] == '1' && !visited[nr][nc]) {
                                visited[nr][nc] = true;
                                q.offer(new int[]{nr, nc});
                            }
                        }
                    }
                }
            }
        }
        return count;
    }
}
`,
  complexity: {
    optimal: "Time O(m·n) · Space O(m·n) — DFS",
    bruteForce: "Time O(m·n) · Space O(m·n) — BFS + visited",
  },
  sampleTests: [
    { id: "t1", label: "Example 1", args: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], expected: 1 },
    { id: "t2", label: "Example 2", args: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expected: 3 },
    { id: "t3", label: "All water", args: [[["0","0"],["0","0"]]], expected: 0 },
  ],
};
