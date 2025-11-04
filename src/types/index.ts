
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CoinDetails extends Coin {
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
    github: string[];
    bitbucket: string[];
  };
  };
  categories: string[];
  developer_data: any;
  community_data: any;
}

export interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface ChartData {
  timestamp: number;
  price: number;
}

export type SortDirection = 'asc' | 'desc';

export type SortKey = 'market_cap_rank' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume' | 'current_price';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '1y' | 'max';
