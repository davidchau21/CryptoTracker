import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, TrendingDown, TrendingUp } from "lucide-react";
import { Coin, SortKey, SortState } from "@/types";
import SearchBar from "@/components/ui/SearchBar";
import { formatNumber, formatPercentage } from "@/lib/utils";

interface CoinTableProps {
  coins: Coin[];
  isLoading: boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const CoinTable = ({
  coins,
  isLoading,
  currentPage = 1,
  itemsPerPage = 20,
}: CoinTableProps) => {
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins);
  const [sortState, setSortState] = useState<SortState>({
    key: "market_cap_rank",
    direction: "asc",
  });

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

      // Handle null values
      if (aValue === null) return direction === "asc" ? -1 : 1;
      if (bValue === null) return direction === "asc" ? 1 : -1;

      // Sort based on direction
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

    // When coins change (e.g., when page changes), apply the current sort
    if (coins.length > 0 && sortState.key !== "market_cap_rank") {
      const { key, direction } = sortState;
      const sorted = [...coins].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        // Handle null values
        if (aValue === null) return direction === "asc" ? -1 : 1;
        if (bValue === null) return direction === "asc" ? 1 : -1;

        // Sort based on direction
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

  return (
    <div className="w-full space-y-4">
      <SearchBar
        onSearch={handleSearch}
        onSort={handleSort}
        currentSort={sortState}
      />

      <div className="glass-panel shadow-xl rounded-2xl overflow-hidden border border-white/40 dark:border-white/5 bg-white/20 dark:bg-slate-900/40 relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  #
                </th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Name
                </th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Price
                </th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  24h %
                </th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Market Cap
                </th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-gray-400">
                  Volume (24h)
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index} className="border-b border-white/10 dark:border-white/5">
                      <td colSpan={6} className="p-4">
                        <div className="h-12 bg-indigo-500/5 rounded-xl animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredCoins.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-slate-500 dark:text-gray-400 font-medium"
                  >
                    No coins found
                  </td>
                </tr>
              ) : (
                filteredCoins.map((coin) => {
                  const isPriceChangePositive =
                    coin.price_change_percentage_24h >= 0;

                  return (
                    <tr
                      key={coin.id}
                      className="border-b border-white/10 dark:border-white/5 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 hover:translate-x-0.5 transition-all duration-300 group"
                    >
                      <td className="p-4">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-white/10 dark:border-white/5 shadow-sm">
                          {coin.market_cap_rank ??
                            (currentPage - 1) * itemsPerPage +
                              filteredCoins.indexOf(coin) +
                              1}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          to={`/coin/${coin.id}`}
                          className="flex items-center space-x-3 group-hover:text-indigo-500 transition-colors"
                        >
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full bg-white shadow-sm ring-1 ring-white/10"
                          />
                          <div>
                            <div className="font-bold text-slate-800 dark:text-gray-100">{coin.name}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              {coin.symbol}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-slate-800 dark:text-gray-100">
                          ${formatNumber(coin.current_price)}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isPriceChangePositive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-glow-success"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-glow-danger"
                          }`}>
                            {isPriceChangePositive ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {formatPercentage(coin.price_change_percentage_24h)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-semibold text-slate-700 dark:text-gray-300">
                          ${formatNumber(coin.market_cap)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-semibold text-slate-700 dark:text-gray-300">
                          ${formatNumber(coin.total_volume)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>    </div>
  );
};

export default CoinTable;
