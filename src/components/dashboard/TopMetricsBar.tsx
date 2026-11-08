import React, { useState, useEffect } from "react";
import { useWallet } from "@/providers/WalletProvider";

const TopMetricsBar: React.FC = () => {
  const { chain, isConnected } = useWallet();
  const [gasStandard, setGasStandard] = useState<number>(12);
  const [blockHeight, setBlockHeight] = useState<number>(21489320);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate realistic network gas micro-fluctuation (8 - 22 Gwei) & new blocks every 12s
      setGasStandard((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(7, Math.min(28, prev + delta));
      });
      setBlockHeight((prev) => prev + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const getNetworkLabel = () => {
    if (!isConnected) return "Multi-Chain Ready";
    switch (chain) {
      case 11155111:
        return "Sepolia Testnet";
      case 97:
        return "BSC Testnet";
      case 31337:
        return "Hardhat Localhost";
      case 56:
        return "BNB Smart Chain";
      case 137:
        return "Polygon POS";
      default:
        return "Ethereum Mainnet";
    }
  };

  const gasLow = Math.max(5, gasStandard - 3);
  const gasFast = gasStandard + 4;

  const MetricsContent = () => (
    <>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-slate-500 dark:text-gray-400">Mạng:</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
          {getNetworkLabel()}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[15px] text-amber-500">
          local_gas_station
        </span>
        <span className="text-slate-500 dark:text-gray-400">Gas Tracker:</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
          🐢 {gasLow}
        </span>
        <span className="text-slate-300 dark:text-gray-600">|</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
          ⚡ {gasStandard} Gwei
        </span>
        <span className="text-slate-300 dark:text-gray-600">|</span>
        <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">
          🚀 {gasFast}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-slate-500 dark:text-gray-400">Block:</span>
        <span className="text-slate-800 dark:text-gray-200 font-mono font-bold">
          #{blockHeight.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-slate-500 dark:text-gray-400">Vốn hóa:</span>
        <span className="text-slate-800 dark:text-gray-200 font-bold">
          $2.48T
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-slate-500 dark:text-gray-400">24h Vol:</span>
        <span className="text-slate-800 dark:text-gray-200 font-bold">
          $68.4B
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-slate-500 dark:text-gray-400">Dominance:</span>
        <span className="text-slate-800 dark:text-gray-200 font-bold">
          BTC 54.2% · ETH 17.8%
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-slate-500 dark:text-gray-400">
          CTK Staking TVL:
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
          125,400+ CTK (225% Max APY)
        </span>
      </div>
    </>
  );

  return (
    <div className="glass-panel border-b border-slate-200/80 dark:border-border-dark py-2 text-xs font-medium text-slate-600 dark:text-gray-300 overflow-hidden z-20 bg-white/80 dark:bg-slate-950/80">
      <div className="flex whitespace-nowrap relative group">
        <div className="flex items-center gap-8 px-4 animate-marquee group-hover:[animation-play-state:paused] min-w-full justify-around">
          <MetricsContent />
        </div>
        <div className="flex items-center gap-8 px-4 animate-marquee group-hover:[animation-play-state:paused] min-w-full justify-around absolute top-0 left-full">
          <MetricsContent />
        </div>
      </div>
    </div>
  );
};

export default TopMetricsBar;
