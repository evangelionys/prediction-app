import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, Newspaper } from 'lucide-react';
import PredictionCard from './PredictionCard';
import { MOCK_CARDS } from '../App';

const FILTERS = ["Latest", "Business", "Politics", "Tech"];

const FeedView = ({ onCardClick, onNewsClick, onQuestionClick, onSearchClick }) => {
  const [activeFilter, setActiveFilter] = useState("Latest");
  const [showSecondaryFilters, setShowSecondaryFilters] = useState(false);
  const scrollContainerRef = useRef(null);
  const lastScrollTop = useRef(0);

  // Handle scroll to show/hide secondary filters
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollTop = scrollContainerRef.current.scrollTop;
      
      // Show filters when scrolling down, hide when scrolling up
      if (currentScrollTop > lastScrollTop.current && currentScrollTop > 50) {
        setShowSecondaryFilters(true);
      } else if (currentScrollTop < lastScrollTop.current || currentScrollTop <= 10) {
        setShowSecondaryFilters(false);
      }
      
      lastScrollTop.current = currentScrollTop;
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    } else {
      setShowSecondaryFilters(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Probable</h1>
          </div>
          <button
            onClick={onSearchClick}
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Search size={20} className="text-slate-600" />
          </button>
        </div>
        
        {/* Secondary Filters */}
        <div 
          className={`flex overflow-x-auto px-4 pb-3 gap-3 no-scrollbar transition-all duration-300 ${
            showSecondaryFilters ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
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
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-24"
      >
        <div className="p-4">
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
    </div>
  );
};

export default FeedView;

