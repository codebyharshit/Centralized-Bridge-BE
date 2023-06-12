require("dotenv").config();
import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers";
import Token from "./abi/token";
import Bridge from "./abi/bridge";
import {
  privateKey,
  providerMatic,
  providerEth,
  TokenMaticAddress,
  TokenEthAddress,
  BridgeMaticAddress,
  BridgeEthAddress,
} from "./config";

const providerMatic = new JsonRpcProvider(providerMatic);
const providerEth = new JsonRpcProvider(providerEth);

const contractBridgeEth = new ethers.Contract(
  BridgeEthAddress,
  Bridge,
  providerEth
);
const contractBridgeMatic = new ethers.Contract(
  BridgeMaticAddress,
  Bridge,
  providerMatic
);

const events = async () => {
  contractBridgeMatic.on("BRIDGE", async (from, amount) => {
    sendTokenEth(from, amount)
      .then(() => {
        console.log("Tokens sent successfully");
      })
      .catch((error) => {
        console.error("Error sending tokens:", error);
      });
  });

  contractBridgeEth.on("BRIDGE", async (from, amount) => {
    sendTokenMatic(from, amount)
      .then(() => {
        console.log("Tokens sent successfully");
      })
      .catch((error) => {
        console.error("Error sending tokens:", error);
      });
  });

  async function sendTokenEth(wallet, amount) {
    const walletWithProvider = new ethers.Wallet(privateKey, providerEth);

    const tokenSmartContract = new ethers.Contract(
      TokenEthAddress,
      Token,
      walletWithProvider
    );

    const transaction = await tokenSmartContract.transfer(wallet, amount);
    await transaction.wait();
    console.log("Tokens transferred successfully.");
  }

  async function sendTokenMatic(wallet, amount) {
    const walletWithProvider = new ethers.Wallet(privateKey, providerMatic);

    const tokenSmartContract = new ethers.Contract(
      TokenMaticAddress,
      Token,
      walletWithProvider
    );

    const transaction = await tokenSmartContract.transfer(wallet, amount);
    await transaction.wait();
    console.log("Tokens transferred successfully.");
  }
};

events();

module.exports = { events };
