import React, { useState, useEffect } from "react";
import { useWallet } from "@/providers/WalletProvider";
import { fetchTokenBalance } from "@/services/api";
import { toast } from "sonner";

const RightSidebar: React.FC = () => {
  const { 
    isConnected, 
    address, 
    disconnect, 
    connect, 
    chain, 
    tokens, 
    nativeBalance, 
    isLoadingTokens, 
    walletProviderName 
  } = useWallet();

  const [ctkBalance, setCtkBalance] = useState("0.0000");

  // Asynchronously query the on-chain CTK balance for the connected address
  useEffect(() => {
    const loadCtkBalance = async () => {
      if (isConnected && address) {
        try {
          const bal = await fetchTokenBalance(address);
          setCtkBalance(bal);
        } catch (e) {
          console.warn("Failed to load CTK balance in RightSidebar:", e);
        }
      } else {
        setCtkBalance("0.0000");
      }
    };

    loadCtkBalance();
    const interval = setInterval(loadCtkBalance, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [isConnected, address]);

  // Shorten wallet address for display
  const shortenedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : "";

  // Switch network on MetaMask or Trust Wallet
  const handleNetworkSwitch = async (targetChainId: number) => {
    const ethereum = window.ethereum;
    if (!ethereum && walletProviderName !== "sandbox") {
      toast.error("Không tìm thấy ví Web3 injected.");
      return;
    }

    const hexChainId = `0x${targetChainId.toString(16)}`;

    try {
      const provider = walletProviderName === "trustwallet" 
        ? (window.trustwallet || ethereum) 
        : ethereum;

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
      toast.success("Chuyển mạng thành công!");
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Network needs to be added
        try {
          const chainDetails = targetChainId === 11155111 ? {
            chainId: hexChainId,
            chainName: "Sepolia Testnet",
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://rpc2.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"]
          } : targetChainId === 97 ? {
            chainId: hexChainId,
            chainName: "BSC Testnet",
            nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
            blockExplorerUrls: ["https://testnet.bscscan.com"]
          } : targetChainId === 31337 ? {
            chainId: hexChainId,
            chainName: "Hardhat Localhost",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["http://127.0.0.1:8545"],
            blockExplorerUrls: ["http://127.0.0.1:8545"]
          } : targetChainId === 137 ? {
            chainId: hexChainId,
            chainName: "Polygon Mainnet",
            nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
            rpcUrls: ["https://polygon-rpc.com"],
            blockExplorerUrls: ["https://polygonscan.com"]
          } : targetChainId === 56 ? {
            chainId: hexChainId,
            chainName: "Binance Smart Chain",
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: ["https://bsc-dataseed.binance.org"],
            blockExplorerUrls: ["https://bscscan.com"]
          } : null;

          if (chainDetails) {
            const provider = walletProviderName === "trustwallet" ? (window.trustwallet || ethereum) : ethereum;
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [chainDetails],
            });
            toast.success("Đã thêm mạng và chuyển đổi thành công!");
          }
        } catch (addError: any) {
          console.error("Failed to add network:", addError);
          toast.error("Không thể thêm mạng mới vào ví.");
        }
      } else {
        toast.error("Không thể chuyển mạng.");
      }
    }
  };

  // Get active chain name
  const getChainName = () => {
    switch (chain) {
      case 1: return "Ethereum Mainnet";
      case 56: return "Binance Smart Chain";
      case 97: return "BSC Testnet";
      case 31337: return "Hardhat Localhost";
      case 137: return "Polygon MATIC";
      case 11155111: return "Sepolia Testnet";
      default: return "Chưa xác định";
    }
  };

  // Get native coin symbol depending on active chain
  const getNativeSymbol = () => {
    switch (chain) {
      case 56: return "BNB";
      case 97: return "tBNB";
      case 31337: return "ETH";
      case 137: return "MATIC";
      case 11155111: return "SepoliaETH";
      default: return "ETH";
    }
  };

  return (
    <>
      {/* ─── WEB3 PORTFOLIO ASSET MANAGEMENT WIDGET ──────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg shadow-indigo-500/5 border border-white/50 dark:border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -z-10 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl -z-10 -ml-12 -mb-12"></div>

        {!isConnected ? (
          /* Disconnected CTA State */
          <div className="text-center py-6">
            <div className="size-14 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-500">
              <span className="material-symbols-outlined text-[32px]">account_balance_wallet</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Quản Lý Tài Sản Web3</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-5 leading-relaxed max-w-[220px] mx-auto">
              Kết nối MetaMask hoặc Trust Wallet của bạn để theo dõi số dư, quản lý mạng và xem danh mục token trực tiếp.
            </p>
            <button
              onClick={() => connect()}
              className="w-full py-3 bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              Kết Nối Ví Web3
            </button>
          </div>
        ) : (
          /* Connected Asset Management State */
          <div className="space-y-5">
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                {walletProviderName === "trustwallet" ? (
                  <img 
                    src="https://cdn.iconscout.com/icon/free/png-256/free-trust-wallet-logo-icon-download-in-svg-png-gif-formats--blockchain-wallet-brand-pack-logos-icons-9578051.png?f=webp&w=256" 
                    className="size-5 rounded-full" 
                    alt="Trust Wallet" 
                  />
                ) : walletProviderName === "metamask" ? (
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                    className="size-5" 
                    alt="MetaMask" 
                  />
                ) : (
                  <span className="material-symbols-outlined text-[18px] text-indigo-400">terminal</span>
                )}
                <span className="font-mono text-sm font-black text-slate-800 dark:text-white">{shortenedAddress}</span>
              </div>
              <button
                onClick={disconnect}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all text-xs font-bold cursor-pointer"
                title="Ngắt kết nối ví"
              >
                Ngắt ví
              </button>
            </div>

            {/* Network Swapper Dropdown */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest block">Mạng lưới Blockchain</span>
              <select
                value={chain || 1}
                onChange={(e) => handleNetworkSwitch(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={1}>🌐 Ethereum Mainnet</option>
                <option value={56}>🔶 Binance Smart Chain</option>
                <option value={97}>🔶 BSC Testnet</option>
                <option value={31337}>💻 Hardhat Localhost</option>
                <option value={137}>💜 Polygon MATIC</option>
                <option value={11155111}>🧪 Sepolia Testnet</option>
              </select>
            </div>

            {/* Assets List */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest block">Danh Mục Tài Sản (Assets)</span>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                
                {/* 1. Native Token Balance */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center font-bold text-xs text-indigo-500">
                      {getNativeSymbol().substring(0,2)}
                    </div>
                    <div className="leading-tight text-left">
                      <span className="block font-bold text-xs text-slate-800 dark:text-white">{getNativeSymbol()}</span>
                      <span className="text-[9px] text-slate-500 dark:text-gray-400">Đồng mặc định mạng</span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-extrabold text-slate-800 dark:text-white">
                    {parseFloat(nativeBalance).toFixed(4)}
                  </span>
                </div>

                {/* 2. CTK Token Balance */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src="https://cryptologos.cc/logos/ethereum-eth-logo.png" 
                      className="size-8 p-1 bg-purple-500/10 rounded-lg" 
                      alt="" 
                    />
                    <div className="leading-tight text-left">
                      <span className="block font-bold text-xs text-slate-800 dark:text-white">CTK</span>
                      <span className="text-[9px] text-slate-500 dark:text-gray-400">CryptoTracker Reward</span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-extrabold text-indigo-500 dark:text-indigo-400">
                    {parseFloat(ctkBalance).toFixed(4)}
                  </span>
                </div>

                {/* 3. Other Moralis ERC20 Tokens */}
                {tokens.filter(t => t.symbol !== "CTK").map((t) => (
                  <div key={t.symbol} className="flex justify-between items-center p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30">
                    <div className="flex items-center gap-2.5">
                      {t.icon ? (
                        <img src={t.icon} className="size-8 rounded-lg" alt="" />
                      ) : (
                        <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center font-bold text-xs text-indigo-500">
                          {t.symbol.substring(0, 2)}
                        </div>
                      )}
                      <div className="leading-tight text-left">
                        <span className="block font-bold text-xs text-slate-800 dark:text-white truncate max-w-[80px]">{t.symbol}</span>
                        <span className="text-[9px] text-slate-500 dark:text-gray-400 truncate max-w-[80px]">{t.name}</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-extrabold text-slate-800 dark:text-white">
                      {parseFloat(t.balance).toFixed(4)}
                    </span>
                  </div>
                ))}

                {isLoadingTokens && (
                  <div className="text-center py-2">
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── LATEST CRYPTO NEWS ──────────────────────────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-[#0d121c] dark:text-white">
            Latest Crypto News
          </h3>
          <a
            className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline decoration-2"
            href="#"
          >
            View All
          </a>
        </div>
        <div className="flex flex-col gap-5">
          <a className="flex gap-3 group" href="#">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-300 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0d121c] dark:text-white leading-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Bitcoin Halving Approaches: What Investors Need to Know
              </h4>
              <div className="flex items-center gap-2 text-xs text-brand-secondary">
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded font-medium">
                  BTC
                </span>
                <span>2h ago</span>
              </div>
            </div>
          </a>
          <a className="flex gap-3 group" href="#">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0d121c] dark:text-white leading-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                SEC Chairman Comments on New DeFi Regulations
              </h4>
              <div className="flex items-center gap-2 text-xs text-brand-secondary">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                  Regs
                </span>
                <span>4h ago</span>
              </div>
            </div>
          </a>
          <a className="flex gap-3 group" href="#">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0d121c] dark:text-white leading-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Ethereum Layer 2 Activity Reaches All-Time High
              </h4>
              <div className="flex items-center gap-2 text-xs text-brand-secondary">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-medium">
                  L2
                </span>
                <span>6h ago</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* ─── LIVE DISCUSSIONS ────────────────────────────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-[#0d121c] dark:text-white">
            Live Discussions
          </h3>
          <div className="flex -space-x-3">
            <div
              className="size-8 rounded-full bg-gray-300 ring-2 ring-white dark:ring-[#1e2634] bg-cover shadow-sm"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAai00pUAHEXT-QVSyo0-hY4c7Bv5L8cTpeAnsihbLNvwWhiwzB3wSWOaT99hKva-SQc-OuMnjcz_ocgOiQ7vqhEgIsgnMVSm11QsNdTr6FyHnEJcXE2hq01TTcg7L3d0sUdKwRL7_JRxTt5-PV2kl1q2RFXDLaqwnPr4DfnDXu7HnILS3DHitY42bIbCayDnDFsQ0OCehLUjUXQOX86_mTPSNJbaxqqg8xmJXN-DJ7CU0x4jiAiZXgQyy01CiGKWkU-pR0hMLDR4E')",
              }}
            ></div>
            <div
              className="size-8 rounded-full bg-gray-300 ring-2 ring-white dark:ring-[#1e2634] bg-cover shadow-sm"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYfKRiEl8bwOsVNKPUHArbS3BOw77CZgy1cs4sIn3tXg0nAfjDQiA9YLdmultMw_OW0Q5jAVHjthu_xlhtf9MUFMjzZalahHfvOSuE7SCrWYRnDElHn5pT8hhHQ8VC6VU2DB2TSCL9vI0ImYqdXSGyDmKzHR4ny7r1Cpxfox4dxsdqLNxM54p4AXaitDZfAxYKqbeS_-iWTccuTrW0STjTdBmU71oyuXGk0OSYhrnJX66r0U9b6qUeeSLc9S2YSmMaZtf62B5z7r4')",
              }}
            ></div>
            <div className="size-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 ring-2 ring-white dark:ring-[#1e2634] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              99+
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white/40 dark:bg-gray-800/40 p-3 rounded-xl border border-white/40 dark:border-gray-700/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="size-8 rounded-full bg-cover ring-2 ring-white/50 dark:ring-white/10"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClcwNWPCZGPf34JLvpRhSvRd8wn6Pfj-Ojb1l150nhnLe1DQhAWF0MPIjw5L9Nk0kz5-PLgi2A3BLAgWUQoM2ePfhRaHhinALlDmsW53A2Bet_zDN7DlB2OBeWbXdaiwYHWeox7MPdDzLSUNeUc86YCpsF4jgFMTHM6SnSHQH4HmLTIsm5J8ob2TaCBM4WDoF_KDKc6w288uKthixTYBV4Jsfshf2_ROTBaTH-lDKIUI0Hr3Ci1XMJrqbryXIQtfxJKVbeI1ZhAM4')",
                  }}
                ></div>
                <span className="text-sm font-bold text-[#0d121c] dark:text-white">
                  CryptoKing
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Bullish
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              BTC looking strong at $28k support. Next stop $32k! 🚀
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-brand-secondary font-medium">
              <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  thumb_up
                </span>
                124
              </span>
              <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  chat_bubble
                </span>
                12
              </span>
              <span className="ml-auto">2m ago</span>
            </div>
          </div>
          <div className="bg-white/40 dark:bg-gray-800/40 p-3 rounded-xl border border-white/40 dark:border-gray-700/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="size-8 rounded-full bg-cover ring-2 ring-white/50 dark:ring-white/10"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8__AEAHm4nbBv35Q4uKL3T1AUzdzNIjIxzmkYKDa6DR83zACVMCpHBlz10EBmacYL9OgklT00583Y9yVUKGTxvjcMNWT_0Eou-ZPvkrWeukGamqLxZSVFPioWO_M6NNxTONuSpscTgP9Egk5CeW4sNqHdLBWyG55Vuj27AlJuYspkxBxb330EEYWGR3Mgd8Rehlc-FiQpUyvAw19TnjuHdNZIgYhtJmcS_tMt1xthZyLZepv5L7vkh-IR7PkKkjZJnE0yNHcl2bc')",
                  }}
                ></div>
                <span className="text-sm font-bold text-[#0d121c] dark:text-white">
                  BearWhale
                </span>
              </div>
              <span className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Bearish
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Volume is dropping. I'm shorting this bounce. Be careful everyone.
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-brand-secondary font-medium">
              <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  thumb_up
                </span>
                45
              </span>
              <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  chat_bubble
                </span>
                8
              </span>
              <span className="ml-auto">15m ago</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
