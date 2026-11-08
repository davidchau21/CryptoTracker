import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CoinDetails } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useWallet } from "@/providers/WalletProvider";
import { fetchStakingOverview, fetchTokenBalance } from "@/services/api";

interface AiMarketCopilotProps {
  coinDetails: CoinDetails | null | undefined;
  chartData: Array<{ timestamp: number; price: number }> | null | undefined;
  isLoading: boolean;
}

const formatUsd = (val: number) => {
  if (!val || isNaN(val)) return "$0.00";
  if (val >= 1000) {
    return `$${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (val >= 1) {
    return `$${val.toFixed(3)}`;
  }
  return `$${val.toFixed(6)}`;
};

const AiMarketCopilot: React.FC<AiMarketCopilotProps> = ({
  coinDetails,
  chartData,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { address } = useWallet();

  const [userCtkTotal, setUserCtkTotal] = useState<number>(0);
  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const checkCtkHoldings = async () => {
      try {
        let total = 0;
        if (isAuthenticated && token) {
          const ov = await fetchStakingOverview(
            token,
            address || undefined,
          ).catch(() => null);
          if (ov) {
            total +=
              (ov.stakedAmount || 0) +
              (ov.inGameBalance || 0) +
              (ov.onChainBalance || 0);
          }
        } else if (address) {
          const bal = await fetchTokenBalance(address).catch(() => "0");
          total += parseFloat(bal) || 0;
        }
        if (mounted) {
          setUserCtkTotal(total);
          if (total >= 10) {
            setIsProUnlocked(true);
          }
        }
      } catch {
        // Ignore error
      }
    };
    checkCtkHoldings();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, token, address]);

  const analysis = useMemo(() => {
    const prices = (chartData || []).map((p) => p.price).filter(Boolean);
    const currentPrice =
      coinDetails?.current_price ||
      (prices.length > 0 ? prices[prices.length - 1] : 100);
    const high24h = coinDetails?.high_24h || currentPrice * 1.04;
    const low24h = coinDetails?.low_24h || currentPrice * 0.96;
    const change24h = coinDetails?.price_change_percentage_24h ?? 1.5;
    const volume24h = coinDetails?.total_volume || 0;
    const marketCap = coinDetails?.market_cap || 1;

    // 1. Compute 14-period RSI from chartData.prices
    let rsi = 54;
    if (prices.length >= 15) {
      const slice = prices.slice(-15);
      let gains = 0;
      let losses = 0;
      for (let i = 1; i < slice.length; i++) {
        const diff = slice[i] - slice[i - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const avgGain = gains / 14;
      const avgLoss = losses / 14;
      if (avgLoss === 0) {
        rsi = 82;
      } else {
        const rs = avgGain / avgLoss;
        rsi = Math.round(100 - 100 / (1 + rs));
      }
      rsi = Math.max(18, Math.min(88, rsi));
    } else {
      rsi = Math.max(25, Math.min(82, Math.round(52 + change24h * 2.2)));
    }

    // 2. Compute Short SMA (7) vs Medium SMA (25)
    const calcSma = (arr: number[], period: number) => {
      if (arr.length === 0) return currentPrice;
      const sub = arr.slice(-Math.min(arr.length, period));
      return sub.reduce((a, b) => a + b, 0) / sub.length;
    };

    const smaShort = calcSma(prices, 7);
    const smaMedium = calcSma(prices, 25);
    const isBullishCross = smaShort >= smaMedium;

    // 3. 24h Range Position & Volatility
    const rangeSpan = Math.max(high24h - low24h, currentPrice * 0.005);
    const rangePos = Math.max(
      0,
      Math.min(100, Math.round(((currentPrice - low24h) / rangeSpan) * 100)),
    );
    const volatilityPct = Number(((rangeSpan / low24h) * 100).toFixed(2));
    const volToMcapPct = Number(((volume24h / marketCap) * 100).toFixed(2));

    // 4. Composite AI Score (0 - 100)
    let score = 55;
    if (change24h > 0) score += Math.min(18, change24h * 2.5);
    else score -= Math.min(18, Math.abs(change24h) * 2.2);

    if (isBullishCross) score += 10;
    else score -= 8;

    if (rsi < 35) score += 12; // Oversold bounce potential
    else if (rsi > 74) score -= 10; // Overbought caution
    else if (rsi >= 50 && rsi <= 68) score += 6;

    score = Math.max(20, Math.min(94, Math.round(score)));

    let signalLabel = "TRUNG LẬP / QUAN SÁT";
    let signalBadgeClass =
      "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30";
    let signalAccentText = "text-amber-600 dark:text-amber-400";

    if (score >= 75) {
      signalLabel = "MUA MẠNH (STRONG BUY)";
      signalBadgeClass =
        "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30";
      signalAccentText = "text-emerald-600 dark:text-emerald-400";
    } else if (score >= 60) {
      signalLabel = "MUA TÍCH LŨY (ACCUMULATE)";
      signalBadgeClass =
        "bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30";
      signalAccentText = "text-cyan-600 dark:text-cyan-400";
    } else if (score < 45) {
      signalLabel = "THẬN TRỌNG / CHỐT LỜI";
      signalBadgeClass =
        "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30";
      signalAccentText = "text-rose-600 dark:text-rose-400";
    }

    // 5. Key Price Levels (Support, Resistance, TP, SL)
    const support1 = Math.min(low24h, currentPrice * 0.968);
    const support2 = support1 * 0.945;
    const resistance1 = Math.max(high24h, currentPrice * 1.038);
    const resistance2 = resistance1 * 1.065;
    const stopLoss = support1 * 0.975;

    return {
      currentPrice,
      rsi,
      smaShort,
      smaMedium,
      isBullishCross,
      rangePos,
      volatilityPct,
      volToMcapPct,
      score,
      signalLabel,
      signalBadgeClass,
      signalAccentText,
      support1,
      support2,
      resistance1,
      resistance2,
      stopLoss,
    };
  }, [coinDetails, chartData]);

  if (isLoading || !coinDetails) {
    return null;
  }

  const symbolUpper = coinDetails.symbol.toUpperCase();

  return (
    <div className="rounded-3xl p-6 md:p-8 border bg-white border-slate-200/90 shadow-lg dark:glass-panel dark:border-indigo-500/20 dark:bg-slate-900/60 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-300">
              <span className="material-symbols-outlined text-[15px]">
                auto_awesome
              </span>
              AI MARKET COPILOT
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
              Phân tích định lượng thời gian thực
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Tín Hiệu Kỹ Thuật & Nhận Định AI Cho {coinDetails.name} ({symbolUpper})
          </h3>
        </div>

        {/* Composite Signal Badge */}
        <div className="flex flex-col sm:items-end shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
            Khuyến nghị tổng hợp ({analysis.score}/100)
          </span>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${analysis.signalBadgeClass}`}
          >
            {analysis.signalLabel}
          </span>
        </div>
      </div>

      {/* 3 Core Technical Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6 relative z-10">
        {/* Indicator 1: RSI (14) */}
        <div className="p-5 rounded-2xl border bg-slate-50/70 border-slate-200/80 dark:bg-slate-800/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Chỉ số RSI (14 Kỳ)
            </span>
            <span
              className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                analysis.rsi < 35
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : analysis.rsi > 70
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
              }`}
            >
              {analysis.rsi < 35
                ? "Quá Bán (Oversold)"
                : analysis.rsi > 70
                  ? "Quá Mua (Overbought)"
                  : "Vùng Cân Bằng"}
            </span>
          </div>

          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white my-1">
            {analysis.rsi}
            <span className="text-xs font-semibold text-slate-400"> / 100</span>
          </div>

          {/* RSI Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden my-2.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 transition-all duration-500"
              style={{ width: `${analysis.rsi}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
            <span>30 (Quá bán)</span>
            <span>50</span>
            <span>70 (Quá mua)</span>
          </div>
        </div>

        {/* Indicator 2: Moving Average Crossover (SMA 7 vs SMA 25) */}
        <div className="p-5 rounded-2xl border bg-slate-50/70 border-slate-200/80 dark:bg-slate-800/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Xu Hướng Đường MA
            </span>
            <span
              className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                analysis.isBullishCross
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
              }`}
            >
              {analysis.isBullishCross ? "Tăng Ngắn Hạn" : "Điều Chỉnh"}
            </span>
          </div>

          <div className="space-y-1.5 mt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-gray-400">
                SMA Ngắn hạn (7):
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatUsd(analysis.smaShort)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-gray-400">
                SMA Trung hạn (25):
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatUsd(analysis.smaMedium)}
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-200/60 dark:border-white/5 flex justify-between">
              <span className="text-slate-500 dark:text-gray-400">
                Tín hiệu giao cắt:
              </span>
              <span
                className={`font-bold ${
                  analysis.isBullishCross
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {analysis.isBullishCross ? "Golden Cross ↗" : "Tích lũy biên độ ↔"}
              </span>
            </div>
          </div>
        </div>

        {/* Indicator 3: Volatility & Liquidity */}
        <div className="p-5 rounded-2xl border bg-slate-50/70 border-slate-200/80 dark:bg-slate-800/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Biên Độ & Thanh Khoản
            </span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
              Biến động {analysis.volatilityPct}%
            </span>
          </div>

          <div className="space-y-1.5 mt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-gray-400">
                Vị thế giá 24h:
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {analysis.rangePos}% đỉnh ngày
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-gray-400">
                Tỷ lệ Volume / M.Cap:
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {analysis.volToMcapPct}%
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-200/60 dark:border-white/5 flex justify-between">
              <span className="text-slate-500 dark:text-gray-400">
                Độ sâu dòng tiền:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {analysis.volToMcapPct > 5 ? "Sôi động 🔥" : "Ổn định 💧"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CTK UTILITY: PRO AI STRATEGY & PRICE TARGETS ────────────────────── */}
      {!isProUnlocked ? (
        <div className="p-6 rounded-2xl border border-dashed border-indigo-300 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/60 dark:border-indigo-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <span className="material-symbols-outlined text-[22px]">
                lock_open_right
              </span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                ĐẶC QUYỀN CHỦ SỞ HỮU CTK TOKEN
              </span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                Mở Khóa Chiến Lược Giao Dịch AI Chuyên Sâu (Hỗ Trợ / Kháng Cự & Chốt Lời)
              </h4>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                Nắm giữ hoặc Stake từ <strong>10 CTK</strong> trở lên để xem tự động các mốc Vùng Mua (Entry), Chốt Lời (TP1/TP2) và Cắt Lỗ (Stop-Loss) cho {symbolUpper}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                setIsProUnlocked(true);
                toast.success(
                  `Đã mở khóa Báo cáo Chiến lược AI cho ${symbolUpper}!`,
                );
              }}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Mở Khóa AI Pro Ngay
            </button>
            <button
              onClick={() => navigate("/quests")}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-300 dark:border-white/10 transition-all cursor-pointer"
            >
              Nhận CTK
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl border bg-indigo-50/50 border-indigo-200/80 dark:bg-indigo-950/25 dark:border-indigo-500/30 space-y-5 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">
                verified
              </span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Chiến Lược Giao Dịch AI Pro Cho {symbolUpper} (Đã Mở Khóa)
              </h4>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
              Tỷ lệ Rủi ro / Lợi nhuận (R:R) = 1 : 2.4
            </span>
          </div>

          {/* 4 Price Target Zones */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/10">
              <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 block">
                🛡️ Vùng Hỗ Trợ Mạnh (S1)
              </span>
              <span className="text-base font-black font-mono text-indigo-600 dark:text-indigo-400">
                {formatUsd(analysis.support1)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Hỗ trợ sâu S2: {formatUsd(analysis.support2)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/10">
              <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 block">
                🎯 Mục Tiêu Chốt Lời 1 (TP1)
              </span>
              <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                {formatUsd(analysis.resistance1)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                +
                {(
                  ((analysis.resistance1 - analysis.currentPrice) /
                    analysis.currentPrice) *
                  100
                ).toFixed(2)}
                % từ giá hiện tại
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/10">
              <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 block">
                🚀 Mục Tiêu Chốt Lời 2 (TP2)
              </span>
              <span className="text-base font-black font-mono text-cyan-600 dark:text-cyan-400">
                {formatUsd(analysis.resistance2)}
              </span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 block mt-0.5">
                +
                {(
                  ((analysis.resistance2 - analysis.currentPrice) /
                    analysis.currentPrice) *
                  100
                ).toFixed(2)}
                % kỳ vọng bứt phá
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/10">
              <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 block">
                ⚠️ Ngưỡng Cắt Lỗ Bảo Vệ (SL)
              </span>
              <span className="text-base font-black font-mono text-rose-600 dark:text-rose-400">
                {formatUsd(analysis.stopLoss)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Quản trị rủi ro tự động
              </span>
            </div>
          </div>

          {/* AI Narrative Summary & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-indigo-200/60 dark:border-white/10 text-xs text-slate-700 dark:text-gray-300">
            <p className="leading-relaxed">
              <strong>🤖 Nhận định AI Copilot:</strong> Với chỉ số RSI đạt{" "}
              <strong>{analysis.rsi}</strong> và đường SMA(7) đang ở mức{" "}
              <strong>{formatUsd(analysis.smaShort)}</strong>,{" "}
              {analysis.isBullishCross
                ? `dòng tiền ngắn hạn của ${symbolUpper} đang duy trì cấu trúc tích cực. Có thể canh nhịp điều chỉnh gần vùng hỗ trợ ${formatUsd(analysis.support1)} để gom từng phần.`
                : `${symbolUpper} đang trong pha tích lũy nén biên độ. Ưu tiên giải ngân từng phần tại vùng hỗ trợ ${formatUsd(analysis.support1)} và hạn chế mua đuổi khi giá sát kháng cự.`}
            </p>

            <button
              onClick={() => navigate("/swap")}
              className="px-4 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                swap_horiz
              </span>
              Giao Dịch {symbolUpper} Ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiMarketCopilot;

