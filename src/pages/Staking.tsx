import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useWallet } from "@/providers/WalletProvider";
import {
  fetchStakingOverview,
  stakeCtkTokens,
  unstakeCtkTokens,
  claimStakingRewards,
  fetchLeaderboard,
  StakingOverview,
  LeaderboardResponse,
  LockTier,
} from "@/services/api";

const DEFAULT_POOLS = [
  {
    id: "flexible" as LockTier,
    name: "Flexible Pool (Linh Hoạt)",
    lockDays: 0,
    baseApy: 36.5,
    rewardPerSecPer100Ctk: 0.0015,
    vipMultiplierBoost: 1.0,
    description:
      "Rút gốc bất cứ lúc nào, không thời gian khóa, nhận lãi mỗi giây.",
  },
  {
    id: "30days" as LockTier,
    name: "30-Day Boost Vault",
    lockDays: 30,
    baseApy: 85.0,
    rewardPerSecPer100Ctk: 0.0035,
    vipMultiplierBoost: 1.5,
    description:
      "Cam kết 30 ngày với lãi suất cao gấp 2.3x và cộng thêm hệ số điểm VIP.",
  },
  {
    id: "90days" as LockTier,
    name: "90-Day Whale Vault",
    lockDays: 90,
    baseApy: 150.0,
    rewardPerSecPer100Ctk: 0.0065,
    vipMultiplierBoost: 2.5,
    description:
      "Lãi suất tối đa 150% APY dành cho nhà đầu tư dài hạn & Cá voi CTK.",
  },
];

const VIP_TIERS_CATALOG = [
  {
    id: "bronze",
    name: "Bronze Explorer",
    icon: "workspace_premium",
    minScore: "0 - 99 Điểm",
    swapFee: "0.30%",
    discount: "Tiêu chuẩn",
    apyBoost: "1.0x APY",
    badgeClass:
      "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
    accentGrad: "from-amber-600 to-orange-600",
  },
  {
    id: "silver",
    name: "Silver Trader",
    icon: "military_tech",
    minScore: "100 - 299 Điểm",
    swapFee: "0.20%",
    discount: "Giảm 33% phí",
    apyBoost: "1.1x APY (+10%)",
    badgeClass:
      "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-400/10 dark:text-slate-200 dark:border-slate-400/30",
    accentGrad: "from-slate-500 to-indigo-500",
  },
  {
    id: "gold",
    name: "Gold Validator",
    icon: "emoji_events",
    minScore: "300 - 999 Điểm",
    swapFee: "0.10%",
    discount: "Giảm 67% phí",
    apyBoost: "1.25x APY (+25%)",
    badgeClass:
      "bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/30",
    accentGrad: "from-yellow-500 to-amber-500",
  },
  {
    id: "diamond",
    name: "Diamond Whale",
    icon: "diamond",
    minScore: "1,000+ Điểm",
    swapFee: "0.02%",
    discount: "Giảm 93% phí",
    apyBoost: "1.5x APY (+50%)",
    badgeClass:
      "bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-400/40",
    accentGrad: "from-cyan-500 via-indigo-500 to-purple-600",
  },
];

