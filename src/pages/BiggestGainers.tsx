
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CoinTable from "@/components/home/CoinTable";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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
    <DashboardLayout hideSidebar={true}>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-emerald-500 to-indigo-500 bg-clip-text text-transparent">Biggest Gainers</h1>
        <p className="text-brand-secondary dark:text-gray-300 text-sm">
          Cryptocurrencies with the highest price increase in the last 24 hours.
        </p>
      </div>
      
      <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-white/50 dark:border-white/10 p-1">
        <CoinTable coins={gainersCoins} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default BiggestGainers;

