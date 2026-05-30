import { useState } from "react";
import PriceChart from "@/components/charts/PriceChart";
import TradingViewChart from "./TradingViewChart";
import { useTheme } from "@/providers/ThemeProvider";
import { ChartData, TimeRange } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSectionProps {
  chartData: ChartData[] | undefined;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isLoading: boolean;
  symbol: string | undefined;
}

const ChartSection = ({
  chartData,
  timeRange,
  onTimeRangeChange,
  isLoading,
  symbol,
}: ChartSectionProps) => {
  const [chartType, setChartType] = useState<"tradingview" | "simple">("tradingview");
  const { theme } = useTheme();

  return (
    <div className="glass-panel p-6 border border-white/50 dark:border-white/10 rounded-2xl relative overflow-hidden shadow-sm mb-8">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <h2 className="text-xl font-bold text-[#0d121c] dark:text-white">
          Price Chart
        </h2>

        {/* Chart Type Toggle */}
        <div className="flex bg-[#F1F3F6] dark:bg-[#0F1623] p-1 rounded-xl border border-white/50 dark:border-white/5 shadow-inner">
          <button
            onClick={() => setChartType("tradingview")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              chartType === "tradingview"
                ? "bg-white dark:bg-[#1E293B] text-indigo-600 dark:text-cyan-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            TradingView (Pro)
          </button>
          <button
            onClick={() => setChartType("simple")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              chartType === "simple"
                ? "bg-white dark:bg-[#1E293B] text-indigo-600 dark:text-cyan-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Simple Chart
          </button>
        </div>
      </div>

      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-white/50 dark:border-white/5 bg-white/40 dark:bg-gradient-to-b dark:from-[#0F1623]/50 dark:to-[#0F1623]/20">
        {chartType === "tradingview" ? (
          <div className="w-full h-full p-2">
            <TradingViewChart symbol={symbol ?? "BTC"} theme={theme} />
          </div>
        ) : isLoading ? (
          <div className="w-full h-full p-4 flex flex-col justify-end">
            <Skeleton className="w-full h-full opacity-50" />
          </div>
        ) : chartData && chartData.length > 0 ? (
          <div className="w-full h-full p-4">
            <PriceChart
              data={chartData}
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-brand-secondary">No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartSection;
