import React from "react";

const MarketSnapshotFAB: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <button className="size-14 rounded-full buzz-gradient text-white shadow-2xl shadow-brand-pink/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95">
        <span className="material-symbols-outlined text-3xl">bar_chart</span>
      </button>

      <div className="absolute bottom-full right-0 mb-4 w-72 glass-card rounded-3xl p-5 shadow-2xl border-white/20 hidden group-hover:block animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-black text-sm uppercase tracking-widest text-brand-pink">
            Market Snapshot
          </h4>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold">
            Today
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Market Cap</span>
            <span className="font-bold">$1.24 Trillion</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">24h Volume</span>
            <span className="font-bold">$42.1 Billion</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">BTC Dominance</span>
            <span className="font-bold">48.2%</span>
          </div>
          <div className="pt-3 border-t border-white/10">
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
              Open Full Price Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSnapshotFAB;
