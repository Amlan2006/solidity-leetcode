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
        uint[] memory nums = new uint[](5);
        nums[0] = 1;
        nums[1] = 2;
        nums[2] = 3;
        nums[3] = 4;
        nums[4] = 5;
        
        uint[] memory result = solution.reverseArray(nums);
        
        assertEq(result.length, 5, "Length should be same");
        assertEq(result[0], 5, "First element should be 5");
        assertEq(result[1], 4, "Second element should be 4");
        assertEq(result[2], 3, "Third element should be 3");
        assertEq(result[3], 2, "Fourth element should be 2");
        assertEq(result[4], 1, "Fifth element should be 1");
    }

    function test_EmptyArray() public {
        uint[] memory nums = new uint[](0);
        uint[] memory result = solution.reverseArray(nums);
        assertEq(result.length, 0, "Empty array should return empty");
    }

    function test_SingleElement() public {
        uint[] memory nums = new uint[](1);
        nums[0] = 42;
        uint[] memory result = solution.reverseArray(nums);
        assertEq(result.length, 1, "Length should be 1");
        assertEq(result[0], 42, "Single element should remain same");
    }

    function test_TwoElements() public {
        uint[] memory nums = new uint[](2);
        nums[0] = 10;
        nums[1] = 20;
        uint[] memory result = solution.reverseArray(nums);
        assertEq(result[0], 20, "First should be 20");
        assertEq(result[1], 10, "Second should be 10");
    }

    function test_Fuzz(uint[] memory nums) public {
        vm.assume(nums.length <= 100);
        uint[] memory result = solution.reverseArray(nums);
        assertEq(result.length, nums.length, "Length should match");
        
        if (nums.length > 0) {
            for (uint i = 0; i < nums.length; i++) {
                assertEq(result[i], nums[nums.length - 1 - i], "Elements should be reversed");
            }
        }
    }
}

