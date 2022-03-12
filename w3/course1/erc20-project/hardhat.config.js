require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const MY_KEY = "";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    ganache: {
      url: "http://localhost:8545",
      accounts: [MY_KEY],
    },
    goerli: {
      url: "https://eth-goerli.alchemyapi.io/v2/12UFIG5EnjVSP5Oha1Z3JBSZzvvoV9Zs",
      accounts: [MY_KEY],
    },
  },
};