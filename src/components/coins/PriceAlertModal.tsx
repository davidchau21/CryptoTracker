import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/AuthProvider";
import {
  PriceAlert,
  fetchPriceAlerts,
  createPriceAlert,
  deletePriceAlert,
} from "@/services/api";

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinSymbol: string;
  coinName: string;
  currentPrice: number;
  coinImage?: string;
}

const LOCAL_ALERTS_KEY = "ctk_local_price_alerts";

const getLocalAlerts = (): PriceAlert[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ALERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalAlerts = (alerts: PriceAlert[]) => {
  localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(alerts));
};

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  coinSymbol,
  coinName,
  currentPrice,
  coinImage,
}) => {
  const { token, isAuthenticated } = useAuth();
  const symbolUpper = (coinSymbol || "BTC").toUpperCase();

  const [condition, setCondition] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize default target price (+5%) when modal opens
  useEffect(() => {
    if (isOpen && currentPrice > 0) {
      const defaultTarget =
        currentPrice >= 1
          ? (currentPrice * 1.05).toFixed(2)
          : (currentPrice * 1.05).toFixed(6);
      setTargetPrice(defaultTarget);
      setCondition("above");
      loadAlerts();
    }
  }, [isOpen, currentPrice, symbolUpper]);

  const loadAlerts = async () => {
    if (isAuthenticated && token) {
      try {
        const data = await fetchPriceAlerts(token);
        setAlerts(data);
        return;
      } catch {
        // Fallback to local storage if backend unreachable
      }
    }
    setAlerts(getLocalAlerts());
  };

  const applyPercentagePreset = (pct: number) => {
    if (!currentPrice) return;
    const computed = currentPrice * (1 + pct / 100);
    setTargetPrice(
      computed >= 1 ? computed.toFixed(2) : computed.toFixed(6),
    );
    setCondition(pct >= 0 ? "above" : "below");
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(targetPrice);
    if (!numericPrice || numericPrice <= 0) {
      toast.error("Vui lòng nhập mức giá mục tiêu hợp lệ.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isAuthenticated && token) {
        const created = await createPriceAlert(token, {
          symbol: symbolUpper,
          targetPrice: numericPrice,
          condition,
        });
        setAlerts((prev) => [created, ...prev]);
      } else {
        const mockAlert: PriceAlert = {
          _id: `local-${Date.now()}`,
          userId: "guest",
          symbol: symbolUpper,
          targetPrice: numericPrice,
          condition,
          isTriggered: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [mockAlert, ...getLocalAlerts()];
        saveLocalAlerts(updated);
        setAlerts(updated);
      }

      toast.success(
        `🔔 Đã bật cảnh báo khi giá ${symbolUpper} ${
          condition === "above" ? "vượt lên trên" : "giảm xuống dưới"
        } $${numericPrice.toLocaleString()}!`,
      );
    } catch (err: any) {
      toast.error(err.message || "Không thể tạo cảnh báo giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      if (isAuthenticated && token && !id.startsWith("local-")) {
        await deletePriceAlert(token, id);
      } else {
        const updated = getLocalAlerts().filter((a) => a._id !== id);
        saveLocalAlerts(updated);
      }
      setAlerts((prev) => prev.filter((a) => a._id !== id));
      toast.info("Đã xóa cảnh báo giá.");
    } catch {
      toast.error("Không thể xóa cảnh báo giá.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            {coinImage ? (
              <img
                src={coinImage}
                alt={coinName}
                className="w-10 h-10 rounded-full bg-white shadow-sm ring-1 ring-slate-200 dark:ring-white/10"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                {symbolUpper.slice(0, 2)}
              </div>
            )}
            <div>
              <DialogTitle className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Đặt Cảnh Báo Giá {coinName} ({symbolUpper})
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-gray-400">
                Giá hiện tại:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">
                  ${currentPrice.toLocaleString()}
                </strong>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleCreateAlert} className="space-y-4 mt-2">
          {/* Condition Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setCondition("above")}
              className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                condition === "above"
                  ? "bg-white text-emerald-600 shadow-xs dark:bg-emerald-600 dark:text-white"
                  : "text-slate-600 dark:text-gray-400"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                trending_up
              </span>
              Giá Vượt Lên Trên
            </button>
            <button
              type="button"
              onClick={() => setCondition("below")}
              className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                condition === "below"
                  ? "bg-white text-rose-600 shadow-xs dark:bg-rose-600 dark:text-white"
                  : "text-slate-600 dark:text-gray-400"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                trending_down
              </span>
              Giá Giảm Xuống Dưới
            </button>
          </div>

          {/* Target Price Input */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-gray-300 block mb-1.5">
              Mức Giá Mục Tiêu (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                $
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full pl-8 pr-16 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/70 text-lg font-black font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                USD
              </span>
            </div>
          </div>

          {/* Quick Percentage Presets */}
          <div className="grid grid-cols-6 gap-1.5">
            {[-10, -5, -3, 3, 5, 10].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => applyPercentagePreset(pct)}
                className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  pct > 0
                    ? "bg-emerald-50/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20"
                    : "bg-rose-50/70 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20"
                }`}
              >
                {pct > 0 ? `+${pct}%` : `${pct}%`}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              notifications_active
            </span>
            {isSubmitting ? "Đang lưu..." : "Tạo Cảnh Báo Giá Ngay"}
          </button>
        </form>

        {/* Active Alerts List */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 block mb-2.5">
            Cảnh Báo Đang Hoạt Động ({alerts.length})
          </span>

          {alerts.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-gray-500 text-center py-3">
              Chưa có cảnh báo giá nào được thiết lập.
            </p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        alert.condition === "above"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                      }`}
                    >
                      {alert.symbol} {alert.condition === "above" ? "≥" : "≤"}
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                      ${Number(alert.targetPrice).toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Xóa cảnh báo"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      delete
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAlertModal;

