import React from "react";

const MetricsContent = () => (
  <>
    <div className="flex items-center gap-1">
      <span>Cryptos:</span>
      <span className="text-brand-primary font-semibold">22,000+</span>
    </div>
    <div className="flex items-center gap-1">
      <span>Exchanges:</span>
      <span className="text-brand-primary font-semibold">500+</span>
    </div>
    <div className="flex items-center gap-1">
      <span>Market Cap:</span>
      <span className="text-brand-primary font-semibold">$1.2T</span>
    </div>
    <div className="flex items-center gap-1">
      <span>24h Vol:</span>
      <span className="text-brand-primary font-semibold">$42B</span>
    </div>
    <div className="flex items-center gap-1">
      <span>Dominance:</span>
      <span className="text-brand-primary font-semibold">BTC 48% ETH 19%</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="material-symbols-outlined text-[16px] text-blue-500">
        local_gas_station
      </span>
      <span>Gas:</span>
      <span className="text-brand-primary font-semibold">12 Gwei</span>
    </div>
  </>
);

const TopMetricsBar: React.FC = () => {
  return (
    <div className="glass-panel border-b border-border-light dark:border-border-dark py-2 text-xs font-medium text-brand-secondary dark:text-gray-300 overflow-hidden z-20">
      <div className="flex whitespace-nowrap relative group">
        <div className="flex items-center gap-8 px-4 animate-marquee group-hover:[animation-play-state:paused] min-w-full justify-around">
          <MetricsContent />
        </div>
        <div className="flex items-center gap-8 px-4 animate-marquee group-hover:[animation-play-state:paused] min-w-full justify-around absolute top-0 left-full">
          <MetricsContent />
        </div>
      </div>
    </div>
  );
};

export default TopMetricsBar;
