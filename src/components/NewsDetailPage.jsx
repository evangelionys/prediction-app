import React from 'react';
import { ChevronLeft, ArrowRight, Newspaper } from 'lucide-react';
import { NEWS_DETAILS } from '../App';

const NewsDetailPage = ({ data, onBack, onGoToPrediction }) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">News Detail</span>
      </div>

      {/* News Image */}
      <div className={`h-64 w-full bg-gradient-to-r ${data.imageGradient} relative`}>
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-xs font-medium text-white px-2 py-1 rounded-md">
          {data.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
          {data.newsTitle}
        </h1>
        
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {NEWS_DETAILS}
          </p>
        </div>

        <button
          onClick={onGoToPrediction}
          className="w-full bg-black text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          View Prediction Question
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default NewsDetailPage;

