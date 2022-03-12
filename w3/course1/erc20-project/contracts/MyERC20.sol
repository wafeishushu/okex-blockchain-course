// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20Token is ERC20 {
    address minter;

    constructor() ERC20("BaJiuTe", "BJT") {
        minter = msg.sender;
        _mint(msg.sender, 0);
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not minter");
        _;
    }

    function mint(uint256 _supply) onlyMinter external {
        _mint(msg.sender, _supply * 10 ** decimals());
    }
}