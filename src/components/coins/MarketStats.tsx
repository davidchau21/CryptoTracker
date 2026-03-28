import { CoinDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";

interface MarketStatsProps {
  coinDetails: CoinDetails | null;
  isLoading: boolean;
}

const MarketStats = ({ coinDetails, isLoading }: MarketStatsProps) => {
  // Calculate fully diluted valuation
  const fullyDilutedValuation = coinDetails
    ? (coinDetails.total_supply || 0) * (coinDetails.current_price || 0)
    : 0;

  // Format display values with fallbacks
  const symbol = coinDetails?.symbol?.toUpperCase() || "";

  const calcSupplyPercentage = () => {
    if (!coinDetails?.circulating_supply || !coinDetails?.max_supply) return 0;
    return Math.min(
      100,
      Math.round(
        (coinDetails.circulating_supply / coinDetails.max_supply) * 100,
      ),
    );
  };

  const supplyPct = calcSupplyPercentage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Market Cap */}
      <div className="flex flex-col p-5 glass-panel hover:-translate-y-1 transition-transform duration-300 shadow-sm border border-white/50 dark:border-white/10 rounded-2xl group bg-white/40 dark:bg-gray-800/20">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Market Cap
          </span>
          <span
            className="material-symbols-outlined text-[14px] text-gray-400 dark:text-gray-600 cursor-help"
            title="The total market value of a cryptocurrency's circulating supply."
          >
            info
          </span>
        </div>
        <span className="text-xl font-bold text-[#0d121c] dark:text-white tracking-tight">
          ${formatNumber(coinDetails?.market_cap || 0)}
        </span>
      </div>

      {/* Volume 24h */}
      <div className="flex flex-col p-5 glass-panel hover:-translate-y-1 transition-transform duration-300 shadow-sm border border-white/50 dark:border-white/10 rounded-2xl group bg-white/40 dark:bg-gray-800/20">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Volume (24h)
          </span>
          <span
            className="material-symbols-outlined text-[14px] text-gray-400 dark:text-gray-600 cursor-help"
            title="A measure of how much of a cryptocurrency was traded in the last 24 hours."
          >
            info
          </span>
        </div>
        <span className="text-xl font-bold text-[#0d121c] dark:text-white tracking-tight">
          ${formatNumber(coinDetails?.total_volume || 0)}
        </span>
      </div>

      {/* Fully Diluted Valuation */}
      <div className="flex flex-col p-5 glass-panel hover:-translate-y-1 transition-transform duration-300 shadow-sm border border-white/50 dark:border-white/10 rounded-2xl group bg-white/40 dark:bg-gray-800/20">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            FDV
          </span>
          <span
            className="material-symbols-outlined text-[14px] text-gray-400 dark:text-gray-600 cursor-help"
            title="Fully Diluted Valuation represents the market capitalization if the maximum supply was in circulation."
          >
            info
          </span>
        </div>
        <span className="text-xl font-bold text-[#0d121c] dark:text-white tracking-tight">
          ${formatNumber(fullyDilutedValuation)}
        </span>
      </div>

      {/* Circulating Supply */}
      <div className="flex flex-col p-5 glass-panel hover:-translate-y-1 transition-transform duration-300 shadow-sm border border-white/50 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-gray-800/20 group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Circulating Supply
          </span>
          {supplyPct > 0 && (
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {supplyPct}%
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-bold text-[#0d121c] dark:text-white truncate">
            {formatNumber(coinDetails?.circulating_supply || 0)} {symbol}
          </span>
        </div>

        {supplyPct > 0 ? (
          <div className="w-full bg-white/50 dark:bg-white/5 rounded-full h-1.5 overflow-hidden border border-white dark:border-white/10 shadow-inner">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              style={{ width: `${supplyPct}%` }}
            ></div>
          </div>
        ) : (
          <div className="w-full h-1.5"></div> // spacing placeholder
        )}

        <div className="flex justify-between mt-2">
          {coinDetails?.max_supply ? (
            <span className="text-[10px] text-brand-secondary font-mono font-medium">
              Max: {formatNumber(coinDetails.max_supply)}
            </span>
          ) : (
            <span className="text-[10px] text-brand-secondary font-mono font-medium">
              Total: {formatNumber(coinDetails?.total_supply || 0)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketStats;
