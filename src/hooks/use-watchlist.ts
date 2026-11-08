import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "ctk_watchlist_coins";
const EVENT_NAME = "ctk-watchlist-updated";

const getStoredWatchlist = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ["bitcoin", "ethereum"];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ["bitcoin", "ethereum"];
  } catch {
    return ["bitcoin", "ethereum"];
  }
};

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>(() =>
    getStoredWatchlist(),
  );

  useEffect(() => {
    const syncHandler = () => {
      setWatchlist(getStoredWatchlist());
    };
    window.addEventListener(EVENT_NAME, syncHandler);
    window.addEventListener("storage", syncHandler);
    return () => {
      window.removeEventListener(EVENT_NAME, syncHandler);
      window.removeEventListener("storage", syncHandler);
    };
  }, []);

  const toggleWatchlist = useCallback((coinId: string, coinName?: string) => {
    const current = getStoredWatchlist();
    const exists = current.includes(coinId);
    const updated = exists
      ? current.filter((id) => id !== coinId)
      : [...current, coinId];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setWatchlist(updated);
    window.dispatchEvent(new Event(EVENT_NAME));

    if (exists) {
      toast.info(`Đã xóa ${coinName || coinId.toUpperCase()} khỏi Watchlist.`);
    } else {
      toast.success(
        `⭐ Đã thêm ${coinName || coinId.toUpperCase()} vào danh sách yêu thích (Watchlist)!`,
      );
    }
  }, []);

  const isInWatchlist = useCallback(
    (coinId: string) => watchlist.includes(coinId),
    [watchlist],
  );

  return {
    watchlist,
    toggleWatchlist,
    isInWatchlist,
  };
};
