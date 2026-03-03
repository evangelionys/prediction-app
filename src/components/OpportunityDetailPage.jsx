import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Clock, ThumbsUp, ThumbsDown, Lock, GitBranch, Save, Share2, ArrowRight, CheckCircle } from 'lucide-react';
import { DECISION_SANDBOX_OPPORTUNITIES } from './DecisionSandboxView';
import ReasoningPathView from './ReasoningPathView';

// Mock news data for reasoning steps - used to calculate source counts
const MOCK_STEP_NEWS = {
  // Step index -> { supporting: [...], opposing: [...] }
  0: {
    supporting: [
      { id: 1, title: "DeepSeek R1 Model Shows 10x Efficiency Gains", updatedAt: "2h ago", timestamp: Date.now() - 2 * 60 * 60 * 1000, imageGradient: "from-blue-500 to-cyan-600" },
      { id: 2, title: "New Algorithm Reduces Training Costs by 80%", updatedAt: "5h ago", timestamp: Date.now() - 5 * 60 * 60 * 1000, imageGradient: "from-purple-500 to-pink-600" },
      { id: 3, title: "Compute Efficiency Breakthrough Announced", updatedAt: "1d ago", timestamp: Date.now() - 24 * 60 * 60 * 1000, imageGradient: "from-green-500 to-emerald-600" }
    ],
    opposing: [
      { id: 4, title: "Efficiency Claims Questioned by Experts", updatedAt: "3h ago", timestamp: Date.now() - 3 * 60 * 60 * 1000, imageGradient: "from-orange-500 to-red-600" },
      { id: 5, title: "Real-World Performance Falls Short", updatedAt: "6h ago", timestamp: Date.now() - 6 * 60 * 60 * 1000, imageGradient: "from-red-500 to-rose-600" }
    ]
  },
  1: {
    supporting: [
      { id: 6, title: "Jevons Effect Observed in AI Compute Demand", updatedAt: "1h ago", timestamp: Date.now() - 1 * 60 * 60 * 1000, imageGradient: "from-indigo-500 to-purple-600" },
      { id: 7, title: "Lower Costs Drive Higher Usage", updatedAt: "4h ago", timestamp: Date.now() - 4 * 60 * 60 * 1000, imageGradient: "from-blue-500 to-indigo-600" }
    ],
    opposing: [
      { id: 8, title: "Demand Growth Slows Despite Lower Costs", updatedAt: "2h ago", timestamp: Date.now() - 2 * 60 * 60 * 1000, imageGradient: "from-yellow-500 to-orange-600" }
    ]
  },
  2: {
    supporting: [
      { id: 9, title: "Enterprises Shift to Inference-Focused Deployments", updatedAt: "3h ago", timestamp: Date.now() - 3 * 60 * 60 * 1000, imageGradient: "from-teal-500 to-cyan-600" }
    ],
    opposing: []
  },
  3: {
    supporting: [
      { id: 10, title: "NVIDIA Ecosystem Lock-In Strengthens", updatedAt: "1h ago", timestamp: Date.now() - 1 * 60 * 60 * 1000, imageGradient: "from-violet-500 to-purple-600" }
    ],
    opposing: []
  },
  result: {
    supporting: [
      { id: 11, title: "NVDA Stock Volatility Expected in Short Term", updatedAt: "1h ago", timestamp: Date.now() - 1 * 60 * 60 * 1000, imageGradient: "from-blue-500 to-indigo-600" },
      { id: 12, title: "Market Analysts Predict Compute Cost Concerns", updatedAt: "3h ago", timestamp: Date.now() - 3 * 60 * 60 * 1000, imageGradient: "from-purple-500 to-pink-600" },
      { id: 13, title: "Orders Remain Stable Despite Market Fears", updatedAt: "5h ago", timestamp: Date.now() - 5 * 60 * 60 * 1000, imageGradient: "from-green-500 to-emerald-600" }
    ],
    opposing: [
      { id: 14, title: "NVDA Orders Show Significant Decline", updatedAt: "2h ago", timestamp: Date.now() - 2 * 60 * 60 * 1000, imageGradient: "from-orange-500 to-red-600" },
      { id: 15, title: "Market Confidence in Compute Sector Wanes", updatedAt: "4h ago", timestamp: Date.now() - 4 * 60 * 60 * 1000, imageGradient: "from-red-500 to-rose-600" }
    ]
  }
};

