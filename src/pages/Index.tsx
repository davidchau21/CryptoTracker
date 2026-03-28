import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CoinTable from "@/components/home/CoinTable";
import PaginationControls from "@/components/home/Pagination";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MainContentHeader from "@/components/dashboard/MainContentHeader";
import {
  fetchCoins,
  fetchTotalCoinsCount,
  ITEMS_PER_PAGE,
} from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Coin } from "@/types";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: totalCount = 0 } = useQuery({
    queryKey: ["coinsCount"],
    queryFn: fetchTotalCoinsCount,
    staleTime: 2 * 60 * 1000,
  });

  const {
    data: coins,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["coins", currentPage],
    queryFn: () => fetchCoins(currentPage, ITEMS_PER_PAGE),
    refetchInterval: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải dữ liệu coin. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== searchQuery.trim()) {
      setCurrentPage(1);
    }
  };

  const displayedCoins: Coin[] = searchQuery.trim()
    ? (coins ?? []).filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : (coins ?? []);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardLayout onSearch={handleSearch}>
      <MainContentHeader />

      <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-white/50 dark:border-white/10 p-1">
        <CoinTable
          coins={displayedCoins}
          isLoading={isLoading}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {!searchQuery && !isLoading && totalPages > 1 && (
        <div className="mt-8">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
