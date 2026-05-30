import { Coin, CoinDetails, MarketChartData } from "../types";

const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
const COINGECKO_URL = "https://api.coingecko.com/api/v3";

// ─── Helper ───────────────────────────────────────────────────────────────────
async function apiFetch<T>(url: string, label: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `${label}: HTTP ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

// ─── Backend response shape ───────────────────────────────────────────────────
interface BackendCoinsResponse {
  status: string;
  data: {
    data: Coin[];
    count: number;
  };
}

// ─── Cache toàn bộ danh sách (tránh gọi lại khi chỉ đổi trang) ───────────────
// Note: We now fetch paginated results directly from the backend to optimize payload.
// We will still keep a small cache map for fetched pages to avoid refetching during session.
const _coinsPageCache: Record<string, { coins: Coin[]; cachedAt: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

// ─── fetchCoins — với server-side pagination ──────────────────────────────────
export const ITEMS_PER_PAGE = 100;

export const fetchCoins = async (
  page: number = 1,
  perPage: number = ITEMS_PER_PAGE,
): Promise<Coin[]> => {
  const cacheKey = `${page}-${perPage}`;
  const now = Date.now();
  if (_coinsPageCache[cacheKey] && now - _coinsPageCache[cacheKey].cachedAt < CACHE_TTL) {
    console.log(`Returning cached coins for page ${page} from local cache`);
    return _coinsPageCache[cacheKey].coins;
  }

  console.log(`Fetching coins for page ${page} (limit ${perPage}) from backend...`);

  try {
    const json = await apiFetch<BackendCoinsResponse>(
      `${BACKEND_URL}/coins?page=${page}&limit=${perPage}`,
      "fetchCoins",
    );

    const coins: Coin[] = (json.data?.data ?? []).map((coin: Coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: Number(coin.current_price) || 0,
      market_cap: Number(coin.market_cap) || 0,
      market_cap_rank: coin.market_cap_rank || 0,
      total_volume: Number(coin.total_volume) || 0,
      high_24h: Number(coin.high_24h) || 0,
      low_24h: Number(coin.low_24h) || 0,
      price_change_24h: Number(coin.price_change_24h) || 0,
      price_change_percentage_24h:
        Number(coin.price_change_percentage_24h) || 0,
      market_cap_change_24h: Number(coin.market_cap_change_24h) || 0,
      market_cap_change_percentage_24h:
        Number(coin.market_cap_change_percentage_24h) || 0,
      circulating_supply: Number(coin.circulating_supply) || 0,
      total_supply: Number(coin.total_supply) || 0,
      max_supply: Number(coin.max_supply) || 0,
      ath: Number(coin.ath) || 0,
      ath_change_percentage: Number(coin.ath_change_percentage) || 0,
      ath_date: coin.ath_date || "",
      atl: Number(coin.atl) || 0,
      atl_change_percentage: Number(coin.atl_change_percentage) || 0,
      atl_date: coin.atl_date || "",
      last_updated: coin.last_updated || "",
    }));

    _coinsPageCache[cacheKey] = { coins, cachedAt: now };
    return coins;
  } catch (err) {
    console.warn("Backend unavailable, falling back to CoinGecko:", err);
    // Fallback CoinGecko nếu backend down
    const fallback = await apiFetch<Coin[]>(
      `${COINGECKO_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`,
      "fetchCoins-fallback",
    );
    _coinsPageCache[cacheKey] = { coins: fallback, cachedAt: now };
    return fallback;
  }
};

// ─── Backend status response shape ───────────────────────────────────────────
interface BackendStatusResponse {
  status: string;
  data: {
    status: string;
    lastUpdate: string | null;
    coinsCount: number;
  };
}

// ─── Tổng số trang ────────────────────────────────────────────────────────────
export const fetchTotalCoinsCount = async (): Promise<number> => {
  try {
    const json = await apiFetch<BackendStatusResponse>(
      `${BACKEND_URL}/coins/status`,
      "fetchTotalCoinsCount",
    );
    return json.data?.coinsCount ?? 1000;
  } catch (err) {
    console.warn("Backend status unavailable, using fallback coin count:", err);
    return 1000; // Fallback mặc định là 1000 coin
  }
};

// ─── fetchCoinDetails — nguồn: CoinGecko ─────────────────────────────────────
export const fetchCoinDetails = async (
  id: string,
): Promise<CoinDetails | null> => {
  console.log(`Fetching details for coin: ${id}`);

  const data = await apiFetch<Record<string, unknown>>(
    `${COINGECKO_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true`,
    `fetchCoinDetails(${id})`,
  );

  const md = (data.market_data ?? {}) as Record<string, Record<string, number>>;

  const coinDetails: CoinDetails = {
    id: data.id as string,
    symbol: data.symbol as string,
    name: data.name as string,
    image: (data.image as Record<string, string>)?.large ?? "",
    current_price: md.current_price?.usd ?? 0,
    market_cap: md.market_cap?.usd ?? 0,
    market_cap_rank: (data.market_cap_rank as number) ?? 0,
    total_volume: md.total_volume?.usd ?? 0,
    high_24h: md.high_24h?.usd ?? 0,
    low_24h: md.low_24h?.usd ?? 0,
    price_change_24h: (md.price_change_24h as unknown as number) ?? 0,
    price_change_percentage_24h:
      (md.price_change_percentage_24h as unknown as number) ?? 0,
    market_cap_change_24h: (md.market_cap_change_24h as unknown as number) ?? 0,
    market_cap_change_percentage_24h:
      (md.market_cap_change_percentage_24h as unknown as number) ?? 0,
    circulating_supply: (md.circulating_supply as unknown as number) ?? 0,
    total_supply: (md.total_supply as unknown as number) ?? 0,
    max_supply: (md.max_supply as unknown as number) ?? 0,
    ath: md.ath?.usd ?? 0,
    ath_change_percentage: md.ath_change_percentage?.usd ?? 0,
    ath_date: (md.ath_date as unknown as Record<string, string>)?.usd ?? "",
    atl: md.atl?.usd ?? 0,
    atl_change_percentage: md.atl_change_percentage?.usd ?? 0,
    atl_date: (md.atl_date as unknown as Record<string, string>)?.usd ?? "",
    last_updated: (data.last_updated as string) ?? "",
    description: (data.description as { en: string }) ?? { en: "" },
    links: (data.links as CoinDetails["links"]) ?? {
      homepage: [],
      blockchain_site: [],
      official_forum_url: [],
      chat_url: [],
      announcement_url: [],
      twitter_screen_name: "",
      facebook_username: "",
      telegram_channel_identifier: "",
      subreddit_url: "",
      repos_url: { github: [], bitbucket: [] },
    },
    categories: (data.categories as string[]) ?? [],
    developer_data: data.developer_data ?? {},
    community_data: data.community_data ?? {},
  };

  return coinDetails;
};

// ─── fetchCoinMarketChart — nguồn: CoinGecko ─────────────────────────────────
export const fetchCoinMarketChart = async (
  id: string,
  days: string | number = 7,
): Promise<MarketChartData> => {
  const data = await apiFetch<MarketChartData>(
    `${COINGECKO_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    `fetchCoinMarketChart(${id})`,
  );

  if (!data.prices || data.prices.length === 0) {
    throw new Error(`No price data available for ${id}`);
  }

  return data;
};

// ─── searchCoins — filter từ backend cache ────────────────────────────────────
export const searchCoins = async (query: string): Promise<Coin[]> => {
  const lowered = query.toLowerCase();
  const coins = await fetchCoins(1, 100);
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(lowered) ||
      coin.symbol.toLowerCase().includes(lowered),
  );
};
