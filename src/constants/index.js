import ballotContractABI from "./Ballot.json";

const supportedChain = {
  id: 0x61,
  idString: "0x61",
  name: "BSC Testnet",
  rpcUrl: "https://data-seed-prebsc-2-s2.binance.org:8545",
  explorerUrl: "https://testnet.bscscan.com/",
  nativeCurrency: {
    symbol: "BNB",
    decimals: 18,
  },
};

const addresses = {
  ballot: "0x3C356226e24b15f9d04D8a6A2Dbc38DB72641d33",
};

const abis = {
  ballot: ballotContractABI,
};

export { supportedChain, addresses, abis };
