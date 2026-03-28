import { CoinDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Globe, Github, Twitter, Facebook } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface CoinAboutProps {
  coinDetails: CoinDetails | null;
  isLoading: boolean;
}

const CoinAbout = ({ coinDetails, isLoading }: CoinAboutProps) => {
  return (
    <>
      <h2 className="text-xl sm:text-2xl font-bold text-[#0d121c] dark:text-white mb-4">
        About {coinDetails?.name}
      </h2>
      <div className="glass-panel p-6 bg-white/40 dark:bg-gradient-to-r dark:from-[#131B2C]/80 dark:to-[#0F1623]/80 mb-8 max-h-[28rem] relative overflow-y-auto group rounded-2xl border border-white/50 dark:border-white/10 shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div
            className="prose prose-sm sm:prose-base max-w-none relative z-10 transition-all duration-500 text-gray-800 dark:text-gray-400 dark:prose-headings:text-gray-200 dark:prose-a:text-indigo-400"
            dangerouslySetInnerHTML={{
              __html:
                coinDetails?.description?.en ||
                "No description available for this coin.",
            }}
          />
        )}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-[#0d121c] dark:text-white mb-4">
        {coinDetails?.name || "Coin"} Price Today
      </h2>
      <div className="glass-panel p-6 bg-white/40 dark:bg-gradient-to-r dark:from-[#131B2C]/80 dark:to-[#0F1623]/80 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm mb-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 leading-relaxed mb-6">
              Today's {coinDetails?.name} price is{" "}
              <strong className="text-[#0d121c] dark:text-white">
                ${formatNumber(coinDetails?.current_price || 0)}
              </strong>
              , with a 24-hour trading volume of{" "}
              <strong className="text-[#0d121c] dark:text-white">
                ${formatNumber(coinDetails?.total_volume || 0)}
              </strong>
              .{coinDetails?.name} is{" "}
              {coinDetails?.price_change_percentage_24h &&
              coinDetails.price_change_percentage_24h >= 0
                ? "up"
                : "down"}{" "}
              <strong
                className={
                  coinDetails?.price_change_percentage_24h &&
                  coinDetails.price_change_percentage_24h >= 0
                    ? "text-emerald-600 dark:text-green-400"
                    : "text-rose-600 dark:text-red-400"
                }
              >
                {Math.abs(
                  coinDetails?.price_change_percentage_24h || 0,
                ).toFixed(2)}
                %
              </strong>{" "}
              in the last 24 hours. It is currently ranked #
              {coinDetails?.market_cap_rank} by market cap, with a live market
              cap of{" "}
              <strong className="text-[#0d121c] dark:text-white">
                ${formatNumber(coinDetails?.market_cap || 0)}
              </strong>
              . It has a circulating supply of{" "}
              {formatNumber(coinDetails?.circulating_supply || 0)}{" "}
              {coinDetails?.symbol?.toUpperCase()} coins.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/50 dark:border-white/5 mt-6">
              <div>
                <span className="text-xs text-brand-secondary block mb-1 font-medium">
                  {coinDetails?.name} ROI
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-green-400 bg-emerald-50 dark:bg-green-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-green-500/20 inline-block shadow-sm">
                  {formatNumber(
                    coinDetails?.market_cap_change_percentage_24h || 0,
                  )}
                  %
                </span>
              </div>
              <div>
                <span className="text-xs text-brand-secondary block mb-1 font-medium">
                  All Time High
                </span>
                <span className="text-sm font-bold text-[#0d121c] dark:text-white block">
                  ${formatNumber(coinDetails?.ath || 0)}
                </span>
                <span className="text-[10px] text-brand-secondary mt-0.5 block">
                  {new Date(
                    coinDetails?.ath_date || Date.now(),
                  ).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-brand-secondary block mb-1 font-medium">
                  All Time Low
                </span>
                <span className="text-sm font-bold text-[#0d121c] dark:text-white block">
                  ${formatNumber(coinDetails?.atl || 0)}
                </span>
                <span className="text-[10px] text-brand-secondary mt-0.5 block">
                  {new Date(
                    coinDetails?.atl_date || Date.now(),
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Official links are now rendered in RightSidebarDetail */}
    </>
  );
};

export default CoinAbout;
