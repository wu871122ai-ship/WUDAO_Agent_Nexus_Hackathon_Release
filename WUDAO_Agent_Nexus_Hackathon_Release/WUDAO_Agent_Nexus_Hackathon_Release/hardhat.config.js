require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const key = process.env.DEPLOYER_PRIVATE_KEY;
const accounts = key ? [key] : [];

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    bnbTestnet: {
      url: process.env.BNB_TESTNET_RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts
    },
    bnbMainnet: {
      url: process.env.BNB_MAINNET_RPC_URL || "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts
    }
  },
  etherscan: {
    apiKey: { bsc: process.env.BSCSCAN_API_KEY || "", bsctest: process.env.BSCSCAN_API_KEY || "" },
    customChains: [
      { network: "bnbTestnet", chainId: 97, urls: { apiURL: "https://api-testnet.bscscan.com/api", browserURL: "https://testnet.bscscan.com" } }
    ]
  }
};