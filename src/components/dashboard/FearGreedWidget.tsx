import React, { useEffect, useState } from "react";

interface FngDataPoint {
  value: number;
  classification: string;
  timestamp: string;
}

const translateClassification = (val: number): {
  labelVi: string;
  colorClass: string;
  bgBadgeClass: string;
  advice: string;
} => {
  if (val <= 24) {
    return {
      labelVi: "Sợ Hãi Tột Độ",
      colorClass: "text-rose-600 dark:text-rose-400",
      bgBadgeClass:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
      advice:
        "Thị trường đang hoảng loạn quá mức. Theo lịch sử, đây thường là vùng tích lũy dài hạn (DCA) tốt cho nhà đầu tư kiên nhẫn.",
    };
  }
  if (val <= 45) {
    return {
      labelVi: "Tâm Lý Sợ Hãi",
      colorClass: "text-orange-600 dark:text-orange-400",
      bgBadgeClass:
        "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30",
      advice:
        "Nhà đầu tư đang thận trọng. Nên ưu tiên các đồng coin vốn hóa lớn (BTC, ETH) và tránh dùng đòn bẩy cao.",
    };
  }
  if (val <= 54) {
    return {
      labelVi: "Trung Lập",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgBadgeClass:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
      advice:
        "Thị trường đang cân bằng giữa bên mua và bên bán, chờ đợi tín hiệu bứt phá xu hướng mới.",
    };
  }
  if (val <= 74) {
    return {
      labelVi: "Tâm Lý Tham Lam",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgBadgeClass:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
      advice:
        "Dòng tiền đang đổ vào tích cực. Xu hướng tăng chiếm ưu thế nhưng cần đặt cảnh báo giá để bảo vệ lợi nhuận.",
    };
  }
  return {
    labelVi: "Tham Lam Tột Độ",
    colorClass: "text-cyan-600 dark:text-cyan-400",
    bgBadgeClass:
      "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30",
    advice:
      "Thị trường đang hưng phấn mạnh (FOMO). Hãy cân nhắc chốt lời từng phần hoặc đưa lãi vào Staking Vault.",
  };
};

const FearGreedWidget: React.FC = () => {
  const [today, setToday] = useState<FngDataPoint>({
    value: 68,
    classification: "Greed",
    timestamp: "",
  });
  const [yesterday, setYesterday] = useState<number>(64);
  const [lastWeek, setLastWeek] = useState<number>(58);

  useEffect(() => {
    let isMounted = true;
    const loadFng = async () => {
      try {
        const res = await fetch("https://api.alternative.me/fng/?limit=7");
        if (!res.ok) return;
        const json = await res.json();
        const list = json?.data;
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setToday({
            value: Number(list[0].value) || 68,
            classification: list[0].value_classification || "Greed",
            timestamp: list[0].timestamp || "",
          });
          if (list[1]) setYesterday(Number(list[1].value) || 64);
          if (list[6]) setLastWeek(Number(list[6].value) || 58);
        }
      } catch {
        // Keep clean default values if offline
      }
    };
    loadFng();
    return () => {
      isMounted = false;
    };
  }, []);

  const info = translateClassification(today.value);
  // Needle angle: -90deg (0) to +90deg (100)
  const clamped = Math.max(0, Math.min(100, today.value));
  const needleAngle = -90 + (clamped / 100) * 180;

  return (
    <div className="rounded-2xl p-6 border bg-white border-slate-200/90 shadow-md dark:glass-panel dark:border-white/10 dark:bg-slate-900/60 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-indigo-600 dark:text-indigo-400">
            psychology
          </span>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Tâm Lý Thị Trường (AI)
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
          Fear & Greed
        </span>
      </div>

      {/* Semi-Circle SVG Gauge */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            <defs>
              <linearGradient id="fngGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="28%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Background Track Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Colored Gradient Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#fngGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (clamped / 100) * 251.2}
              className="transition-all duration-1000 ease-out"
            />

            {/* Rotating Needle */}
            <g
              transform={`translate(100, 100) rotate(${needleAngle})`}
              className="transition-transform duration-1000 ease-out"
            >
              <polygon
                points="-3,0 0,-68 3,0"
                className="fill-slate-800 dark:fill-white"
              />
              <circle
                cx="0"
                cy="0"
                r="6"
                className="fill-indigo-600 dark:fill-indigo-400"
              />
            </g>
          </svg>
        </div>

        {/* Numeric Value & Label */}
        <div className="text-center -mt-1">
          <div className="text-3xl font-black font-display text-slate-900 dark:text-white leading-none">
            {today.value}
            <span className="text-xs font-bold text-slate-400 dark:text-gray-500">
              /100
            </span>
          </div>
          <span
            className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-extrabold border ${info.bgBadgeClass}`}
          >
            {info.labelVi}
          </span>
        </div>
      </div>

      {/* Historical Comparison Row */}
      <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-100 dark:border-white/5 text-center">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 block">
            Hôm nay
          </span>
          <span className={`text-sm font-black font-mono ${info.colorClass}`}>
            {today.value}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 block">
            Hôm qua
          </span>
          <span className="text-sm font-black font-mono text-slate-800 dark:text-white">
            {yesterday}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 block">
            Tuần trước
          </span>
          <span className="text-sm font-black font-mono text-slate-800 dark:text-white">
            {lastWeek}
          </span>
        </div>
      </div>

      {/* AI Copilot Brief Advice */}
      <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
        <strong className="text-indigo-700 dark:text-indigo-300 font-bold block mb-0.5">
          🤖 Góc nhìn AI Copilot:
        </strong>
        {info.advice}
      </div>
    </div>
  );
};

export default FearGreedWidget;

