const hre = require("hardhat");

const main = async () => {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
 
  const provider = new ethers.getDefaultProvider('goerli');
  const abi = [
    "function mintAllNFTs() public",
    "function approve(address to, uint256 tokenId) external",
    "function ownerOf(uint256 tokenId) external view returns (address owner)",
    "function balanceOf(address owner) external view returns (uint256 balance)",
    "function safeTransferFrom(address from, address to, uint256 tokenId) external",
  ];
  
  // Connect contract
  const contractAddress = "0x9200D2E565Ec7172a4eA50CAB329Ec3cf0DF55bf";
  const nftContract = new ethers.Contract(contractAddress, abi, provider);
  const nftContractWithSigner = nftContract.connect(owner);

  // mint
  let tx1 = await nftContractWithSigner.mintAllNFTs()
  await tx1.wait()
  console.log("Mint succeed!")

  const receiver = "0x22a9D210ba154994ad1477F585602eC41b99b931";

  // check owner balance
  let ownerBalance = await nftContractWithSigner.balanceOf(owner.address)
  console.log("Owner NFT balance: ", ownerBalance.toNumber())

  // approve and transfer No.1 NFT
  let tx2 = await nftContractWithSigner.approve(receiver, 1)
  await tx2.wait()
  console.log("Approve succeed!")

  let tx3 = await nftContractWithSigner.safeTransferFrom(owner.address, receiver, 1)
  await tx3.wait()

  // check balance
  ownerBalance = await nftContractWithSigner.balanceOf(owner.address)
  console.log("Owner NFT balance: ", ownerBalance.toNumber())

  let user1Balance = await nftContractWithSigner.balanceOf(receiver)
  console.log("User1 NFT balance: ", user1Balance.toNumber())
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// npx hardhat run scripts/call.js --network georli