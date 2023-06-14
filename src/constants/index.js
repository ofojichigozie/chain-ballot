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
  ballot: "0xc39c9744f6599f454337e566601551bBEEe83bDA",
};

const abis = {
  ballot: ballotContractABI,
};

export { supportedChain, addresses, abis };
