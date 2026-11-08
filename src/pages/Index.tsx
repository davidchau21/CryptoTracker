import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CoinTable from "@/components/home/CoinTable";
import PaginationControls from "@/components/home/Pagination";
import FaqSection from "@/components/home/FaqSection";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MainContentHeader, {
  MarketFilterCategory,
} from "@/components/dashboard/MainContentHeader";
import {
  fetchCoins,
  fetchTotalCoinsCount,
  ITEMS_PER_PAGE,
} from "@/services/api";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";
import { Coin } from "@/types";

const DEFI_KEYWORDS = [
  "ethereum",
  "solana",
  "binance",
  "uni",
  "aave",
  "link",
  "avax",
  "mkr",
  "ldo",
  "cake",
  "crv",
  "sui",
  "apt",
  "arb",
  "op",
  "dot",
  "ada",
  "trx",
  "near",
  "atom",
  "inj",
  "pendle",
  "jup",
];

const GAMING_KEYWORDS = [
  "imx",
  "sand",
  "mana",
  "axs",
  "gala",
  "rndr",
  "render",
  "floki",
  "pepe",
  "shib",
  "doge",
  "ape",
  "beam",
  "ron",
  "enjin",
  "ilv",
  "not",
  "ton",
  "bonk",
];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<MarketFilterCategory>(
    () =>
      searchParams.get("filter") === "watchlist" ? "watchlist" : "all",
  );
  const [isLiveStreamEnabled, setIsLiveStreamEnabled] = useState(true);

  const { watchlist } = useWatchlist();
  const { toast } = useToast();

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam === "watchlist") {
      setActiveCategory("watchlist");
    }
  }, [searchParams]);

  const handleSelectCategory = (cat: MarketFilterCategory) => {
    setActiveCategory(cat);
    if (cat === "watchlist") {
      setSearchParams({ filter: "watchlist" });
    } else {
      setSearchParams({});
    }
  };

  const { data: totalCount = 0 } = useQuery({
    queryKey: ["coinsCount"],
    queryFn: fetchTotalCoinsCount,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: coins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["coins", currentPage],
    queryFn: () => fetchCoins(currentPage, ITEMS_PER_PAGE),
    refetchInterval: 5 * 60 * 1000,
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

  const displayedCoins: Coin[] = useMemo(() => {
    let list = [...(coins ?? [])];

    // 1. Apply Category Filter
    if (activeCategory === "watchlist") {
      list = list.filter((c) => watchlist.includes(c.id));
    } else if (activeCategory === "gainers") {
      list = list
        .filter((c) => c.price_change_percentage_24h > 0)
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h,
        );
    } else if (activeCategory === "losers") {
      list = list
        .filter((c) => c.price_change_percentage_24h < 0)
        .sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h,
        );
    } else if (activeCategory === "defi") {
      list = list.filter((c) =>
        DEFI_KEYWORDS.some(
          (kw) =>
            c.id.toLowerCase().includes(kw) ||
            c.symbol.toLowerCase() === kw ||
            c.name.toLowerCase().includes(kw),
        ),
      );
    } else if (activeCategory === "gaming") {
      list = list.filter((c) =>
        GAMING_KEYWORDS.some(
          (kw) =>
            c.id.toLowerCase().includes(kw) ||
            c.symbol.toLowerCase() === kw ||
            c.name.toLowerCase().includes(kw),
        ),
      );
    }

    // 2. Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (coin) =>
          coin.name.toLowerCase().includes(q) ||
          coin.symbol.toLowerCase().includes(q),
      );
    }

    return list;
  }, [coins, activeCategory, watchlist, searchQuery]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardLayout onSearch={handleSearch}>
      <MainContentHeader
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        watchlistCount={watchlist.length}
        isLiveStreamEnabled={isLiveStreamEnabled}
        onToggleLiveStream={() => setIsLiveStreamEnabled((prev) => !prev)}
      />

      <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-white/50 dark:border-white/10 p-1">
        <CoinTable
          coins={displayedCoins}
          isLoading={isLoading}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          isLiveStreamEnabled={isLiveStreamEnabled}
        />
      </div>

      {activeCategory === "all" &&
        !searchQuery &&
        !isLoading &&
        totalPages > 1 && (
          <div className="mt-8">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

      {/* Interactive Web3 & Platform FAQ Section */}
      <FaqSection />
    </DashboardLayout>
  );
};

export default Index;
