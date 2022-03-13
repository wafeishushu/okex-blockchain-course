// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyNFT is ERC721URIStorage {
    address minter;
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // We need to pass the name of our NFTs token and its symbol.
    constructor() ERC721 ("Antisocial Ape Club", "ASAC") {
        minter = msg.sender;
    }


    modifier onlyMinter() {
        require(msg.sender == minter, "Not minter");
        _;
    }

    // mint 5 NFTs
    function mintAllNFTs() onlyMinter public {
        for (uint i = 0; i < 5; i++) {
            // Get the current tokenId, this starts at 0.
            uint256 newItemId = _tokenIds.current();
            _tokenIds.increment();
            _safeMint(msg.sender, newItemId);
        }
    }
}