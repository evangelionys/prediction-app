import React, { useState } from 'react';
import { ChevronLeft, Cpu, Users, MessageSquare, TrendingUp, Bot, Target, ArrowRight, Plus } from 'lucide-react';
import DriverCard from './DriverCard';
import OpportunityCard from './OpportunityCard';
import { MOCK_COMMENTS } from '../App';
import CommentCard from './CommentCard';

const DETAIL_TABS = ["Question", "Reasoning", "Opportunities", "Discussions"];

const DetailPage = ({ data, onBack, setSubView, drivers, opportunities, onPredict }) => {
  const [activeTab, setActiveTab] = useState("Question");
  const [userPrediction, setUserPrediction] = useState(null);
  
  const totalPercentage = data.stats.yes + data.stats.no;
  const yesWidth = (data.stats.yes / totalPercentage) * 100;

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">Prediction Detail</span>
      </div>

      {/* Question Section */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex gap-2 items-start mb-4">
          <Cpu size={24} className="text-cyan-600 mt-1" />
          <h1 className="text-2xl font-bold text-slate-900 leading-tight flex-1">
            {data.question}
          </h1>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium mb-1.5">
            <div className="flex items-center gap-1 text-cyan-600">
              <span>Yes {data.stats.yes}%</span>
              {data.trending === 'yes' && <TrendingUp size={14} />}
            </div>
            <div className="flex items-center gap-1 text-rose-500">
              <span>No {data.stats.no}%</span>
            </div>
          </div>
          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
            <div className="h-full bg-cyan-500" style={{ width: `${yesWidth}%` }} />
            <div className="h-full bg-rose-500" style={{ width: `${100 - yesWidth}%` }} />
          </div>
        </div>

        {!userPrediction && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setUserPrediction('yes');
                onPredict('yes');
              }}
              className="flex-1 bg-cyan-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-cyan-700 transition-colors"
            >
              Predict Yes
            </button>
            <button
              onClick={() => {
                setUserPrediction('no');
                onPredict('no');
              }}
              className="flex-1 bg-rose-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors"
            >
              Predict No
            </button>
          </div>
        )}

        {userPrediction && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Your Prediction</div>
            <div className={`text-sm font-bold ${userPrediction === 'yes' ? 'text-cyan-600' : 'text-rose-600'}`}>
              {userPrediction.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-[73px] z-10 bg-white border-b border-gray-200 flex overflow-x-auto no-scrollbar">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Question" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-slate-900 mb-2">Resolution Rules</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                If the United States conducts a military attack on Venezuelan territory or military forces before January 1, 2026, this question will resolve as Yes.
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{data.timeLeft}</span>
              <button 
                onClick={() => setSubView('aiChat')}
                className="flex items-center gap-2 text-cyan-600 font-medium hover:text-cyan-700"
              >
                <Bot size={16} />
                Ask AI
              </button>
            </div>
          </div>
        )}

        {activeTab === "Reasoning" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Drivers</h3>
              <button
                onClick={() => setSubView('drivers')}
                className="text-sm text-cyan-600 font-medium hover:text-cyan-700"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {drivers.slice(0, 3).map((driver) => (
                <DriverCard key={driver.id} driver={driver} showSide={true} />
              ))}
            </div>
            <button
              onClick={() => setSubView('addDriver')}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-cyan-500 hover:text-cyan-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Driver
            </button>
          </div>
        )}

        {activeTab === "Opportunities" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Opportunities</h3>
              <button
                onClick={() => setSubView('opportunities')}
                className="text-sm text-cyan-600 font-medium hover:text-cyan-700"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {opportunities.slice(0, 2).map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} showReasoning={true} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Discussions" && (
          <div className="space-y-4">
            {MOCK_COMMENTS.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;

