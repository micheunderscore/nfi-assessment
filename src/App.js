import { ethers } from "ethers";
import React, { useState } from "react";
import "./App.css";
import chainIds from "./chainIds.json";

const App = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState("");
  const [loading, setLoading] = useState({ address: false, balance: false });
  const [userChainId, setUserChainId] = useState("");

  const connectWalletHandler = () => {
    if (window.ethereum) {
      // metamask exists
      setLoading({ ...loading, address: true });
      window.ethereum
        .request?.({
          method: "eth_requestAccounts",
        })
        .then((result) => {
          accountChangedHandler(result[0]);
        });
    } else {
      setErrorMessage("Please Install MetaMask");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount.toString());
    getUserBalance(newAccount);
    getChainId();
    setLoading({ ...loading, address: false });
  };

  const getUserBalance = (address) => {
    setLoading({ ...loading, balance: true });
    window.ethereum
      ?.request?.({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
        setLoading({ ...loading, balance: false });
      });
  };

  const getChainId = () => {
    window.ethereum
      ?.request?.({ method: "eth_chainId" })
      .then((chainId) => setUserChainId(chainIds[chainId].network));
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum?.on?.("accountsChanged", accountChangedHandler);

  window.ethereum?.on?.("chainChanged", chainChangedHandler);

  return (
    <div className="App">
      <h4>Connection to MetaMask using window.ethereum method</h4>
      <button onClick={connectWalletHandler}>Connect Wallet</button>
      <div className="accountDisplay">
        {!loading.address ? (
          <h3>Address: {defaultAccount}</h3>
        ) : (
          <div className="loader"></div>
        )}
      </div>
      <div className="balanceDisplay">
        {!loading.balance ? (
          <h3>Balance: {userBalance}</h3>
        ) : (
          <div className="loader"></div>
        )}
      </div>
      <div className="chainDisplay">
        <h3>Network: {userChainId}</h3>
      </div>
      {errorMessage}
    </div>
  );
};

export default App;