const Staking: React.FC = () => {
  const { token, user, isAuthenticated } = useAuth();
  const wallet = useWallet();
  const location = useLocation();
  const navigate = useNavigate();

  const isLeaderboardRoute = location.pathname === "/leaderboard";
  const [activeTab, setActiveTab] = useState<"vault" | "leaderboard">(
    isLeaderboardRoute ? "leaderboard" : "vault",
  );

  // Sync tab with URL route changes
  useEffect(() => {
    setActiveTab(
      location.pathname === "/leaderboard" ? "leaderboard" : "vault",
    );
  }, [location.pathname]);

  const [overview, setOverview] = useState<StakingOverview | null>(null);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Staking form state
  const [actionMode, setActionMode] = useState<"stake" | "unstake">("stake");
  const [selectedTier, setSelectedTier] = useState<LockTier>("flexible");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaimingMode, setIsClaimingMode] = useState<
    "compound" | "wallet" | null
  >(null);

  // Live ticking reward counter
  const [liveRewards, setLiveRewards] = useState<number>(0);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const lbPromise = fetchLeaderboard(user?.id).catch(() => null);

      if (isAuthenticated && token) {
        const [ov, lb] = await Promise.all([
          fetchStakingOverview(token, wallet.address || undefined).catch(
            () => null,
          ),
          lbPromise,
        ]);

        if (ov) {
          setOverview(ov);
          setLiveRewards(ov.pendingRewards);
          setSelectedTier(ov.lockTier || "flexible");
        }
        if (lb) {
          setLeaderboardData(lb);
        }
      } else {
        const lb = await lbPromise;
        if (lb) setLeaderboardData(lb);
      }
    } catch (err) {
      console.error("Failed to load Staking & Leaderboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [isAuthenticated, token, wallet.address, user?.id]);

  // Real-time 100ms ticker for pending rewards
  useEffect(() => {
    if (
      !overview ||
      overview.stakedAmount <= 0 ||
      overview.rewardRatePerSec <= 0
    ) {
      return;
    }

    const interval = setInterval(() => {
      setLiveRewards((prev) => prev + overview.rewardRatePerSec * 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [overview?.stakedAmount, overview?.rewardRatePerSec]);

  const pools = overview?.pools || DEFAULT_POOLS;
  const activePoolConfig =
    pools.find((p) => p.id === selectedTier) || DEFAULT_POOLS[0];
  const vipMultiplier = overview?.vipStatus?.apyMultiplier || 1.0;
  const maxBalanceForAction =
    actionMode === "stake"
      ? overview?.availableToStake || 0
      : overview?.stakedAmount || 0;

  // Yield calculator preview
  const numericInput = parseFloat(inputAmount) || 0;
  const previewAmount =
    numericInput > 0 ? numericInput : overview?.stakedAmount || 100;
  const previewEffectiveApy = Number(
    (activePoolConfig.baseApy * vipMultiplier).toFixed(2),
  );
  const estDailyYield =
    previewAmount *
    (activePoolConfig.rewardPerSecPer100Ctk / 100) *
    vipMultiplier *
    3600; // Scaled hourly/daily demo rate
  const estYearlyYield = (previewAmount * previewEffectiveApy) / 100;

  const handlePercentageSelect = (pct: number) => {
    if (maxBalanceForAction <= 0) {
      toast.info(
        actionMode === "stake"
          ? "Bạn chưa có CTK khả dụng. Hãy điểm danh tại trang Nhiệm Vụ (Quests) để nhận CTK!"
          : "Bạn chưa có CTK nào đang gửi trong Staking Vault.",
      );
      return;
    }
    const computed = ((maxBalanceForAction * pct) / 100).toFixed(2);
    setInputAmount(computed);
  };

  const handleExecuteStakeOrUnstake = async () => {
    if (!isAuthenticated || !token) {
      toast.error("Vui lòng đăng nhập để sử dụng Staking Vault.");
      navigate("/login");
      return;
    }

    const amount = parseFloat(inputAmount);
    if (!amount || amount <= 0) {
      toast.error("Vui lòng nhập số lượng CTK hợp lệ.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (actionMode === "stake") {
        const res = await stakeCtkTokens(token, {
          amount,
          lockTier: selectedTier,
          walletAddress: wallet.address || undefined,
        });
        toast.success(res.message, {
          description:
            "Nhiệm vụ 'Gửi tiết kiệm Staking lần đầu' (+40 CTK) đã được mở khóa!",
        });
        setOverview(res.overview);
        setLiveRewards(res.overview.pendingRewards);
        setInputAmount("");
      } else {
        const res = await unstakeCtkTokens(token, {
          amount,
          walletAddress: wallet.address || undefined,
        });
        toast.success(res.message);
        setOverview(res.overview);
        setLiveRewards(res.overview.pendingRewards);
        setInputAmount("");
      }
      // Refresh leaderboard
      const lb = await fetchLeaderboard(user?.id).catch(() => null);
      if (lb) setLeaderboardData(lb);
    } catch (err: any) {
      toast.error(err.message || "Giao dịch thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimReward = async (mode: "compound" | "wallet") => {
    if (!isAuthenticated || !token) {
      toast.error("Vui lòng đăng nhập để nhận thưởng.");
      return;
    }
    if (mode === "wallet" && (!wallet.isConnected || !wallet.address)) {
      toast.error(
        "Vui lòng kết nối ví MetaMask để rút lãi về ví Web3, hoặc chọn 'Gộp Lãi Kép (Compound)'!",
      );
      return;
    }

    setIsClaimingMode(mode);
    try {
      const res = await claimStakingRewards(token, {
        mode,
        walletAddress: wallet.address || undefined,
      });
      toast.success(res.message);
      setOverview(res.overview);
      setLiveRewards(res.overview.pendingRewards);

      if (mode === "wallet") {
        await wallet.refetchBalances();
      }
      const lb = await fetchLeaderboard(user?.id).catch(() => null);
      if (lb) setLeaderboardData(lb);
    } catch (err: any) {
      toast.error(err.message || "Không thể nhận thưởng lúc này.");
    } finally {
      setIsClaimingMode(null);
    }
  };

  const getTierBadgeStyle = (tierId: string) => {
    switch (tierId) {
      case "diamond":
        return "bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-400/40";
      case "gold":
        return "bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/40";
      case "silver":
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-400/15 dark:text-slate-200 dark:border-slate-400/40";
      default:
        return "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/40";
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case "diamond":
        return "diamond";
      case "gold":
        return "emoji_events";
      case "silver":
        return "military_tech";
      default:
        return "workspace_premium";
    }
  };

  return (
    <DashboardLayout hideSidebar={true}>
      <div className="w-full max-w-[1250px] mx-auto pb-16">
        {/* ─── HERO BANNER ─────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden border p-8 md:p-10 mb-8 transition-all duration-300 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-white border-slate-200 shadow-lg shadow-slate-100/80 dark:glass-panel dark:border-indigo-500/20 dark:bg-gradient-to-br dark:from-indigo-950/50 dark:via-purple-950/30 dark:to-slate-900/70">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-300">
                  <span className="material-symbols-outlined text-[15px]">
                    savings
                  </span>
                  DEFI STAKING VAULT & VIP TIERS
                </span>
                {overview?.vipStatus && (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${getTierBadgeStyle(overview.vipStatus.tierId)}`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {getTierIcon(overview.vipStatus.tierId)}
                    </span>
                    Hạng: {overview.vipStatus.name} (
                    {overview.vipStatus.apyMultiplier}x APY)
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                Sinh lời tự động với{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
                  CTK Staking Vault
                </span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Đem đồng{" "}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  CTK
                </strong>{" "}
                nhận được từ Nhiệm Vụ đi gửi tiết kiệm để hưởng lãi suất kép mỗi
                giây, thăng hạng{" "}
                <strong className="text-purple-600 dark:text-purple-400">
                  VIP Whale
                </strong>{" "}
                và giảm tới <strong>93% phí giao dịch Swap</strong>!
              </p>
            </div>

            {/* Global Protocol TVL Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 shrink-0 min-w-[240px]">
              <div className="p-4 rounded-2xl border bg-white/90 border-slate-200 shadow-sm dark:bg-slate-900/70 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 block">
                  Tổng Giá Trị Khóa (TVL)
                </span>
                <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                  {(
                    overview?.globalStats?.totalValueLocked ?? 125400
                  ).toLocaleString()}{" "}
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    CTK
                  </span>
                </span>
              </div>

              <div className="p-4 rounded-2xl border bg-white/90 border-slate-200 shadow-sm dark:bg-slate-900/70 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 block">
                  Lãi Suất Tối Đa (VIP Boost)
                </span>
                <span className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400">
                  Lên tới 225% APY
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs inside Hero */}
          <div className="relative z-10 mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab("vault");
                  navigate("/staking", { replace: true });
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "vault"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800/70 dark:text-gray-300 dark:border-white/10 dark:hover:bg-slate-800"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  account_balance
                </span>
                Staking Vault (Sinh Lời)
              </button>

              <button
                onClick={() => {
                  setActiveTab("leaderboard");
                  navigate("/leaderboard", { replace: true });
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "leaderboard"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800/70 dark:text-gray-300 dark:border-white/10 dark:hover:bg-slate-800"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  leaderboard
                </span>
                Bảng Xếp Hạng & Hạng VIP
              </button>
            </div>

            <button
              onClick={() => navigate("/quests")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                redeem
              </span>
              Cần thêm CTK? Làm nhiệm vụ nhận thưởng miễn phí
            </button>
          </div>
        </div>

        {/* ─── TAB 1: STAKING VAULT ────────────────────────────────────────────── */}
        {activeTab === "vault" && (
          <div className="space-y-8">
            {/* 3-Column Live User Staking Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Staked Principal */}
              <div className="rounded-2xl p-6 border bg-white border-slate-200 shadow-md dark:glass-panel dark:border-white/10 dark:bg-slate-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                      Số Dư Đang Stake
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
                      {overview?.effectiveApy ?? 36.5}% APY
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-3xl font-black font-display text-slate-900 dark:text-white">
                      {(overview?.stakedAmount ?? 0).toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      CTK
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Gói hiện tại:{" "}
                    <strong className="text-slate-800 dark:text-gray-200">
                      {
                        (
                          pools.find((p) => p.id === overview?.lockTier) ||
                          DEFAULT_POOLS[0]
                        ).name
                      }
                    </strong>
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-gray-400 font-medium">
                    Số dư khả dụng để Stake:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {(overview?.availableToStake ?? 0).toFixed(2)} CTK
                  </span>
                </div>
              </div>

              {/* Card 2: Real-Time Ticking Yield */}
              <div className="rounded-2xl p-6 border bg-white border-slate-200 shadow-md dark:glass-panel dark:border-emerald-500/20 dark:bg-slate-900/60 flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Lãi Thưởng Thực Tế (Real-time)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +{(overview?.rewardRatePerSec ?? 0).toFixed(5)} CTK/s
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {liveRewards.toFixed(6)}
                    </span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      CTK
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Tổng lãi đã nhận:{" "}
                    <strong className="text-slate-800 dark:text-gray-200 font-mono">
                      {(overview?.totalClaimedRewards ?? 0).toFixed(4)} CTK
                    </strong>
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleClaimReward("compound")}
                    disabled={liveRewards < 0.0001 || !!isClaimingMode}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:hover:bg-indigo-500/25 dark:text-indigo-300 dark:border-indigo-500/30 disabled:opacity-40 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      autorenew
                    </span>
                    {isClaimingMode === "compound"
                      ? "Đang gộp..."
                      : "Gộp Lãi Kép"}
                  </button>

                  <button
                    onClick={() => handleClaimReward("wallet")}
                    disabled={liveRewards < 0.0001 || !!isClaimingMode}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm disabled:opacity-40 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      account_balance_wallet
                    </span>
                    {isClaimingMode === "wallet" ? "Đang đúc..." : "Rút Về Ví"}
                  </button>
                </div>
              </div>

              {/* Card 3: VIP Power & Fee Discount */}
              <div className="rounded-2xl p-6 border bg-white border-slate-200 shadow-md dark:glass-panel dark:border-purple-500/20 dark:bg-slate-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                      Đặc Quyền VIP Hiện Tại
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getTierBadgeStyle(overview?.vipStatus?.tierId || "bronze")}`}
                    >
                      {overview?.vipStatus?.name || "Bronze Explorer"}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between my-2">
                    <div>
                      <span className="text-3xl font-black font-display text-slate-900 dark:text-white">
                        {overview?.vipStatus?.powerScore ?? 0}
                      </span>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 ml-1.5 uppercase">
                        Điểm Thực Lực
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Phí Swap: {overview?.vipStatus?.swapFeePercent ?? 0.3}%
                    </span>
                  </div>

                  {/* Progress bar to next tier */}
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-gray-400 mb-1">
                      <span>
                        {overview?.vipStatus?.nextTierName
                          ? `Tiến trình lên ${overview.vipStatus.nextTierName}`
                          : "Đã đạt cấp bậc tối đa!"}
                      </span>
                      <span>{overview?.vipStatus?.progressPercent ?? 0}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
                        style={{
                          width: `${overview?.vipStatus?.progressPercent ?? 5}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-gray-400">
                    Hệ số thưởng Staking:
                  </span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {overview?.vipStatus?.apyMultiplier ?? 1.0}x Boost
                  </span>
                </div>
              </div>
            </div>

            {/* ─── MAIN STAKING WORKSPACE: POOLS + ACTION PANEL ──────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left 7 Cols: 3 Pool Selection Cards & Yield Calculator */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">
                    layers
                  </span>
                  Chọn Gói Kỳ Hạn Staking (Pools)
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {pools.map((pool) => {
                    const isSelected = selectedTier === pool.id;
                    const boostedApy = Number(
                      (pool.baseApy * vipMultiplier).toFixed(1),
                    );

                    return (
                      <div
                        key={pool.id}
                        onClick={() => setSelectedTier(pool.id)}
                        className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isSelected
                            ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md dark:bg-indigo-950/40 dark:border-indigo-400"
                            : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm dark:bg-slate-900/50 dark:border-white/10 dark:hover:border-indigo-500/40"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? "border-indigo-600 dark:border-indigo-400"
                                  : "border-slate-300 dark:border-gray-600"
                              }`}
                            >
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                              )}
                            </span>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                              {pool.name}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-gray-300 dark:border-white/10">
                              {pool.lockDays === 0
                                ? "Không khóa"
                                : `Khóa ${pool.lockDays} ngày`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-gray-400 pl-6">
                            {pool.description}
                          </p>
                        </div>

                        <div className="sm:text-right pl-6 sm:pl-0 shrink-0">
                          <div className="text-2xl font-black font-display text-indigo-600 dark:text-indigo-400">
                            {boostedApy}%{" "}
                            <span className="text-xs font-bold">APY</span>
                          </div>
                          {vipMultiplier > 1 && (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                              Gốc {pool.baseApy}% × {vipMultiplier}x VIP
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Yield Simulator Box */}
                <div className="p-6 rounded-2xl border bg-slate-50/80 border-slate-200 dark:bg-slate-900/40 dark:border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">
                      calculate
                    </span>
                    Ước Tính Lợi Nhuận Cho {previewAmount.toFixed(0)} CTK (
                    {activePoolConfig.name})
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/5">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 block">
                        Mỗi Giờ (Demo Tăng Tốc)
                      </span>
                      <span className="text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                        +{estDailyYield.toFixed(2)} CTK
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/5">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 block">
                        Lãi Suất Năm (APY)
                      </span>
                      <span className="text-lg font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                        {previewEffectiveApy}% / năm
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/5">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 block">
                        Điểm Thực Lực VIP Cộng Thêm
                      </span>
                      <span className="text-lg font-extrabold font-mono text-purple-600 dark:text-purple-400">
                        +{Math.round(previewAmount * 1.5)} Điểm
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Stake / Unstake Execution Card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl p-6 md:p-7 border bg-white border-slate-200 shadow-xl dark:glass-panel dark:border-indigo-500/20 dark:bg-slate-900/70 sticky top-24">
                  {/* Mode Switcher */}
                  <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 mb-6">
                    <button
                      onClick={() => {
                        setActionMode("stake");
                        setInputAmount("");
                      }}
                      className={`py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                        actionMode === "stake"
                          ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                          : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Gửi CTK (Stake)
                    </button>
                    <button
                      onClick={() => {
                        setActionMode("unstake");
                        setInputAmount("");
                      }}
                      className={`py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                        actionMode === "unstake"
                          ? "bg-white text-rose-600 shadow-sm dark:bg-rose-600 dark:text-white"
                          : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Rút Gốc (Unstake)
                    </button>
                  </div>

                  {/* Balance Info */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-600 dark:text-gray-400">
                      {actionMode === "stake"
                        ? "Số lượng CTK muốn Stake"
                        : "Số lượng CTK muốn rút"}
                    </span>
                    <span className="text-slate-500 dark:text-gray-400">
                      Khả dụng:{" "}
                      <strong className="text-slate-900 dark:text-white font-mono">
                        {maxBalanceForAction.toFixed(2)} CTK
                      </strong>
                    </span>
                  </div>

                  {/* Input Box */}
                  <div className="relative mb-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-4 pr-20 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 text-xl font-black font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      CTK
                    </span>
                  </div>

                  {/* Quick % Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handlePercentageSelect(pct)}
                        className="py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-700 dark:bg-slate-800 dark:border-white/10 dark:text-gray-300 dark:hover:border-indigo-500/40 transition-all cursor-pointer"
                      >
                        {pct === 100 ? "MAX" : `${pct}%`}
                      </button>
                    ))}
                  </div>

                  {/* Summary Details */}
                  <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 dark:bg-slate-800/40 dark:border-white/5 text-xs mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-gray-400">
                        Gói kỳ hạn:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {activePoolConfig.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-gray-400">
                        Lãi suất thực nhận:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {previewEffectiveApy}% APY
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-gray-400">
                        Phí nền tảng:
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        0.00 CTK (Miễn phí Gas Off-chain)
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleExecuteStakeOrUnstake}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-2xl text-sm font-extrabold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      actionMode === "stake"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25"
                        : "bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 shadow-rose-500/25"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {actionMode === "stake" ? "lock" : "lock_open"}
                    </span>
                    {isSubmitting
                      ? "Đang xử lý giao dịch..."
                      : actionMode === "stake"
                        ? "Xác Nhận Gửi Tiết Kiệm (Stake CTK)"
                        : "Xác Nhận Rút Gốc (Unstake CTK)"}
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Staking History */}
            {overview?.history && overview.history.length > 0 && (
              <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:glass-panel dark:border-white/10 dark:bg-slate-900/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">
                      history
                    </span>
                    Lịch Sử Giao Dịch Staking Gần Đây
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-gray-400 text-xs uppercase">
                        <th className="py-3 px-6 font-bold">Hoạt Động</th>
                        <th className="py-3 px-6 font-bold">Số Lượng</th>
                        <th className="py-3 px-6 font-bold">Gói Pool</th>
                        <th className="py-3 px-6 font-bold">Mã Giao Dịch</th>
                        <th className="py-3 px-6 font-bold text-right">
                          Thời Gian
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {overview.history.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white capitalize">
                            {item.action === "stake" && "🔒 Gửi Stake"}
                            {item.action === "unstake" && "🔓 Rút Gốc"}
                            {item.action === "compound" && "⚡ Gộp Lãi Kép"}
                            {item.action === "claim" && "🦊 Rút Lãi Về Ví"}
                          </td>
                          <td className="py-3.5 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {item.action === "unstake" ? "-" : "+"}
                            {Number(item.amount).toFixed(4)} CTK
                          </td>
                          <td className="py-3.5 px-6 text-slate-600 dark:text-gray-300">
                            {item.lockTier}
                          </td>
                          <td className="py-3.5 px-6 font-mono text-xs text-slate-500 dark:text-gray-400">
                            {item.txHash
                              ? `${item.txHash.slice(0, 10)}...${item.txHash.slice(-6)}`
                              : "Off-chain"}
                          </td>
                          <td className="py-3.5 px-6 text-right text-xs text-slate-500 dark:text-gray-400">
                            {new Date(item.timestamp).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: LEADERBOARD & VIP TIERS ──────────────────────────────────── */}
        {activeTab === "leaderboard" && (
          <div className="space-y-10">
            {/* VIP Tiers Perks Catalog */}
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">
                    workspace_premium
                  </span>
                  Hệ Thống Phân Hạng VIP & Đặc Quyền Chủ Sở Hữu CTK
                </h2>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                  Công thức Điểm Thực Lực:{" "}
                  <code className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold">
                    (CTK Đang Stake × 1.5) + (CTK Nhiệm Vụ) + (Số Lệnh Swap ×
                    15)
                  </code>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {VIP_TIERS_CATALOG.map((tier) => {
                  const isCurrentTier =
                    (overview?.vipStatus?.tierId || "bronze") === tier.id;
                  return (
                    <div
                      key={tier.id}
                      className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden ${
                        isCurrentTier
                          ? "bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg dark:bg-slate-900/80 dark:border-indigo-400"
                          : "bg-white border-slate-200 shadow-sm dark:bg-slate-900/50 dark:border-white/10"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${tier.accentGrad}`}
                      ></div>

                      <div>
                        <div className="flex items-center justify-between mb-4 mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold border ${tier.badgeClass}`}
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {tier.icon}
                            </span>
                            {tier.name}
                          </span>
                          {isCurrentTier && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                              Hạng Của Bạn
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-3">
                          Yêu cầu:{" "}
                          <strong className="text-slate-900 dark:text-white">
                            {tier.minScore}
                          </strong>
                        </div>

                        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-white/5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-gray-400">
                              Phí giao dịch Swap:
                            </span>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {tier.swapFee}{" "}
                              <span className="text-emerald-600 dark:text-emerald-400">
                                ({tier.discount})
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-gray-400">
                              Thưởng lãi Staking:
                            </span>
                            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                              {tier.apyBoost}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 3 Podium */}
            {leaderboardData?.leaderboard &&
              leaderboardData.leaderboard.length >= 3 && (
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">
                      trophy
                    </span>
                    Bục Vinh Danh Top 3 Cá Voi & Thợ Săn Nhiệm Vụ
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {leaderboardData.leaderboard
                      .slice(0, 3)
                      .map((leader, i) => {
                        const medals = ["🥇 HẠNG 1", "🥈 HẠNG 2", "🥉 HẠNG 3"];
                        const borderAccents = [
                          "border-amber-300 dark:border-amber-500/40",
                          "border-slate-300 dark:border-slate-400/40",
                          "border-orange-300 dark:border-orange-500/40",
                        ];

                        return (
                          <div
                            key={leader.userId}
                            className={`rounded-2xl p-6 border bg-white shadow-md dark:glass-panel dark:bg-slate-900/60 relative overflow-hidden ${borderAccents[i]}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
                                {medals[i]}
                              </span>
                              <span
                                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getTierBadgeStyle(leader.tierId)}`}
                              >
                                {leader.tierName}
                              </span>
                            </div>

                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white truncate">
                              {leader.displayName}{" "}
                              {leader.isCurrentUser && (
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                  (Bạn)
                                </span>
                              )}
                            </h3>
                            <p className="text-xs font-mono text-slate-500 dark:text-gray-400 mb-4">
                              {leader.walletAddress}
                            </p>

                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                  Điểm Thực Lực
                                </span>
                                <span className="text-2xl font-black font-display text-indigo-600 dark:text-indigo-400">
                                  {leader.powerScore.toLocaleString()} pts
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                  Đang Stake
                                </span>
                                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                                  {leader.stakedCtk} CTK
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            {/* Full Leaderboard Table */}
            <div className="rounded-2xl border bg-white border-slate-200 shadow-md dark:glass-panel dark:border-white/10 dark:bg-slate-900/60 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                    Bảng Xếp Hạng Web3 Toàn Hệ Thống
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Cập nhật theo thời gian thực từ dữ liệu Staking Vault,
                    Quests & Swap Ledger
                  </p>
                </div>

                {leaderboardData?.myRank && (
                  <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 dark:bg-indigo-500/15 dark:border-indigo-500/30 dark:text-indigo-300 text-xs font-bold">
                    Thứ hạng của bạn: #{leaderboardData.myRank.rank} (
                    {leaderboardData.myRank.powerScore} điểm)
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-gray-400 text-xs uppercase">
                      <th className="py-3.5 px-6 font-bold">Hạng</th>
                      <th className="py-3.5 px-6 font-bold">
                        Thành Viên / Ví Web3
                      </th>
                      <th className="py-3.5 px-6 font-bold">Cấp Bậc VIP</th>
                      <th className="py-3.5 px-6 font-bold text-right">
                        Đang Stake
                      </th>
                      <th className="py-3.5 px-6 font-bold text-right">
                        Thưởng Quests
                      </th>
                      <th className="py-3.5 px-6 font-bold text-right">
                        Số Lệnh Swap
                      </th>
                      <th className="py-3.5 px-6 font-bold text-right">
                        Điểm Thực Lực
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {(leaderboardData?.leaderboard || []).map((row) => (
                      <tr
                        key={row.userId}
                        className={`transition-colors ${
                          row.isCurrentUser
                            ? "bg-indigo-50/70 dark:bg-indigo-500/15 font-semibold"
                            : "hover:bg-slate-50/80 dark:hover:bg-white/5"
                        }`}
                      >
                        <td className="py-4 px-6 font-black text-slate-900 dark:text-white">
                          #{row.rank}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {row.displayName}
                            </span>
                            {row.isCurrentUser && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-600 text-white uppercase">
                                BẠN
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-slate-500 dark:text-gray-400 block">
                            {row.walletAddress}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTierBadgeStyle(row.tierId)}`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {getTierIcon(row.tierId)}
                            </span>
                            {row.tierName}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {row.stakedCtk.toLocaleString()} CTK
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-slate-700 dark:text-gray-300">
                          {row.questCtk.toLocaleString()} CTK
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-slate-700 dark:text-gray-300">
                          {row.swapCount}
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-black text-indigo-600 dark:text-indigo-400">
                          {row.powerScore.toLocaleString()} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Staking;
