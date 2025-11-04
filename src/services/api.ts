
import { Coin, CoinDetails, MarketChartData } from "../types";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCoins = async (page: number = 1, perPage: number = 100): Promise<Coin[]> => {
  try {
    console.log(`Fetching coins from database... (page ${page}, per_page ${perPage})`);
    
    // Calculate offset for pagination
    const offset = (page - 1) * perPage;
    
    // Try to fetch from database first
    const { data: coinsData, error: dbError } = await supabase
      .from('coins')
      .select('*')
      .order('market_cap_rank', { ascending: true })
      .range(offset, offset + perPage - 1);
    
    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }
    
    // If we have data from database, use it
    if (coinsData && coinsData.length > 0) {
      console.log(`Fetched ${coinsData.length} coins from database`);
      
      // Transform database data to match Coin interface
      const coins: Coin[] = coinsData.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: parseFloat(coin.current_price) || 0,
        market_cap: parseInt(coin.market_cap) || 0,
        market_cap_rank: coin.market_cap_rank || 0,
        total_volume: parseInt(coin.total_volume) || 0,
        high_24h: parseFloat(coin.high_24h) || 0,
        low_24h: parseFloat(coin.low_24h) || 0,
        price_change_24h: parseFloat(coin.price_change_24h) || 0,
        price_change_percentage_24h: parseFloat(coin.price_change_percentage_24h) || 0,
        market_cap_change_24h: parseInt(coin.market_cap_change_24h) || 0,
        market_cap_change_percentage_24h: parseFloat(coin.market_cap_change_percentage_24h) || 0,
        circulating_supply: parseFloat(coin.circulating_supply) || 0,
        total_supply: parseFloat(coin.total_supply) || 0,
        max_supply: parseFloat(coin.max_supply) || 0,
        ath: parseFloat(coin.ath) || 0,
        ath_change_percentage: parseFloat(coin.ath_change_percentage) || 0,
        ath_date: coin.ath_date || '',
        atl: parseFloat(coin.atl) || 0,
        atl_change_percentage: parseFloat(coin.atl_change_percentage) || 0,
        atl_date: coin.atl_date || '',
        last_updated: coin.last_updated || ''
      }));
      
      return coins;
    }
    
    // Fallback to CoinGecko API if database is empty
    console.log("Database empty, falling back to CoinGecko API");
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error response:", errorData);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Fetched coins data from API:", data.length, "coins");
    return data;
  } catch (error) {
    console.error("Error fetching coins:", error);
    throw error;
  }
};

export const fetchCoinDetails = async (id: string): Promise<CoinDetails | null> => {
  try {
    console.log(`Fetching details for coin: ${id}`);
    const response = await fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error response:", errorData);
      throw new Error(errorData.error || `Failed to fetch details for coin: ${id}`);
    }
    
    const data = await response.json();
    
    // Map API response to expected CoinDetails structure
    const coinDetails: CoinDetails = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image?.large,
      current_price: data.market_data?.current_price?.usd || 0,
      market_cap: data.market_data?.market_cap?.usd || 0,
      market_cap_rank: data.market_cap_rank || 0,
      total_volume: data.market_data?.total_volume?.usd || 0,
      high_24h: data.market_data?.high_24h?.usd || 0,
      low_24h: data.market_data?.low_24h?.usd || 0,
      price_change_24h: data.market_data?.price_change_24h || 0,
      price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
      market_cap_change_24h: data.market_data?.market_cap_change_24h || 0,
      market_cap_change_percentage_24h: data.market_data?.market_cap_change_percentage_24h || 0,
      circulating_supply: data.market_data?.circulating_supply || 0,
      total_supply: data.market_data?.total_supply || 0,
      max_supply: data.market_data?.max_supply || 0,
      ath: data.market_data?.ath?.usd || 0,
      ath_change_percentage: data.market_data?.ath_change_percentage?.usd || 0,
      ath_date: data.market_data?.ath_date?.usd || '',
      atl: data.market_data?.atl?.usd || 0,
      atl_change_percentage: data.market_data?.atl_change_percentage?.usd || 0,
      atl_date: data.market_data?.atl_date?.usd || '',
      last_updated: data.last_updated || '',
      description: data.description || { en: '' },
      links: data.links || {
        homepage: [],
        blockchain_site: [],
        official_forum_url: [],
        chat_url: [],
        announcement_url: [],
        twitter_screen_name: '',
        facebook_username: '',
        telegram_channel_identifier: '',
        subreddit_url: '',
        repos_url: {
          github: [],
          bitbucket: []
        }
      },
      categories: data.categories || [],
      developer_data: data.developer_data || {},
      community_data: data.community_data || {}
    };
    
    console.log("Processed coin details:", coinDetails.id, "Price:", coinDetails.current_price);
    return coinDetails;
  } catch (error) {
    console.error(`Error fetching details for coin ${id}:`, error);
    throw error;
  }
};

