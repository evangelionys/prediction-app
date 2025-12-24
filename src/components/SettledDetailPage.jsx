import React from 'react';
import { ChevronLeft, CheckCircle2, TrendingUp, Clock, Target } from 'lucide-react';
import OpportunityCard from './OpportunityCard';

const SettledDetailPage = ({ data, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">Settled Prediction</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Outcome Banner */}
        <div className={`bg-gradient-to-r ${data.imageGradient} rounded-2xl p-6 text-white mb-4`}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 size={32} className="text-white" />
            <div>
              <div className="text-sm font-medium opacity-90">Resolved</div>
              <div className="text-2xl font-bold">{data.outcome.toUpperCase()}</div>
            </div>
          </div>
          <div className="text-sm opacity-80">{data.timeLeft}</div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{data.question}</h2>
          <div className="text-sm text-gray-500">{data.timeLeft}</div>
        </div>

        {/* Impact Events */}
        {data.impactEvents && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
            <h3 className="font-bold text-slate-900 mb-3">Key Events</h3>
            <div className="space-y-3">
              {data.impactEvents.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-500">{event.date}</span>
                      <span className="text-xs font-bold text-emerald-600">{event.impact}</span>
                    </div>
                    <div className="text-sm text-slate-900 font-medium">{event.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Winning Opportunities */}
        {data.winningOpportunities && (
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 mb-3">Winning Opportunities</h3>
            <div className="space-y-3">
              {data.winningOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettledDetailPage;

