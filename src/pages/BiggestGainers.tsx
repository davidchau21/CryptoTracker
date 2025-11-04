
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CoinTable from "@/components/home/CoinTable";
import MainLayout from "@/components/layout/MainLayout";
import { fetchCoins } from "@/services/api";
import { Coin } from "@/types";

const BiggestGainers = () => {
  const [gainersCoins, setGainersCoins] = useState<Coin[]>([]);
  
  const { data: coins, isLoading } = useQuery({
    queryKey: ['coins', 'gainers'],
    queryFn: () => fetchCoins(1, 100),
  });
  
  useEffect(() => {
    if (coins && coins.length > 0) {
      // Sort by 24h price change percentage (highest to lowest)
      const sortedByGain = [...coins].sort((a, b) => 
        (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
      );
      setGainersCoins(sortedByGain.slice(0, 50));
    }
  }, [coins]);
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Biggest Gainers</h1>
        <p className="text-muted-foreground">
          Cryptocurrencies with the highest price increase in the last 24 hours.
        </p>
      </div>
      
      <CoinTable coins={gainersCoins} isLoading={isLoading} />
    </MainLayout>
  );
};

export default BiggestGainers;
