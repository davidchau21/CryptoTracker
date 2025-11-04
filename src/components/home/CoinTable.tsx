
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, TrendingDown, TrendingUp } from "lucide-react";
import { Coin, SortKey, SortState } from "@/types";
import SearchBar from "@/components/ui/SearchBar";
import { formatNumber, formatPercentage } from "@/lib/utils";

interface CoinTableProps {
  coins: Coin[];
  isLoading: boolean;
}

const CoinTable = ({ coins, isLoading }: CoinTableProps) => {
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins);
  const [sortState, setSortState] = useState<SortState>({
    key: "market_cap_rank",
    direction: "asc",
  });

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCoins(coins);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const results = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(lowercasedQuery) ||
        coin.symbol.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredCoins(results);
  };

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState);
    
    const { key, direction } = newSortState;
    const sorted = [...filteredCoins].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      
      // Handle null values
      if (aValue === null) return direction === 'asc' ? -1 : 1;
      if (bValue === null) return direction === 'asc' ? 1 : -1;
      
      // Sort based on direction
      return direction === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
    
    setFilteredCoins(sorted);
  };

  // Update filtered coins when the main coins list changes
  useEffect(() => {
    setFilteredCoins(coins);
    
    // When coins change (e.g., when page changes), apply the current sort
    if (coins.length > 0 && sortState.key !== "market_cap_rank") {
      const { key, direction } = sortState;
      const sorted = [...coins].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        
        // Handle null values
        if (aValue === null) return direction === 'asc' ? -1 : 1;
        if (bValue === null) return direction === 'asc' ? 1 : -1;
        
        // Sort based on direction
        return direction === 'asc' 
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1);
      });
      
      setFilteredCoins(sorted);
    }
  }, [coins, sortState]);

  return (
    <div className="w-full space-y-4">
      <SearchBar 
        onSearch={handleSearch} 
        onSort={handleSort} 
        currentSort={sortState} 
      />
      
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">#</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Price</th>
                <th className="text-right p-4 font-medium text-muted-foreground">24h %</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Market Cap</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index} className="border-b border-border">
                      <td colSpan={6} className="p-4">
                        <div className="h-12 bg-secondary/50 rounded animate-pulse-opacity"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredCoins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No coins found
                  </td>
                </tr>
              ) : (
                filteredCoins.map((coin) => {
                  const isPriceChangePositive = coin.price_change_percentage_24h >= 0;
                  
                  return (
                    <tr 
                      key={coin.id} 
                      className="border-b border-border hover:bg-secondary/20 transition-colors"
                    >
                      <td className="p-4 text-sm">{coin.market_cap_rank}</td>
                      <td className="p-4">
                        <Link 
                          to={`/coin/${coin.id}`} 
                          className="flex items-center space-x-3 hover:text-primary transition-colors"
                        >
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-8 h-8 rounded-full" 
                          />
                          <div>
                            <div className="font-medium">{coin.name}</div>
                            <div className="text-xs text-muted-foreground uppercase">
                              {coin.symbol}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">${formatNumber(coin.current_price)}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`flex items-center justify-end ${isPriceChangePositive ? 'text-crypto-green' : 'text-crypto-red'}`}>
                          {isPriceChangePositive ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {formatPercentage(coin.price_change_percentage_24h)}
                        </div>
                      </td>
                      <td className="p-4 text-right">${formatNumber(coin.market_cap)}</td>
                      <td className="p-4 text-right">${formatNumber(coin.total_volume)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoinTable;
