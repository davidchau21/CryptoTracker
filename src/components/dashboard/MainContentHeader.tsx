import React from "react";

export type MarketFilterCategory =
  | "all"
  | "watchlist"
  | "defi"
  | "gaming"
  | "gainers"
  | "losers";

interface MainContentHeaderProps {
  activeCategory?: MarketFilterCategory;
  onSelectCategory?: (category: MarketFilterCategory) => void;
  watchlistCount?: number;
  isLiveStreamEnabled?: boolean;
  onToggleLiveStream?: () => void;
}

const FILTER_TABS: Array<{
  id: MarketFilterCategory;
  label: string;
  icon: string;
}> = [
  { id: "all", label: "Tất cả thị trường", icon: "public" },
  { id: "watchlist", label: "Watchlist", icon: "star" },
  { id: "gainers", label: "Tăng mạnh (Gainers)", icon: "trending_up" },
  { id: "losers", label: "Giảm sâu (Losers)", icon: "trending_down" },
  { id: "defi", label: "Hệ sinh thái DeFi", icon: "account_balance" },
  { id: "gaming", label: "Gaming & Web3", icon: "sports_esports" },
];

const MainContentHeader: React.FC<MainContentHeaderProps> = ({
  activeCategory = "all",
  onSelectCategory,
  watchlistCount = 0,
  isLiveStreamEnabled = true,
  onToggleLiveStream,
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0d121c] dark:text-white mb-2 tracking-tight">
            Giá Tiền Điện Tử Hôm Nay Theo Vốn Hóa
          </h1>
          <p className="text-brand-secondary dark:text-gray-300 text-sm">
            Tổng vốn hóa thị trường toàn cầu đạt{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              $2.48T
            </span>
            , biến động{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +1.84%
            </span>{" "}
            trong 24 giờ qua.
          </p>
        </div>

        {/* Live Price Stream Toggle */}
        {onToggleLiveStream && (
          <button
            type="button"
            onClick={onToggleLiveStream}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all shrink-0 cursor-pointer ${
              isLiveStreamEnabled
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                : "bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-gray-400 dark:border-white/10"
            }`}
            title="Bật/Tắt hiệu ứng nhảy giá thời gian thực"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveStreamEnabled
                  ? "bg-emerald-500 animate-ping"
                  : "bg-slate-400"
              }`}
            ></span>
            <span>⚡ Giá Nhảy Real-time: {isLiveStreamEnabled ? "BẬT" : "TẮT"}</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {FILTER_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory?.(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                  : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 dark:bg-slate-900/60 dark:text-gray-200 dark:border-white/10 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[17px] ${
                  tab.id === "watchlist" && !isActive ? "text-amber-500" : ""
                }`}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.id === "watchlist" && (
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                  }`}
                >
                  {watchlistCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MainContentHeader;
