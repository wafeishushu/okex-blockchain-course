const hre = require("hardhat");

const main = async () => {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const counterFactory = await hre.ethers.getContractFactory("Counter");
  const counterContract = await counterFactory.deploy(0);
  await counterContract.deployed();
  console.log("Contract address:", counterContract.address);
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