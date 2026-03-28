import PriceChart from "@/components/charts/PriceChart";
import { ChartData, TimeRange } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSectionProps {
  chartData: ChartData[] | undefined;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isLoading: boolean;
}

const ChartSection = ({
  chartData,
  timeRange,
  onTimeRangeChange,
  isLoading,
}: ChartSectionProps) => {
  return (
    <div className="glass-panel p-6 border border-white/50 dark:border-white/10 rounded-2xl relative overflow-hidden shadow-sm mb-8">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <h2 className="text-xl font-bold text-[#0d121c] dark:text-white">
          Price Chart
        </h2>
      </div>

      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-white/50 dark:border-white/5 bg-white/40 dark:bg-gradient-to-b dark:from-[#0F1623]/50 dark:to-[#0F1623]/20">
        {isLoading ? (
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
