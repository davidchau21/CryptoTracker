
import { CoinDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";

interface PriceRangeProps {
  coinDetails: CoinDetails | null;
  isLoading: boolean;
}

const PriceRange = ({ coinDetails, isLoading }: PriceRangeProps) => {
  // Calculate position on price range
  const currentPrice = coinDetails?.current_price || 0;
  const lowPrice = coinDetails?.low_24h || 0;
  const highPrice = coinDetails?.high_24h || 0;
  
  // Calculate percentage position with safety checks
  let clampedPercentage = 50; // Default to middle if there's no valid range
  
  if (highPrice - lowPrice > 0) {
    const priceRangePercentage = ((currentPrice - lowPrice) / (highPrice - lowPrice)) * 100;
    // Clamp between 0 and 100
    clampedPercentage = Math.max(0, Math.min(100, priceRangePercentage));
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-6">Price Range (24h)</h2>
      
      {isLoading ? (
        <Skeleton className="h-16" />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Low: ${formatNumber(lowPrice)}</span>
            <span>Current: ${formatNumber(currentPrice)}</span>
            <span>High: ${formatNumber(highPrice)}</span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            {/* Gradient background */}
            <div 
              className="absolute top-0 h-full bg-gradient-to-r from-crypto-red via-yellow-500 to-crypto-green"
              style={{ width: '100%' }}
            ></div>
            {/* Slider thumb */}
            <div 
              className="absolute top-0 h-full w-2 bg-white rounded-full shadow-md z-10"
              style={{ 
                left: `${clampedPercentage}%`,
                transform: 'translateX(-50%)'
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceRange;
