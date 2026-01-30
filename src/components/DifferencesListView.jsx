import React from 'react';
import { ChevronLeft, ArrowRight } from 'lucide-react';

const DifferencesListView = ({ comparisonData, onBack, onCategoryClick, onReasoningClick }) => {
  // 假数据：用于演示
  const mockCategoryBreakdown = [
    { category: 'Stocks & Indexes', agreementRate: 82, total: 12, differenceCount: 2 },
    { category: 'AI & Technology', agreementRate: 31, total: 8, differenceCount: 5 },
    { category: 'Energy & Infra', agreementRate: 56, total: 5, differenceCount: 2 }
  ];

  try {
    const { predictionDiffs = [], reasoningDiffs = [] } = comparisonData || {};
  
  // 按领域分组
  const categoryMap = {};
  predictionDiffs.forEach(diff => {
    const category = diff.category || 'Other';
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        total: 0,
        totalAlignment: 0,
        differences: []
      };
    }
    categoryMap[category].total++;
    const alignment = diff.alignmentScore !== undefined ? diff.alignmentScore : (diff.isAgreement ? 100 : 0);
    categoryMap[category].totalAlignment += alignment;
    if (!diff.isAgreement) {
      categoryMap[category].differences.push(diff);
    }
  });

  let categoryBreakdown = Object.values(categoryMap).map(cat => ({
    ...cat,
    agreementRate: cat.total > 0 ? (cat.totalAlignment / cat.total) : 0,
    differenceCount: cat.differences.length
  })).sort((a, b) => b.total - a.total);

  // 如果真实数据不足，使用假数据
  if (categoryBreakdown.length === 0) {
    categoryBreakdown = mockCategoryBreakdown;
  } else if (categoryBreakdown.length < 3) {
    const existingCategories = new Set(categoryBreakdown.map(c => c.category));
    const additionalMock = mockCategoryBreakdown.filter(m => !existingCategories.has(m.category));
    categoryBreakdown = [...categoryBreakdown, ...additionalMock].slice(0, 3);
  }

  // 有差异的推理路径
  const reasoningDifferences = reasoningDiffs.filter(d => d.differences && d.differences.length > 0);

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-slate-900">You vs AI: Differences</h1>
          <div className="text-xs text-slate-500 mt-0.5">
            Explore where your views diverge
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Prediction Differences by Category */}
        <div>
          <div className="text-sm font-semibold text-slate-900 mb-3">Prediction Differences</div>
          <div className="space-y-2.5">
            {categoryBreakdown.map((item) => {
              const alignmentScore = Math.round(item.agreementRate);
              return (
                <div 
                  key={item.category}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onCategoryClick) {
                      onCategoryClick(item.category);
                    }
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{item.category}</span>
                      <span className="text-xs text-slate-500 ml-2 font-medium">{alignmentScore}% aligned</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          alignmentScore >= 70 ? 'bg-emerald-500' : 
                          alignmentScore >= 50 ? 'bg-yellow-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${alignmentScore}%` }}
                      />
                    </div>
                  </div>
                  {item.differenceCount > 0 && (
                    <div className="px-2 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-medium shrink-0">
                      {item.differenceCount}
                    </div>
                  )}
                  <ArrowRight size={16} className="text-slate-400 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Reasoning Path Differences */}
        {reasoningDifferences.length > 0 && (
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-3">Reasoning Path Differences</div>
            <button
              onClick={onReasoningClick}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="text-sm font-medium text-slate-700">
                {reasoningDifferences.length} path{reasoningDifferences.length > 1 ? 's' : ''} with differences
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
  } catch (error) {
    console.error('DifferencesListView error:', error);
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-slate-900">Error</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-slate-600">Something went wrong. Please try again.</p>
        </div>
      </div>
    );
  }
};

export default DifferencesListView;
