// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    function assertTrue(bool condition, string memory message) internal pure {
        require(condition, message);
    }
    
    function assertEq(uint a, uint b, string memory message) internal pure {
        require(a == b, message);
    }
    
    function assertEq(uint a, uint b) internal pure {
        require(a == b, "Values should be equal");
    }
}

library console {
    function log(string memory message) internal pure {}
}