import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  chainName: string;
  isConnected: boolean;
}

export interface MetaMaskError extends Error {
  code?: number;
  data?: { message: string };
}

export const useWeb3 = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chain ID to name mapping
  const chainNames: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon Mainnet',
    80001: 'Mumbai Testnet',
    43114: 'Avalanche',
    43113: 'Fuji Testnet',
    56: 'BSC Mainnet',
    97: 'BSC Testnet',
    250: 'Fantom',
    4002: 'Fantom Testnet',
    42161: 'Arbitrum',
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask not installed');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const newProvider = new ethers.BrowserProvider(ethereum);
      const network = await newProvider.getNetwork();
      const newSigner = await newProvider.getSigner();

      const balance = await newProvider.getBalance(accounts[0]);
      const balanceInEth = ethers.formatEther(balance);

      const walletInfo: WalletInfo = {
        address: accounts[0],
        balance: balanceInEth,
        chainId: Number(network.chainId),
        chainName: chainNames[Number(network.chainId)] || `Chain ${network.chainId}`,
        isConnected: true,
      };

      setProvider(newProvider);
      setSigner(newSigner);
      setWallet(walletInfo);

      localStorage.setItem('wallet_address', accounts[0]);

      return walletInfo;
    } catch (err) {
      const error = err as MetaMaskError;
      setError(error.message || 'Failed to connect wallet');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isMetaMaskInstalled]);

  // Switch network
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask not installed');
      return false;
    }

    try {
      setLoading(true);
      const ethereum = (window as any).ethereum;

      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      if (wallet) {
        setWallet({
          ...wallet,
          chainId,
          chainName: chainNames[chainId] || `Chain ${chainId}`,
        });
      }

      return true;
    } catch (err: any) {
      // If the chain doesn't exist, we could add it here
      setError(`Failed to switch to chain ${chainId}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isMetaMaskInstalled, wallet, chainNames]);

  // Get accounts on chain change
  const updateAccountOnChainChange = useCallback(async () => {
    if (!provider) return;

    try {
      const currentSigner = await provider.getSigner();
      const address = await currentSigner.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      setWallet((prev) =>
        prev
          ? {
              ...prev,
              address,
              balance: ethers.formatEther(balance),
              chainId: Number(network.chainId),
              chainName: chainNames[Number(network.chainId)] || `Chain ${network.chainId}`,
            }
          : null
      );
    } catch (err) {
      console.error('Error updating account on chain change:', err);
    }
  }, [provider, chainNames]);

  // Listen for account and chain changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const ethereum = (window as any).ethereum;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWallet(null);
        setSigner(null);
        localStorage.removeItem('wallet_address');
      } else {
        updateAccountOnChainChange();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [isMetaMaskInstalled, updateAccountOnChainChange]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setSigner(null);
    setProvider(null);
    localStorage.removeItem('wallet_address');
  }, []);

  // Sign message
  const signMessage = useCallback(
    async (message: string) => {
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      try {
        const signature = await signer.signMessage(message);
        return signature;
      } catch (err) {
        const error = err as Error;
        throw new Error(`Failed to sign message: ${error.message}`);
      }
    },
    [signer]
  );

  // Send transaction
  const sendTransaction = useCallback(
    async (to: string, value: string, data?: string) => {
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      try {
        const tx = await signer.sendTransaction({
          to,
          value: ethers.parseEther(value),
          data,
        });

        return tx;
      } catch (err) {
        const error = err as Error;
        throw new Error(`Transaction failed: ${error.message}`);
      }
    },
    [signer]
  );

  return {
    wallet,
    provider,
    signer,
    loading,
    error,
    isMetaMaskInstalled,
    connectWallet,
    switchNetwork,
    disconnectWallet,
    signMessage,
    sendTransaction,
  };
};
