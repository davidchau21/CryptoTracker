import React from "react";
import { Link } from "react-router-dom";

const RightSidebarDetail: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Buy Bitcoin Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg border border-white/60 dark:border-white/10 relative overflow-hidden group bg-white/40 dark:bg-[#131B2C]/80">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="text-lg font-bold text-[#0d121c] dark:text-white mb-5 relative z-10">
          Buy Bitcoin
        </h3>
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">
              Spend
            </label>
            <div className="flex items-center rounded-xl border border-white/60 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400/50 transition-all shadow-inner">
              <input
                className="w-full bg-transparent border-none text-[#0d121c] dark:text-white font-bold text-lg p-3 focus:ring-0 placeholder-gray-400"
                type="number"
                defaultValue="1000"
              />
              <div className="flex items-center gap-2 px-3 border-l border-white/60 dark:border-gray-700/50 bg-slate-50/50 dark:bg-gray-700/40 h-full">
                <span className="font-bold text-sm text-[#0d121c] dark:text-white">
                  USD
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-3 z-20">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full border shadow-md border-white/60 dark:border-gray-700 text-indigo-500 hover:text-white hover:bg-indigo-500 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[20px] font-bold block">
                arrow_downward
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">
              Receive
            </label>
            <div className="flex items-center rounded-xl border border-white/60 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400/50 transition-all shadow-inner">
              <input
                className="w-full bg-transparent border-none text-[#0d121c] dark:text-white font-bold text-lg p-3 focus:ring-0 placeholder-gray-400"
                type="number"
                defaultValue="0.0236"
              />
              <div className="flex items-center gap-2 px-3 border-l border-white/60 dark:border-gray-700/50 bg-slate-50/50 dark:bg-gray-700/40 h-full">
                <img
                  className="w-5 h-5 rounded-full ring-1 ring-white/20"
                  alt="BTC Icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhbTAIpS7oMrg9SBn24X1keGWGXGch5zrDyJGU0vIdSTIrgVkupjKG_pkkAKcGYqISD8tIhnV2Ix0j9R4-Z0vYIqQjTQQzaqontYFygAIPtaLTazgDNsfqUkc9Ea-xR3UDcEmoWlVUNEG9YJieXsdPY1Ws9aVgQDMMt8gnzOsRyulIn3Km71VnkmHn2qWNnkPsxfXGiVt3j1CHSQHmQnODbPrJiUgC4b97hzq8yQwC65QBdOMhwtYqbZIjzlrJBr9fstAYOEO8YAM"
                />
                <span className="font-bold text-sm text-[#0d121c] dark:text-white">
                  BTC
                </span>
              </div>
            </div>
          </div>

          <button className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/50 transform active:scale-95 text-lg tracking-wide uppercase">
            Buy Bitcoin
          </button>

          <p className="text-[10px] text-center text-brand-secondary mt-1">
            Powered by{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              CryptoSwap
            </span>
          </p>
        </div>
      </div>

      {/* Official Links */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-widest px-1">
          Official Links
        </h3>
        <div className="flex flex-wrap gap-2">
          <a
            className="flex-1 min-w-[120px] flex items-center justify-between gap-2 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 px-4 py-3 rounded-xl border border-white/50 dark:border-gray-700/50 text-sm font-medium transition-all group shadow-sm"
            href="#"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-secondary group-hover:text-indigo-500 transition-colors">
                language
              </span>
              <span className="text-[#0d121c] dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-white">
                Website
              </span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-gray-400 group-hover:text-indigo-500">
              open_in_new
            </span>
          </a>
          <a
            className="flex-1 min-w-[120px] flex items-center justify-between gap-2 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 px-4 py-3 rounded-xl border border-white/50 dark:border-gray-700/50 text-sm font-medium transition-all group shadow-sm"
            href="#"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-secondary group-hover:text-purple-500 transition-colors">
                description
              </span>
              <span className="text-[#0d121c] dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-white">
                Whitepaper
              </span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-gray-400 group-hover:text-purple-500">
              open_in_new
            </span>
          </a>
          <a
            className="flex-1 min-w-[120px] flex items-center justify-between gap-2 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 px-4 py-3 rounded-xl border border-white/50 dark:border-gray-700/50 text-sm font-medium transition-all group shadow-sm"
            href="#"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-secondary group-hover:text-blue-500 transition-colors">
                search
              </span>
              <span className="text-[#0d121c] dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-white">
                Explorers
              </span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-gray-400 group-hover:text-blue-500">
              open_in_new
            </span>
          </a>
          <a
            className="flex-1 min-w-[120px] flex items-center justify-between gap-2 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 px-4 py-3 rounded-xl border border-white/50 dark:border-gray-700/50 text-sm font-medium transition-all group shadow-sm"
            href="#"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-secondary group-hover:text-pink-500 transition-colors">
                group
              </span>
              <span className="text-[#0d121c] dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-white">
                Community
              </span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-gray-400 group-hover:text-pink-500">
              open_in_new
            </span>
          </a>
        </div>
      </div>

      {/* Community Sentiment */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10 relative overflow-hidden bg-white/40 dark:bg-[#131B2C]/80">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-rose-500 opacity-70"></div>
        <h3 className="text-lg font-bold text-[#0d121c] dark:text-white mb-2">
          Community Sentiment
        </h3>
        <p className="text-xs text-brand-secondary mb-5">
          How do you feel about Bitcoin today?
        </p>

        <div className="flex gap-4 mb-6">
          <button className="flex-1 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined">trending_up</span>
            Bullish
          </button>
          <button className="flex-1 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 hover:bg-rose-100 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined">trending_down</span>
            Bearish
          </button>
        </div>

        <div className="w-full h-3 rounded-full flex overflow-hidden bg-gray-200 dark:bg-gray-800 p-0.5 border border-white/50 dark:border-gray-700 shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-l-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
            style={{ width: "78%" }}
          ></div>
          <div
            className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-r-full shadow-[0_0_8px_rgba(244,63,94,0.3)]"
            style={{ width: "22%" }}
          ></div>
        </div>

        <div className="flex justify-between mt-3 text-xs font-bold uppercase tracking-wider">
          <span className="text-emerald-600 dark:text-emerald-400">
            78% Bullish
          </span>
          <span className="text-rose-600 dark:text-rose-400">22% Bearish</span>
        </div>
      </div>

      {/* Trending Coins */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-widest px-1">
          Trending Coins
        </h3>
        <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-white/60 dark:border-white/10 bg-white/40 dark:bg-[#131B2C]/80">
          <Link
            className="flex items-center justify-between p-4 bg-white/20 dark:bg-transparent hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0 group"
            to="/coin/bonk"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-secondary font-bold w-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                1
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 flex items-center justify-center text-[12px] shadow-sm text-black font-bold border border-white/50">
                🐶
              </div>
              <span className="text-sm font-bold text-[#0d121c] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                Bonk
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-500/20">
              +12.4%
            </span>
          </Link>
          <Link
            className="flex items-center justify-between p-4 bg-white/20 dark:bg-transparent hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0 group"
            to="/coin/solana"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-secondary font-bold w-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                2
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-[12px] shadow-sm text-white font-bold border border-white/50">
                S
              </div>
              <span className="text-sm font-bold text-[#0d121c] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                Solana
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-500/20">
              +5.2%
            </span>
          </Link>
          <Link
            className="flex items-center justify-between p-4 bg-white/20 dark:bg-transparent hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0 group"
            to="/coin/celestia"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-secondary font-bold w-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                3
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-400 flex items-center justify-center text-[12px] shadow-sm text-white font-bold border border-white/50">
                T
              </div>
              <span className="text-sm font-bold text-[#0d121c] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                Tia
              </span>
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 border border-rose-100 dark:border-rose-500/20 px-2 py-1 rounded">
              -2.1%
            </span>
          </Link>
        </div>
      </div>

      {/* Live Discussions */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-[#0d121c] dark:text-white">
            Live Discussions
          </h3>
          <div className="flex -space-x-3">
            <div
              className="size-8 rounded-full bg-gray-300 ring-2 ring-white dark:ring-[#1e2634] bg-cover shadow-sm"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAai00pUAHEXT-QVSyo0-hY4c7Bv5L8cTpeAnsihbLNvwWhiwzB3wSWOaT99hKva-SQc-OuMnjcz_ocgOiQ7vqhEgIsgnMVSm11QsNdTr6FyHnEJcXE2hq01TTcg7L3d0sUdKwRL7_JRxTt5-PV2kl1q2RFXDLaqwnPr4DfnDXu7HnILS3DHitY42bIbCayDnDFsQ0OCehLUjUXQOX86_mTPSNJbaxqqg8xmJXN-DJ7CU0x4jiAiZXgQyy01CiGKWkU-pR0hMLDR4E')",
              }}
            ></div>
            <div
              className="size-8 rounded-full bg-gray-300 ring-2 ring-white dark:ring-[#1e2634] bg-cover shadow-sm"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYfKRiEl8bwOsVNKPUHArbS3BOw77CZgy1cs4sIn3tXg0nAfjDQiA9YLdmultMw_OW0Q5jAVHjthu_xlhtf9MUFMjzZalahHfvOSuE7SCrWYRnDElHn5pT8hhHQ8VC6VU2DB2TSCL9vI0ImYqdXSGyDmKzHR4ny7r1Cpxfox4dxsdqLNxM54p4AXaitDZfAxYKqbeS_-iWTccuTrW0STjTdBmU71oyuXGk0OSYhrnJX66r0U9b6qUeeSLc9S2YSmMaZtf62B5z7r4')",
              }}
            ></div>
            <div className="size-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 ring-2 ring-white dark:ring-[#1e2634] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              99+
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white/40 dark:bg-gray-800/40 p-3 rounded-xl border border-white/40 dark:border-gray-700/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="size-8 rounded-full bg-cover ring-2 ring-white/50 dark:ring-white/10"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClcwNWPCZGPf34JLvpRhSvRd8wn6Pfj-Ojb1l150nhnLe1DQhAWF0MPIjw5L9Nk0kz5-PLgi2A3BLAgWUQoM2ePfhRaHhinALlDmsW53A2Bet_zDN7DlB2OBeWbXdaiwYHWeox7MPdDzLSUNeUc86YCpsF4jgFMTHM6SnSHQH4HmLTIsm5J8ob2TaCBM4WDoF_KDKc6w288uKthixTYBV4Jsfshf2_ROTBaTH-lDKIUI0Hr3Ci1XMJrqbryXIQtfxJKVbeI1ZhAM4')",
                  }}
                ></div>
                <span className="text-sm font-bold text-[#0d121c] dark:text-white">
                  CryptoKing
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Bullish
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              BTC looking strong at $28k support. Next stop $32k! 🚀
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-brand-secondary font-medium">
              <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  thumb_up
                </span>
                124
              </span>
              <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  chat_bubble
                </span>
                12
              </span>
              <span className="ml-auto">2m ago</span>
            </div>
          </div>
          <div className="bg-white/40 dark:bg-gray-800/40 p-3 rounded-xl border border-white/40 dark:border-gray-700/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="size-8 rounded-full bg-cover ring-2 ring-white/50 dark:ring-white/10"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8__AEAHm4nbBv35Q4uKL3T1AUzdzNIjIxzmkYKDa6DR83zACVMCpHBlz10EBmacYL9OgklT00583Y9yVUKGTxvjcMNWT_0Eou-ZPvkrWeukGamqLxZSVFPioWO_M6NNxTONuSpscTgP9Egk5CeW4sNqHdLBWyG55Vuj27AlJuYspkxBxb330EEYWGR3Mgd8Rehlc-FiQpUyvAw19TnjuHdNZIgYhtJmcS_tMt1xthZyLZepv5L7vkh-IR7PkKkjZJnE0yNHcl2bc')",
                  }}
                ></div>
                <span className="text-sm font-bold text-[#0d121c] dark:text-white">
                  BearWhale
                </span>
              </div>
              <span className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Bearish
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Volume is dropping. I'm shorting this bounce. Be careful everyone.
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-brand-secondary font-medium">
              <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  thumb_up
                </span>
                45
              </span>
              <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  chat_bubble
                </span>
                8
              </span>
              <span className="ml-auto">15m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebarDetail;
