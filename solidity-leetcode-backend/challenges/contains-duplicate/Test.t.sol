// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Solution} from "./Solution.sol";

contract SolutionTest is Test {
    Solution solution;

    function setUp() public {
        solution = new Solution();
    }

    function test_HasDuplicates() public {
        uint[] memory nums = new uint[](4);
        nums[0] = 1;
        nums[1] = 2;
        nums[2] = 3;
        nums[3] = 1;
        
        bool result = solution.containsDuplicate(nums);
        assertTrue(result, "Should contain duplicate");
    }

    function test_NoDuplicates() public {
        uint[] memory nums = new uint[](4);
        nums[0] = 1;
        nums[1] = 2;
        nums[2] = 3;
        nums[3] = 4;
        
        bool result = solution.containsDuplicate(nums);
        assertFalse(result, "Should not contain duplicate");
    }

    function test_MultipleDuplicates() public {
        uint[] memory nums = new uint[](5);
        nums[0] = 1;
        nums[1] = 1;
        nums[2] = 1;
        nums[3] = 3;
        nums[4] = 3;
        
        bool result = solution.containsDuplicate(nums);
        assertTrue(result, "Should contain duplicate");
    }

    function test_SingleElement() public {
        uint[] memory nums = new uint[](1);
        nums[0] = 1;
        
        bool result = solution.containsDuplicate(nums);
        assertFalse(result, "Single element has no duplicates");
    }

    function test_TwoElementsSame() public {
        uint[] memory nums = new uint[](2);
        nums[0] = 1;
        nums[1] = 1;
        
        bool result = solution.containsDuplicate(nums);
        assertTrue(result, "Two same elements are duplicates");
    }

    function test_Fuzz(uint[] memory nums) public {
        vm.assume(nums.length <= 100);
        bool result = solution.containsDuplicate(nums);
        // If result is true, verify there's actually a duplicate
        if (result) {
            bool hasDuplicate = false;
            for (uint i = 0; i < nums.length; i++) {
                for (uint j = i + 1; j < nums.length; j++) {
                    if (nums[i] == nums[j]) {
                        hasDuplicate = true;
                        break;
                    }
                }
                if (hasDuplicate) break;
            }
            assertTrue(hasDuplicate, "If containsDuplicate returns true, there must be a duplicate");
        }
    }
}

