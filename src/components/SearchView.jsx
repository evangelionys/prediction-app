import React, { useState, useMemo } from 'react';
import { Search, X, Target, Newspaper, ChevronLeft } from 'lucide-react';
import { MOCK_CARDS } from '../App';
import PredictionCard from './PredictionCard';

const SearchView = ({ onBack, onNewsClick, onQuestionClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('predictions'); // 默认预测题

  // 搜索过滤逻辑
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        predictions: [],
        news: []
      };
    }

    const query = searchQuery.toLowerCase().trim();
    
    const predictions = MOCK_CARDS.filter(card => 
      card.question?.toLowerCase().includes(query)
    );

    const news = MOCK_CARDS.filter(card => 
      card.newsTitle?.toLowerCase().includes(query)
    );

    return { predictions, news };
  }, [searchQuery]);

  const hasResults = activeTab === 'predictions' 
    ? filteredResults.predictions.length > 0
    : filteredResults.news.length > 0;

  const results = activeTab === 'predictions' 
    ? filteredResults.predictions
    : filteredResults.news;

  return (
    <div className="flex flex-col h-full bg-gray-50 text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search predictions or news..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Tab切换 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('predictions')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'predictions'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Target size={16} />
                <span>Predictions</span>
                {searchQuery && (
                  <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {filteredResults.predictions.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'news'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Newspaper size={16} />
                <span>News</span>
                {searchQuery && (
                  <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {filteredResults.news.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {!searchQuery ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">Search predictions and news</p>
            <p className="text-sm text-slate-400">Type keywords to find what you're looking for</p>
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">No results found</p>
            <p className="text-sm text-slate-400">Try different keywords</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((card) => (
              <PredictionCard
                key={card.id}
                data={card}
                onNewsClick={onNewsClick}
                onQuestionClick={onQuestionClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;

