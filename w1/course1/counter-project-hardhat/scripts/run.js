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

  /*
   * Run locally
   */

  // get
  let counter = await counterContract.get();
  console.log("1.Get counter: ", counter);

  // set
  await counterContract.set(100);
  counter = await counterContract.get();
  console.log("2.Set counter 100: ", counter);

  // inc
  await counterContract.inc();
  counter = await counterContract.get();
  console.log("3.Inc counter: ", counter);

  // dec
  await counterContract.dec();
  counter = await counterContract.get();
  console.log("4.Dec counter: ", counter);
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

// npx hardhat run scripts/run.js 