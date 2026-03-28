import React from "react";

const LiveTicker: React.FC = () => {
  return (
    <div className="bg-black/60 backdrop-blur-md border-b border-white/5 py-2 px-4 overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex items-center gap-8 whitespace-nowrap animate-marquee">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-brand-cyan shadow-[0_0_8px_#50e3c2]"></span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-cyan">
            Live Buzz
          </span>
        </div>
        <div className="flex gap-6 text-xs font-medium text-gray-400">
          <span className="flex items-center gap-1.5">
            🔥 <span className="text-white">Bitcoin</span> is trending in US
          </span>
          <span className="flex items-center gap-1.5">
            🚀 <span className="text-white">Solana</span> sentiment hits 89%
            Bullish
          </span>
          <span className="flex items-center gap-1.5">
            💎 <span className="text-white">Ether</span> Whale moved 50k ETH
          </span>
          <span className="flex items-center gap-1.5">
            📢 <span className="text-white">Polygon</span> 2.0 announcement live
          </span>
          <span className="flex items-center gap-1.5">
            📉 <span className="text-white">PEPE</span> volume down 12%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveTicker;
