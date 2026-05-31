import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "@/providers/WalletProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Notification, fetchNotifications, markAllNotificationsAsRead } from "@/services/api";

interface TopHeaderProps {
  onSearch?: (query: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const { isConnected, connect, disconnect, address } = useWallet();
  const { user, isAuthenticated, logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDark = theme === "dark";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    if (!token) return;
    try {
      const data = await fetchNotifications(token);
      setNotifications(data);
    } catch (e) {
      console.error("Lỗi khi tải thông báo:", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      await markAllNotificationsAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error("Lỗi khi đánh dấu đã đọc:", e);
    }
  };

  const timeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (seconds < 60) return "Vừa xong";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} phút trước`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} giờ trước`;
      const days = Math.floor(hours / 24);
      return `${days} ngày trước`;
    } catch (e) {
      return "";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const shortenedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

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
             <Link
              className={`text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-1 ${
                isActive("/quests") ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-brand-secondary dark:text-gray-300"
              }`}
              to="/quests"
            >
              Quests
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${isActive("/quests") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
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
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsNotifOpen(!isNotifOpen);
                    loadNotifications();
                  } else {
                    navigate("/login");
                  }
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 relative"
              >
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white ring-2 ring-white dark:ring-gray-800">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && isAuthenticated && (
                <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border backdrop-blur-md z-50 p-3 transition-all animate-in fade-in-50 slide-in-from-top-3 duration-200 ${isDark ? "bg-[#0d1425]/95 border-white/5 text-white" : "bg-white/95 border-slate-200/80 text-slate-800"}`}>
                  
                  {/* Notifications Header */}
                  <div className={`flex items-center justify-between pb-2 mb-2 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      Thông Báo ({notifications.length})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-1 font-semibold"
                      >
                        <span className="material-symbols-outlined text-[12px]">done_all</span>
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  {/* List Container */}
                  <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[28px] text-gray-400 dark:text-gray-600">
                          notifications_off
                        </span>
                        <span className={`text-[11px] ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                          Không có thông báo nào.
                        </span>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const isRead = notif.isRead;
                        return (
                          <div
                            key={notif._id}
                            className={`p-2.5 rounded-xl transition-all border flex items-start gap-2.5 ${
                              isRead
                                ? isDark
                                  ? "bg-white/0 border-transparent hover:bg-white/5"
                                  : "bg-transparent border-transparent hover:bg-slate-100"
                                : isDark
                                ? "bg-indigo-500/10 border-indigo-500/10 hover:bg-indigo-500/15"
                                : "bg-indigo-50/70 border-indigo-100/50 hover:bg-indigo-50"
                            }`}
                          >
                            <div className={`size-8 rounded-lg flex items-center justify-center text-sm shadow-sm shrink-0 ${
                              notif.type === "alert"
                                ? "bg-amber-500/10 text-amber-500"
                                : notif.type === "swap"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-indigo-500/10 text-indigo-500"
                            }`}>
                              <span className="material-symbols-outlined text-[18px]">
                                {notif.type === "alert"
                                  ? "notifications_active"
                                  : notif.type === "swap"
                                  ? "swap_horiz"
                                  : "settings"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className={`text-[11px] font-bold truncate block ${isDark ? "text-white" : "text-slate-800"}`}>
                                  {notif.title}
                                </span>
                                <span className={`text-[9px] shrink-0 ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                                  {timeAgo(notif.createdAt)}
                                </span>
                              </div>
                              <span className={`text-[10px] mt-0.5 leading-relaxed block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                                {notif.message}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isConnected ? (
            <button
              onClick={disconnect}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              <span className="hidden sm:inline font-mono">{shortenedAddress}</span>
            </button>
          ) : (
            <button
              onClick={connect}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center gap-2 transform hover:-translate-y-0.5 animate-pulse-subtle"
            >
              <span className="material-symbols-outlined text-[18px]">
                account_balance_wallet
              </span>
              <span className="hidden sm:inline">Connect Wallet</span>
            </button>
          )}

          {/* User Authentication Dropdown section */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            {isAuthenticated && user ? (
              <div className="relative">
                {/* Avatar Action Trigger */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="size-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center text-white font-extrabold text-sm shadow-md transition-all transform hover:-translate-y-0.5 relative group border border-white/10"
                  title="Tài khoản của bạn"
                >
                  {user.displayName.slice(0, 2).toUpperCase()}
                  <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full border border-[#060913]"></span>
                </button>

                {/* Glassmorphic Dropdown Menu */}
                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl border backdrop-blur-md z-50 p-2.5 transition-all animate-in fade-in-50 slide-in-from-top-3 duration-200 ${isDark ? "bg-[#0d1425]/95 border-white/5 text-white" : "bg-white/95 border-slate-200/80 text-slate-800"}`}>
                    
                    {/* User profile brief */}
                    <div className={`px-3 py-2.5 mb-2 border-b flex flex-col ${isDark ? "border-white/5" : "border-slate-100"}`}>
                      <span className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                        {user.displayName}
                      </span>
                      <span className={`text-[10px] truncate mt-0.5 ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                        {user.email}
                      </span>
                    </div>

                    {/* Nav options */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${isDark ? "hover:bg-white/5 text-gray-300 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-indigo-500">
                        dashboard
                      </span>
                      Trang Cá Nhân / Quản Lý
                    </button>
                    
                     <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/quests");
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${isDark ? "hover:bg-white/5 text-gray-300 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-indigo-500">
                        emoji_events
                      </span>
                      Hệ Thống Nhiệm Vụ (CTK)
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/portfolio");
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${isDark ? "hover:bg-white/5 text-gray-300 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-indigo-500">
                        account_balance_wallet
                      </span>
                      Quản Lý Tài Sản (CTK)
                    </button>


                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/security");
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${isDark ? "hover:bg-white/5 text-gray-300 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-indigo-500">
                        shield
                      </span>
                      Bảo Mật & Mật Khẩu
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/history");
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${isDark ? "hover:bg-white/5 text-gray-300 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-indigo-500">
                        history
                      </span>
                      Lịch Sử Swap Ledger
                    </button>

                    {/* Logout Option */}
                    <div className={`mt-2 pt-2 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left text-rose-500 ${isDark ? "hover:bg-rose-500/10" : "hover:bg-rose-50"}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          logout
                        </span>
                        Đăng Xuất Tài Khoản
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-slate-100 dark:bg-gray-800 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/5 border border-gray-200 dark:border-gray-700 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 text-[#0d121c] dark:text-gray-300 text-sm font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  login
                </span>
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