export const fetchCoinMarketChart = async (
  id: string,
  days: string | number = 7
): Promise<MarketChartData> => {
  try {
    console.log(`Fetching market chart for coin ${id} with days: ${days}`);
    const response = await fetch(
      `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error response:", errorData);
      throw new Error(errorData.error || `Failed to fetch market chart for coin: ${id}`);
    }
    
    const data = await response.json();
    
    // Validate chart data
    if (!data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
      console.error("Invalid chart data structure:", data);
      throw new Error("Invalid chart data received from API");
    }
    
    console.log("Fetched market chart data:", {
      prices: data.prices?.length || 0,
      market_caps: data.market_caps?.length || 0,
      volumes: data.total_volumes?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching market chart for coin ${id}:`, error);
    throw error;
  }
};

export const searchCoins = async (query: string): Promise<Coin[]> => {
  try {
    console.log(`Searching coins in database with query: ${query}`);
    const lowercasedQuery = query.toLowerCase();
    
    // Search in database first
    const { data: coinsData, error: dbError } = await supabase
      .from('coins')
      .select('*')
      .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
      .order('market_cap_rank', { ascending: true })
      .limit(50);
    
    if (dbError) {
      console.error("Database search error:", dbError);
      // Fallback to fetching all and filtering
      const allCoins = await fetchCoins(1, 100);
      const results = allCoins.filter(
        coin => 
          coin.name.toLowerCase().includes(lowercasedQuery) ||
          coin.symbol.toLowerCase().includes(lowercasedQuery)
      );
      return results;
    }
    
    if (coinsData && coinsData.length > 0) {
      console.log(`Search found ${coinsData.length} coins matching '${query}' in database`);
      
      // Transform database data to match Coin interface
      const coins: Coin[] = coinsData.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: parseFloat(coin.current_price) || 0,
        market_cap: parseInt(coin.market_cap) || 0,
        market_cap_rank: coin.market_cap_rank || 0,
        total_volume: parseInt(coin.total_volume) || 0,
        high_24h: parseFloat(coin.high_24h) || 0,
        low_24h: parseFloat(coin.low_24h) || 0,
        price_change_24h: parseFloat(coin.price_change_24h) || 0,
        price_change_percentage_24h: parseFloat(coin.price_change_percentage_24h) || 0,
        market_cap_change_24h: parseInt(coin.market_cap_change_24h) || 0,
        market_cap_change_percentage_24h: parseFloat(coin.market_cap_change_percentage_24h) || 0,
        circulating_supply: parseFloat(coin.circulating_supply) || 0,
        total_supply: parseFloat(coin.total_supply) || 0,
        max_supply: parseFloat(coin.max_supply) || 0,
        ath: parseFloat(coin.ath) || 0,
        ath_change_percentage: parseFloat(coin.ath_change_percentage) || 0,
        ath_date: coin.ath_date || '',
        atl: parseFloat(coin.atl) || 0,
        atl_change_percentage: parseFloat(coin.atl_change_percentage) || 0,
        atl_date: coin.atl_date || '',
        last_updated: coin.last_updated || ''
      }));
      
      return coins;
    }
    
    // Fallback to API search if no results in database
    console.log("No results in database, falling back to API search");
    const allCoins = await fetchCoins(1, 100);
    const results = allCoins.filter(
      coin => 
        coin.name.toLowerCase().includes(lowercasedQuery) ||
        coin.symbol.toLowerCase().includes(lowercasedQuery)
    );
    
    console.log(`Search found ${results.length} coins matching '${query}'`);
    return results;
  } catch (error) {
    console.error("Error searching coins:", error);
    throw error;
  }
};
