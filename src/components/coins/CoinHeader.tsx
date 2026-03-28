import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { CoinDetails } from "@/types";

interface CoinHeaderProps {
  coinDetails: CoinDetails | null;
  isLoading: boolean;
}

const CoinHeader = ({ coinDetails, isLoading }: CoinHeaderProps) => {
  const isPriceChangePositive = coinDetails?.price_change_percentage_24h >= 0;

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap gap-2 items-center text-sm font-medium">
        <Link
          className="text-brand-secondary hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          to="/"
        >
          Cryptocurrencies
        </Link>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <span className="text-brand-secondary">Coins</span>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <span className="text-[#0d121c] dark:text-white font-bold">
          {coinDetails?.name}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 glass-panel p-6 bg-gradient-to-r from-white/90 to-indigo-50/80 dark:from-[#131B2C]/80 dark:to-[#0F1623]/80 rounded-2xl shadow-sm border border-white/50 dark:border-white/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex gap-5 items-center relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 dark:bg-orange-500 rounded-full blur-md opacity-20"></div>
            <img
              className="relative w-16 h-16 rounded-full bg-white shadow-lg ring-2 ring-indigo-100 dark:ring-white/10 p-1"
              alt={coinDetails?.name}
              src={coinDetails?.image}
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0d121c] dark:text-white tracking-tight">
                {coinDetails?.name}
              </h1>
              <span className="bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm uppercase">
                {coinDetails?.symbol}
              </span>
              <span className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-yellow-600/20 dark:to-orange-600/20 border border-indigo-200 dark:border-orange-500/20 text-indigo-700 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm shadow-sm whitespace-nowrap">
                Rank #{coinDetails?.market_cap_rank || "-"}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-brand-secondary">
                {coinDetails?.name} Price ({coinDetails?.symbol?.toUpperCase()})
              </span>
              <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[18px] group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
                  star
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end relative z-10">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-4xl sm:text-5xl font-bold text-[#0d121c] dark:text-white tracking-tighter shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              ${formatNumber(coinDetails?.current_price || 0)}
            </span>
            <span
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${
                isPriceChangePositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 dark:shadow-[0_0_10px_rgba(74,222,128,0.1)]"
                  : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:shadow-[0_0_10px_rgba(248,113,113,0.1)]"
              }`}
            >
              <span className="material-symbols-outlined text-base font-bold">
                {isPriceChangePositive ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
              {formatPercentage(
                coinDetails?.price_change_percentage_24h || 0,
              ).replace("-", "")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinHeader;
