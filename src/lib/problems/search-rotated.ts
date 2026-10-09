import type { Problem } from "./types";

export const searchRotated: Problem = {
  id: "search-rotated",
  number: 33,
  title: "Search in Rotated Sorted Array",
  difficulty: "Medium",
  description:
    "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).\n\nFor example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.",
  examples: [
    "Input: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4",
    "Input: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1",
    "Input: nums = [1], target = 0\nOutput: -1",
  ],
  constraints: [
    "1 <= nums.length <= 5000",
    "-10^4 <= nums[i] <= 10^4",
    "All values of nums are unique.",
    "nums is an ascending array that is possibly rotated.",
    "-10^4 <= target <= 10^4",
  ],
  functionName: "search",
  starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Write your solution here
}
`,
  sampleTests: [
    {
      id: "t1",
      label: "Example 1",
      argsJson: "[[4,5,6,7,0,1,2], 0]",
      expectedJson: "4",
    },
    {
      id: "t2",
      label: "Example 2",
      argsJson: "[[4,5,6,7,0,1,2], 3]",
      expectedJson: "-1",
    },
    {
      id: "t3",
      label: "Single element miss",
      argsJson: "[[1], 0]",
      expectedJson: "-1",
    },
    {
      id: "t4",
      label: "No rotation",
      argsJson: "[[1,2,3,4,5], 3]",
      expectedJson: "2",
    },
  ],
  optimal: {
    time: "O(log n)",
    space: "O(1)",
    notes:
      "Binary search that identifies which half is sorted, then decides whether the target lies in that half.",
    code: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}`,
  },
  bruteForce: {
    time: "O(n)",
    space: "O(1)",
    notes: "Linear scan — ignore the rotation and search every index.",
    code: `function search(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
  },
};
