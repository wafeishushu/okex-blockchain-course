const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact-log.js");

const UniswapV2Factory = require(`../../../v2-core/deployments/${network.name}/UniswapV2Factory.json`);
const Router = require(`../../../v2-periphery/deployments/${network.name}/Router.json`);
const WETH = require(`../../../v2-periphery/deployments/${network.name}/WETH.json`);
const MasterChef = require(`../deployments/${network.name}/MasterChef.json`);

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // 1. deploy MyToken
  const Token = await ethers.getContractFactory("Token");
  const tokenAmount = ethers.utils.parseUnits("100000", 18);
  const token = await Token.deploy("MyToken", "BJT", tokenAmount);
  await token.deployed();
  console.log("MyToken address: ", token.address);
  await writeAddr(token.address, "Token", network.name);

  // 2. deploy MyTokenMarket
  const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
  const market = await MyTokenMarket.deploy(
    token.address,
    Router.address,
    WETH.address,
    MasterChef.address,
    UniswapV2Factory.address
  );
  await market.deployed();
  console.log("MyTokenMarket address: ", market.address);
  await writeAddr(market.address, "MyTokenMarket", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
