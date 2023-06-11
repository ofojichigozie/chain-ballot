import { ethers, BigNumber } from "ethers";

export const ethersUtils = {
  toWei: (value) => {
    return ethers.utils.parseUnits(value.toString(), 6);
  },
  fromWei: (value) => {
    return ethers.utils.formatUnits(value.toString(), 6);
  },
};

export const toBN = (value) => {
  return BigNumber.from(value.toString());
};
