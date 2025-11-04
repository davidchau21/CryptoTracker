
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CoinTable from "@/components/home/CoinTable";
import PageHeader from "@/components/home/PageHeader";
import PaginationControls from "@/components/home/Pagination";
import MainLayout from "@/components/layout/MainLayout";
import { fetchCoins } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const { toast } = useToast();
  
  // Fetch coins with react-query
  const { 
    data: coins, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['coins', currentPage],
    queryFn: () => fetchCoins(currentPage, itemsPerPage),
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true
  });

  // Handle API error with useEffect to avoid render loop
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching data",
        description: "Could not load cryptocurrency data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Search coins
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reset to first page when searching
    if (query.trim() !== searchQuery.trim()) {
      setCurrentPage(1);
    }
  };

  // Filtered coins based on search
  const displayedCoins = searchQuery.trim() 
    ? (coins || []).filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : coins || [];

  // Handle page navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <MainLayout onSearch={handleSearch}>
      <PageHeader onRefresh={refetch} />
      
      <CoinTable coins={displayedCoins} isLoading={isLoading} />
      
      {!searchQuery && !isLoading && (
        <div className="mt-8">
          <PaginationControls 
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
