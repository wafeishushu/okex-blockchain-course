// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyTokenB is ERC20 {
    constructor() ERC20("MyTokenB", "TB") {
        _mint(msg.sender, 10000 * 10**18);
    }

    function mint(address _account, uint256 _amount) public returns (bool) {
        _mint(_account, _amount);
        return true;
    }
}
