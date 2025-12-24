import React from 'react';
import { ChevronLeft } from 'lucide-react';
import OpportunityCard from './OpportunityCard';

const OpportunitiesListView = ({ onBack, opportunities }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">All Opportunities</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} showReasoning={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesListView;

