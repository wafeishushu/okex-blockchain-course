const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner] = await ethers.getSigners();

  console.log("Owner address:", owner.address);

  // Deploy Teacher.sol
  const Teacher = await hre.ethers.getContractFactory("Teacher");
  const teacherContract = await Teacher.deploy();
  await teacherContract.deployed();
  console.log("Teacher deployed to:", teacherContract.address);
  console.log("Deploy done!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run scripts/deploy.js --network georli