import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { fetchCoins } from "@/services/api";
import { Coin } from "@/types";
import {
  TrendingUp,
  Search,
  Zap,
  BarChart2,
  Boxes,
  Database,
  BrainCircuit,
  ArrowRightLeft,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";

const TrendingCoins = () => {
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]);

  const { data: coins, isLoading } = useQuery({
    queryKey: ["coins", "trending"],
    queryFn: () => fetchCoins(1, 100),
  });

  useEffect(() => {
    if (coins && coins.length > 0) {
      // Sort by price change percentage or just take top 10 as trending
      const sorted = [...coins].sort(
        (a, b) =>
          (b.price_change_percentage_24h || 0) -
          (a.price_change_percentage_24h || 0),
      );
      setTrendingCoins(sorted.slice(0, 10));
    }
  }, [coins]);

  return (
    <DashboardLayout>
      <div className="flex flex-col mb-8">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#460df2]/10 p-2 rounded-lg">
              <TrendingUp className="text-[#460df2] h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0d121c] dark:text-white">
                Trending Coins
              </h1>
              <p className="text-slate-500 text-sm">
                Top 10 tokens gaining momentum today
              </p>
            </div>
          </div>
          <button className="size-10 flex items-center justify-center rounded-full glass-panel shadow-sm">
            <Search className="text-slate-700 dark:text-slate-300 h-5 w-5" />
          </button>
        </header>

        {/* Highlights Row (Horizontal Scroll) */}
        <div className="flex overflow-x-auto gap-4 py-2 mb-6 no-scrollbar pb-4">
          {/* Card 1: Top Trending */}
          <div className="min-w-[240px] flex-1 glass-panel rounded-xl p-5 shadow-sm border border-white/50 dark:border-white/10 relative overflow-hidden bg-white/40 dark:bg-[#131B2C]/80">
            <div className="absolute -top-4 -right-4 size-24 bg-gradient-to-br from-[#460df2] to-indigo-400 opacity-10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-[#460df2] dark:text-indigo-400 uppercase tracking-wider">
                Top Trending
              </span>
              <Zap className="text-[#460df2] dark:text-indigo-400 h-5 w-5" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-full bg-gradient-to-br from-[#460df2] to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                B
              </div>
              <div>
                <p className="font-bold text-[#0d121c] dark:text-white">
                  Bitcoin
                </p>
                <p className="text-xs text-slate-500">BTC</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-[#0d121c] dark:text-white">
                $64,231.50
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                +4.2% Today
              </p>
            </div>
          </div>

          {/* Card 2: Most Searched */}
          <div className="min-w-[240px] flex-1 glass-panel rounded-xl p-5 shadow-sm border border-white/50 dark:border-white/10 bg-white/40 dark:bg-[#131B2C]/80">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Most Searched
              </span>
              <Search className="text-slate-400 h-5 w-5" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <p className="font-bold text-[#0d121c] dark:text-white">
                  Solana
                </p>
                <p className="text-xs text-slate-500">SOL</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-[#0d121c] dark:text-white">
                $142.12
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                12k searches/hr
              </p>
            </div>
          </div>

          {/* Card 3: Highest 24h Vol */}
          <div className="min-w-[240px] flex-1 glass-panel rounded-xl p-5 shadow-sm border border-white/50 dark:border-white/10 bg-white/40 dark:bg-[#131B2C]/80">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                High 24h Volume
              </span>
              <BarChart2 className="text-slate-400 h-5 w-5" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                E
              </div>
              <div>
                <p className="font-bold text-[#0d121c] dark:text-white">
                  Ethereum
                </p>
                <p className="text-xs text-slate-500">ETH</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-[#0d121c] dark:text-white">
                $3,450.80
              </p>
              <p className="text-slate-500 text-xs font-medium">$22.4B Vol</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content (Table) */}
          <main className="xl:col-span-3">
            <div className="glass-panel rounded-2xl shadow-sm border-white/50 dark:border-white/10 overflow-hidden bg-white/40 dark:bg-[#131B2C]/80">
              <div className="p-5 border-b border-white/40 dark:border-white/10 flex justify-between items-center bg-white/30 dark:bg-white/5">
                <h2 className="font-bold text-[#0d121c] dark:text-white">
                  Market Leaders
                </h2>
                <span className="text-xs text-[#460df2] dark:text-indigo-400 font-bold cursor-pointer hover:underline">
                  View All
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/20 dark:border-white/10">
                      <th className="px-5 py-4"># Coin</th>
                      <th className="px-5 py-4">Price</th>
                      <th className="px-5 py-4 text-right">24h</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20 dark:divide-white/5">
                    {isLoading
                      ? Array(5)
                          .fill(0)
                          .map((_, idx) => (
                            <tr key={idx}>
                              <td className="px-5 py-4">
                                <Skeleton className="h-10 w-full" />
                              </td>
                              <td className="px-5 py-4">
                                <Skeleton className="h-6 w-20" />
                              </td>
                              <td className="px-5 py-4">
                                <Skeleton className="h-6 w-16 ml-auto" />
                              </td>
                            </tr>
                          ))
                      : trendingCoins.map((coin, index) => (
                          <tr
                            key={coin.id}
                            className="group hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 w-4">
                                  {index + 1}
                                </span>
                                <Link
                                  to={`/coin/${coin.id}`}
                                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                >
                                  <img
                                    src={coin.image}
                                    alt={coin.name}
                                    className="size-8 rounded-full"
                                  />
                                  <div>
                                    <p className="text-sm font-bold text-[#0d121c] dark:text-white">
                                      {coin.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase">
                                      {coin.symbol}
                                    </p>
                                  </div>
                                </Link>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-sm font-bold text-[#0d121c] dark:text-white">
                                ${formatNumber(coin.current_price)}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span
                                className={`text-sm font-bold ${coin.price_change_percentage_24h >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                              >
                                {coin.price_change_percentage_24h > 0
                                  ? "+"
                                  : ""}
                                {coin.price_change_percentage_24h?.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-white/40 dark:border-white/10">
                <Link
                  to="/swap"
                  className="w-full py-4 bg-gradient-to-r from-[#460df2] to-indigo-500 hover:from-indigo-600 hover:to-indigo-400 transition-all rounded-xl text-white font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                  Quick Trade
                </Link>
              </div>
            </div>
          </main>

          {/* Ecosystems Section */}
          <section className="xl:col-span-1">
            <div className="glass-panel rounded-2xl p-5 shadow-sm border-white/50 dark:border-white/10 bg-white/40 dark:bg-[#131B2C]/80 h-full">
              <h3 className="font-bold text-sm mb-6 text-[#0d121c] dark:text-white uppercase tracking-wide">
                Top 3 Ecosystems
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-white/5 rounded-xl border border-white/80 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center">
                      <Boxes className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0d121c] dark:text-white">
                        Solana
                      </p>
                      <p className="text-[10px] text-slate-500">Layer 1</p>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    +18.4%
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-white/5 rounded-xl border border-white/80 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <Database className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0d121c] dark:text-white">
                        Base
                      </p>
                      <p className="text-[10px] text-slate-500">Layer 2</p>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    +12.1%
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-white/5 rounded-xl border border-white/80 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-[#460df2] to-indigo-400 flex items-center justify-center">
                      <BrainCircuit className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0d121c] dark:text-white">
                        AI Agents
                      </p>
                      <p className="text-[10px] text-slate-500">Sector</p>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    +34.8%
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrendingCoins;
