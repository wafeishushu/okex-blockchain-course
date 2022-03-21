const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact-log.js");

const Factory = require(`../../v2-core/deployments/${network.name}/UniswapV2Factory.json`);

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const WETH = await ethers.getContractFactory("WETH9");
  const wethContract = await WETH.deploy();
  await wethContract.deployed();
  console.log("WETH address: ", wethContract.address);
  await writeAddr(wethContract.address, "WETH", network.name);

  const factoryAddr = Factory.address;
  console.log("facotry address: ", factoryAddr);

  const Router = await ethers.getContractFactory("UniswapV2Router02");
  const routerContract = await Router.deploy(factoryAddr, wethContract.address);
  await routerContract.deployed();
  console.log("Router address: ", routerContract.address);
  await writeAddr(routerContract.address, "Router", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
