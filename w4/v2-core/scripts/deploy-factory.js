const { ethers } = require("hardhat");
const { writeAddr } = require("./artifact-log.js");

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factoryContract = await UniswapV2Factory.deploy(owner.address);
  await factoryContract.deployed();
  console.log("UniswapV2Factory address: ", factoryContract.address);
  await writeAddr(factoryContract.address, "UniswapV2Factory", network.name);

  const codeHash = await factoryContract.INIT_CODE_PAIR_HASH();
  console.log("UniswapV2Factory code hash: ", codeHash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
