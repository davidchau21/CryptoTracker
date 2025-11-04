
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchCoinDetails, 
  fetchCoinMarketChart 
} from "@/services/api";
import { 
  calculateTimeframe,
  transformMarketChartData
} from "@/lib/utils";
import { TimeRange, ChartData, CoinDetails, MarketChartData } from "@/types";

export const useCoinDetails = (id: string | undefined) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  
  // Fetch coin details
  const { 
    data: coinDetails, 
    isLoading: isLoadingDetails,
    error: detailsError
  } = useQuery({
    queryKey: ['coinDetails', id],
    queryFn: async () => {
      if (!id) throw new Error("Coin ID is required");
      const data = await fetchCoinDetails(id);
      console.log("Fetched coin details:", data);
      return data;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    enabled: !!id,
    retry: 2,
    staleTime: 30000
  });

  // Fetch market chart data for prices
  const {
    data: chartData,
    isLoading: isLoadingChart,
    error: chartError
  } = useQuery({
    queryKey: ['coinChart', id, timeRange],
    queryFn: async () => {
      if (!id) throw new Error("Coin ID is required");
      const days = calculateTimeframe(timeRange);
      const data = await fetchCoinMarketChart(id, days);
      
      if (!data || !data.prices || data.prices.length === 0) {
        console.error("No price data available for", id);
        return [];
      }
      return transformMarketChartData(data.prices);
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    enabled: !!id,
    retry: 2,
    staleTime: 30000
  });

  // Fetch full market chart data (for trading history)
  const {
    data: fullMarketData,
    isLoading: isLoadingFullMarket,
    error: fullMarketError
  } = useQuery({
    queryKey: ['fullMarketData', id, timeRange],
    queryFn: async () => {
      if (!id) throw new Error("Coin ID is required");
      const days = calculateTimeframe(timeRange);
      const data = await fetchCoinMarketChart(id, days);
      return data;
    },
    refetchInterval: 60000,
    enabled: !!id,
    retry: 2,
    staleTime: 30000
  });

  // Combine errors from all queries
  const error = detailsError || chartError || fullMarketError;

  return {
    coinDetails,
    chartData,
    fullMarketData,
    timeRange,
    setTimeRange,
    isLoadingDetails,
    isLoadingChart,
    isLoadingFullMarket,
    error
  };
};
