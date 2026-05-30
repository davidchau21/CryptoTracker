
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CoinTable from "@/components/home/CoinTable";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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
    <DashboardLayout hideSidebar={true}>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Recently Added</h1>
        <p className="text-brand-secondary dark:text-gray-300 text-sm">
          Newest cryptocurrencies added to the market.
        </p>
      </div>
      
      <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-white/50 dark:border-white/10 p-1">
        <CoinTable coins={recentCoins} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default RecentlyAdded;

