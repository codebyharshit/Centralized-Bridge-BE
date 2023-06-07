require("dotenv").config();
const { ethers } = require("ethers");
const { JsonRpcProvider } = require("ethers");
const Token = require("./ABI/Token");
const Bridge = require("./ABI/Bridge");
const { parseEther } = require("ethers");
const Web3 = require("web3");
const web3 = new Web3();

const providerMatic = new JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/FUvWV-Ytjb0hH4R2T2Qa0k21bOwlyqWw"
);

const providerEth = new JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/HugBgBUi34bleuAuHHP7WRE2cOkuTtoc"
);

const TokenMaticAddress = "0x627098Fcc59D1ac36899f12Acf0c5A9AAcBEd01b";

const TokenEthAddress = "0x4e146e4a1B93035fde484db0E4F65563846Da3D9";

const BridgeMaticAddress = "0x40AEFecb2dC5Ad4E96f7cFB437Ea4DC07862B68c";

const BridgeEthAddress = "0xe2Af6495367DF41116e014baf500ac66D358Aae4";

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

const eventsETH = async () => {
  contractBridgeEth.on("BRIDGE", async (from, amount) => {
    // console.log("Event received - From:", from);
    // console.log("Amount:", amount.toString());
    // console.log("Chain Name:", chainName.toString());
    sendTokenToWallet(from, amount)
      .then(() => {
        console.log("Tokens sent successfully");
      })
      .catch((error) => {
        console.error("Error sending tokens:", error);
      });
  });

  async function sendTokenToWallet(wallet, amount) {
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

const events = async () => {
  contractBridgeMatic.on("BRIDGE", async (from, amount) => {
    // console.log("Event received - From:", from);
    // console.log("Amount:", amount.toString());
    // console.log("Chain Name:", chainName.toString());

    sendTokenEth(from, amount)
      .then(() => {
        console.log("Tokens sent successfully");
      })
      .catch((error) => {
        console.error("Error sending tokens:", error);
      });
  });

  contractBridgeEth.on("BRIDGE", async (from, amount) => {
    // console.log("Event received - From:", from);
    // console.log("Amount:", amount.toString());
    // console.log("Chain Name:", chainName.toString());
    sendTokenMatic(from, amount)
      .then(() => {
        console.log("Tokens sent successfully");
      })
      .catch((error) => {
        console.error("Error sending tokens:", error);
      });
  });

  async function sendTokenEth(wallet, amount) {
    const walletWithProvider = new ethers.Wallet(
      process.env.privateKey,
      providerEth
    );

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
    const walletWithProvider = new ethers.Wallet(
      process.env.privateKey,
      providerMatic
    );

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
