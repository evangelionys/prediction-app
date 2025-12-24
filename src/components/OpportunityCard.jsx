import React, { useState } from 'react';
import { Target, Users, Bot } from 'lucide-react';

const OpportunityCard = ({ opp, showReasoning = false, onClick, className = "" }) => {
  const [voted, setVoted] = useState(null);
  
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 p-1.5 rounded-lg text-purple-600">
            <Target size={16} />
          </div>
          <div>
            <div className="text-slate-900 font-bold text-sm">{opp.title || opp.type}</div>
            <div className="text-emerald-600 text-xs font-mono font-bold">{opp.roi} ROI</div>
          </div>
        </div>
        <div className="text-right">
          {!opp.confidence ? (
            <>
              <div className="text-gray-400 text-[10px] uppercase font-bold">Probability</div>
              <div className="text-slate-900 font-bold text-sm leading-none mb-1">{opp.prob || opp.probability}</div>
            </>
          ) : (
             <div className="text-xs bg-emerald-100 text-emerald-600 border border-emerald-200 px-2 py-1 rounded font-bold uppercase">{opp.confidence} Conf.</div>
          )}
          
          {opp.votes && (
            <div className="flex items-center justify-end gap-1 text-gray-400 text-[10px]">
              <Users size={10} />
              <span>{opp.votes}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Recommended Action</div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
          {opp.action}
        </p>
      </div>
      {showReasoning && opp.reasoningChain && (
        <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-1.5 text-cyan-600 mb-2">
            <Bot size={14} />
            <span className="text-xs font-bold uppercase tracking-wide">Predix Logic Chain</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-mono">
            {opp.reasoningChain}
          </p>
        </div>
      )}
      {/* Only show voting buttons if it's not a historical/winning opp */}
      {!opp.confidence && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Is probability reasonable?</span>
          <div className="flex gap-2 text-xs font-medium">
             <button 
               onClick={(e) => { e.stopPropagation(); setVoted('yes'); }}
               className={`px-3 py-1 rounded-full border transition-all ${voted === 'yes' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-white text-slate-500 border-transparent hover:bg-emerald-50 hover:text-emerald-600'}`}
             >
               Reasonable
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); setVoted('no'); }}
               className={`px-3 py-1 rounded-full border transition-all ${voted === 'no' ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-white text-slate-500 border-transparent hover:bg-rose-50 hover:text-rose-600'}`}
             >
               Not really
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;

