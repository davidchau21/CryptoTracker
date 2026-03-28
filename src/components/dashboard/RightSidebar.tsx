import React from "react";

const RightSidebar: React.FC = () => {
  return (
    <>
      <div className="glass-panel rounded-2xl p-6 shadow-lg shadow-indigo-500/5 border border-white/50 dark:border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -z-10 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl -z-10 -ml-12 -mb-12"></div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-[#0d121c] dark:text-white">
            Quick Exchange
          </h3>
          <span className="material-symbols-outlined text-brand-secondary hover:text-indigo-500 transition-colors cursor-pointer">
            settings
          </span>
        </div>
        <div className="space-y-2">
          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex justify-between text-xs text-brand-secondary mb-2 font-medium">
              <span>Sell</span>
              <span>Balance: 2,403.20</span>
            </div>
            <div className="flex justify-between items-center">
              <input
                className="bg-transparent border-none p-0 text-2xl font-bold w-full focus:ring-0 text-[#0d121c] dark:text-white placeholder-gray-400"
                placeholder="0.00"
                type="number"
                defaultValue="1000"
              />
              <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
                <img
                  className="size-5 rounded-full"
                  alt="USDT icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwEXYT7aiFgeqlIbK5uBUOtGZ5qlp34VmdQIzYzNizD9UubMWk_TxMYKKiDyKRQsl5VcfCPytjEXErrQawp2igm3N-89SLVDq7R-QCXEgnxQYoRzO-CBfMfsNJ85iDOADhVtc1qGLFrpTgONwjPd_Rje3QZheFAZ03U5jbaDZlMMcC3NtzVrSmAIjQeUlxhI6ynhZc2XAhfteV696TYwe8XLopUFsb0iHHA1DkMqbivI6Dd5qtsvDglzQdEViMfdJeg4fhM_AVp4I"
                />
                <span className="font-bold text-sm text-[#0d121c] dark:text-white">
                  USDT
                </span>
                <span className="material-symbols-outlined text-[18px] text-gray-500">
                  expand_more
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center -my-3 relative z-10">
            <div className="bg-indigo-50 dark:bg-gray-700 p-2 rounded-xl border-2 border-white dark:border-gray-800 shadow-sm cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors group">
              <span className="material-symbols-outlined text-indigo-500 group-hover:rotate-180 transition-transform duration-300">
                swap_vert
              </span>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex justify-between text-xs text-brand-secondary mb-2 font-medium">
              <span>Buy</span>
              <span>Est.</span>
            </div>
            <div className="flex justify-between items-center">
              <input
                className="bg-transparent border-none p-0 text-2xl font-bold w-full focus:ring-0 text-[#0d121c] dark:text-white placeholder-gray-400"
                placeholder="0.00"
                type="number"
                defaultValue="0.5402"
              />
              <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
                <img
                  className="size-5 bg-white rounded-full p-0.5"
                  alt="ETH icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbV0Fslk2aKOjidkQsYiICvImTlgPtpqKFJ7fPr_wRYa9knOclrxCWMaO3iMgfQ9HY_vp7krYm1kRZ4sbCC6Jsbkiqml8BUQyZb5oic6XBg8kRUtgGtIfIYXJBwCmzYbKul6XNQSi3e2kS4AYuOkcB6uM1yjw0MNqyfkpBEu3DU9WBspLEwKgmVgmERpIHjmUIp9pL3LVq_5qxk53O-I1pbV8HXviXIp293n9wChXmalg8DOZtKTv1pr73NpTVogIWs5ejSzzYbvQ"
                />
                <span className="font-bold text-sm text-[#0d121c] dark:text-white">
                  ETH
                </span>
                <span className="material-symbols-outlined text-[18px] text-gray-500">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex justify-center items-center gap-2 transform active:scale-95">
          <span className="material-symbols-outlined text-[20px]">
            currency_exchange
          </span>
          Swap Now
        </button>
        <p className="text-xs text-center text-brand-secondary mt-3 bg-white/30 dark:bg-black/20 py-1 rounded-md mx-auto w-fit px-3">
          1 USDT = 0.00054 ETH • Gas: $4.20
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-[#0d121c] dark:text-white">
            Latest Crypto News
          </h3>
          <a
            className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline decoration-2"
            href="#"
          >
            View All
          </a>
        </div>
        <div className="flex flex-col gap-5">
          <a className="flex gap-3 group" href="#">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-300 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0d121c] dark:text-white leading-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Bitcoin Halving Approaches: What Investors Need to Know
              </h4>
              <div className="flex items-center gap-2 text-xs text-brand-secondary">
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded font-medium">
                  BTC
                </span>
                <span>2h ago</span>
              </div>
            </div>
          </a>
          <a className="flex gap-3 group" href="#">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0d121c] dark:text-white leading-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                SEC Chairman Comments on New DeFi Regulations
              </h4>
              <div className="flex items-center gap-2 text-xs text-brand-secondary">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                  Regs
                </span>
                <span>4h ago</span>
              </div>
            </div>
          </a>
          <a className="flex gap-3 group" href="#">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0d121c] dark:text-white leading-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Ethereum Layer 2 Activity Reaches All-Time High
              </h4>
              <div className="flex items-center gap-2 text-xs text-brand-secondary">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-medium">
                  L2
                </span>
                <span>6h ago</span>
              </div>
            </div>
          </a>
        </div>
      </div>

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
    </>
  );
};

export default RightSidebar;
