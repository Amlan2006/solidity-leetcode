// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Solution {
    /**
     * @dev Given an array of integers nums and an integer target, 
     * return indices of the two numbers such that they add up to target.
     * You may assume that each input has exactly one solution, and you may not use the same element twice.
     */
    function twoSum(uint[] calldata nums, uint target) external pure returns (uint[2] memory) {
        // Default implementation - will be replaced by user code
        for (uint i = 0; i < nums.length; i++) {
            for (uint j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return [i, j];
                }
            }
        }
        revert("No solution found");
    }
}