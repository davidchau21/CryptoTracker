
import React, { createContext, useContext, useState, useEffect } from 'react';
import Moralis from 'moralis';

// Polyfill for Node.js global objects needed by Moralis
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
}

// WalletConnect Project ID
const projectId = '964dd91fea5c13a73daa953ac1653157';

// Define our own Chain type since we need compatibility with Web3Modal's expectations
type Chain = {
  id: number;
  name: string;
  rpcUrl: string;
  currency: string;
  explorerUrl: string;
  chainId: number;
};

// Supported chains
const chains: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    rpcUrl: 'https://ethereum.publicnode.com',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    chainId: 1
  },
  {
    id: 56,
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    currency: 'BNB',
    explorerUrl: 'https://bscscan.com',
    chainId: 56
  },
  {
    id: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    chainId: 137
  }
];

// Define metadata for future use
const metadata = {
  name: 'CryptoTracker',
  description: 'Crypto Trading Platform',
  url: 'https://cryptotracker.io',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Initialize Moralis
const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjQ4NGFmMDk3LTQ3ZTEtNDcxOS1iODcxLTYwNGY1MzZlMjk4ZSIsIm9yZ0lkIjoiNDQzNjkzIiwidXNlcklkIjoiNDU2NTA0IiwidHlwZUlkIjoiMGIxM2Y0N2MtYTc1YS00OTIwLWIyMzItZGVhZWNmYzUwMjA1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDU1NDY5ODQsImV4cCI6NDkwMTMwNjk4NH0.wLzrxq9S1UZBWPAqPDcRJf6wl6u25TQyHIeYMa6wPA0";

interface WalletContextType {
  isConnected: boolean;
  address?: string;
  disconnect: () => void;
  connect: () => Promise<void>;
  chain?: number;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  disconnect: () => {},
  connect: async () => {}
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>();
  const [chain, setChain] = useState<number | undefined>();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initMoralis = async () => {
      try {
        if (!hasInitialized && MORALIS_API_KEY) {
          await Moralis.start({
            apiKey: MORALIS_API_KEY,
          });
          setHasInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize Moralis:", error);
      }
    };

    initMoralis();

    // Check if wallet is already connected using localStorage
    const checkConnection = async () => {
      try {
        const walletStore = localStorage.getItem('walletconnect');
        if (walletStore) {
          const walletData = JSON.parse(walletStore);
          if (walletData?.accounts?.length) {
            setAddress(walletData.accounts[0]);
            setIsConnected(true);
            if (walletData.chainId) {
              setChain(walletData.chainId);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    };

    checkConnection();
  }, [hasInitialized]);

  // Connect wallet function using Moralis
  const connect = async () => {
    try {
      if (!MORALIS_API_KEY) {
        alert("Moralis API Key is not configured. Please add your Moralis API key to use wallet connection.");
        return;
      }

      if (!hasInitialized) {
        console.log("Moralis not initialized yet.");
        return;
      }

      // Check if Metamask is installed
      const ethereum = window.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask to connect your wallet!");
        window.open('https://metamask.io/download.html', '_blank');
        return;
      }

      // Request wallet connection
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        // Get current chain
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        setChain(parseInt(chainId, 16));
        
        // Save to localStorage
        localStorage.setItem('walletconnect', JSON.stringify({
          accounts: accounts,
          chainId: parseInt(chainId, 16)
        }));
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const disconnect = () => {
    localStorage.removeItem('walletconnect');
    setIsConnected(false);
    setAddress(undefined);
    setChain(undefined);
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      address, 
      disconnect,
      connect,
      chain
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
