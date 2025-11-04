
import PriceChart from "@/components/charts/PriceChart";
import { ChartData, TimeRange, MarketChartData } from "@/types";
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
  isLoading 
}: ChartSectionProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-6">Price Chart</h2>
      {isLoading ? (
        <div className="w-full h-[400px]">
          <Skeleton className="w-full h-full" />
        </div>
      ) : chartData && chartData.length > 0 ? (
        <PriceChart 
          data={chartData} 
          timeRange={timeRange} 
          onTimeRangeChange={onTimeRangeChange} 
          isLoading={isLoading} 
        />
      ) : (
        <div className="w-full h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No chart data available</p>
        </div>
      )}
    </div>
  );
};

export default ChartSection;
