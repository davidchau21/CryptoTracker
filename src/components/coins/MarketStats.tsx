
import { CoinDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";

interface MarketStatsProps {
  coinDetails: CoinDetails | null;
  isLoading: boolean;
}

const MarketStats = ({ coinDetails, isLoading }: MarketStatsProps) => {
  // Calculate fully diluted valuation
  const fullyDilutedValuation = coinDetails 
    ? (coinDetails.total_supply || 0) * (coinDetails.current_price || 0) 
    : 0;
  
  // Format display values with fallbacks
  const symbol = coinDetails?.symbol?.toUpperCase() || '';
  
  console.log("Market Stats Data:", {
    marketCap: coinDetails?.market_cap,
    volume: coinDetails?.total_volume,
    fdv: fullyDilutedValuation,
    circulatingSupply: coinDetails?.circulating_supply,
    totalSupply: coinDetails?.total_supply,
    maxSupply: coinDetails?.max_supply
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-6">Market Stats</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Market Cap</div>
            <div className="text-lg font-medium">
              ${formatNumber(coinDetails?.market_cap || 0)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">24h Trading Volume</div>
            <div className="text-lg font-medium">
              ${formatNumber(coinDetails?.total_volume || 0)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Fully Diluted Valuation</div>
            <div className="text-lg font-medium">
              ${formatNumber(fullyDilutedValuation)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Circulating Supply</div>
            <div className="text-lg font-medium">
              {formatNumber(coinDetails?.circulating_supply || 0)} {symbol}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Supply</div>
            <div className="text-lg font-medium">
              {coinDetails?.total_supply ? `${formatNumber(coinDetails.total_supply)} ${symbol}` : 'N/A'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Max Supply</div>
            <div className="text-lg font-medium">
              {coinDetails?.max_supply 
                ? `${formatNumber(coinDetails.max_supply)} ${symbol}`
                : 'Unlimited'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketStats;
