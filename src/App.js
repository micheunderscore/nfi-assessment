import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import React, { useState, useEffect } from "react";
import { appStyle } from "./App.styles";
import chainIds from "./chainIds.json";

const App = () => {
  const { connect, status, account, chainId, ethereum } = useMetaMask();

  const [errorMessage, setErrorMessage] = useState("");
  const [userBalance, setUserBalance] = useState("");

  const resetErr = () => {
    setErrorMessage("");
  };

  const connectWalletHandler = () => {
    resetErr();
    connect().catch((err) => {
      setErrorMessage(`ERR_WALLET(${err.code})\t: ${err.message}`);
    });
  };

  const chainChangedHandler = () => {
    // reload(); // Best Practice but disabled for purposes of demo
  };

  const getUserBalance = (address) => {
    ethereum
      ?.request?.({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
        resetErr();
      })
      .catch((err) => {
        setErrorMessage(`ERR_BAL(${err.code})\t: ${err.message}`);
      });
  };

  ethereum?.on?.("chainChanged", chainChangedHandler);

  useEffect(() => {
    if (status === "connected") getUserBalance(account);
  }, [status]);

  return (
    <div className="text-center">
      <p className={appStyle.text.title}>MetaMask Wallet Info</p>
      <button className={appStyle.button} onClick={connectWalletHandler}>
        Connect Wallet
      </button>
      <div className={appStyle.container}>
        {status === "connected" ? (
          <div className={appStyle.text.box}>
            <p className={appStyle.text.p}>{`Address\t: ${account}`}</p>
            <p className={appStyle.text.p}>{`Balance\t: ${userBalance}`}</p>
            <p
              className={appStyle.text.p}
            >{`Network\t: ${chainIds[chainId].network}`}</p>
          </div>
        ) : (
          <p className={appStyle.text.p}>No Wallet Connected 😢</p>
        )}
      </div>
      <p className={appStyle.text.err}>{errorMessage}</p>
    </div>
  );
};

export default App;
