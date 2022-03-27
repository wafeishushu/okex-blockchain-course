const { artifacts, network } = require("hardhat");
const { writeAddr } = require("./artifact-log.js");

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const MyTokenA = await ethers.getContractFactory("MyTokenA");
  const myTokenA = await MyTokenA.deploy();
  await myTokenA.deployed();
  console.log("TokenA address", myTokenA.address);

  await writeAddr(myTokenA.address, "MyTokenA", network.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
