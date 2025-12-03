import React, { createContext, useContext } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { WalletInfo } from '../hooks/useWeb3';
import { ethers } from 'ethers';

interface Web3ContextType {
  wallet: WalletInfo | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  loading: boolean;
  error: string | null;
  isMetaMaskInstalled: () => boolean;
  connectWallet: () => Promise<WalletInfo | null>;
  switchNetwork: (chainId: number) => Promise<boolean>;
  disconnectWallet: () => void;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (to: string, value: string, data?: string) => Promise<any>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const web3 = useWeb3();

  return <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>;
}

export function useWeb3Context() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within Web3Provider');
  }
  return context;
}
