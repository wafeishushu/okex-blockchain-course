const hre = require("hardhat");

const main = async () => {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
 
  const provider = new ethers.getDefaultProvider('goerli');
  const abi = [
    "function withdraw() external",
    "function getBalance() external view returns (uint)",
    "function checkDeposits(address _addr) external view returns (uint)"
  ];
  
  // Connect contract
  const contractAddress = "0xa51d754da1d6a1eadd1968f6063123c52d241513";
  const bankContract = new ethers.Contract(contractAddress, abi, provider);

  // Check bank balance
  const bankBalance = await bankContract.getBalance()
  console.log("Bank contract balance: ", ethers.utils.formatEther(bankBalance));

  // Rug
  const bankContractWithSigner = bankContract.connect(owner);
  const tx1 = await bankContractWithSigner.withdraw()
  console.log("Tx1 hash: ", tx1.hash)
  await waitTransaction(provider, tx1.hash)

  console.log("Rug succeed!");
};

async function waitTransaction(provider, txHash) {
  let txReceipt = null
  while (txReceipt == null) { 
    // Waiting until the transaction is mined
    txReceipt = await provider.getTransactionReceipt(txHash);
    await sleep(1000)
  }
}

async function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function prettyJson(json) {
  return JSON.stringify(json, null, '\t');
}


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