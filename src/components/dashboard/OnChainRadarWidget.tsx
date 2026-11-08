import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RadarEvent {
  id: string;
  category: "whale" | "ctk";
  badgeLabel: string;
  badgeStyle: string;
  routeText: string;
  amountText: string;
  subValueText: string;
  network: string;
  timeLabel: string;
}

const INITIAL_EVENTS: RadarEvent[] = [
  {
    id: "ev-1",
    category: "ctk",
    badgeLabel: "🔒 STAKE VAULT",
    badgeStyle:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
    routeText: "0x89a4...e91b ➔ 90-Day Whale Vault",
    amountText: "+450.00 CTK",
    subValueText: "150% Base APY × 1.5x VIP",
    network: "Sepolia",
    timeLabel: "Vừa xong",
  },
  {
    id: "ev-2",
    category: "whale",
    badgeLabel: "🐋 WHALE ALERT",
    badgeStyle:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    routeText: "Binance ➔ Ví Lạnh 0x42c9...77a1",
    amountText: "320 BTC",
    subValueText: "~$29.4M USD (Tích lũy)",
    network: "Bitcoin",
    timeLabel: "18 giây trước",
  },
  {
    id: "ev-3",
    category: "ctk",
    badgeLabel: "🪙 MINT REWARD",
    badgeStyle:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    routeText: "CTK Treasury ➔ 0x71b2...309f",
    amountText: "+110.00 CTK",
    subValueText: "Rút thưởng Nhiệm Vụ On-Chain",
    network: "Sepolia",
    timeLabel: "45 giây trước",
  },
  {
    id: "ev-4",
    category: "whale",
    badgeLabel: "🔄 DEX WHALE SWAP",
    badgeStyle:
      "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30",
    routeText: "0x19f0...c482 (Uniswap V3)",
    amountText: "4,500 ETH ➔ USDT",
    subValueText: "~$14.8M USD",
    network: "Ethereum",
    timeLabel: "1 phút trước",
  },
  {
    id: "ev-5",
    category: "ctk",
    badgeLabel: "⚡ AUTO-COMPOUND",
    badgeStyle:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30",
    routeText: "0x63d8...91a0 (Staking Vault)",
    amountText: "+24.85 CTK",
    subValueText: "Gộp lãi kép miễn phí Gas",
    network: "Sepolia",
    timeLabel: "2 phút trước",
  },
];

const STREAM_POOL: Omit<RadarEvent, "id" | "timeLabel">[] = [
  {
    category: "ctk",
    badgeLabel: "🔒 STAKE VAULT",
    badgeStyle:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
    routeText: "0x55e1...88b4 ➔ 30-Day Boost",
    amountText: "+200.00 CTK",
    subValueText: "85% APY + Điểm Thực Lực VIP",
    network: "Sepolia",
  },
  {
    category: "whale",
    badgeLabel: "🐋 WHALE ALERT",
    badgeStyle:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    routeText: "Ví Cá Voi 0x99d...12f ➔ Coinbase",
    amountText: "85,000 SOL",
    subValueText: "~$15.2M USD",
    network: "Solana",
  },
  {
    category: "ctk",
    badgeLabel: "🪙 QUEST CLAIM",
    badgeStyle:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    routeText: "CTK Minter ➔ 0x28c7...11d3",
    amountText: "+50.00 CTK",
    subValueText: "Nhiệm vụ Liên kết ví Web3",
    network: "BSC Testnet",
  },
  {
    category: "whale",
    badgeLabel: "💵 TREASURY MINT",
    badgeStyle:
      "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30",
    routeText: "Tether Treasury ➔ Ethereum",
    amountText: "50,000,000 USDT",
    subValueText: "Dòng tiền thanh khoản mới",
    network: "Ethereum",
  },
];

const OnChainRadarWidget: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<RadarEvent[]>(INITIAL_EVENTS);
  const [filter, setFilter] = useState<"all" | "whale" | "ctk">("all");

  useEffect(() => {
    let cursor = 0;
    const interval = setInterval(() => {
      const template = STREAM_POOL[cursor % STREAM_POOL.length];
      cursor += 1;

      const newEvent: RadarEvent = {
        ...template,
        id: `live-${Date.now()}`,
        timeLabel: "Vừa xong",
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 6)]);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const visibleEvents =
    filter === "all"
      ? events.slice(0, 4)
      : events.filter((e) => e.category === filter).slice(0, 4);

  return (
    <div className="rounded-2xl p-6 border bg-white border-slate-200/90 shadow-md dark:glass-panel dark:border-white/10 dark:bg-slate-900/60 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            On-Chain & Whale Radar
          </h3>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
          LIVE FEED
        </span>
      </div>

      {/* Filter Pills */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-4 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === "all"
              ? "bg-white text-indigo-600 shadow-xs dark:bg-indigo-600 dark:text-white"
              : "text-slate-600 dark:text-gray-400"
          }`}
        >
          Tất cả
        </button>
        <button
          type="button"
          onClick={() => setFilter("whale")}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === "whale"
              ? "bg-white text-indigo-600 shadow-xs dark:bg-indigo-600 dark:text-white"
              : "text-slate-600 dark:text-gray-400"
          }`}
        >
          🐋 Cá Voi
        </button>
        <button
          type="button"
          onClick={() => setFilter("ctk")}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === "ctk"
              ? "bg-white text-indigo-600 shadow-xs dark:bg-indigo-600 dark:text-white"
              : "text-slate-600 dark:text-gray-400"
          }`}
        >
          ⚡ CTK Chain
        </button>
      </div>

      {/* Live Feed List */}
      <div className="space-y-2.5">
        {visibleEvents.map((ev) => (
          <div
            key={ev.id}
            className="p-3 rounded-xl border bg-slate-50/70 border-slate-200/70 hover:border-indigo-200 dark:bg-slate-800/40 dark:border-white/5 dark:hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${ev.badgeStyle}`}
              >
                {ev.badgeLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium">
                {ev.network} · {ev.timeLabel}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2 mt-1.5">
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-gray-300 truncate">
                {ev.routeText}
              </span>
              <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 shrink-0">
                {ev.amountText}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 block mt-0.5">
              {ev.subValueText}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Quick Link */}
      <button
        type="button"
        onClick={() => navigate("/leaderboard")}
        className="w-full mt-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 hover:bg-indigo-100/80 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[15px]">
          leaderboard
        </span>
        Xem Top Cá Voi Trên Bảng Xếp Hạng
      </button>
    </div>
  );
};

export default OnChainRadarWidget;

