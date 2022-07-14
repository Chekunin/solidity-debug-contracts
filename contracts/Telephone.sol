pragma solidity ^0.8.0;

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract Telephone {
    address addr;
    constructor(address _addr) public {
        addr = _addr;
    }
    function change(address _owner) public {
        ITelephone(addr).changeOwner(_owner);
    }
}
