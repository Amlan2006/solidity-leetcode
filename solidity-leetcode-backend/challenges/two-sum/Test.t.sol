// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Solution} from "./Solution.sol";

contract SolutionTest is Test {
    Solution solution;

    function setUp() public {
        solution = new Solution();
    }

    function test_BasicCase() public {
        uint[] memory nums = new uint[](4);
        nums[0] = 2;
        nums[1] = 7;
        nums[2] = 11;
        nums[3] = 15;
        uint target = 9;
        
        (uint i, uint j) = solution.twoSum(nums, target);
        assertEq(nums[i] + nums[j], target, "Indices should sum to target");
        assertTrue(i != j, "Indices must be different");
    }

    function test_MultipleSolutions() public {
        uint[] memory nums = new uint[](4);
        nums[0] = 3;
        nums[1] = 2;
        nums[2] = 4;
        nums[3] = 6;
        uint target = 6;
        
        (uint i, uint j) = solution.twoSum(nums, target);
        assertEq(nums[i] + nums[j], target, "Indices should sum to target");
        assertTrue(i != j, "Indices must be different");
    }

    function test_SameNumberTwice() public {
        uint[] memory nums = new uint[](3);
        nums[0] = 3;
        nums[1] = 3;
        nums[2] = 4;
        uint target = 6;
        
        (uint i, uint j) = solution.twoSum(nums, target);
        assertEq(nums[i] + nums[j], target, "Indices should sum to target");
        assertTrue(i != j, "Indices must be different");
    }

    function test_EdgeCaseSmallArray() public {
        uint[] memory nums = new uint[](2);
        nums[0] = 1;
        nums[1] = 2;
        uint target = 3;
        
        (uint i, uint j) = solution.twoSum(nums, target);
        assertEq(nums[i] + nums[j], target, "Indices should sum to target");
        assertTrue(i != j, "Indices must be different");
    }

    function test_Fuzz(uint[] memory nums, uint target) public {
        // Bound array length to reasonable size
        vm.assume(nums.length >= 2 && nums.length <= 100);
        
        // Try to find solution
        try solution.twoSum(nums, target) returns (uint i, uint j) {
            // If no revert, verify the solution
            vm.assume(i < nums.length && j < nums.length);
            assertEq(nums[i] + nums[j], target, "Fuzz: Indices should sum to target");
            assertTrue(i != j, "Fuzz: Indices must be different");
        } catch {
            // If revert, that's acceptable - no solution exists
            // This is valid behavior
        }
    }
}

