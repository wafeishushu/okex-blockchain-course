const { artifacts, network } = require("hardhat");
const { writeAddr } = require("./artifact-log.js");

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const MyTokenB = await ethers.getContractFactory("MyTokenB");
  const myTokenB = await MyTokenB.deploy();
  await myTokenB.deployed();
  console.log("Token address", myTokenB.address);

  await writeAddr(myTokenB.address, "MyTokenB", network.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//npx hardhat run scripts/deploy_tokenb_2.js --network goerli
