import React from "react";

const FeedHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full mb-6">
      <div className="glass-card rounded-3xl p-4 flex items-center gap-4">
        <div className="size-10 rounded-full bg-brand-purple/20 flex items-center justify-center border border-brand-purple/50">
          <span className="material-symbols-outlined text-brand-purple">
            person
          </span>
        </div>
        <div className="flex-1 px-4 py-2.5 bg-white/5 rounded-2xl text-gray-500 text-sm cursor-text hover:bg-white/10 transition-all">
          What's the word on the street? 🗣️
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-brand-pink transition-colors">
            <span className="material-symbols-outlined">image</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-brand-pink transition-colors">
            <span className="material-symbols-outlined">poll</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex gap-4">
          <button className="text-sm font-bold border-b-2 border-brand-pink pb-1 text-white">
            For You
          </button>
          <button className="text-sm font-bold text-gray-500 hover:text-gray-300 pb-1">
            Trending
          </button>
          <button className="text-sm font-bold text-gray-500 hover:text-gray-300 pb-1">
            Recent
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
