// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Solution {
function reverseArray(uint[] memory nums) public pure returns (uint[] memory) {
    uint length = nums.length;
    uint[] memory reversed = new uint[](length);
    
    for (uint i = 0; i < length; i++) {
        reversed[i] = nums[length - 1 - i];
    }
    
    return reversed;
    // Return a new array with elements in reverse order
}
}

