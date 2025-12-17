// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Solution {
function twoSum(uint[] memory nums, uint target) public pure returns (uint, uint) {
    // Your code here
    uint n = nums.length;

        for (uint i = 0; i < n; i++) {
            for (uint j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return (i, j);
                }
            }
        }

        revert("No solution found");
    // Return two indices (i, j) such that nums[i] + nums[j] == target
    // You may assume that each input has exactly one solution
}
}

