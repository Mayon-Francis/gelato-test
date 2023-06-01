pragma solidity ^0.8.9;
// SPDX-License-Identifier: UNLICENSED

contract Counter {
    uint256 public count;
    uint256 public lastExecuted;

    constructor() {
        count = 0;
        lastExecuted = block.timestamp;
    }

    function increaseCount(uint256 _amount) external {
        count += _amount;
        lastExecuted = block.timestamp;
    }

    function getCount() external view returns (uint256) {
        return count;
    }
}

interface ICounter {
    function increaseCount(uint256 _amount) external;

    function getCount() external view returns (uint256);
}
