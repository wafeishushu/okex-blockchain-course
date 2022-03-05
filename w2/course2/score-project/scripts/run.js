const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner, student1, student2] = await ethers.getSigners();

  console.log("Owner address:", owner.address);

  // Deploy Teacher.sol
  const Teacher = await hre.ethers.getContractFactory("Teacher");
  const teacherContract = await Teacher.deploy();
  await teacherContract.deployed();
  console.log("Teacher deployed to:", teacherContract.address);

  // create Score contract
  await teacherContract.createNewScoreContract()
  const scoreAddress = await teacherContract.scoreAddress()
  console.log("Score contract address: ", scoreAddress);

  // set student1 with score 101 --- should be failed
  // await teacherContract.setScore(student1.address, 101)

  // set student1 with score 100
  await teacherContract.setScore(student1.address, 100)
  const score1 = await teacherContract.getScore(student1.address)
  console.log("Student2 score: ", score1.toNumber());

  // set student1 with score 99
  await teacherContract.setScore(student2.address, 99)
  const score2 = await teacherContract.getScore(student2.address)
  console.log("Student2 score: ", score2.toNumber());
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