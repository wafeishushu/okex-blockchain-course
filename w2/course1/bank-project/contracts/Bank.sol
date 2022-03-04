// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Bank {
    address payable public owner;
    mapping(address => uint) public accountMap;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {
        accountMap[msg.sender] = msg.value;
    }

    function withdraw() external {
        require(msg.sender == owner, "caller is not owner");
        payable(msg.sender).transfer(address(this).balance);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function checkDeposits(address _addr) external view returns (uint) {
        return accountMap[_addr];
    }
}
