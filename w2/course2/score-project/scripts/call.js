const hre = require("hardhat");

const main = async () => {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
 
  const provider = new ethers.getDefaultProvider('goerli');
  const abi = [
    "function createNewScoreContract() public",
    "function getScore(address _student) external view returns (uint)",
    "function setScore(address _student, uint _score) external"
  ];

  // Connect contract
  const contractAddress = "0xB5690568a40B2EfF33Ede02210e27C13E365de12"
  const teacherContractFromProvider = new ethers.Contract(contractAddress, abi, provider);
  const teacherContractWithSigner = teacherContractFromProvider.connect(owner);

  // create Score contract
  const tx1 = await teacherContractWithSigner.createNewScoreContract()
  console.log("Tx1 hash: ", tx1.hash)
  await tx1.wait()

  // set student with score 88
  const tx2 = await teacherContractWithSigner.setScore(owner.address, 88)
  console.log("Tx2 hash: ", tx2.hash)
  await tx2.wait()

  const ownerScore = await teacherContractWithSigner.getScore(owner.address)
  console.log("Owner score: ", ownerScore.toNumber());
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

// npx hardhat run scripts/call.js --network georli