import React from 'react';
import { Cpu, Users, MessageSquare, TrendingUp, Bookmark, CheckCircle2, Flame } from 'lucide-react';

const PredictionCard = ({ data, onNewsClick, onQuestionClick }) => {
  const totalPercentage = data.stats.yes + data.stats.no;
  const yesWidth = (data.stats.yes / totalPercentage) * 100;
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden mb-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 relative group"
    >
      {/* Top Section - News (Clickable for News Detail) */}
      <div 
        onClick={() => onNewsClick(data)}
        className={`h-32 w-full bg-gradient-to-r ${data.imageGradient} relative p-4 flex flex-col justify-end cursor-pointer active:opacity-95 transition-all ${data.status === 'closed' ? 'grayscale-[0.5]' : ''}`}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
        
        {/* NEW Badge */}
        {data.isNew && (
          <div className="absolute top-0 left-0 z-20 m-3 flex items-center gap-1 bg-white/90 text-rose-600 px-2 py-1 rounded text-xs font-bold shadow-sm backdrop-blur-sm">
            <Flame size={12} fill="currentColor" /> NEW
          </div>
        )}
        {/* Closed Badge */}
        {data.status === 'closed' && (
           <div className="absolute top-0 left-0 z-20 m-3 flex items-center gap-1 bg-black/80 text-white border border-gray-500 px-2 py-1 rounded text-xs font-bold shadow-lg backdrop-blur-sm">
             <CheckCircle2 size={12} className="text-emerald-400" /> CLOSED
           </div>
        )}
        <button 
          className="absolute top-3 right-3 z-20 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all border border-white/20"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <Bookmark size={18} />
        </button>
        <span className="relative z-10 bg-black/40 backdrop-blur-sm text-xs font-medium text-white px-2 py-1 rounded-md w-fit mb-2 border border-white/10">
          {data.category}
        </span>
        <h3 className="relative z-10 text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow-md mb-1">
          {data.newsTitle}
        </h3>
      </div>
      {/* Bottom Section - Question & Stats (Clickable for Prediction Detail) */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onQuestionClick(data)}
      >
        <div className="flex gap-2 items-start mb-4">
          <div className="mt-1 min-w-[20px]">
            <Cpu size={20} className="text-cyan-600" />
          </div>
          <h4 className="text-slate-900 font-bold text-xl leading-tight">
            {data.question}
          </h4>
        </div>
        <div className="mb-4">
          {data.status === 'closed' ? (
             <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
               <div className={`text-sm font-bold px-2 py-0.5 rounded uppercase ${data.outcome === 'yes' ? 'bg-cyan-100 text-cyan-700' : 'bg-rose-100 text-rose-700'}`}>
                 Outcome: {data.outcome.toUpperCase()}
               </div>
               <span className="text-xs text-gray-500 ml-auto">Ended Dec 20, 2024</span>
             </div>
          ) : (
            <>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <div className="flex items-center gap-1 text-cyan-600">
                  <span>Yes {data.stats.yes}%</span>
                  {data.trending === 'yes' && <TrendingUp size={14} className="stroke-[3px]" />}
                </div>
                <div className="flex items-center gap-1 text-rose-500">
                  <span>No {data.stats.no}%</span>
                </div>
              </div>
              
              <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-cyan-500" style={{ width: `${yesWidth}%` }} />
                <div className="h-full bg-rose-500" style={{ width: `${100 - yesWidth}%` }} />
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-4 text-gray-500 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{data.followers.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} />
              <span>{data.drivers} Drivers</span>
            </div>
          </div>
          <button 
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors flex items-center gap-1 shadow-sm ${
              data.status === 'closed' 
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {data.status === 'closed' ? 'View Results' : 'Predict'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;

