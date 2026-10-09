import type { Problem } from "./types";

export const findMinimumRotated: Problem = {
  id: "find-minimum-in-rotated-sorted-array",
  number: 153,
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  description: `Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times. Given the sorted rotated array \`nums\` of unique elements, return the minimum element.

You must write an algorithm that runs in \`O(log n)\` time.`,
  examples: [
    { input: "nums = [3,4,5,1,2]", output: "1" },
    { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
    { input: "nums = [11,13,15,17]", output: "11" },
  ],
  constraints: [
    "n == nums.length",
    "1 <= n <= 5000",
    "-5000 <= nums[i] <= 5000",
    "All the integers of nums are unique.",
    "nums is sorted and rotated between 1 and n times.",
  ],
  methodName: "findMin",
  paramTypes: ["int[]"],
  returnType: "int",
  starterCode: `class Solution {
    public int findMin(int[] nums) {
        
    }
}
`,
  optimalSolution: `class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        return nums[lo];
    }
}
`,
  bruteForceSolution: `class Solution {
    public int findMin(int[] nums) {
        int min = nums[0];
        for (int i = 1; i < nums.length; i++) if (nums[i] < min) min = nums[i];
        return min;
    }
}
`,
  complexity: {
    optimal: "Time O(log n) · Space O(1)",
    bruteForce: "Time O(n) · Space O(1)",
  },
  sampleTests: [
    { id: "t1", label: "Example 1", args: [[3, 4, 5, 1, 2]], expected: 1 },
    { id: "t2", label: "Example 2", args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
    { id: "t3", label: "Example 3", args: [[11, 13, 15, 17]], expected: 11 },
    { id: "t4", label: "Single element", args: [[1]], expected: 1 },
  ],
};
