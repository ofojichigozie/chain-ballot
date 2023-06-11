import { useContext } from 'react';
import { Web3Context } from '../contexts/web3Context';

const useWeb3 = () => {
  const context = useContext(Web3Context);

  if (!context) throw new Error('Web3 must be use inside Web3Context');

  return context;
};

export default useWeb3;