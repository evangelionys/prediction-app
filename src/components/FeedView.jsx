import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import PredictionCard from './PredictionCard';
import { MOCK_CARDS } from '../App';

const FILTERS = ["Latest", "Business", "Politics", "Tech"];

const FeedView = ({ onCardClick, onNewsClick, onQuestionClick }) => {
  const [activeFilter, setActiveFilter] = useState("Latest");
  
  return (
    <div className="flex flex-col h-full bg-gray-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Predix</h1>
          </div>
          <div className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
            <Search size={20} className="text-slate-600" />
          </div>
        </div>
        
        <div className="flex overflow-x-auto px-4 pb-3 gap-3 no-scrollbar">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {MOCK_CARDS.map((card) => (
          <PredictionCard 
            key={card.id} 
            data={card} 
            onNewsClick={onNewsClick}
            onQuestionClick={onQuestionClick}
          />
        ))}
        <div className="text-center py-6">
          <p className="text-slate-400 text-sm">You're up to date</p>
        </div>
      </div>
    </div>
  );
};

export default FeedView;

