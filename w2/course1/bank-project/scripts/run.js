const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner, user1] = await ethers.getSigners();

  console.log("Owner address:", owner.address);
  console.log("User1 address: ", user1.address)

  // Deploy Bank.sol
  const Bank = await hre.ethers.getContractFactory("Bank");
  const bankContract = await Bank.deploy();
  await bankContract.deployed();
  console.log("Bank deployed to:", bankContract.address);

  // Send transactions
  let provider = ethers.getDefaultProvider();
  let gasPrice = await provider.getGasPrice();

  let ownerBalance = await owner.getBalance();
  console.log("Owner balance: ", ethers.utils.formatEther(ownerBalance))

  // Owner sends 5 ethers to bank
  let tx1 = await owner.sendTransaction({
    gasLimit: 300000,
    gasPrice: gasPrice,
    to: bankContract.address,
    value: ethers.utils.parseEther("5")
  });
  console.log("Sent tx1: " + JSON.stringify(tx1));

  // User1 sends 10 ethers + 20 ethers to bank
  let tx2 = await user1.sendTransaction({
    gasLimit: 300000,
    gasPrice: gasPrice,
    to: bankContract.address,
    value: ethers.utils.parseEther("10")
  });
  console.log("Sent tx2: " + JSON.stringify(tx2));

  let tx3 = await user1.sendTransaction({
    gasLimit: 300000,
    gasPrice: gasPrice,
    to: bankContract.address,
    value: ethers.utils.parseEther("20")
  });
  console.log("Sent tx3: " + JSON.stringify(tx3));

  // Now there are 35 ethers at bank
  let bankBalance = await bankContract.getBalance()
  console.log("Bank contract balance: ", ethers.utils.formatEther(bankBalance));

  // User1 checks his deposits
  // but he doesn't know it is a rug project
  let user1Deposit = await bankContract.checkDeposits(user1.address)
  console.log("User1 deposit value: ", ethers.utils.formatEther(user1Deposit));

  // Owner rugs!
  await bankContract.withdraw()
  ownerBalance = await owner.getBalance();
  console.log("Owner balance: ", ethers.utils.formatEther(ownerBalance))

  // Going to zero
  bankBalance = await bankContract.getBalance()
  console.log("Bank contract balance: ", ethers.utils.formatEther(bankBalance));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
// npx hardhat run scripts/run.js