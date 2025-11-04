
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { CoinDetails } from "@/types";

interface CoinHeaderProps {
  coinDetails: CoinDetails | null;
  isLoading: boolean;
}

const CoinHeader = ({ coinDetails, isLoading }: CoinHeaderProps) => {
  const isPriceChangePositive = coinDetails?.price_change_percentage_24h >= 0;

  return (
    <div className="mb-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coins
        </Link>
      </Button>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <img 
              src={coinDetails?.image} 
              alt={coinDetails?.name} 
              className="w-12 h-12 rounded-full mr-4" 
            />
            <div>
              <h1 className="text-3xl font-bold">{coinDetails?.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-lg text-muted-foreground uppercase">
                  {coinDetails?.symbol}
                </span>
                <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                  Rank #{coinDetails?.market_cap_rank}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold">
              ${formatNumber(coinDetails?.current_price || 0)}
            </div>
            <div 
              className={`flex items-center ${
                isPriceChangePositive ? 'text-crypto-green' : 'text-crypto-red'
              }`}
            >
              {formatPercentage(coinDetails?.price_change_percentage_24h || 0)}
              <span className="text-sm text-muted-foreground ml-2">(24h)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinHeader;
