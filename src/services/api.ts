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

// ─── Swap API Helpers ─────────────────────────────────────────────────────────
export interface BackendSwapRateResponse {
  status: string;
  data: {
    rate: number;
    fromPrice: number;
    toPrice: number;
  };
}

export interface BackendSwapTx {
  id?: string;
  address: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  hash: string;
  createdAt?: string;
  timestamp?: string;
}

export interface BackendSwapHistoryResponse {
  status: string;
  data: BackendSwapTx[];
}

export const fetchSwapRate = async (
  from: string,
  to: string,
): Promise<{ rate: number; fromPrice: number; toPrice: number }> => {
  try {
    const json = await apiFetch<BackendSwapRateResponse>(
      `${BACKEND_URL}/swap/rate?from=${from}&to=${to}`,
      "fetchSwapRate",
    );
    return json.data;
  } catch (err) {
    console.warn("Backend rate failed, calculating locally:", err);
    // Simple local conversion fallback
    const fallbackPrices: Record<string, number> = {
      ETH: 3500,
      BTC: 65000,
      USDT: 1.0,
      USDC: 1.0,
      BNB: 580,
      SOL: 150,
    };
    const fromPrice = fallbackPrices[from.toUpperCase()] ?? 1.0;
    const toPrice = fallbackPrices[to.toUpperCase()] ?? 1.0;
    return {
      rate: fromPrice / toPrice,
      fromPrice,
      toPrice,
    };
  }
};

export const postSwapTransaction = async (data: {
  address: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  hash: string;
}): Promise<BackendSwapTx> => {
  const res = await fetch(`${BACKEND_URL}/swap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to save swap on backend: HTTP ${res.status}`);
  }
  const json = await res.json() as { data: BackendSwapTx };
  return json.data;
};

export const fetchSwapHistory = async (
  address: string,
): Promise<BackendSwapTx[]> => {
  try {
    const json = await apiFetch<BackendSwapHistoryResponse>(
      `${BACKEND_URL}/swap/history?address=${address}`,
      "fetchSwapHistory",
    );
    return json.data ?? [];
  } catch (err) {
    console.warn("Failed to fetch swap history from backend, falling back to empty:", err);
    return [];
  }
};

// ─── Price Alerts API Helpers ──────────────────────────────────────────────────
export interface PriceAlert {
  _id: string;
  userId: string;
  symbol: string;
  targetPrice: number;
  condition: "above" | "below";
  isTriggered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendAlertsResponse {
  status: string;
  data: PriceAlert[];
}

export const fetchPriceAlerts = async (token: string): Promise<PriceAlert[]> => {
  const res = await fetch(`${BACKEND_URL}/alerts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch price alerts: HTTP ${res.status}`);
  }
  const json = (await res.json()) as BackendAlertsResponse;
  return json.data ?? [];
};

export const createPriceAlert = async (
  token: string,
  data: { symbol: string; targetPrice: number; condition: "above" | "below" },
): Promise<PriceAlert> => {
  const res = await fetch(`${BACKEND_URL}/alerts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Failed to create price alert: HTTP ${res.status}`);
  }
  const json = (await res.json()) as { data: PriceAlert };
  return json.data;
};

export const deletePriceAlert = async (token: string, id: string): Promise<boolean> => {
  const res = await fetch(`${BACKEND_URL}/alerts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to delete price alert: HTTP ${res.status}`);
  }
  return true;
};

// ─── Notifications API Helpers ──────────────────────────────────────────────────
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "alert" | "swap" | "system";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendNotificationsResponse {
  status: string;
  data: Notification[];
}

export const fetchNotifications = async (token: string): Promise<Notification[]> => {
  const res = await fetch(`${BACKEND_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: HTTP ${res.status}`);
  }
  const json = (await res.json()) as BackendNotificationsResponse;
  return json.data ?? [];
};

export const markAllNotificationsAsRead = async (token: string): Promise<boolean> => {
  const res = await fetch(`${BACKEND_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to mark notifications as read: HTTP ${res.status}`);
  }
  return true;
};

// ─── Quests & Token API Helpers ────────────────────────────────────────────────
export interface QuestProgress {
  id: string;
  key: string;
  title: string;
  description: string;
  rewardAmount: number;
  status: "pending" | "completed" | "claimed";
  completedAt: string | null;
  claimedAt: string | null;
  txHash: string | null;
  userWalletAddress: string | null;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  contractAddress: string;
  isSimulation: boolean;
}

export const fetchUserQuests = async (token: string): Promise<QuestProgress[]> => {
  const res = await fetch(`${BACKEND_URL}/quests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch user quests: HTTP ${res.status}`);
  }
  const json = await res.json() as { status: string; data: QuestProgress[] };
  return json.data ?? [];
};

export const triggerDailyCheckin = async (token: string): Promise<{ success: boolean; message: string; progress: any }> => {
  const res = await fetch(`${BACKEND_URL}/quests/daily-checkin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Failed to perform daily check-in: HTTP ${res.status}`);
  }
  const json = await res.json() as { status: string; data: any };
  return json.data;
};

export const claimQuestReward = async (
  token: string,
  questKey: string,
  walletAddress: string,
): Promise<{ success: boolean; message: string; txHash: string }> => {
  const res = await fetch(`${BACKEND_URL}/quests/claim/${questKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Failed to claim reward: HTTP ${res.status}`);
  }
  const json = await res.json() as { status: string; data: any };
  return json.data;
};

export const withdrawAccumulatedRewards = async (
  token: string,
  walletAddress: string,
): Promise<{ success: boolean; message: string; amount: number; txHash: string }> => {
  const res = await fetch(`${BACKEND_URL}/quests/withdraw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Failed to withdraw rewards: HTTP ${res.status}`);
  }
  const json = await res.json() as { status: string; data: any };
  return json.data;
};

export const fetchTokenInfo = async (): Promise<TokenInfo> => {
  const res = await fetch(`${BACKEND_URL}/token/info`);
  if (!res.ok) {
    throw new Error(`Failed to fetch token info: HTTP ${res.status}`);
  }
  const json = await res.json() as { status: string; data: TokenInfo };
  return json.data;
};

export const fetchTokenBalance = async (address: string): Promise<string> => {
  const res = await fetch(`${BACKEND_URL}/token/balance/${address}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch token balance: HTTP ${res.status}`);
  }
  const json = await res.json() as { status: string; data: string };
  return json.data ?? "0.00";
};



