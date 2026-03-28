import React, { useState, useEffect } from "react";
import TopMetricsBar from "./TopMetricsBar";
import TopHeader from "./TopHeader";
import RightSidebar from "./RightSidebar";
import { ArrowUp } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  hideSidebar?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onSearch,
  hideSidebar = false,
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <TopMetricsBar />
      <TopHeader onSearch={onSearch} />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 relative z-0">
        <div className="flex flex-col xl:flex-row gap-8">
          <div
            className={`flex-1 min-w-0 flex flex-col gap-6 ${hideSidebar ? "w-full" : "xl:w-3/4"}`}
          >
            {children}
          </div>

          {!hideSidebar && (
            <div className="w-full xl:w-1/4 flex flex-col gap-6">
              <RightSidebar />
            </div>
          )}
        </div>
      </main>

      <footer className="glass-panel border-t border-border-light dark:border-border-dark mt-auto z-10 overflow-hidden relative">
        <div className="py-2 border-b border-border-light dark:border-border-dark bg-indigo-50/50 dark:bg-gray-800/30 overflow-hidden">
          <div className="flex whitespace-nowrap group">
            <div className="flex items-center gap-8 px-4 animate-marquee group-hover:[animation-play-state:paused] min-w-full justify-around text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-widest">
              <span>🚀 Bitcoin hits new all-time high</span>
              <span>💎 Ethereum 2.0 staking rewards increased</span>
              <span>🔥 Solana network sees record TPS</span>
              <span>💰 DeFi total value locked surpasses $100B again</span>
              <span>🛡️ Crypto regulation framework proposed</span>
            </div>
            <div className="flex items-center gap-8 px-4 animate-marquee group-hover:[animation-play-state:paused] min-w-full justify-around text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-widest absolute top-2 left-full">
              <span>🚀 Bitcoin hits new all-time high</span>
              <span>💎 Ethereum 2.0 staking rewards increased</span>
              <span>🔥 Solana network sees record TPS</span>
              <span>💰 DeFi total value locked surpasses $100B again</span>
              <span>🛡️ Crypto regulation framework proposed</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                  C
                </div>
                <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  CoinHub
                </span>
              </div>
              <p className="text-slate-600 dark:text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
                Your premier destination for cryptocurrency tracking, portfolio
                management, and market insights. Designed with modern technology
                to provide you the best experience in the blockchain ecosystem.
              </p>
              <div className="flex gap-4">
                <a
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    public
                  </span>
                </a>
                <a
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    mail
                  </span>
                </a>
                <a
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    forum
                  </span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Products
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Crypto Tracker
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Portfolio Manager
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Exchange API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Wallet Connect
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border-light dark:border-border-dark flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 dark:text-gray-400 text-sm">
              © 2026 CoinHub. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>by the Crypto Team</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center animate-in fade-in zoom-in slide-in-from-bottom-4"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default DashboardLayout;
