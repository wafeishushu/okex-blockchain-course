const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Deploy MyERC20.sol
  const MyERC20 = await hre.ethers.getContractFactory("MyERC20Token");
  const myERC20Contract = await MyERC20.deploy();
  await myERC20Contract.deployed();
  console.log("MyERC20 deployed to:", myERC20Contract.address);

  // Deploy Vault.sol
  const Vault = await hre.ethers.getContractFactory("Vault");
  const vaultContract = await Vault.deploy(myERC20Contract.address);
  await vaultContract.deployed();
  console.log("Vault deployed to:", vaultContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run scripts/deploy.js --network goerli