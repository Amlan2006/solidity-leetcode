// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Solution} from "../src/Solution.sol";

contract SolutionTest is Test {
    Solution solution;

    function setUp() public {
        solution = new Solution();
    }

    function test_TwoSum_BasicCase() public view {
        uint[] memory nums = new uint[](4);
        nums[0] = 2;
        nums[1] = 7;
        nums[2] = 11;
        nums[3] = 15;
        
        uint target = 9;
        
        uint[2] memory result = solution.twoSum(nums, target);
        
        // Check that the result is [0, 1]
        assertEq(result[0], 0, "First index should be 0");
        assertEq(result[1], 1, "Second index should be 1");
        
        // Verify the sum equals target
        assertEq(nums[result[0]] + nums[result[1]], target, "Sum should equal target");
    }

    function test_TwoSum_DifferentIndices() public view {
        uint[] memory nums = new uint[](3);
        nums[0] = 3;
        nums[1] = 2;
        nums[2] = 4;
        
        uint target = 6;
        
        uint[2] memory result = solution.twoSum(nums, target);
        
        // Check that indices are valid
        assertTrue(result[0] < nums.length, "First index should be valid");
        assertTrue(result[1] < nums.length, "Second index should be valid");
        assertTrue(result[0] != result[1], "Indices should be different");
        
        // Verify the sum equals target
        assertEq(nums[result[0]] + nums[result[1]], target, "Sum should equal target");
    }

    function test_TwoSum_LargerArray() public view {
        uint[] memory nums = new uint[](5);
        nums[0] = 1;
        nums[1] = 5;
        nums[2] = 3;
        nums[3] = 7;
        nums[4] = 9;
        
        uint target = 12;
        
        uint[2] memory result = solution.twoSum(nums, target);
        
        // Verify the sum equals target
        assertEq(nums[result[0]] + nums[result[1]], target, "Sum should equal target");
        assertTrue(result[0] < result[1], "First index should be less than second");
    }
}