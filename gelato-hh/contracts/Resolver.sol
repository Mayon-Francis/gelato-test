pragma solidity ^0.8.9;
// SPDX-License-Identifier: UNLICENSED
import "./Counter.sol";

contract CounterResolver {
    constructor() {}

    function checker(
        address _counterAddress
    ) external view returns (bool canExec, bytes memory execPayload) {
        uint256 lastExecuted = Counter(_counterAddress).lastExecuted();
        canExec = (block.timestamp - lastExecuted) > 180;

        execPayload = abi.encodeCall(Counter.increaseCount, (1));
        if (canExec) return (true, execPayload);

        return (false, bytes("cannot exec yet"));
    }
}
