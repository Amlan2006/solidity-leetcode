// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Solution {
    /**
     * @dev Given an array of integers nums and an integer target, 
     * return indices of the two numbers such that they add up to target.
     */
    function twoSum(uint[] memory nums, uint target) public pure returns (uint[2] memory) {
        // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Solution {
    /**
     * @dev Given an array of integers nums and an integer target, 
     * return indices of the two numbers such that they add up to target.
     */
    function twoSum(uint[] memory nums, uint target) public pure returns (uint[2] memory) {
        // Write your solution here
     for (uint i = 0; i < nums.length; i++) {
        for (uint j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return [i, j];
            }
        }
    }

    // LeetCode-style default return
    return [0, 0];
        
    }
}
    }
}