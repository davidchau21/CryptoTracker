import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Link, useLocation } from "react-router-dom";

interface TopHeaderProps {
  onSearch?: (query: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border-light dark:border-border-dark px-4 md:px-6 lg:px-8 py-3 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-[#0d121c] dark:text-white cursor-pointer group">
            <div className="size-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
              CT
            </div>
            <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-gray-200">
              CryptoTracker
            </h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              className={`text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-1 ${
                isActive("/") ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-brand-secondary dark:text-gray-300"
              }`}
              to="/"
            >
              Markets
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${isActive("/") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
            <Link
              className={`text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-1 ${
                isActive("/trending") ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-brand-secondary dark:text-gray-300"
              }`}
              to="/trending"
            >
              Trending
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${isActive("/trending") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
            <Link
              className={`text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-1 ${
                isActive("/gainers") ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-brand-secondary dark:text-gray-300"
              }`}
              to="/gainers"
            >
              Gainers
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${isActive("/gainers") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
            <Link
              className={`text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-1 ${
                isActive("/recent") ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-brand-secondary dark:text-gray-300"
              }`}
              to="/recent"
            >
              New Coins
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${isActive("/recent") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
            <Link
              className={`text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-1 ${
                isActive("/swap") ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-brand-secondary dark:text-gray-300"
              }`}
              to="/swap"
            >
              Swap
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${isActive("/swap") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
          </nav>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                search
              </span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-800/50 text-[#0d121c] dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all sm:text-sm shadow-sm backdrop-blur-sm"
              placeholder="Search coins, exchanges, NFTs..."
              type="text"
              onChange={(e) => onSearch?.(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="bg-gray-100 dark:bg-gray-700 rounded px-1.5 py-0.5 text-xs text-gray-400 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                /
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-brand-secondary dark:text-gray-300">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400">
              <span className="material-symbols-outlined text-[20px]">
                star
              </span>
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 relative">
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
            </button>
          </div>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center gap-2 transform hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-[18px]">
              account_balance_wallet
            </span>
            <span className="hidden sm:inline">Connect Wallet</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
