import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useWallet } from "@/providers/WalletProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Shield, 
  Loader2, 
  Wallet, 
  CheckCircle2, 
  ArrowUpRight, 
  PlusCircle, 
  Layers, 
  RefreshCw, 
  History, 
  Award,
  ArrowDownCircle,
  ExternalLink,
  Info
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchUserQuests,
  withdrawAccumulatedRewards,
  fetchTokenBalance,
  fetchTokenInfo,
  QuestProgress,
} from "@/services/api";

const Portfolio: React.FC = () => {
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const wallet = useWallet();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const [quests, setQuests] = useState<QuestProgress[]>([]);
  const [ctkBalance, setCtkBalance] = useState<string>("0.00");
  const [isLoadingQuests, setIsLoadingQuests] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const loadData = async () => {
    if (!token) return;
    setIsLoadingQuests(true);
    try {
      // 1. Fetch User Quests Progress to compute in-game balance
      const questData = await fetchUserQuests(token);
      setQuests(questData);

      // 2. Fetch Token Balance
      if (wallet.isConnected && wallet.address) {
        const bal = await fetchTokenBalance(wallet.address);
        setCtkBalance(bal);
      } else {
        setCtkBalance("0.00");
      }
    } catch (err: any) {
      console.error("Failed to load assets data:", err);
    } finally {
      setIsLoadingQuests(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      loadData();
    }
  }, [isAuthenticated, token, wallet.isConnected, wallet.address, wallet.chain]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để truy cập trang quản lý tài sản.");
      navigate("/login");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // Dynamically calculate In-Game Balance
  const inGameBalance = quests
    .filter((q) => q.status === "claimed" && !q.txHash)
    .reduce((sum, q) => sum + q.rewardAmount, 0);

  // Filter completed but totally on-chain withdrawn quests for history
  const withdrawnHistory = quests.filter((q) => q.status === "claimed" && q.txHash);

  // Switch network in MetaMask
  const switchToNetwork = async (targetChainId: number) => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      toast.error("Ví Web3 chưa được cài đặt.");
      return;
    }

    const hexChainId = `0x${targetChainId.toString(16)}`;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
      toast.success(`Đã chuyển mạng thành công!`);
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          const chainDetails = targetChainId === 11155111 ? {
            chainId: hexChainId,
            chainName: "Sepolia Testnet",
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://rpc2.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          } : targetChainId === 97 ? {
            chainId: hexChainId,
            chainName: "BSC Testnet",
            nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
            blockExplorerUrls: ["https://testnet.bscscan.com"],
          } : targetChainId === 31337 ? {
            chainId: hexChainId,
            chainName: "Hardhat Localhost",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["http://127.0.0.1:8545"],
            blockExplorerUrls: ["http://127.0.0.1:8545"],
          } : null;

          if (chainDetails) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [chainDetails],
            });
            toast.success(`Đã thêm và chuyển sang mạng ${chainDetails.chainName}!`);
          }
        } catch (addError) {
          console.error("Failed to add network", addError);
          toast.error("Không thể thêm mạng mới vào ví.");
        }
      } else {
        toast.error("Không thể chuyển mạng.");
      }
    }
  };

  // Withdraw accumulated rewards on-chain
  const handleWithdraw = async () => {
    if (!wallet.isConnected || !wallet.address) {
      toast.error("Vui lòng kết nối ví MetaMask/Trust Wallet trước khi thực hiện rút tiền.");
      return;
    }

    if (wallet.chain !== 11155111 && wallet.chain !== 97 && wallet.chain !== 31337) {
      toast.error("Mạng không hợp lệ. Vui lòng chuyển sang mạng Hardhat Localhost, BSC Testnet hoặc Sepolia để thực hiện rút tiền.", {
        action: {
          label: "Chuyển Mạng",
          onClick: () => switchToNetwork(31337),
        },
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await withdrawAccumulatedRewards(token!, wallet.address);
      if (res.success) {
        toast.success(`Rút thành công ${res.amount} CTK về ví Web3!`, {
          description: `Giao dịch đúc token đã hoàn tất thành công trên blockchain.`,
          duration: 8000,
          action: {
            label: wallet.chain === 31337 ? "Xem giao dịch local" : wallet.chain === 97 ? "Xem trên BscScan" : "Xem trên Etherscan",
            onClick: () => window.open(
              wallet.chain === 31337
                ? `http://127.0.0.1:8545`
                : wallet.chain === 97
                  ? `https://testnet.bscscan.com/tx/${res.txHash}`
                  : `https://sepolia.etherscan.io/tx/${res.txHash}`,
              "_blank"
            ),
          },
        });
        await loadData();
        await wallet.refetchBalances();
      }
    } catch (err: any) {
      toast.error(err.message || "Rút tiền thất bại. Vui lòng thử lại!");
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Add CTK to wallet manually
  const addCtkToWallet = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      toast.error("Vui lòng cài đặt ví MetaMask.");
      return;
    }
    try {
      const tokenInfo = await fetchTokenInfo().catch(() => null);
      const contractAddr = tokenInfo?.contractAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: contractAddr,
            symbol: tokenInfo?.symbol || "CTK",
            decimals: 18,
            image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
          },
        },
      });
      toast.success("Đã gửi yêu cầu thêm token CTK vào ví của bạn!");
    } catch (error: any) {
      console.error("Error adding CTK:", error);
      toast.error(error.message || "Không thể thêm token vào ví.");
    }
  };

  // Naming helper for networks
  const getNetworkName = (chainId?: number) => {
    switch (chainId) {
      case 1: return "Ethereum Mainnet";
      case 56: return "Binance Smart Chain";
      case 97: return "BSC Testnet";
      case 31337: return "Hardhat Localhost";
      case 137: return "Polygon MATIC";
      case 11155111: return "Sepolia Testnet";
      default: return "Chưa xác định";
    }
  };

  if (isAuthLoading) {
    return (
      <DashboardLayout hideSidebar={true}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="size-8 text-indigo-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout hideSidebar={true}>
      <div className={`w-full max-w-[1300px] mx-auto px-4 py-8 space-y-8 relative transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"}`}>
        
        {/* Dynamic Glow Blobs */}
        <div className={`absolute top-1/4 left-1/4 size-80 rounded-full blur-3xl pointer-events-none -z-10 transition-colors ${isDark ? "bg-indigo-500/5" : "bg-indigo-500/[0.03]"}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 size-80 rounded-full blur-3xl pointer-events-none -z-10 transition-colors ${isDark ? "bg-purple-500/5" : "bg-purple-500/[0.03]"}`}></div>

        {/* ─── CENTRAL PORTFOLIO BANNER ────────────────────────────────────────── */}
        <div className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${
          isDark 
            ? "glass-panel border-white/5 bg-[#0b1021]" 
            : "bg-white border-slate-200 shadow-lg shadow-slate-100"
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-spin-slow"></div>
              <div className={`relative size-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl border shrink-0 transition-all ${
                isDark 
                  ? "bg-[#0c1328] text-white border-white/10" 
                  : "bg-gradient-to-tr from-indigo-500 to-violet-600 text-white border-indigo-400/30 shadow-lg shadow-indigo-500/20"
              }`}>
                <Wallet className="size-8 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                  Quản Lý Tài Sản Web3
                </h1>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                  isDark ? "bg-indigo-500/10 border-indigo-500/20 text-cyan-400" : "bg-indigo-50 border-indigo-200 text-indigo-700"
                }`}>
                  <Layers className="size-3" /> PORTFOLIO HUB
                </span>
              </div>
              <p className={`text-sm mt-1.5 font-medium ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                Quản lý số dư Ví game tích lũy, các ví Web3 on-chain kết nối và xem lịch sử giao dịch đúc token.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 relative z-10 shrink-0">
            <button
              onClick={loadData}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
                isDark 
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" 
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              <RefreshCw className={`size-3.5 ${isLoadingQuests ? "animate-spin text-indigo-500" : "text-slate-500 dark:text-gray-400"}`} />
              <span>Làm mới số dư</span>
            </button>
          </div>
        </div>

        {/* ─── DUAL WALLET MANAGEMENT GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMN 1: VÍ TÍCH LŨY GAME (OFF-CHAIN) */}
          <div className="lg:col-span-6 space-y-8">
            <Card className={`overflow-hidden border transition-all duration-300 relative ${
              isDark 
                ? "glass-panel border-white/5 bg-[#0a0f1d]/60 shadow-xl" 
                : "bg-white border-slate-200/90 shadow-lg shadow-slate-100/70"
            }`}>
              <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
                isDark ? "bg-amber-500/5" : "bg-amber-500/10"
              }`}></div>
              
              <CardHeader className={`border-b py-4.5 px-6 ${
                isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-amber-500/[0.03]"
              }`}>
                <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center justify-between ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  <span className="flex items-center gap-2">
                    <Award className="size-4.5 text-amber-500 dark:text-amber-400" />
                    Ví Game Tích Lũy (Off-chain)
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    isDark 
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    Không tốn gas khi nhận
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6 pb-6 px-6 flex flex-col justify-between min-h-[220px]">
                <div className="text-center md:text-left md:flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <span className={`text-xs font-bold uppercase tracking-wider block ${
                      isDark ? "text-gray-400" : "text-slate-500"
                    }`}>
                      Tổng số dư tích lũy khả dụng
                    </span>
                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                      <span className="text-5xl font-black text-amber-600 dark:text-amber-400 font-display tracking-tight leading-none">
                        {inGameBalance.toFixed(2)}
                      </span>
                      <span className="text-base font-extrabold text-amber-700 dark:text-amber-300 uppercase">CTK</span>
                    </div>
                    <p className={`text-xs pt-1.5 leading-relaxed max-w-md ${
                      isDark ? "text-gray-400" : "text-slate-600"
                    }`}>
                      Số dư này được ghi nhận ngay lập tức khi hoàn thành các nhiệm vụ. Bạn có thể cộng dồn không giới hạn và rút tất cả trong một lần duy nhất.
                    </p>
                  </div>
                  
                  <div className="mt-6 md:mt-0 shrink-0">
                    <button
                      onClick={handleWithdraw}
                      disabled={inGameBalance <= 0 || isWithdrawing}
                      className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black rounded-2xl shadow-lg shadow-orange-500/25 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isWithdrawing ? (
                        <>
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Đang xử lý rút...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">call_made</span>
                          Rút về ví Web3
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Display breakdown of pending withdrawals */}
                <div className={`mt-8 pt-6 border-t space-y-3 ${
                  isDark ? "border-white/5" : "border-slate-100"
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest block ${
                    isDark ? "text-gray-400" : "text-slate-500"
                  }`}>
                    Nhiệm vụ đang chờ rút ({quests.filter(q => q.status === "claimed" && !q.txHash).length})
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {quests.filter(q => q.status === "claimed" && !q.txHash).map((q) => (
                      <div key={q.id} className={`p-2.5 rounded-xl border text-center transition-all ${
                        isDark 
                          ? "bg-white/5 border-white/5 text-gray-200" 
                          : "bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-800"
                      }`}>
                        <span className={`block text-[11px] font-bold truncate ${
                          isDark ? "text-gray-200" : "text-slate-800"
                        }`}>{q.title}</span>
                        <span className="block font-mono text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
                          +{q.rewardAmount} CTK
                        </span>
                      </div>
                    ))}
                    {quests.filter(q => q.status === "claimed" && !q.txHash).length === 0 && (
                      <div className={`col-span-4 py-3 text-center text-xs italic ${
                        isDark ? "text-gray-500" : "text-slate-500"
                      }`}>
                        Không có nhiệm vụ nào chờ rút. Hãy làm nhiệm vụ mới để tích lũy!
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COLUMN 2: VÍ WEB3 THỰC TẾ (ON-CHAIN PORTFOLIO) */}
          <div className="lg:col-span-6 space-y-8">
            <Card className={`overflow-hidden border transition-all duration-300 relative ${
              isDark 
                ? "glass-panel border-white/5 bg-[#0a0f1d]/60 shadow-xl" 
                : "bg-white border-slate-200/90 shadow-lg shadow-slate-100/70"
            }`}>
              <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
                isDark ? "bg-indigo-500/5" : "bg-indigo-500/10"
              }`}></div>

              <CardHeader className={`border-b py-4.5 px-6 ${
                isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-indigo-500/[0.03]"
              }`}>
                <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center justify-between ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  <span className="flex items-center gap-2">
                    <Wallet className="size-4.5 text-indigo-500 dark:text-indigo-400" />
                    Ví Web3 Thực Tế (On-chain)
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    wallet.isConnected && wallet.address 
                      ? (isDark 
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                          : "text-emerald-700 bg-emerald-50 border-emerald-200") 
                      : (isDark 
                          ? "text-rose-400 bg-rose-500/10 border-rose-500/20" 
                          : "text-rose-700 bg-rose-50 border-rose-200")
                  }`}>
                    {wallet.isConnected && wallet.address ? getNetworkName(wallet.chain) : "Chưa kết nối"}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 pb-6 px-6 min-h-[220px]">
                {!wallet.isConnected ? (
                  <div className="text-center py-10">
                    <div className={`size-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                      isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    }`}>
                      <Wallet className="size-7" />
                    </div>
                    <h4 className={`font-bold text-base mb-1.5 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>Chưa kết nối ví Web3</h4>
                    <p className={`text-xs mb-5 max-w-[280px] mx-auto leading-relaxed ${
                      isDark ? "text-gray-400" : "text-slate-600"
                    }`}>
                      Hãy kết nối ví MetaMask hoặc Trust Wallet của bạn để xem số dư on-chain và rút phần thưởng.
                    </p>
                    <button
                      onClick={() => wallet.connect()}
                      className="px-6 py-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Kết Nối Ví Ngay
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Real-time balances list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Native Asset */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        isDark 
                          ? "bg-white/5 border-white/5" 
                          : "bg-slate-50/80 border-slate-200/80 shadow-xs"
                      }`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                          isDark ? "text-gray-400" : "text-slate-500"
                        }`}>
                          Coin Mặc Định Mạng
                        </span>
                        <div className="flex justify-between items-baseline mt-1.5">
                          <span className={`font-mono text-2xl font-black ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}>
                            {parseFloat(wallet.nativeBalance).toFixed(4)}
                          </span>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {wallet.chain === 97 ? "tBNB" : "ETH"}
                          </span>
                        </div>
                      </div>

                      {/* On-Chain CTK Token */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        isDark 
                          ? "bg-indigo-500/10 border-indigo-500/20" 
                          : "bg-indigo-50/70 border-indigo-200/70 shadow-xs"
                      }`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                          isDark ? "text-indigo-300" : "text-indigo-800"
                        }`}>
                          CryptoTracker Token (CTK)
                        </span>
                        <div className="flex justify-between items-baseline mt-1.5">
                          <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {parseFloat(ctkBalance).toFixed(4)}
                          </span>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">CTK</span>
                        </div>
                      </div>

                    </div>

                    {/* MetaMask Import Button */}
                    <button
                      onClick={addCtkToWallet}
                      className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl border border-dashed transition-all duration-300 cursor-pointer ${
                        isDark
                          ? "border-indigo-500/30 hover:border-indigo-400 text-indigo-400 hover:bg-indigo-500/10"
                          : "border-indigo-300 hover:border-indigo-500 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/60 shadow-xs"
                      }`}
                    >
                      <PlusCircle className="size-4" />
                      Nhập Token CTK vào ví MetaMask của bạn
                    </button>

                    {/* Moralis Assets Portfolio Toggles */}
                    <div className="space-y-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest block ${
                        isDark ? "text-gray-400" : "text-slate-500"
                      }`}>
                        Các tài sản ERC-20 khác (Moralis Query)
                      </span>
                      <div className="max-h-[110px] overflow-y-auto pr-1 space-y-2">
                        {wallet.tokens.filter(t => t.symbol !== "CTK").map((t) => (
                          <div key={t.symbol} className={`flex justify-between items-center text-xs p-2.5 rounded-xl border transition-all ${
                            isDark 
                              ? "bg-white/5 border-white/5 text-gray-200" 
                              : "bg-slate-50 hover:bg-slate-100/60 border-slate-200/80 text-slate-800"
                          }`}>
                            <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{t.name} ({t.symbol})</span>
                            <span className={`font-mono font-bold ${isDark ? "text-gray-200" : "text-slate-800"}`}>{parseFloat(t.balance).toFixed(4)}</span>
                          </div>
                        ))}
                        {wallet.tokens.filter(t => t.symbol !== "CTK").length === 0 && (
                          <span className={`text-[11px] italic block py-2 ${
                            isDark ? "text-gray-500" : "text-slate-500"
                          }`}>Không có token ERC-20 khác trong ví.</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>

        {/* ─── SECTION 3: TRANSACTION HISTORY ────────────────────────────────── */}
        <Card className={`overflow-hidden border transition-all duration-300 ${
          isDark 
            ? "glass-panel border-white/5 bg-[#0a0f1d]/60 shadow-xl" 
            : "bg-white border-slate-200/90 shadow-lg shadow-slate-100/70"
        }`}>
          <CardHeader className={`border-b py-4.5 px-6 ${
            isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50/70"
          }`}>
            <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center justify-between ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <span className="flex items-center gap-2">
                <History className="size-4.5 text-indigo-500 dark:text-indigo-400" />
                Lịch Sử Giao Dịch Rút Về Ví Web3 ({withdrawnHistory.length})
              </span>
              {withdrawnHistory.length > 0 && (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isDark 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  On-chain Verified
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {withdrawnHistory.length === 0 ? (
              <div className="text-center py-12 px-4">
                <ArrowDownCircle className={`size-12 mx-auto mb-3 ${
                  isDark ? "text-gray-600" : "text-slate-300"
                }`} />
                <h5 className={`font-bold text-sm mb-1 ${
                  isDark ? "text-gray-300" : "text-slate-800"
                }`}>Chưa có giao dịch rút on-chain nào</h5>
                <span className={`text-xs max-w-sm mx-auto block ${
                  isDark ? "text-gray-500" : "text-slate-500"
                }`}>Hãy hoàn thành nhiệm vụ để tích lũy token CTK và rút trực tiếp về ví Web3 của bạn!</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className={`border-b text-xs font-bold uppercase tracking-wider ${
                      isDark 
                        ? "border-white/5 bg-white/[0.02] text-gray-400" 
                        : "border-slate-200 bg-slate-50/80 text-slate-700"
                    }`}>
                      <th className="py-3.5 px-6">Tên Nhiệm Vụ</th>
                      <th className="py-3.5 px-6">Phần Thưởng</th>
                      <th className="py-3.5 px-6">Thời Gian Nhận</th>
                      <th className="py-3.5 px-6">Ví Nhận Thưởng</th>
                      <th className="py-3.5 px-6 text-right">Mã Giao Dịch (TxHash)</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    isDark ? "divide-white/5" : "divide-slate-100"
                  }`}>
                    {withdrawnHistory.map((progress) => (
                      <tr key={progress.id} className={`transition-colors ${
                        isDark 
                          ? "hover:bg-white/[0.02] text-gray-200" 
                          : "hover:bg-slate-50/80 text-slate-800"
                      }`}>
                        {/* 1. Tên Nhiệm vụ: Đảm bảo luôn đậm và tương phản rõ ràng */}
                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                          {progress.title}
                        </td>

                        {/* 2. Phần thưởng */}
                        <td className="py-4 px-6">
                          <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                            +{progress.rewardAmount} CTK
                          </span>
                        </td>

                        {/* 3. Thời gian */}
                        <td className="py-4 px-6 text-xs text-slate-600 dark:text-gray-400 font-medium">
                          {progress.claimedAt ? new Date(progress.claimedAt).toLocaleString("vi-VN") : "Chưa xác định"}
                        </td>

                        {/* 4. Địa chỉ ví */}
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-200 dark:border-white/5">
                            {progress.userWalletAddress ? `${progress.userWalletAddress.slice(0, 6)}...${progress.userWalletAddress.slice(-4)}` : "-"}
                          </span>
                        </td>

                        {/* 5. TxHash */}
                        <td className="py-4 px-6 text-right">
                          {progress.txHash ? (
                            <a
                              href={
                                wallet.chain === 31337 
                                  ? `http://127.0.0.1:8545` 
                                  : wallet.chain === 97 
                                    ? `https://testnet.bscscan.com/tx/${progress.txHash}` 
                                    : `https://sepolia.etherscan.io/tx/${progress.txHash}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors"
                            >
                              <span className="font-mono">{`${progress.txHash.slice(0, 8)}...${progress.txHash.slice(-6)}`}</span>
                              <ExternalLink className="size-3.5" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20">
                              Chờ đúc
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
