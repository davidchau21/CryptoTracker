import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Coin, SortState } from "@/types";
import SearchBar from "@/components/ui/SearchBar";
import PriceAlertModal from "@/components/coins/PriceAlertModal";
import { useWatchlist } from "@/hooks/use-watchlist";
import { formatNumber, formatPercentage } from "@/lib/utils";

interface CoinTableProps {
  coins: Coin[];
  isLoading: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  isLiveStreamEnabled?: boolean;
}

const CoinTable = ({
  coins,
  isLoading,
  currentPage = 1,
  itemsPerPage = 20,
  isLiveStreamEnabled = true,
}: CoinTableProps) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins);
  const [sortState, setSortState] = useState<SortState>({
    key: "market_cap_rank",
    direction: "asc",
  });

  // Live micro-tick price map & flash direction ("up" | "down")
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [flashStates, setFlashStates] = useState<
    Record<string, "up" | "down" | undefined>
  >({});

  // Price Alert Modal state
  const [alertTargetCoin, setAlertTargetCoin] = useState<Coin | null>(null);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCoins(coins);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const results = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(lowercasedQuery) ||
        coin.symbol.toLowerCase().includes(lowercasedQuery),
    );
    setFilteredCoins(results);
  };

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState);

    const { key, direction } = newSortState;
    const sorted = [...filteredCoins].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === null) return direction === "asc" ? -1 : 1;
      if (bValue === null) return direction === "asc" ? 1 : -1;

      return direction === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });

    setFilteredCoins(sorted);
  };

  // Update filtered coins when the main coins list changes
  useEffect(() => {
    setFilteredCoins(coins);

    if (coins.length > 0 && sortState.key !== "market_cap_rank") {
      const { key, direction } = sortState;
      const sorted = [...coins].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === null) return direction === "asc" ? -1 : 1;
        if (bValue === null) return direction === "asc" ? 1 : -1;

        return direction === "asc"
          ? aValue > bValue
            ? 1
            : -1
          : aValue < bValue
            ? 1
            : -1;
      });

      setFilteredCoins(sorted);
    }
  }, [coins, sortState]);

  // Simulated Live WebSocket Price Micro-Tick Stream
  useEffect(() => {
    if (!isLiveStreamEnabled || filteredCoins.length === 0) return;

    const interval = setInterval(() => {
      const visibleSample = filteredCoins.slice(0, 25);
      if (visibleSample.length === 0) return;

      // Pick 3 to 5 random coins to tick
      const tickCount = Math.min(4, visibleSample.length);
      const nextPrices: Record<string, number> = {};
      const nextFlashes: Record<string, "up" | "down"> = {};

      for (let i = 0; i < tickCount; i++) {
        const randomCoin =
          visibleSample[Math.floor(Math.random() * visibleSample.length)];
        if (!randomCoin) continue;

        const basePrice =
          livePrices[randomCoin.id] ?? randomCoin.current_price ?? 0;
        if (basePrice <= 0) continue;

        // Delta between -0.22% and +0.24%
        const pctDelta = (Math.random() - 0.48) * 0.0045;
        const updatedPrice = Number(
          (basePrice * (1 + pctDelta)).toFixed(basePrice >= 1 ? 2 : 6),
        );

        nextPrices[randomCoin.id] = updatedPrice;
        nextFlashes[randomCoin.id] = pctDelta >= 0 ? "up" : "down";
      }

      setLivePrices((prev) => ({ ...prev, ...nextPrices }));
      setFlashStates(nextFlashes);

      // Clear flash highlight after 900ms
      setTimeout(() => {
        setFlashStates({});
      }, 900);
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveStreamEnabled, filteredCoins, livePrices]);

  return (
    <div className="w-full space-y-4">
      <SearchBar
        onSearch={handleSearch}
        onSort={handleSort}
        currentSort={sortState}
      />

      <div className="glass-panel shadow-xl rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900/40 relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/5 bg-slate-50/80 dark:bg-slate-900/50">
                <th className="w-10 text-center p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  ⭐
                </th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  #
                </th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Đồng Coin
                </th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Giá Hiện Tại
                </th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  24h %
                </th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Vốn Hóa (Market Cap)
                </th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Khối Lượng (24h)
                </th>
                <th className="text-center p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Cảnh Báo
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 dark:border-white/5"
                    >
                      <td colSpan={8} className="p-4">
                        <div className="h-12 bg-indigo-500/5 rounded-xl animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredCoins.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-10 text-center text-slate-500 dark:text-gray-400 font-medium"
                  >
                    Không tìm thấy đồng coin nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredCoins.map((coin) => {
                  const isPriceChangePositive =
                    coin.price_change_percentage_24h >= 0;
                  const starred = isInWatchlist(coin.id);
                  const displayPrice =
                    livePrices[coin.id] ?? coin.current_price;
                  const flash = flashStates[coin.id];

                  return (
                    <tr
                      key={coin.id}
                      className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 transition-all duration-200 group"
                    >
                      {/* Star Watchlist Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(coin.id, coin.name)}
                          className={`p-1.5 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                            starred
                              ? "text-amber-500"
                              : "text-slate-300 hover:text-amber-400 dark:text-gray-600 dark:hover:text-amber-400"
                          }`}
                          title={
                            starred
                              ? "Xóa khỏi Watchlist"
                              : "Thêm vào Watchlist"
                          }
                        >
                          <span
                            className="material-symbols-outlined text-[19px]"
                            style={{
                              fontVariationSettings: starred
                                ? "'FILL' 1"
                                : "'FILL' 0",
                            }}
                          >
                            star
                          </span>
                        </button>
                      </td>

                      {/* Rank */}
                      <td className="p-4">
                        <span className="font-mono text-xs text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/60 dark:border-white/5">
                          {coin.market_cap_rank ??
                            (currentPage - 1) * itemsPerPage +
                              filteredCoins.indexOf(coin) +
                              1}
                        </span>
                      </td>

                      {/* Name & Symbol */}
                      <td className="p-4">
                        <Link
                          to={`/coin/${coin.id}`}
                          className="flex items-center space-x-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                        >
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-gray-100">
                              {coin.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              {coin.symbol}
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Live Price with Flash Animation */}
                      <td className="p-4 text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-lg font-mono font-bold transition-colors duration-300 ${
                            flash === "up"
                              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                              : flash === "down"
                                ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                                : "text-slate-900 dark:text-gray-100"
                          }`}
                        >
                          ${formatNumber(displayPrice)}
                        </span>
                      </td>

                      {/* 24h % */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isPriceChangePositive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {isPriceChangePositive ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {formatPercentage(coin.price_change_percentage_24h)}
                          </span>
                        </div>
                      </td>

                      {/* Market Cap */}
                      <td className="p-4 text-right">
                        <span className="font-semibold text-slate-700 dark:text-gray-300">
                          ${formatNumber(coin.market_cap)}
                        </span>
                      </td>

                      {/* Volume 24h */}
                      <td className="p-4 text-right">
                        <span className="font-semibold text-slate-700 dark:text-gray-300">
                          ${formatNumber(coin.total_volume)}
                        </span>
                      </td>

                      {/* Price Alert Trigger Button */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setAlertTargetCoin({
                              ...coin,
                              current_price: displayPrice,
                            })
                          }
                          className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200/80 dark:bg-indigo-500/10 dark:hover:bg-indigo-600 dark:text-indigo-400 dark:hover:text-white dark:border-indigo-500/20 transition-all cursor-pointer"
                          title={`Đặt cảnh báo giá cho ${coin.name}`}
                        >
                          <span className="material-symbols-outlined text-[17px] block">
                            notifications_active
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Alert Modal */}
      {alertTargetCoin && (
        <PriceAlertModal
          isOpen={!!alertTargetCoin}
          onClose={() => setAlertTargetCoin(null)}
          coinSymbol={alertTargetCoin.symbol}
          coinName={alertTargetCoin.name}
          currentPrice={alertTargetCoin.current_price}
          coinImage={alertTargetCoin.image}
        />
      )}
    </div>
  );
};

export default CoinTable;
