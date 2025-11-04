import { useState, useEffect } from "react";
import { fetchCoins } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Coin } from "@/types";
import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp, Star, Plus } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export const TrendingSections = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]);
  const [gainersCoins, setGainersCoins] = useState<Coin[]>([]);
  const [recentCoins, setRecentCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const coins = await fetchCoins(1, 100);
        
        if (coins && coins.length > 0) {
          setTrendingCoins(coins.slice(0, 3));
          const sortedByGain = [...coins].sort((a, b) => 
            (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
          );
          setGainersCoins(sortedByGain.slice(0, 3));
          setRecentCoins(coins.slice(coins.length - 3, coins.length));
        }
      } catch (error) {
        console.error("Failed to load section data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TrendingSection coins={trendingCoins} isLoading={isLoading} />
      <BiggestGainersSection coins={gainersCoins} isLoading={isLoading} />
      <RecentlyAddedSection coins={recentCoins} isLoading={isLoading} />
    </div>
  );
};

interface SectionProps {
  coins: Coin[];
  isLoading: boolean;
}

// Trending Section Component
const TrendingSection = ({ coins, isLoading }: SectionProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500/10 p-1.5 rounded-full">
            <TrendingUp className="text-orange-500 h-4 w-4" />
          </div>
          <h3 className="font-medium">Trending</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary text-sm" asChild>
          <Link to="/trending">
            More <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      <div className="border-t border-border">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          coins.map((coin, index) => (
            <CoinListItem key={coin.id} coin={coin} rank={index + 1} />
          ))
        )}
      </div>
    </div>
  );
};

// Biggest Gainers Section Component
const BiggestGainersSection = ({ coins, isLoading }: SectionProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-green-500/10 p-1.5 rounded-full">
            <Star className="text-green-500 h-4 w-4" />
          </div>
          <h3 className="font-medium">Biggest Gainers</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary text-sm" asChild>
          <Link to="/gainers">
            More <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      <div className="border-t border-border">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          coins.map((coin, index) => (
            <CoinListItem key={coin.id} coin={coin} rank={index + 1} />
          ))
        )}
      </div>
    </div>
  );
};

// Recently Added Section Component
const RecentlyAddedSection = ({ coins, isLoading }: SectionProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500/10 p-1.5 rounded-full">
            <Plus className="text-blue-500 h-4 w-4" />
          </div>
          <h3 className="font-medium">Recently Added</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary text-sm" asChild>
          <Link to="/recent">
            More <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      <div className="border-t border-border">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          coins.map((coin, index) => (
            <CoinListItem key={coin.id} coin={coin} rank={index + 1} />
          ))
        )}
      </div>
    </div>
  );
};

const CoinListItem = ({ coin, rank }: { coin: Coin; rank: number }) => {
  return (
    <Link to={`/coin/${coin.id}`} className="flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center space-x-3">
        <span className="text-sm text-muted-foreground w-4 text-center">{rank}</span>
        <div className="w-6 h-6 overflow-hidden rounded-full flex-shrink-0">
          <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="font-medium">{coin.name}</span>
          <span className="text-sm text-muted-foreground ml-2">{coin.symbol.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-medium">${formatNumber(coin.current_price)}</span>
        <span className={coin.price_change_percentage_24h >= 0 ? "text-crypto-green text-sm" : "text-crypto-red text-sm"}>
          {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
        </span>
      </div>
    </Link>
  );
};

const LoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <div key={item} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-24 h-5" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-12 h-4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
