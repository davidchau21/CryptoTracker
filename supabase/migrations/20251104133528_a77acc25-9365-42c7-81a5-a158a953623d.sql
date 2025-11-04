-- Fix data types for coins table
ALTER TABLE public.coins 
  ALTER COLUMN market_cap_change_24h TYPE DECIMAL USING market_cap_change_24h::DECIMAL;