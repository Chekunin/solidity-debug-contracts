pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Storage {
    uint public val;
    constructor(uint v) public {
        val = v;
    }
    function setValue(uint v) public {
        val = v;
    }
}

contract Machine {
    Storage public s;
    uint256 public calculateResult;
    address public user;

    event AddedValuesByDelegateCall(uint256 a, uint256 b, bool success);
    event AddedValuesByCall(uint256 a, uint256 b, bool success);

    constructor(Storage addr) public {
        s = addr;
        calculateResult = 0;
    }

    function saveValue(uint x) public returns (bool) {
        s.setValue(x);
        return true;
    }
    function getValue() public view returns (uint) {
        return s.val();
    }

    function addValuesWithDelegateCall(address calculator, uint256 a, uint256 b) public returns (uint256) {
        (bool success, bytes memory result) = calculator.delegatecall(abi.encodeWithSignature("add(uint256,uint256)", a, b));
        emit AddedValuesByDelegateCall(a, b, success);
        return abi.decode(result, (uint256));
    }

    function addValuesWithCall(address calculator, uint256 a, uint256 b) public returns (uint256) {
        (bool success, bytes memory result) = calculator.call(abi.encodeWithSignature("add(uint256,uint256)", a, b));
        emit AddedValuesByCall(a, b, success);
        return abi.decode(result, (uint256));
    }
}

contract Calculator {
    uint256 public calculateResult;
    address public user;

    event Add(uint256 a, uint256 b);

    function add(uint256 a, uint256 b) public returns (uint256) {
        calculateResult = a + b;
        assert(calculateResult >= a);

        emit Add(a, b);
        user = msg.sender;

        return calculateResult;
    }
}

contract DCall {
    constructor() public {
        console.log("--- constructor of DCall ---");
        console.log("--- constructor of DCall%s ---");
//        bytes memory qwe = abi.encodeWithSignature("add(uint256,uint256)", 1, 2);
//        console.log("%s", qwe);
    }
}
