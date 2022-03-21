import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  let [currentAccount, setCurrentAccount] = useState("");
  let [tokenBalance, setTokenBalance] = useState(0);
  let [vaultBalance, setVaultBalance] = useState(0);
  let [mintAmount, setMintAmount] = useState(0);
  let [approveAmount, setApproveAmount] = useState(0);
  let [depositAmount, setDepositAmount] = useState(0);
  let [withdrawAmount, setWithdrawAmount] = useState(0);

  const tokenAddress = "0xcC0eD986CC2493D184493cEc1c8Dc715F771CeA2";
  const vaultAddress = "0xCa300840d852d900D4D0Bba29D5B2f8FD3945b73";

  const DECIMAL_UNITS = 18
  const erc20ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function mint(uint256 _supply) external"
  ];

  const vaultABI = [
    "function deposit(uint256 _amount) external",
    "function withdraw(uint256 _amount) external",
    "function showUserBalance() external view returns (uint256)"
  ];

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const mintAmountChange = async (e) => {
    try {
      setMintAmount(e.target.value);
    } catch (error) {
      console.log(error)
    }
  }

  const approveAmountChange = async (e) => {
    try {
      setApproveAmount(e.target.value);
    } catch (error) {
      console.log(error)
    }
  }

  const depositAmountChange = async (e) => {
    try {
      setDepositAmount(e.target.value);
    } catch (error) {
      console.log(error)
    }
  }

  const withdrawAmountChange = async (e) => {
    try {
      setWithdrawAmount(e.target.value);
    } catch (error) {
      console.log(error)
    }
  }

  const mintTokens = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        await tokenContract.mint(mintAmount)

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const refreshBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const accounts = await ethereum.request({ method: "eth_accounts" });
        const owner = accounts[0]

        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        const vaultContract = new ethers.Contract(vaultAddress, vaultABI, signer);

        let ownerVaultBalance = await vaultContract.showUserBalance()
        console.log("Owner vault balance: ", ethers.utils.formatUnits(ownerVaultBalance, DECIMAL_UNITS));
        setVaultBalance(ethers.utils.formatUnits(ownerVaultBalance, DECIMAL_UNITS));

        let ownerTokenBalance = await tokenContract.balanceOf(owner)
        console.log("Owner token balance: ", ethers.utils.formatUnits(ownerTokenBalance, DECIMAL_UNITS));
        setTokenBalance(ethers.utils.formatUnits(ownerTokenBalance, DECIMAL_UNITS));

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const approve = async () => {
    if ( approveAmount <= 0) {
      console.log("Approve amount must be >= 0")
      return
    }

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        let tx = await tokenContract.approve(vaultAddress, ethers.utils.parseUnits(approveAmount.toString(), DECIMAL_UNITS))
        await tx.wait();
        console.log("Approve succeed")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const depositVault = async () => {
    if ( depositAmount <= 0) {
      console.log("Deposit amount must be >= 0")
      return
    }

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const owner = accounts[0]

        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        const vaultContract = new ethers.Contract(vaultAddress, vaultABI, signer);

        let tx = await vaultContract.deposit(depositAmount)
        await tx.wait();
        console.log("Deposit succeed")

        let ownerVaultBalance = await vaultContract.showUserBalance()
        console.log("Owner vault balance: ", ethers.utils.formatUnits(ownerVaultBalance, DECIMAL_UNITS));
        setVaultBalance(ethers.utils.formatUnits(ownerVaultBalance, DECIMAL_UNITS));

        let ownerTokenBalance = await tokenContract.balanceOf(owner)
        console.log("Owner token balance: ", ethers.utils.formatUnits(ownerTokenBalance, DECIMAL_UNITS));
        setTokenBalance(ethers.utils.formatUnits(ownerTokenBalance, DECIMAL_UNITS));
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const withdrawVault = async () => {
    if ( withdrawAmount <= 0) {
      console.log("Withdraw amount must be >= 0")
      return
    }

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const owner = accounts[0]

        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        const vaultContract = new ethers.Contract(vaultAddress, vaultABI, signer);

        let tx = await vaultContract.withdraw(withdrawAmount)
        await tx.wait();
        console.log("Withdraw succeed")

        let ownerVaultBalance = await vaultContract.showUserBalance()
        console.log("Owner vault balance: ", ethers.utils.formatUnits(ownerVaultBalance, DECIMAL_UNITS));
        setVaultBalance(ethers.utils.formatUnits(ownerVaultBalance, DECIMAL_UNITS));

        let ownerTokenBalance = await tokenContract.balanceOf(owner)
        console.log("Owner token balance: ", ethers.utils.formatUnits(ownerTokenBalance, DECIMAL_UNITS));
        setTokenBalance(ethers.utils.formatUnits(ownerTokenBalance, DECIMAL_UNITS));
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
    refreshBalance();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        My Vault App
        </div>

        <br/>

        <div className="balance">
          <div className="tokenBalance">
          My token balance: {tokenBalance}
          </div>

          <div className="vaultBalance">
          My vault balance: {vaultBalance}
          </div>

          
          <button className="refresh" onClick={refreshBalance}>
            Refresh balance
          </button>
        </div>


        <br/>

        <div className="mintToken">
          
          <input type="text" onChange={mintAmountChange} defaultValue={0} />
          <button className="mint" onClick={mintTokens}>
            Mint tokens
          </button>
        </div>

        <br/>

        <div className="approveClass">
          <input type="text" onChange={approveAmountChange} defaultValue={0} />
          <button className="approve" onClick={approve}>
          Approve
          </button>
        </div>

        <br/>

        <div className="depositVaultClass">
          <input type="text" onChange={depositAmountChange} defaultValue={0} />
          <button className="depositVault" onClick={depositVault}>
          Deposit tokens to vault
          </button>
        </div>

        <br/>


        <div className="withdrawVaultClass">
          <input type="text" onChange={withdrawAmountChange} defaultValue={0} />
          <button className="withdrawVault" onClick={withdrawVault}>
          Withdraw tokens from vault
          </button>
        </div>

        <br/>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
