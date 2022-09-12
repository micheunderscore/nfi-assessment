import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import React, { useState } from "react";
import "./App.css";
import chainIds from "./chainIds.json";

const App = () => {
  const { ethereum } = useMetaMask();

  const [errorMessage, setErrorMessage] = useState("");
  const [defaultAccount, setDefaultAccount] = useState("");
  const [userBalance, setUserBalance] = useState("");
  const [userChainId, setUserChainId] = useState("");

  const reload = () => {
    window.location.reload();
  };

  const resetErr = () => {
    setErrorMessage("");
  };

  const connectWalletHandler = () => {
    if (ethereum) {
      // metamask exists
      ethereum
        .request?.({
          method: "eth_requestAccounts",
        })
        .then((result) => {
          accountChangedHandler(result);
          resetErr();
        })

        .catch((err) => {
          setErrorMessage(`ERR_ACC: ${err.message}`);
        });
    } else {
      setErrorMessage("Please Install MetaMask");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount[0].toString());
    getUserBalance(newAccount[0]);
    getChainId();
  };

  const chainChangedHandler = () => {
    // reload(); // Best Practice but disabled for purposes of demo
    getChainId();
  };

  const getUserBalance = (address) => {
    ethereum
      ?.request?.({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
        resetErr();
      })
      .catch((err) => {
        setErrorMessage(`ERR_BAL: ${err.message}`);
      });
  };

  const getChainId = () => {
    ethereum
      ?.request?.({ method: "eth_chainId" })
      .then((chainId) => {
        setUserChainId(chainIds[chainId].network);
        resetErr();
      })
      .catch((err) => {
        setErrorMessage(`ERR_CHA: ${err.message}`);
      });
  };

  ethereum?.on?.("accountsChanged", accountChangedHandler);

  ethereum?.on?.("chainChanged", chainChangedHandler);

  ethereum?.on?.("disconnect", reload);

  return (
    <div className="App">
      <h4>Connection to MetaMask using window.ethereum method</h4>
      <button onClick={connectWalletHandler}>Connect Wallet</button>
      <div className="accountDisplay">
        <h3>Address: {defaultAccount}</h3>
      </div>
      <div className="balanceDisplay">
        <h3>Balance: {userBalance}</h3>
      </div>
      <div className="chainDisplay">
        <h3>Network: {userChainId}</h3>
      </div>
      <p className="errMsg">{errorMessage}</p>
    </div>
  );
};

export default App;
