
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CoinTable from "@/components/home/CoinTable";
import MainLayout from "@/components/layout/MainLayout";
import { fetchCoins } from "@/services/api";
import { Coin } from "@/types";

const RecentlyAdded = () => {
  const [recentCoins, setRecentCoins] = useState<Coin[]>([]);
  
  const { data: coins, isLoading } = useQuery({
    queryKey: ['coins', 'recent'],
    queryFn: () => fetchCoins(1, 100),
  });
  
  useEffect(() => {
    if (coins && coins.length > 0) {
      // In a real app, you'd have a specific API endpoint for recent coins
      // Here we're using the last coins as a demonstration
      setRecentCoins(coins.slice(coins.length - 50));
    }
  }, [coins]);
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Recently Added</h1>
        <p className="text-muted-foreground">
          Newest cryptocurrencies added to the market.
        </p>
      </div>
      
      <CoinTable coins={recentCoins} isLoading={isLoading} />
    </MainLayout>
  );
};

export default RecentlyAdded;
