// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Vault {
    uint8 private constant DECIMALS_UNITS = 18;

    address public tokenAddress;
    mapping(address=>uint256) public balanceMap;

    // set token which this vault can deposit/withdraw
    constructor(address _tokenAddr) {
        tokenAddress = _tokenAddr;
    }

    function deposit(uint256 _amount) external {
        require(_amount > 0, "Vault: deposit amount must be greater than 0");
        uint256 _amountWithDecimal = _amount * 10 ** DECIMALS_UNITS;

        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _amountWithDecimal);

        balanceMap[msg.sender] += _amountWithDecimal;
    }

    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Vault: withdraw amount must be greater than 0");
        uint256 _amountWithDecimal = _amount * 10 ** DECIMALS_UNITS;
        require(balanceMap[msg.sender] >= _amountWithDecimal, "Vault: msg.sender balance is not enough");

        IERC20 token = IERC20(tokenAddress);
        token.approve(address(this), _amountWithDecimal);
        token.transferFrom(address(this), msg.sender, _amountWithDecimal);

        balanceMap[msg.sender] -= _amountWithDecimal;
    }


    function showUserBalance() external view returns (uint256) {
        return balanceMap[msg.sender];
    }
}