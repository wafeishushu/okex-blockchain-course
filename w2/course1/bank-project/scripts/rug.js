const hre = require("hardhat");

const main = async () => {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
 
  const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.alchemyapi.io/v2/12UFIG5EnjVSP5Oha1Z3JBSZzvvoV9Zs");
  let contractAddress = "0xa51d754da1d6a1eadd1968f6063123c52d241513";
  const abi = [
    "function withdraw() external",
    "function getBalance() external view returns (uint)",
    "function checkDeposits(address _addr) external view returns (uint)"
  ];
  
  // Check Bank balance
  const bankContract = new ethers.Contract(contractAddress, abi, provider);
  let bankBalance01 = await bankContract.getBalance()
  console.log("Bank contract balance: ", ethers.utils.formatEther(bankBalance01));

  // Rug
  const bankContractWithSigner = bankContract.connect(owner);
  await bankContractWithSigner.withdraw()
  console.log("Rug succeed!");
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

// npx hardhat run scripts/rug.js --network georli