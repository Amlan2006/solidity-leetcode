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
        
        // Check that the result indices are correct
        assertTrue(result[0] == 0 && result[1] == 1, "Should return indices [0, 1]");
        
        // Verify the sum
        assertTrue(nums[result[0]] + nums[result[1]] == target, "Sum should equal target");
    }
}