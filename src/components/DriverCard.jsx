import React, { useState } from 'react';
import { Users, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

const DriverCard = ({ driver, compact = false, showSide = false, onChangeMind, className = "" }) => {
  const [voteState, setVoteState] = useState(null); 
  
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2">
          {showSide && (
             <div className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
               driver.side === 'yes' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
             }`}>
               Supports {driver.side}
             </div>
          )}
          <div className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
            driver.strength === 'High' ? 'bg-emerald-50 text-emerald-600' :
            driver.strength === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
            'bg-gray-100 text-gray-500'
          }`}>
            {driver.strength} Confidence
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Users size={12} /> {driver.votes + (voteState ? 1 : 0)}
        </div>
      </div>
      
      <h4 className="text-slate-900 font-bold text-sm mb-2 leading-snug">
        {driver.claim}
      </h4>
      
      {driver.evidence && (
        <div 
          className="bg-gray-50 p-3 rounded-lg border-l-2 border-cyan-500 mb-3 cursor-pointer hover:bg-gray-100 group transition-colors"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <p className="text-xs text-slate-600 italic group-hover:text-slate-900 transition-colors line-clamp-3">
            "{driver.evidence}"
          </p>
        </div>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {onChangeMind ? (
           <button 
             onClick={onChangeMind}
             className="text-[10px] bg-gray-100 hover:bg-gray-200 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1 transition-colors border border-gray-200"
           >
             <RefreshCw size={10} /> Changed My Mind
           </button>
        ) : (
           <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Vote Strength</span>
        )}
        
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setVoteState(voteState === 'up' ? null : 'up'); }}
            className={`p-1.5 rounded-full transition-all ${voteState === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
          >
            <ThumbsUp size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setVoteState(voteState === 'down' ? null : 'down'); }}
            className={`p-1.5 rounded-full transition-all ${voteState === 'down' ? 'bg-rose-100 text-rose-600' : 'bg-gray-50 text-gray-400 hover:text-rose-600 hover:bg-rose-50'}`}
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;

