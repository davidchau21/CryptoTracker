import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useWallet } from "@/providers/WalletProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  fetchUserQuests,
  triggerDailyCheckin,
  claimQuestReward,
  withdrawAccumulatedRewards,
  linkUserWallet,
  completeQuestByKey,
  fetchTokenInfo,
  fetchTokenBalance,
  QuestProgress,
  TokenInfo,
} from "@/services/api";

const Quests: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const wallet = useWallet();
  const navigate = useNavigate();

  const [quests, setQuests] = useState<QuestProgress[]>([]);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [ctkBalance, setCtkBalance] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isLinkingWallet, setIsLinkingWallet] = useState(false);

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
  }, [
    isAuthenticated,
    token,
    wallet.isConnected,
    wallet.address,
    wallet.chain,
  ]);

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

  // Switch chain using unified WalletProvider helper
  const switchToNetwork = async (targetChainId: number) => {
    await wallet.switchNetwork(targetChainId);
  };

  // Link Web3 wallet and complete wallet_connect quest
  const handleLinkWallet = async () => {
    if (!wallet.isConnected || !wallet.address) {
      wallet.connect();
      return;
    }
    setIsLinkingWallet(true);
    try {
      const res = await linkUserWallet(token!, wallet.address);
      if (res.success) {
        toast.success("Liên kết ví thành công!", {
          description:
            "Nhiệm vụ 'Liên kết ví MetaMask' đã hoàn thành! Nhận ngay 50 CTK thưởng.",
        });
        await loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể liên kết ví.");
    } finally {
      setIsLinkingWallet(false);
    }
  };

  // Copy referral link
  const handleShareReferral = () => {
    const refCode = wallet.address
      ? wallet.address.slice(2, 8).toUpperCase()
      : "CTK888";
    const refUrl = `${window.location.origin}/register?ref=${refCode}`;
    navigator.clipboard.writeText(refUrl);
    toast.success("Đã sao chép link giới thiệu vào bộ nhớ tạm!", {
      description: `Mã mời: ${refCode}. Nhận 100 CTK khi bạn bè tham gia và liên kết ví.`,
    });
  };

  // Check-in trigger
  const handleCheckin = async () => {
    setIsCheckingIn(true);
    try {
      const res = await triggerDailyCheckin(token!);
      if (res.success) {
        toast.success("Điểm danh hàng ngày thành công!", {
          description:
            "Nhiệm vụ 'Điểm danh hàng ngày' đã sẵn sàng để nhận thưởng!",
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
      const res = await claimQuestReward(
        token!,
        questKey,
        wallet.address || "0x0000000000000000000000000000000000000000",
      );
      if (res.success) {
        toast.success(
          `Đã nhận ${quests.find((q) => q.key === questKey)?.rewardAmount} CTK vào Ví Game tích lũy!`,
          {
            description: `Hãy tiếp tục tích lũy thêm hoặc bấm 'Rút' để đưa toàn bộ CTK lên blockchain!`,
            duration: 5000,
          },
        );
        await loadData();
      }
    } catch (err: any) {
      toast.error(
        err.message || "Nhận phần thưởng thất bại. Vui lòng thử lại!",
      );
    } finally {
      setIsClaiming(null);
    }
  };

  // Batch-withdraw accumulated in-game rewards on-chain
  const handleWithdraw = async () => {
    if (!wallet.isConnected || !wallet.address) {
      toast.error(
        "Vui lòng kết nối ví MetaMask/Trust Wallet trước khi thực hiện rút tiền.",
      );
      return;
    }

    if (
      wallet.chain !== 11155111 &&
      wallet.chain !== 97 &&
      wallet.chain !== 31337
    ) {
      toast.error(
        "Mạng không hợp lệ. Vui lòng chuyển sang mạng Hardhat Localhost, BSC Testnet hoặc Sepolia để thực hiện rút tiền.",
        {
          action: {
            label: "Chuyển Mạng",
            onClick: () => switchToNetwork(31337),
          },
        },
      );
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
            label:
              wallet.chain === 31337
                ? "Xem giao dịch local"
                : wallet.chain === 97
                  ? "Xem trên BscScan"
                  : "Xem trên Etherscan",
            onClick: () =>
              window.open(
                wallet.chain === 31337
                  ? `http://127.0.0.1:8545`
                  : wallet.chain === 97
                    ? `https://testnet.bscscan.com/tx/${res.txHash}`
                    : `https://sepolia.etherscan.io/tx/${res.txHash}`,
                "_blank",
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              <span className="material-symbols-outlined text-[16px]">
                verified
              </span>
              Đã rút về ví Web3
            </span>
            <a
              href={
                wallet.chain === 97
                  ? `https://testnet.bscscan.com/tx/${quest.txHash}`
                  : `https://sepolia.etherscan.io/tx/${quest.txHash}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
            >
              Xem giao dịch
              <span className="material-symbols-outlined text-[12px]">
                open_in_new
              </span>
            </a>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
              <span className="material-symbols-outlined text-[16px]">
                sports_esports
              </span>
              Ví Game Tích Lũy
            </span>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">
              Chờ rút lên on-chain
            </span>
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
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
        >
          {isThisClaiming ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Đang đúc...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">
                redeem
              </span>
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
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
        >
          {isCheckingIn ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Đang gửi...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">
                calendar_today
              </span>
              Điểm Danh
            </>
          )}
        </button>
      );
    }

    if (quest.key === "wallet_connect") {
      return (
        <button
          onClick={handleLinkWallet}
          disabled={isLinkingWallet}
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
        >
          {isLinkingWallet ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Đang liên kết...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">
                link
              </span>
              {wallet.isConnected ? "Xác Nhận Ví" : "Kết Nối Ví"}
            </>
          )}
        </button>
      );
    }

    if (quest.key === "first_swap") {
      return (
        <button
          onClick={() => navigate("/swap")}
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            swap_horiz
          </span>
          Đến Trang Swap
        </button>
      );
    }

    if (quest.key === "first_stake") {
      return (
        <button
          onClick={() => navigate("/staking")}
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            savings
          </span>
          Đến Staking Vault
        </button>
      );
    }

    if (quest.key === "referral") {
      return (
        <button
          onClick={handleShareReferral}
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          Sao Chép Link Mời
        </button>
      );
    }

    // Other one-time quests that are pending
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-gray-400 dark:border-transparent">
        <span className="material-symbols-outlined text-[16px]">
          hourglass_empty
        </span>
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
      case "first_stake":
        return "savings";
      case "referral":
        return "group_add";
      default:
        return "task_alt";
    }
  };

  if (!isAuthenticated) {
    return (
      <DashboardLayout hideSidebar={true}>
        <div className="max-w-md mx-auto my-16 p-8 text-center rounded-3xl border shadow-xl relative overflow-hidden bg-white border-slate-200 shadow-slate-100 dark:glass-panel dark:border-indigo-500/20 dark:bg-slate-900/60">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>
          <h2 className="text-2xl font-bold font-display mb-3 text-slate-900 dark:text-white">
            Yêu cầu Đăng nhập
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            Vui lòng đăng nhập vào tài khoản của bạn để tham gia hệ thống làm
            nhiệm vụ nhận token CTK được đúc trực tiếp về ví blockchain MetaMask
            của bạn.
          </p>
          <a
            href="/login"
            className="inline-flex w-full justify-center px-6 py-3.5 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 cursor-pointer"
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
        <div className="relative rounded-3xl overflow-hidden border p-8 md:p-12 mb-8 transition-all duration-300 bg-gradient-to-br from-indigo-50 via-purple-50/40 to-white border-slate-200 shadow-lg shadow-slate-100/70 dark:glass-panel dark:border-indigo-500/20 dark:bg-gradient-to-br dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/50">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400">
              🎉 NHIỆM VỤ & QUÀ TẶNG BLOCKCHAIN
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
              Làm nhiệm vụ, <br />
              Nhận{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                CryptoTracker Token
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg mb-0 leading-relaxed font-normal">
              Chào mừng bạn đến với chương trình khách hàng thân thiết Web3!
              Hoàn thành các thử thách hàng ngày và một lần dưới đây để nhận mã
              thông báo{" "}
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                CTK
              </strong>{" "}
              miễn phí được đúc trực tiếp vào ví blockchain của bạn.
            </p>
          </div>
        </div>

        {/* Wallet Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Connection Status */}
          <div className="md:col-span-2 rounded-2xl p-6 flex flex-col justify-between border transition-all duration-300 bg-white border-slate-200 shadow-md dark:glass-panel dark:border-indigo-500/10 dark:bg-slate-900/40 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                  Ví Blockchain Kết Nối
                </h3>
                {wallet.isConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-base font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                      {wallet.address}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-sm text-slate-600 dark:text-gray-400 font-semibold">
                      Chưa kết nối ví blockchain
                    </span>
                  </div>
                )}
              </div>
              <div>
                {wallet.isConnected ? (
                  <button
                    onClick={wallet.disconnect}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500 dark:text-rose-400 dark:hover:text-white dark:border-transparent transition-all duration-300 cursor-pointer"
                  >
                    Ngắt kết nối
                  </button>
                ) : (
                  <button
                    onClick={wallet.connect}
                    className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      account_balance_wallet
                    </span>
                    Kết nối MetaMask
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">
                  link
                </span>
                <span>Mạng hiện tại:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {wallet.isConnected
                    ? wallet.chain === 11155111
                      ? "Sepolia Testnet"
                      : wallet.chain === 97
                        ? "BSC Testnet"
                        : wallet.chain === 31337
                          ? "Hardhat Localhost"
                          : "Mạng không hỗ trợ"
                    : "Chưa xác định"}
                </span>
              </div>
              {wallet.isConnected &&
                wallet.chain !== 11155111 &&
                wallet.chain !== 97 &&
                wallet.chain !== 31337 && (
                  <button
                    onClick={() => switchToNetwork(31337)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white dark:border-transparent transition-all duration-300 cursor-pointer"
                  >
                    Chuyển sang Localhost
                  </button>
                )}
            </div>
          </div>

          {/* Token Balance Card */}
          <div className="rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group bg-white border-slate-200 shadow-md dark:glass-panel dark:border-indigo-500/20 dark:bg-gradient-to-br dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-indigo-900/40">
            <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-[64px] text-indigo-600 dark:text-indigo-400">
                payments
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              {/* Ví Game Tích Lũy */}
              <div className="border-b border-slate-100 dark:border-white/5 pb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-1.5">
                  <span className="material-symbols-outlined text-[10px]">
                    sports_esports
                  </span>
                  Ví Game Tích Lũy (Off-chain)
                </span>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-amber-600 dark:text-white font-display tracking-tight">
                      {inGameBalance.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                      CTK
                    </span>
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
                        <span className="material-symbols-outlined text-[14px]">
                          call_made
                        </span>
                        Rút về ví Web3
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ví Web3 Thực Tế */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-widest mb-1.5">
                  <span className="material-symbols-outlined text-[10px]">
                    account_balance_wallet
                  </span>
                  Ví Web3 Thực Tế (On-chain)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                    {parseFloat(ctkBalance).toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    CTK
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 relative z-10">
              <button
                onClick={addToMetaMask}
                disabled={!wallet.isConnected}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-xl border border-dashed border-indigo-300 dark:border-white/10 hover:border-indigo-500 text-indigo-700 dark:text-slate-300 dark:hover:text-white bg-indigo-50/50 dark:bg-transparent hover:bg-indigo-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  add_circle
                </span>
                Thêm CTK vào MetaMask
              </button>
            </div>
          </div>
        </div>

        {/* Quest List Section */}
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-indigo-600 dark:text-indigo-400">
            checklist
          </span>
          Danh Sách Nhiệm Vụ Hoạt Động
        </h2>

        {isLoading ? (
          <div className="rounded-2xl p-16 text-center border bg-white border-slate-200 shadow-sm dark:glass-panel dark:border-indigo-500/10 dark:bg-slate-900/50">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></span>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Đang tải bảng nhiệm vụ của bạn...
            </p>
          </div>
        ) : quests.length === 0 ? (
          <div className="rounded-2xl p-16 text-center border bg-white border-slate-200 shadow-sm dark:glass-panel dark:border-indigo-500/10 dark:bg-slate-900/50">
            <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-gray-600 mb-2">
              assignment_late
            </span>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Không có nhiệm vụ nào khả dụng vào lúc này.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className="rounded-2xl p-5 md:p-6 border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-200/80 dark:bg-slate-900/50 dark:border-white/5 dark:hover:border-indigo-500/30"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border bg-indigo-50 border-indigo-100 text-indigo-600 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-transparent">
                    <span className="material-symbols-outlined text-[26px]">
                      {getQuestIcon(quest.key)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg mb-1 flex items-center gap-2">
                      {quest.title}
                      {quest.key === "daily_login" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-transparent">
                          Mỗi Ngày
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/50">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-0.5">
                      Phần Thưởng
                    </span>
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-display">
                      +{quest.rewardAmount} CTK
                    </span>
                  </div>

                  <div className="w-auto shrink-0">
                    {renderQuestActionButton(quest)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Token Details Info Box */}
        {tokenInfo && (
          <div className="rounded-2xl p-6 mt-12 border transition-all duration-300 bg-indigo-50/70 border-indigo-200/80 shadow-xs dark:glass-panel dark:border-indigo-500/20 dark:bg-slate-900/60">
            <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-400 font-display mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-indigo-600 dark:text-indigo-400">
                info
              </span>
              Thông Tin Token Hợp Đồng Thông Minh CTK
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-slate-500 dark:text-gray-400 block mb-1 text-xs font-bold uppercase tracking-wider">
                  Tên & Ký Hiệu:
                </span>
                <strong className="text-slate-900 dark:text-white text-base font-extrabold">
                  {tokenInfo.name} ({tokenInfo.symbol})
                </strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-gray-400 block mb-1 text-xs font-bold uppercase tracking-wider">
                  Địa Chỉ Hợp Đồng:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-slate-900 dark:text-white truncate max-w-[160px] inline-block font-semibold bg-white/80 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-white/5">
                    {tokenInfo.contractAddress}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tokenInfo.contractAddress);
                      toast.success("Đã sao chép địa chỉ hợp đồng!");
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-indigo-100 dark:border-white/10 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                    title="Sao chép địa chỉ"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      content_copy
                    </span>
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
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-indigo-100 dark:border-white/10 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                    title="Xem trên Block Explorer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      open_in_new
                    </span>
                  </a>
                </div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-gray-400 block mb-1 text-xs font-bold uppercase tracking-wider">
                  Chế Độ Hoạt Động:
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    tokenInfo.isSimulation
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  }`}
                >
                  {tokenInfo.isSimulation
                    ? "Mô Phỏng Sandbox"
                    : "On-chain Live Sepolia"}
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
