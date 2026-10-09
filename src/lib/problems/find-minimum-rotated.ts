import type { Problem } from "./types";

export const findMinimumRotated: Problem = {
  id: "find-minimum-in-rotated-sorted-array",
  number: 153,
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  description: `Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times. For example, the array \`nums = [0,1,2,4,5,6,7]\` might become:

- \`[4,5,6,7,0,1,2]\` if it was rotated \`4\` times.
- \`[0,1,2,4,5,6,7]\` if it was rotated \`7\` times.

Notice that rotating an array \`[a[0], a[1], a[2], ..., a[n-1]]\` 1 time results in the array \`[a[n-1], a[0], a[1], a[2], ..., a[n-2]]\`.

Given the sorted rotated array \`nums\` of unique elements, return the minimum element of this array.

You must write an algorithm that runs in \`O(log n)\` time.`,
  examples: [
    {
      input: "nums = [3,4,5,1,2]",
      output: "1",
      explanation: "The original array was [1,2,3,4,5] rotated 3 times.",
    },
    {
      input: "nums = [4,5,6,7,0,1,2]",
      output: "0",
      explanation: "The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.",
    },
    {
      input: "nums = [11,13,15,17]",
      output: "11",
      explanation: "The original array was [11,13,15,17] and it was rotated 4 times.",
    },
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
    // Binary search for the rotation pivot — O(log n) time, O(1) space
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return nums[lo];
    }
}
`,
  bruteForceSolution: `class Solution {
    // Linear scan — O(n) time, O(1) space
    public int findMin(int[] nums) {
        int min = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < min) min = nums[i];
        }
        return min;
    }
}
`,
  complexity: {
    optimal: "Time O(log n) · Space O(1) — binary search toward the unsorted / pivot side",
    bruteForce: "Time O(n) · Space O(1) — track the minimum while scanning",
  },
  sampleTests: [
    {
      id: "t1",
      label: "Example 1",
      args: [[3, 4, 5, 1, 2]],
      expected: 1,
    },
    {
      id: "t2",
      label: "Example 2",
      args: [[4, 5, 6, 7, 0, 1, 2]],
      expected: 0,
    },
    {
      id: "t3",
      label: "Example 3",
      args: [[11, 13, 15, 17]],
      expected: 11,
    },
    {
      id: "t4",
      label: "Single element",
      args: [[1]],
      expected: 1,
    },
  ],
};