const OpportunityDetailPage = ({ opportunityId, onBack, onScenarioClick, initialTab = 'simulate', additionalOutcomes = [], onSaveOutcome }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const opportunity = DECISION_SANDBOX_OPPORTUNITIES.find(o => o.id === opportunityId);
  
  // Combine original outcomes with additional outcomes
  const allOutcomes = React.useMemo(() => {
    return [...(opportunity?.outcomes || []), ...additionalOutcomes];
  }, [opportunity, additionalOutcomes]);
  
  // Show toast when new outcomes are added
  const prevAdditionalOutcomesLength = React.useRef(additionalOutcomes.length);
  React.useEffect(() => {
    if (additionalOutcomes.length > prevAdditionalOutcomesLength.current) {
      // New outcome was added
      const newOutcome = additionalOutcomes[additionalOutcomes.length - 1];
      setToastMessage(newOutcome.isPrivate ? 'Saved as private outcome' : 'Published as public outcome');
      setShowToast(true);
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    prevAdditionalOutcomesLength.current = additionalOutcomes.length;
  }, [additionalOutcomes]);
  
  if (!opportunity) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <span className="font-semibold text-slate-900">Decision Sandbox</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-slate-600">Opportunity not found</p>
        </div>
      </div>
    );
  }

  // Handle save from ReasoningPathView (if called directly, though it should go through App.jsx)
  const handleSaveOutcome = (newOutcome, isPrivate) => {
    // Call the parent's onSaveOutcome if provided
    if (onSaveOutcome) {
      onSaveOutcome(newOutcome, isPrivate);
    }
    
    // Show toast
    setToastMessage(isPrivate ? 'Saved as private outcome' : 'Published as public outcome');
    setShowToast(true);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Sort outcomes: user's own first, then by likes descending
  const sortedOutcomes = [...allOutcomes].sort((a, b) => {
    if (a.isUserCreated && !b.isUserCreated) return -1;
    if (!a.isUserCreated && b.isUserCreated) return 1;
    return b.likes - a.likes;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-white rounded-lg shadow-lg border border-purple-200 px-4 py-3 flex items-center gap-2">
            <CheckCircle className="text-purple-600" size={20} />
            <span className="text-sm font-medium text-slate-900">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">Decision Sandbox</span>
      </div>

      {/* Question */}
      <div className="bg-white border-b border-gray-200 p-5">
        <h1 className="text-lg font-bold text-slate-900 leading-relaxed">
          {opportunity.question}
        </h1>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {(
          <div className="p-4 space-y-4">
            {/* Title */}
            <div className="mb-4">
              <h2 className="text-sm font-medium text-slate-600">
                Pick a path to simulate how the future could unfold.
              </h2>
            </div>
            
            {/* Scenarios */}
            {(() => {
              // Calculate total forks for all scenarios
              const totalForksAll = opportunity.scenarios.reduce((sum, scenario) => {
                return sum + scenario.reasoningSteps.reduce((stepSum, step) => stepSum + step.forks, 0);
              }, 0);
              
              return opportunity.scenarios.map((scenario) => {
                const totalForks = scenario.reasoningSteps.reduce((sum, step) => sum + step.forks, 0);
                // Normalize to ensure all percentages sum to 100%
                const percentageChosen = totalForksAll > 0 
                  ? ((totalForks / totalForksAll) * 100).toFixed(1)
                  : (100 / opportunity.scenarios.length).toFixed(1); // Equal distribution if no forks
                
                // Calculate total sources (supporting + opposing news) for this scenario
                // Sum up all news from all reasoning steps in this scenario
                const totalSources = scenario.reasoningSteps.reduce((sum, step, stepIndex) => {
                  const stepNews = MOCK_STEP_NEWS[stepIndex] || { supporting: [], opposing: [] };
                  return sum + stepNews.supporting.length + stepNews.opposing.length;
                }, 0);
                
                // Count results (outcomes) for this scenario
                const scenarioResults = allOutcomes.filter(outcome => {
                  const outcomeScenarioId = outcome.scenario?.split(' ')[1] || outcome.scenario;
                  return outcomeScenarioId === scenario.id;
                });
                const resultsCount = scenarioResults.length;
                
                // Check if user has saved/published a result for this scenario
                const hasUserSavedResult = scenarioResults.some(outcome => outcome.isUserCreated);
                
                return (
                  <div
                    key={scenario.id}
                    className="w-full bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition-all relative"
                  >
                    {/* Number badge in top-left corner */}
                    <span className="absolute top-2 left-2 w-5 h-5 rounded bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                      {scenario.id}
                    </span>
                    
                    {/* Checkmark badge in top-right corner if user has saved/published */}
                    {hasUserSavedResult && (
                      <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle size={16} className="text-emerald-600" />
                      </span>
                    )}
                    
                    <div className="pt-1 pl-7">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">
                          {scenario.title}
                        </h3>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-0.5">
                            <div className="text-xs text-slate-500">
                              {totalSources} source{totalSources !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <button
                            onClick={() => onScenarioClick && onScenarioClick(opportunity, scenario)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shrink-0"
                          >
                            Simulate Future
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}

          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
