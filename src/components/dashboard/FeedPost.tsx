import React from "react";

const FeedPost: React.FC = () => {
  return (
    <div className="glass-card rounded-[2rem] p-6 feed-card relative overflow-hidden group mb-6">
      <div className="absolute -top-12 -right-12 size-40 bg-brand-pink/20 blur-[80px] group-hover:bg-brand-pink/30 transition-all"></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <img
              alt="BTC"
              className="size-8"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcXyoYeWS8g4LzTq0e9tuhKIN_k8S2VtmjAAtDNkbsa6ZHixo8t49qxRRfImxL1RfMvjXcKjjfxbeIEOuu3tNTuTBiaC8Z1R5e0Qu7QJImAnQ7nHs-_3IdHL1v4iXwZwd_QNcdlnjjeXx1H9jr-oBtcTl2opNFHYXGO9jDo5gChbWdv622Azuh2KUSU2Su-VFjpqLp3x0Qeb5RT3cEkOEggdlOHm7WVjxxsOewishV4Z0dTesmS63RrklV6HLsQXnjN16hYTWXZa4"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg text-white">
                Bitcoin is Breaking Out! 🚀
              </h3>
              <span className="bg-brand-cyan/20 text-brand-cyan text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Trending #1
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Market sentiment:{" "}
              <span className="text-brand-cyan font-bold">
                Ultra Bullish 🐂
              </span>
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <p className="text-gray-300 mb-6 text-base leading-relaxed relative z-10">
        BTC just touched $28.5k and the community is going wild! Seeing massive
        accumulation on exchange heatmaps. Is $30k next or are we seeing a
        fakeout? 👀
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">
            Current Price
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">$28,400</span>
            <span className="text-brand-cyan text-xs font-bold">+2.4%</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">
            Social Volume
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">1.2M</span>
            <span className="text-brand-pink text-xs font-bold">🔥 Hot</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-400 hover:text-brand-pink transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              favorite
            </span>
            <span className="text-xs font-bold">4.2k</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              chat_bubble
            </span>
            <span className="text-xs font-bold">284</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-brand-cyan transition-colors">
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span className="text-xs font-bold">150</span>
          </button>
        </div>

        <div className="flex -space-x-3">
          <div
            className="size-8 rounded-full border-2 border-dark-card bg-cover"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAai00pUAHEXT-QVSyo0-hY4c7Bv5L8cTpeAnsihbLNvwWhiwzB3wSWOaT99hKva-SQc-OuMnjcz_ocgOiQ7vqhEgIsgnMVSm11QsNdTr6FyHnEJcXE2hq01TTcg7L3d0sUdKwRL7_JRxTt5-PV2kl1q2RFXDLaqwnPr4DfnDXu7HnILS3DHitY42bIbCayDnDFsQ0OCehLUjUXQOX86_mTPSNJbaxqqg8xmJXN-DJ7CU0x4jiAiZXgQyy01CiGKWkU-pR0hMLDR4E')",
            }}
          ></div>
          <div
            className="size-8 rounded-full border-2 border-dark-card bg-cover"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYfKRiEl8bwOsVNKPUHArbS3BOw77CZgy1cs4sIn3tXg0nAfjDQiA9YLdmultMw_OW0Q5jAVHjthu_xlhtf9MUFMjzZalahHfvOSuE7SCrWYRnDElHn5pT8hhHQ8VC6VU2DB2TSCL9vI0ImYqdXSGyDmKzHR4ny7r1Cpxfox4dxsdqLNxM54p4AXaitDZfAxYKqbeS_-iWTccuTrW0STjTdBmU71oyuXGk0OSYhrnJX66r0U9b6qUeeSLc9S2YSmMaZtf62B5z7r4')",
            }}
          ></div>
          <div className="size-8 rounded-full border-2 border-dark-card bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
            +18
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
