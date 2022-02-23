const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  it("Test Counter Contract", async function () {
    const counterFactory = await ethers.getContractFactory("Counter");
    const counterContract = await counterFactory.deploy(0);
    await counterContract.deployed();

    expect(await counterContract.get()).to.equal(0);

    const setTx = await counterContract.set(100);
    const incTx = await counterContract.inc();
    const decTx = await counterContract.dec();

    // wait until the transaction is mined
    await setTx.wait();
    await incTx.wait();
    await decTx.wait();

    expect(await counterContract.get()).to.equal(100);
  });
});
