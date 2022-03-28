const { network, ethers } = require("hardhat");
const MyTokenA = require(`../deployments/${network.name}/MyTokenA.json`);
const MyTokenB = require(`../deployments/${network.name}/MyTokenB.json`);

// NOTE: only in testnet
async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address: ", owner.address);

  const FlashSwapV2AndV3 = await ethers.getContractFactory("FlashSwapV2AndV3");
  const flashSwap = await FlashSwapV2AndV3.deploy(
    MyTokenA.address,
    MyTokenB.address
  );
  await flashSwap.deployed();
  console.log("FlashSwapV2AndV3 address: ", flashSwap.address);

  const txParam = {
    gasLimit: 3000000,
    gasPrice: ethers.utils.parseUnits("10", 9) 
  }

  let tx1 = await flashSwap.swapLoanToken(ethers.utils.parseUnits("1", 18), txParam);
  await tx1.wait()
  console.log("Tx1 hash: ", tx1.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
