import React from "react";
import { Link } from "react-router-dom";

const LeftSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col gap-6 lg:col-span-2">
      <nav className="flex flex-col gap-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-brand-pink font-bold"
        >
          <span className="material-symbols-outlined">dashboard</span> Feed
        </Link>
        <Link
          to="/trending"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined">trending_up</span>{" "}
          Trending
        </Link>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined">groups</span> Groups
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined">insights</span> Sentiment
        </a>
      </nav>

      <div className="p-5 glass-card rounded-2xl">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
          Top Gainers
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                alt="SOL"
                className="size-6 rounded-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhAW8Ho4ROO_TUP9D_jfdf3Y_mZZZgPDuISUSCfM_vpd75A4MOHSfI-FWTxJlPwsLZjjXlHBzM7f0v3d4D0n82s-KdER8ketgbOKOerOSoIq0sWD0WevWrXpB5gitiCqnDPO618RBHu4y3gS31H-6behzy_BWgeTJuvh4DBexGTjGjeUYzTxAV02m10IZAWxpa_McqAdEtmGOjEDRUG_SMUrQSgBjmH6YFS0QyII74h_boUg7ynm2vz2DNtdzxTw6GIg3T4vt-I-I"
              />
              <span className="text-sm font-bold">SOL</span>
            </div>
            <span className="text-xs text-brand-cyan">+12.4%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                alt="BTC"
                className="size-6 rounded-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcXyoYeWS8g4LzTq0e9tuhKIN_k8S2VtmjAAtDNkbsa6ZHixo8t49qxRRfImxL1RfMvjXcKjjfxbeIEOuu3tNTuTBiaC8Z1R5e0Qu7QJImAnQ7nHs-_3IdHL1v4iXwZwd_QNcdlnjjeXx1H9jr-oBtcTl2opNFHYXGO9jDo5gChbWdv622Azuh2KUSU2Su-VFjpqLp3x0Qeb5RT3cEkOEggdlOHm7WVjxxsOewishV4Z0dTesmS63RrklV6HLsQXnjN16hYTWXZa4"
              />
              <span className="text-sm font-bold">BTC</span>
            </div>
            <span className="text-xs text-brand-cyan">+4.2%</span>
          </div>
        </div>
        <Link
          to="/gainers"
          className="block text-center w-full mt-6 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 transition-all"
        >
          View All Prices
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
