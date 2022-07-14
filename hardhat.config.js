require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('@openzeppelin/hardhat-upgrades');

const ALCHEMY_API_KEY = "";
const RINKEBY_PRIVATE_KEY = "";
const ROPSTEN_PRIVATE_KEY_BOB = "";
const KOVAN_TOKEN = "";
const ROPSTEN_TOKEN = "";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.13",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
      chainId: 4
    },
    bnb_test: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
      chainId: 97
    },
    kovan: {
      url: `https://kovan.infura.io/v3/` + KOVAN_TOKEN,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
      chainId: 42
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/` + ROPSTEN_TOKEN,
      accounts: [`${ROPSTEN_PRIVATE_KEY_BOB}`],
      chainId: 3
    }
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21,
    // enabled: (process.env.REPORT_GAS) ? true : false
    enabled: true
  }
};