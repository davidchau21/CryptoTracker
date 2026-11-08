import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FaqItem {
  id: string;
  category: "general" | "ctk" | "staking" | "wallet";
  categoryLabel: string;
  icon: string;
  question: string;
  answer: string;
  actionLabel?: string;
  actionRoute?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-ctk",
    category: "ctk",
    categoryLabel: "Token CTK & Nhiệm Vụ",
    icon: "toll",
    question: "CryptoTracker Token (CTK) là gì và làm sao để nhận miễn phí?",
    answer:
      "CTK là token tiện ích chuẩn ERC-20 (tích hợp ERC20Permit & AccessControl) của hệ sinh thái CryptoTracker. Bạn có thể kiếm CTK hoàn toàn miễn phí mỗi ngày bằng cách Điểm danh hàng ngày (+10 CTK), Liên kết ví MetaMask (+50 CTK), Thực hiện lệnh Swap đầu tiên (+20 CTK) và Gửi tiết kiệm Staking lần đầu (+40 CTK).",
    actionLabel: "Săn thưởng CTK tại trang Nhiệm Vụ",
    actionRoute: "/quests",
  },
  {
    id: "offchain-vs-onchain",
    category: "ctk",
    categoryLabel: "Token CTK & Nhiệm Vụ",
    icon: "sports_esports",
    question:
      "Tại sao phần thưởng nhiệm vụ lại cộng vào 'Ví Game Tích Lũy' trước khi rút về MetaMask?",
    answer:
      "Cơ chế 'Ví Game Tích Lũy (Off-chain)' giúp bạn nhận thưởng tức thì với phí Gas bằng 0 sau mỗi nhiệm vụ. Khi đã tích lũy được số lượng CTK mong muốn, bạn chỉ cần bấm 'Rút về ví Web3' một lần duy nhất để hệ thống đúc (Mint) toàn bộ token thẳng về ví MetaMask trên mạng Blockchain.",
    actionLabel: "Kiểm tra số dư Ví Game",
    actionRoute: "/quests",
  },
  {
    id: "how-staking-works",
    category: "staking",
    categoryLabel: "Staking & Hạng VIP",
    icon: "savings",
    question:
      "Cơ chế sinh lời tự động tại CTK Staking Vault hoạt động như thế nào?",
    answer:
      "Khi gửi CTK vào Staking Vault, hợp đồng thông minh tính toán lãi suất theo từng giây thực tế với 3 gói: Flexible Pool (36.5% APY - rút gốc bất cứ lúc nào), 30-Day Boost (85% APY) và 90-Day Whale Vault (150% APY). Bạn có thể bấm 'Gộp Lãi Kép (Compound)' miễn phí để cộng thẳng lãi vào gốc hoặc 'Rút Về Ví' để đúc lãi ra ví Web3.",
    actionLabel: "Trải nghiệm Staking Vault ngay",
    actionRoute: "/staking",
  },
  {
    id: "vip-tiers-perks",
    category: "staking",
    categoryLabel: "Staking & Hạng VIP",
    icon: "workspace_premium",
    question:
      "Điểm Thực Lực (Power Score) và 4 cấp bậc VIP mang lại đặc quyền gì?",
    answer:
      "Điểm Thực Lực được tính theo công thức: (CTK Đang Stake × 1.5) + (CTK Nhiệm Vụ) + (Số Lệnh Swap × 15). Khi đạt các mốc điểm từ Bronze → Silver → Gold → Diamond Whale (1,000+ điểm), bạn sẽ được nhân hệ số lãi Staking lên tới 1.5x (tối đa 225% APY) và giảm tới 93% phí giao dịch trên trang Swap (từ 0.30% xuống chỉ còn 0.02%).",
    actionLabel: "Xem Bảng Xếp Hạng & Đặc Quyền VIP",
    actionRoute: "/leaderboard",
  },
  {
    id: "supported-networks",
    category: "wallet",
    categoryLabel: "Ví Web3 & Bảo Mật",
    icon: "account_balance_wallet",
    question:
      "Hệ thống hỗ trợ những loại ví và mạng lưới Blockchain nào?",
    answer:
      "CryptoTracker hỗ trợ kết nối trực tiếp với MetaMask, Trust Wallet và chế độ Sandbox mô phỏng. Bạn có thể chuyển đổi linh hoạt giữa Ethereum Sepolia Testnet, BNB Smart Chain Testnet, Polygon và mạng Hardhat Localhost ngay trên thanh công cụ mà không cần cấu hình thủ công.",
    actionLabel: "Quản lý danh mục tài sản Web3",
    actionRoute: "/portfolio",
  },
  {
    id: "price-alerts-swap",
    category: "general",
    categoryLabel: "Thị Trường & Giao Dịch",
    icon: "swap_horiz",
    question:
      "Tỷ giá hoán đổi (Swap) và dữ liệu thị trường được cập nhật từ đâu?",
    answer:
      "Dữ liệu giá thị trường, biểu đồ nến và vốn hóa của hơn 1,000 đồng tiền điện tử được đồng bộ liên tục từ CoinGecko kết hợp bộ nhớ đệm Redis tốc độ cao tại Backend. Mọi giao dịch Swap đều áp dụng tỷ giá thời gian thực và lưu trữ minh bạch vào sổ cái lịch sử (Swap Ledger).",
    actionLabel: "Mở sàn giao dịch Swap",
    actionRoute: "/swap",
  },
];

