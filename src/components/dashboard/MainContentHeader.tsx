import React from "react";

const MainContentHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[#0d121c] dark:text-white mb-3 tracking-tight">
        Today's Cryptocurrency Prices
      </h1>
      <p className="text-brand-secondary dark:text-gray-300 text-sm mb-6">
        The global crypto market cap is{" "}
        <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1 py-0.5 rounded text-glow-success">
          $1.2T
        </span>
        , a{" "}
        <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1 py-0.5 rounded text-glow-success">
          0.5%
        </span>{" "}
        increase over the last day.
      </p>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold whitespace-nowrap hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
          <span className="material-symbols-outlined text-[18px]">star</span>{" "}
          Watchlist
        </button>
        <button className="glass-panel backdrop-blur-sm px-4 py-2 rounded-full text-[#0d121c] dark:text-gray-200 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors whitespace-nowrap shadow-sm">
          DeFi
        </button>
        <button className="glass-panel backdrop-blur-sm px-4 py-2 rounded-full text-[#0d121c] dark:text-gray-200 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors whitespace-nowrap shadow-sm">
          Metaverse
        </button>
        <button className="glass-panel backdrop-blur-sm px-4 py-2 rounded-full text-[#0d121c] dark:text-gray-200 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors whitespace-nowrap shadow-sm">
          Gaming
        </button>
        <button className="glass-panel backdrop-blur-sm px-4 py-2 rounded-full text-[#0d121c] dark:text-gray-200 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors whitespace-nowrap shadow-sm">
          Gainers
        </button>
        <button className="glass-panel backdrop-blur-sm px-4 py-2 rounded-full text-[#0d121c] dark:text-gray-200 text-sm font-medium hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors whitespace-nowrap shadow-sm">
          Losers
        </button>
      </div>
    </div>
  );
};

export default MainContentHeader;
