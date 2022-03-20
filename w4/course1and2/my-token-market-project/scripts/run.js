const { ethers } = require("hardhat");

const Router = require(`../../../v2-periphery/deployments/${network.name}/Router.json`);
const WETH = require(`../../../v2-periphery/deployments/${network.name}/WETH.json`);

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const Token = await ethers.getContractFactory("Token");
  const tokenAmount = ethers.utils.parseUnits("10000", 18);
  const tokenContract = await Token.deploy("MyToken", "BJT", tokenAmount);

  await tokenContract.deployed();
  console.log("MyToken address: ", tokenContract.address);

  const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
  const routerAddr = Router.address;
  const wethAddr = WETH.address;
  const market = await MyTokenMarket.deploy(
    tokenContract.address,
    routerAddr,
    wethAddr
  );

  await market.deployed();
  console.log("MyTokenMarket address: ", market.address);

  let tx1 = await tokenContract.approve(market.address, ethers.constants.MaxUint256);
  await tx1.wait()

  const ethAmount = ethers.utils.parseUnits("10", 18);
  let tx2 = await market.addLiquidity(tokenAmount, { value: ethAmount });
  await tx2.wait()
  console.log("Add Liquidity, ETH: 10 and BJT 10000");

  let ownerBalance = await tokenContract.balanceOf(owner.address);
  console.log("Owner BJT token balance: ", ethers.utils.formatUnits(ownerBalance, 18));

  let buyEthAmount = ethers.utils.parseUnits("1", 18);
  let tx3 = await market.buyToken("0", { value: buyEthAmount });
  await tx3.wait()

  ownerBalance = await tokenContract.balanceOf(owner.address);
  console.log("After buy tokens, owner balance is: ", ethers.utils.formatUnits(ownerBalance, 18));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
