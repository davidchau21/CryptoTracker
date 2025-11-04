
import { Link } from "react-router-dom";
import { Coin } from "@/types";
import { formatNumber, formatPercentage } from "@/lib/utils";

interface CoinCardProps {
  coin: Coin;
}

const CoinCard = ({ coin }: CoinCardProps) => {
  const isPriceChangePositive = coin.price_change_percentage_24h >= 0;

  return (
    <Link to={`/coin/${coin.id}`}>
      <div className="bg-card p-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer border border-border hover:border-primary/50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full mr-2" />
            <div>
              <h3 className="font-semibold">{coin.name}</h3>
              <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${isPriceChangePositive ? 'bg-crypto-green/20 text-crypto-green' : 'bg-crypto-red/20 text-crypto-red'}`}>
            {formatPercentage(coin.price_change_percentage_24h)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-bold">${formatNumber(coin.current_price)}</div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Market Cap</span>
            <span>${formatNumber(coin.market_cap)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Volume (24h)</span>
            <span>${formatNumber(coin.total_volume)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
