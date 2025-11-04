
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CoinTable from "@/components/home/CoinTable";
import MainLayout from "@/components/layout/MainLayout";
import { fetchCoins } from "@/services/api";
import { Coin } from "@/types";

const TrendingCoins = () => {
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]);
  
  const { data: coins, isLoading } = useQuery({
    queryKey: ['coins', 'trending'],
    queryFn: () => fetchCoins(1, 100),
  });
  
  useEffect(() => {
    if (coins && coins.length > 0) {
      // Get top market cap coins as trending
      setTrendingCoins(coins.slice(0, 50));
    }
  }, [coins]);
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Trending Cryptocurrencies</h1>
        <p className="text-muted-foreground">
          Top cryptocurrencies by market cap and trading volume.
        </p>
      </div>
      
      <CoinTable coins={trendingCoins} isLoading={isLoading} />
    </MainLayout>
  );
};

export default TrendingCoins;