const CATEGORIES = [
  { id: "all", label: "Tất cả câu hỏi", icon: "apps" },
  { id: "ctk", label: "Token CTK & Nhiệm Vụ", icon: "redeem" },
  { id: "staking", label: "Staking & Hạng VIP", icon: "savings" },
  { id: "wallet", label: "Ví Web3 & Bảo Mật", icon: "shield" },
  { id: "general", label: "Thị Trường & Swap", icon: "candlestick_chart" },
];

const FaqSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>("what-is-ctk");

  const filteredFaqs =
    selectedCategory === "all"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200/80 dark:border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 border bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/15 dark:border-indigo-500/30 dark:text-indigo-300">
            <span className="material-symbols-outlined text-[15px]">quiz</span>
            TRUNG TÂM HƯỚNG DẪN & GIẢI ĐÁP
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Câu Hỏi Thường Gặp (FAQ)
          </h2>
          <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
            Tìm hiểu nhanh về hệ sinh thái Web3, cách kiếm đồng CTK, gửi lãi kép Staking và nâng hạng VIP.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20"
                    : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 dark:bg-slate-900/60 dark:text-gray-300 dark:border-white/10 dark:hover:border-indigo-500/40"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredFaqs.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-white border-indigo-400 shadow-md ring-1 ring-indigo-500/15 dark:bg-slate-900/80 dark:border-indigo-500/50"
                  : "bg-white border-slate-200/90 hover:border-indigo-200 shadow-xs dark:bg-slate-900/40 dark:border-white/10 dark:hover:border-white/20"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isOpen
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      {item.categoryLabel}
                    </span>
                    <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? "rotate-180 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300"
                      : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-gray-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    expand_more
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 pl-[68px] border-t border-slate-100 dark:border-white/5">
                  <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed mt-3">
                    {item.answer}
                  </p>
                  {item.actionRoute && item.actionLabel && (
                    <button
                      type="button"
                      onClick={() => navigate(item.actionRoute!)}
                      className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline cursor-pointer"
                    >
                      <span>{item.actionLabel}</span>
                      <span className="material-symbols-outlined text-[15px]">
                        arrow_forward
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Onboarding CTA Strip */}
      <div className="mt-6 p-6 rounded-2xl border bg-gradient-to-r from-indigo-50 via-purple-50/60 to-white border-indigo-200/80 shadow-sm dark:bg-gradient-to-r dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/60 dark:border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <span className="material-symbols-outlined text-[22px]">
              rocket_launch
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
              Sẵn sàng bắt đầu hành trình Web3 cùng CryptoTracker?
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
              Nhận ngay 50 CTK khi liên kết ví lần đầu và hưởng lãi suất tới 225% APY tại Staking Vault.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => navigate("/quests")}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-300 dark:border-indigo-500/30 transition-all cursor-pointer"
          >
            Nhận CTK Miễn Phí
          </button>
          <button
            onClick={() => navigate("/staking")}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            Mở Staking Vault
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

