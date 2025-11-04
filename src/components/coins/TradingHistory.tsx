
import { Clock, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { MarketChartData } from "@/types";

interface TradingHistoryProps {
  isLoading?: boolean;
  marketData?: MarketChartData;
}

const TradingHistory = ({ isLoading = false, marketData }: TradingHistoryProps) => {
  // Generate mock trading history data based on the price data
  const generateTradeHistory = () => {
    if (!marketData?.prices || marketData.prices.length < 5) {
      return [];
    }

    // Use the last 5 data points to create mock trades
    return marketData.prices.slice(-5).map(([timestamp, price], index) => {
      const date = new Date(timestamp);
      const isPurchase = index % 2 === 0;
      
      return {
        id: `trade-${index}`,
        type: isPurchase ? 'buy' : 'sell',
        amount: isPurchase ? `+${(0.05 + Math.random() * 0.2).toFixed(3)}` : `-${(0.05 + Math.random() * 0.2).toFixed(3)}`,
        price: price,
        timestamp: date,
      };
    }).reverse();
  };

  const tradeHistory = generateTradeHistory();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-6">Trading History</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : tradeHistory.length > 0 ? (
        <div className="space-y-3">
          {tradeHistory.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${trade.type === 'buy' ? 'bg-crypto-green/10 text-crypto-green' : 'bg-crypto-red/10 text-crypto-red'}`}>
                  {trade.type === 'buy' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
                <div>
                  <p className="font-medium">{trade.type === 'buy' ? 'Buy' : 'Sell'}</p>
                  <p className="text-xs text-muted-foreground">
                    {trade.timestamp.toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(trade.price)}</p>
                <p className={`text-xs ${trade.type === 'buy' ? 'text-crypto-green' : 'text-crypto-red'}`}>
                  {trade.amount} BTC
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="mx-auto h-12 w-12 mb-4" />
          <p>No recent trading history available</p>
        </div>
      )}
    </div>
  );
};

export default TradingHistory;
