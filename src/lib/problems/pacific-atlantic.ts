import type { Problem } from "./types";

export const pacificAtlantic: Problem = {
  id: "pacific-atlantic-water-flow",
  number: 417,
  title: "Pacific Atlantic Water Flow",
  difficulty: "Medium",
  description: `There is an \`m x n\` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Pacific touches left and top edges; Atlantic touches right and bottom edges.

Given \`heights\` where \`heights[r][c]\` is the height of cell \`(r, c)\`, water can flow to a neighbor (N/S/E/W) if that neighbor's height is less than or equal to the current cell.

Return coordinates from which water can flow to both oceans. Order does not matter.`,
  examples: [
    { input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" },
    { input: "heights = [[1]]", output: "[[0,0]]" },
  ],
  constraints: [
    "m == heights.length",
    "n == heights[r].length",
    "1 <= m, n <= 200",
    "0 <= heights[r][c] <= 10^5",
  ],
  methodName: "pacificAtlantic",
  paramTypes: ["int[][]"],
  returnType: "List<List<Integer>>",
  starterCode: `import java.util.*;

class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        
    }
}
`,
  optimalSolution: `import java.util.*;

class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        int m = heights.length, n = heights[0].length;
        boolean[][] pacific = new boolean[m][n];
        boolean[][] atlantic = new boolean[m][n];
        for (int r = 0; r < m; r++) {
            dfs(heights, pacific, r, 0, heights[r][0]);
            dfs(heights, atlantic, r, n - 1, heights[r][n - 1]);
        }
        for (int c = 0; c < n; c++) {
            dfs(heights, pacific, 0, c, heights[0][c]);
            dfs(heights, atlantic, m - 1, c, heights[m - 1][c]);
        }
        List<List<Integer>> result = new ArrayList<>();
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (pacific[r][c] && atlantic[r][c]) result.add(Arrays.asList(r, c));
            }
        }
        return result;
    }
    private void dfs(int[][] h, boolean[][] vis, int r, int c, int prev) {
        if (r < 0 || c < 0 || r >= h.length || c >= h[0].length || vis[r][c] || h[r][c] < prev) return;
        vis[r][c] = true;
        dfs(h, vis, r + 1, c, h[r][c]);
        dfs(h, vis, r - 1, c, h[r][c]);
        dfs(h, vis, r, c + 1, h[r][c]);
        dfs(h, vis, r, c - 1, h[r][c]);
    }
}
`,
  bruteForceSolution: `import java.util.*;

class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        int m = heights.length, n = heights[0].length;
        List<List<Integer>> result = new ArrayList<>();
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                boolean[] reach = new boolean[2];
                boolean[][] visited = new boolean[m][n];
                flow(heights, r, c, visited, reach);
                if (reach[0] && reach[1]) result.add(Arrays.asList(r, c));
            }
        }
        return result;
    }
    private void flow(int[][] h, int r, int c, boolean[][] vis, boolean[] reach) {
        if (vis[r][c]) return;
        vis[r][c] = true;
        if (r == 0 || c == 0) reach[0] = true;
        if (r == h.length - 1 || c == h[0].length - 1) reach[1] = true;
        if (reach[0] && reach[1]) return;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nc >= 0 && nr < h.length && nc < h[0].length && h[nr][nc] <= h[r][c]) {
                flow(h, nr, nc, vis, reach);
            }
        }
    }
}
`,
  complexity: {
    optimal: "Time O(m·n) · Space O(m·n) — reverse DFS from coasts",
    bruteForce: "Time O(m²·n²) · Space O(m·n) — forward search per cell",
  },
  sampleTests: [
    { id: "t1", label: "Example 1", args: [[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]], expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]] },
    { id: "t2", label: "Example 2", args: [[[1]]], expected: [[0,0]] },
  ],
};
