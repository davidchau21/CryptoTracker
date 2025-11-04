-- Create coins table to store cryptocurrency data
CREATE TABLE IF NOT EXISTS public.coins (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  image TEXT,
  current_price DECIMAL,
  market_cap BIGINT,
  market_cap_rank INTEGER,
  total_volume BIGINT,
  high_24h DECIMAL,
  low_24h DECIMAL,
  price_change_24h DECIMAL,
  price_change_percentage_24h DECIMAL,
  market_cap_change_24h BIGINT,
  market_cap_change_percentage_24h DECIMAL,
  circulating_supply DECIMAL,
  total_supply DECIMAL,
  max_supply DECIMAL,
  ath DECIMAL,
  ath_change_percentage DECIMAL,
  ath_date TIMESTAMP WITH TIME ZONE,
  atl DECIMAL,
  atl_change_percentage DECIMAL,
  atl_date TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.coins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no auth required)
CREATE POLICY "Allow public read access to coins"
  ON public.coins
  FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_coins_market_cap_rank ON public.coins(market_cap_rank);
CREATE INDEX IF NOT EXISTS idx_coins_price_change ON public.coins(price_change_percentage_24h);
CREATE INDEX IF NOT EXISTS idx_coins_last_updated ON public.coins(last_updated);

-- Enable realtime for coins table
ALTER PUBLICATION supabase_realtime ADD TABLE public.coins;