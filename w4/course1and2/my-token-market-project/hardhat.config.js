require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const MY_KEY = "";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    // goerli: {
    //   url:
    //     "https://eth-goerli.alchemyapi.io/v2/12UFIG5EnjVSP5Oha1Z3JBSZzvvoV9Zs",
    //   accounts: [MY_KEY],
    // },
  },
};
