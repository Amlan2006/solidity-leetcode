// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Solution} from "../src/Solution.sol";

contract SolutionTest is Test {
    Solution solution;

    function setUp() public {
        solution = new Solution();
    }

    function test_TwoSum() public {
        uint[] memory nums = new uint[](4);
        nums[0] = 2;
        nums[1] = 7;
        nums[2] = 11;
        nums[3] = 15;
        
        uint target = 9;
        
        uint[2] memory result = solution.twoSum(nums, target);
        
        // Check that indices are valid
        assertTrue(result[0] < nums.length, "First index should be valid");
        assertTrue(result[1] < nums.length, "Second index should be valid");
        assertTrue(result[0] != result[1], "Indices should be different");
        
        // Verify the sum equals target
        assertTrue(nums[result[0]] + nums[result[1]] == target, "Sum should equal target");
    }
}