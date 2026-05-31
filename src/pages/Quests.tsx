import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useWallet } from "@/providers/WalletProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  fetchUserQuests,
  triggerDailyCheckin,
  claimQuestReward,
  withdrawAccumulatedRewards,
  fetchTokenInfo,
  fetchTokenBalance,
  QuestProgress,
  TokenInfo,
} from "@/services/api";

const Quests: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const wallet = useWallet();

  const [quests, setQuests] = useState<QuestProgress[]>([]);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [ctkBalance, setCtkBalance] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Dynamically calculate Accumulated In-Game Wallet Balance (claimed but no txHash)
  const inGameBalance = quests
    .filter((q) => q.status === "claimed" && !q.txHash)
    .reduce((sum, q) => sum + q.rewardAmount, 0);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // 1. Fetch User Quests Progress
      const questData = await fetchUserQuests(token);
      setQuests(questData);

      // 2. Fetch Token Info
      const info = await fetchTokenInfo();
      setTokenInfo(info);

      // 3. Fetch Token Balance
      if (wallet.isConnected && wallet.address) {
        const bal = await fetchTokenBalance(wallet.address);
        setCtkBalance(bal);
      } else {
        setCtkBalance("0.00");
      }
    } catch (err: any) {
      console.error("Failed to load quest details:", err);
      toast.error("Không thể tải thông tin nhiệm vụ.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reload data when token, wallet connection state or address changes
  useEffect(() => {
    if (isAuthenticated && token) {
      loadData();
    }
  }, [isAuthenticated, token, wallet.isConnected, wallet.address, wallet.chain]);

  // watch asset in MetaMask
  const addToMetaMask = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      toast.error("Vui lòng cài đặt ví MetaMask.");
      return;
    }
    if (!tokenInfo?.contractAddress) {
      toast.error("Không tìm thấy địa chỉ hợp đồng thông minh.");
      return;
    }

    try {
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenInfo.contractAddress,
            symbol: "CTK",
            decimals: 18,
            image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
          },
        },
      });
      toast.success("Đã gửi yêu cầu thêm token CTK vào ví của bạn!");
    } catch (error: any) {
      console.error("Error adding CTK to MetaMask:", error);
      toast.error(error.message || "Không thể thêm token vào ví.");
    }
  };

  // Switch chain in MetaMask
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

  // Check-in trigger
  const handleCheckin = async () => {
    setIsCheckingIn(true);
    try {
      const res = await triggerDailyCheckin(token!);
      if (res.success) {
        toast.success("Điểm danh hàng ngày thành công!", {
          description: "Nhiệm vụ 'Điểm danh hàng ngày' đã sẵn sàng để nhận thưởng!",
        });
        await loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Điểm danh thất bại. Hãy thử lại!");
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Claim quest reward off-chain into the accumulated In-Game Wallet (Zero gas fees!)
  const handleClaim = async (questKey: string) => {
    setIsClaiming(questKey);
    try {
      const res = await claimQuestReward(token!, questKey, wallet.address || "0x0000000000000000000000000000000000000000");
      if (res.success) {
        toast.success(`Đã nhận ${quests.find(q => q.key === questKey)?.rewardAmount} CTK vào Ví Game tích lũy!`, {
          description: `Hãy tiếp tục tích lũy thêm hoặc bấm 'Rút' để đưa toàn bộ CTK lên blockchain!`,
          duration: 5000,
        });
        await loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Nhận phần thưởng thất bại. Vui lòng thử lại!");
    } finally {
      setIsClaiming(null);
    }
  };

  // Batch-withdraw accumulated in-game rewards on-chain
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

  // Render checkin button or claimed icon depending on status
  const renderQuestActionButton = (quest: QuestProgress) => {
    if (quest.status === "claimed") {
      if (quest.txHash) {
        return (
          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Đã rút về ví Web3
            </span>
            <a
              href={wallet.chain === 97 ? `https://testnet.bscscan.com/tx/${quest.txHash}` : `https://sepolia.etherscan.io/tx/${quest.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Xem giao dịch
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            </a>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <span className="material-symbols-outlined text-[16px]">sports_esports</span>
              Ví Game Tích Lũy
            </span>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">Chờ rút lên on-chain</span>
          </div>
        );
      }
    }

    if (quest.status === "completed") {
      const isThisClaiming = isClaiming === quest.key;
      return (
        <button
          onClick={() => handleClaim(quest.key)}
          disabled={!!isClaiming}
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
        >
          {isThisClaiming ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Đang đúc...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">redeem</span>
              Nhận Thưởng
            </>
          )}
        </button>
      );
    }

    // Quest is pending
    if (quest.key === "daily_login") {
      return (
        <button
          onClick={handleCheckin}
          disabled={isCheckingIn}
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
        >
          {isCheckingIn ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Đang gửi...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Điểm Danh
            </>
          )}
        </button>
      );
    }

    // Other one-time quests that are pending
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-gray-400">
        <span className="material-symbols-outlined text-[16px]">hourglass_empty</span>
        Chưa hoàn thành
      </span>
    );
  };

  const getQuestIcon = (key: string) => {
    switch (key) {
      case "daily_login":
        return "calendar_month";
      case "wallet_connect":
        return "account_balance_wallet";
      case "first_swap":
        return "sync_alt";
      case "referral":
        return "group_add";
      default:
        return "task_alt";
    }
  };

  if (!isAuthenticated) {
    return (
      <DashboardLayout hideSidebar={true}>
        <div className="glass-panel max-w-md mx-auto my-16 p-8 text-center rounded-2xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>
          <h2 className="text-2xl font-bold font-display mb-3 text-slate-900 dark:text-white">Yêu cầu Đăng nhập</h2>
          <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            Vui lòng đăng nhập vào tài khoản của bạn để tham gia hệ thống làm nhiệm vụ nhận token CTK được đúc trực tiếp về ví blockchain MetaMask của bạn.
          </p>
          <a
            href="/login"
            className="inline-flex w-full justify-center px-6 py-3 bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300"
          >
            Đăng nhập ngay
          </a>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout hideSidebar={true}>
      <div className="w-full max-w-[1100px] mx-auto pb-12">
        {/* Banner Section */}
        <div className="relative rounded-2xl overflow-hidden glass-panel border border-indigo-500/20 p-8 md:p-12 mb-8 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 uppercase tracking-wider mb-4">
              🎉 NHIỆM VỤ & QUÀ TẶNG BLOCKCHAIN
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display text-white mb-4 tracking-tight leading-tight">
              Làm nhiệm vụ, <br />
              Nhận <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">CryptoTracker Token</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-0 leading-relaxed">
              Chào mừng bạn đến với chương trình khách hàng thân thiết Web3! Hoàn thành các thử thách hàng ngày và một lần dưới đây để nhận mã thông báo <strong className="text-indigo-400">CTK</strong> miễn phí được đúc trực tiếp vào ví blockchain của bạn.
            </p>
          </div>
        </div>

        {/* Wallet Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Connection Status */}
          <div className="md:col-span-2 glass-panel border border-indigo-500/10 rounded-2xl p-6 flex flex-col justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Ví Blockchain Kết Nối</h3>
                {wallet.isConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-base font-bold text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                      {wallet.address}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-sm text-slate-600 dark:text-gray-400 font-semibold">Chưa kết nối ví blockchain</span>
                  </div>
                )}
              </div>
              <div>
                {wallet.isConnected ? (
                  <button
                    onClick={wallet.disconnect}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300"
                  >
                    Ngắt kết nối
                  </button>
                ) : (
                  <button
                    onClick={wallet.connect}
                    className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                    Kết nối MetaMask
                  </button>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-[18px] text-indigo-500">link</span>
                <span>Mạng hiện tại:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {wallet.isConnected ? (
                    wallet.chain === 11155111 
                      ? "Sepolia Testnet" 
                      : wallet.chain === 97 
                        ? "BSC Testnet" 
                        : wallet.chain === 31337
                          ? "Hardhat Localhost"
                          : "Mạng không hỗ trợ"
                  ) : "Chưa xác định"}
                </span>
              </div>
              {wallet.isConnected && wallet.chain !== 11155111 && wallet.chain !== 97 && wallet.chain !== 31337 && (
                <button
                  onClick={() => switchToNetwork(31337)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-500/15 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300"
                >
                  Chuyển sang Localhost
                </button>
              )}
            </div>
          </div>

          {/* Token Balance Card */}
          <div className="glass-panel border border-indigo-500/10 rounded-2xl p-6 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-indigo-900/40 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <span className="material-symbols-outlined text-[56px] text-indigo-500">payments</span>
            </div>
            
            <div className="space-y-4">
              {/* Ví Game Tích Lũy */}
              <div className="border-b border-white/5 pb-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-400 uppercase tracking-widest mb-1.5">
                  <span className="material-symbols-outlined text-[10px]">sports_esports</span>
                  Ví Game Tích Lũy (Off-chain)
                </span>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white font-display tracking-tight">
                      {inGameBalance.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-amber-400">CTK</span>
                  </div>
                  
                  <button
                    onClick={handleWithdraw}
                    disabled={inGameBalance <= 0 || isWithdrawing}
                    className="px-4 py-2.5 text-xs font-black rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/10 flex items-center gap-1 cursor-pointer"
                  >
                    {isWithdrawing ? (
                      <>
                        <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                        Đang rút...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px]">call_made</span>
                        Rút về ví Web3
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ví Web3 Thực Tế */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black bg-indigo-500/20 text-indigo-400 uppercase tracking-widest mb-1.5">
                  <span className="material-symbols-outlined text-[10px]">account_balance_wallet</span>
                  Ví Web3 Thực Tế (On-chain)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-display tracking-tight">
                    {parseFloat(ctkBalance).toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-indigo-400">CTK</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <button
                onClick={addToMetaMask}
                disabled={!wallet.isConnected}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold rounded-xl border border-white/10 hover:border-indigo-500/50 text-slate-300 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">add_circle</span>
                Thêm CTK vào MetaMask
              </button>
            </div>
          </div>
        </div>

        {/* Quest List Section */}
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-indigo-500">checklist</span>
          Danh Sách Nhiệm Vụ Hoạt Động
        </h2>

        {isLoading ? (
          <div className="glass-panel border border-indigo-500/10 rounded-2xl p-16 text-center">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></span>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Đang tải bảng nhiệm vụ của bạn...</p>
          </div>
        ) : quests.length === 0 ? (
          <div className="glass-panel border border-indigo-500/10 rounded-2xl p-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">assignment_late</span>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Không có nhiệm vụ nào khả dụng vào lúc này.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className="glass-panel border border-indigo-500/10 rounded-2xl p-5 md:p-6 bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-inner">
                    <span className="material-symbols-outlined text-[26px]">
                      {getQuestIcon(quest.key)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg mb-1 flex items-center gap-2">
                      {quest.title}
                      {quest.key === "daily_login" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                          Mỗi Ngày
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Phần Thưởng</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-display">
                      +{quest.rewardAmount} CTK
                    </span>
                  </div>

                  <div className="w-auto">
                    {renderQuestActionButton(quest)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Token Details Info Box */}
        {tokenInfo && (
          <div className="glass-panel border border-indigo-500/10 rounded-2xl p-6 mt-12 bg-indigo-950/20 dark:bg-slate-900/60 backdrop-blur-md">
            <h3 className="text-base font-bold text-indigo-500 dark:text-indigo-400 font-display mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">info</span>
              Thông Tin Token Hợp Đồng Thông Minh CTK
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-slate-600 dark:text-gray-400 block mb-1">Tên & Ký Hiệu:</span>
                <strong className="text-slate-800 dark:text-white text-base">
                  {tokenInfo.name} ({tokenInfo.symbol})
                </strong>
              </div>
              <div>
                <span className="text-slate-600 dark:text-gray-400 block mb-1">Địa Chỉ Hợp Đồng:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-slate-800 dark:text-white truncate max-w-[160px] inline-block">
                    {tokenInfo.contractAddress}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tokenInfo.contractAddress);
                      toast.success("Đã sao chép địa chỉ hợp đồng!");
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                  <a
                    href={
                      wallet.chain === 31337
                        ? `http://127.0.0.1:8545`
                        : wallet.chain === 97
                          ? `https://testnet.bscscan.com/address/${tokenInfo.contractAddress}`
                          : `https://sepolia.etherscan.io/address/${tokenInfo.contractAddress}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              </div>
              <div>
                <span className="text-slate-600 dark:text-gray-400 block mb-1">Chế Độ Hoạt Động:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  tokenInfo.isSimulation 
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                    : "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                }`}>
                  {tokenInfo.isSimulation ? "Mô Phỏng Sandbox" : "On-chain Live Sepolia"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Quests;
