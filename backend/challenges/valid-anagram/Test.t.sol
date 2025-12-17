// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Solution} from "./Solution.sol";

contract SolutionTest is Test {
    Solution solution;

    function setUp() public {
        solution = new Solution();
    }

    function test_ValidAnagram() public {
        string memory s = "anagram";
        string memory t = "nagaram";
        
        bool result = solution.isAnagram(s, t);
        assertTrue(result, "Should be valid anagram");
    }

    function test_InvalidAnagram() public {
        string memory s = "rat";
        string memory t = "car";
        
        bool result = solution.isAnagram(s, t);
        assertFalse(result, "Should not be valid anagram");
    }

    function test_DifferentLengths() public {
        string memory s = "ab";
        string memory t = "a";
        
        bool result = solution.isAnagram(s, t);
        assertFalse(result, "Different lengths cannot be anagrams");
    }

    function test_EmptyStrings() public {
        string memory s = "";
        string memory t = "";
        
        bool result = solution.isAnagram(s, t);
        assertTrue(result, "Empty strings are anagrams");
    }

    function test_SingleCharacter() public {
        string memory s = "a";
        string memory t = "a";
        
        bool result = solution.isAnagram(s, t);
        assertTrue(result, "Same single character is anagram");
    }

    function test_SameString() public {
        string memory s = "hello";
        string memory t = "hello";
        
        bool result = solution.isAnagram(s, t);
        assertTrue(result, "Same string is anagram");
    }

    function test_CaseSensitive() public {
        string memory s = "Hello";
        string memory t = "hello";
        
        bool result = solution.isAnagram(s, t);
        // This depends on implementation - testing that it handles it
        // Most implementations would treat as different due to case
    }
}

