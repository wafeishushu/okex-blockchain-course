const hre = require("hardhat");

const main = async () => {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Deploy Bank.sol
  const Bank = await hre.ethers.getContractFactory("Bank");
  const bankContract = await Bank.deploy();
  await bankContract.deployed();
  console.log("Bank deployed to:", bankContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

// npx hardhat run scripts/deploy.js --network georli