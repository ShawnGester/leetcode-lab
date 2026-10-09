import type { Problem } from "./types";

export const findMinRotated: Problem = {
  id: "find-min-rotated",
  number: 153,
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  description:
    "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:\n\n- [4,5,6,7,0,1,2] if it was rotated 4 times.\n- [0,1,2,4,5,6,7] if it was rotated 7 times.\n\nNotice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].\n\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.",
  examples: [
    "Input: nums = [3,4,5,1,2]\nOutput: 1",
    "Input: nums = [4,5,6,7,0,1,2]\nOutput: 0",
    "Input: nums = [11,13,15,17]\nOutput: 11",
  ],
  constraints: [
    "n == nums.length",
    "1 <= n <= 5000",
    "-5000 <= nums[i] <= 5000",
    "All the integers of nums are unique.",
    "nums is sorted and rotated between 1 and n times.",
  ],
  functionName: "findMin",
  starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function findMin(nums) {
  // Write your solution here
}
`,
  sampleTests: [
    {
      id: "t1",
      label: "Example 1",
      argsJson: "[[3,4,5,1,2]]",
      expectedJson: "1",
    },
    {
      id: "t2",
      label: "Example 2",
      argsJson: "[[4,5,6,7,0,1,2]]",
      expectedJson: "0",
    },
    {
      id: "t3",
      label: "No effective rotation",
      argsJson: "[[11,13,15,17]]",
      expectedJson: "11",
    },
    {
      id: "t4",
      label: "Two elements",
      argsJson: "[[2,1]]",
      expectedJson: "1",
    },
  ],
  optimal: {
    time: "O(log n)",
    space: "O(1)",
    notes:
      "Binary search toward the unsorted side; the minimum is the only place where order breaks.",
    code: `function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return nums[left];
}`,
  },
  bruteForce: {
    time: "O(n)",
    space: "O(1)",
    notes: "Track the minimum while scanning the entire array.",
    code: `function findMin(nums) {
  let min = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < min) min = nums[i];
  }
  return min;
}`,
  },
};
