import type { Problem } from "./types";

export const searchRotated: Problem = {
  id: "search-in-rotated-sorted-array",
  number: 33,
  title: "Search in Rotated Sorted Array",
  difficulty: "Medium",
  description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\`. Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
  examples: [
    { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
    { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
    { input: "nums = [1], target = 0", output: "-1" },
  ],
  constraints: [
    "1 <= nums.length <= 5000",
    "-10^4 <= nums[i] <= 10^4",
    "All values of nums are unique.",
    "nums is an ascending array that is possibly rotated.",
    "-10^4 <= target <= 10^4",
  ],
  methodName: "search",
  paramTypes: ["int[]", "int"],
  returnType: "int",
  starterCode: `class Solution {
    public int search(int[] nums, int target) {
        
    }
}
`,
  optimalSolution: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}
`,
  bruteForceSolution: `class Solution {
    public int search(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) return i;
        }
        return -1;
    }
}
`,
  complexity: {
    optimal: "Time O(log n) · Space O(1)",
    bruteForce: "Time O(n) · Space O(1)",
  },
  sampleTests: [
    { id: "t1", label: "Example 1", args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
    { id: "t2", label: "Example 2", args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
    { id: "t3", label: "Example 3", args: [[1], 0], expected: -1 },
    { id: "t4", label: "No rotation", args: [[1, 2, 3, 4, 5], 3], expected: 2 },
  ],
};
