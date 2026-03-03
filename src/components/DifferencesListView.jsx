import React, { useState } from 'react';
import { ChevronLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const DifferencesListView = ({ comparisonData, onBack, onCategoryClick, onReasoningClick }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedDifferences, setSelectedDifferences] = useState([]);
  const [showAnalyzeMode, setShowAnalyzeMode] = useState(false);
  
  // 假数据：用于演示
  const mockCategoryBreakdown = [
    { category: 'Stocks & Indexes', agreementRate: 82, total: 12, differenceCount: 2 },
    { category: 'AI & Technology', agreementRate: 31, total: 8, differenceCount: 5 },
    { category: 'Energy & Infra', agreementRate: 56, total: 5, differenceCount: 2 }
  ];

  try {
    const { predictionDiffs = [], reasoningDiffs = [] } = comparisonData || {};
  
  // 按领域分组，过滤掉 Other
  const categoryMap = {};
  predictionDiffs.forEach(diff => {
    const category = diff.category || 'Other';
    // 跳过 Other 分类
    if (category === 'Other') return;
    
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

  let categoryBreakdown = Object.values(categoryMap)
    .filter(cat => cat.category !== 'Other') // 再次确保过滤 Other
    .map(cat => ({
      ...cat,
      agreementRate: cat.total > 0 ? (cat.totalAlignment / cat.total) : 0,
      differenceCount: cat.differences.length
    }))
    .sort((a, b) => b.total - a.total);

  // 如果真实数据不足，使用假数据
  if (categoryBreakdown.length === 0) {
    categoryBreakdown = mockCategoryBreakdown;
  } else if (categoryBreakdown.length < 3) {
    const existingCategories = new Set(categoryBreakdown.map(c => c.category));
    const additionalMock = mockCategoryBreakdown.filter(m => !existingCategories.has(m.category));
    categoryBreakdown = [...categoryBreakdown, ...additionalMock].slice(0, 3);
  }

  // 按 aligned 值排序（从高到低）
  const sortedCategories = [...categoryBreakdown].sort((a, b) => b.agreementRate - a.agreementRate);
  
  // 默认选中 aligned 值最低的（即排序后的最后一个）
  const defaultCategory = selectedCategory || (sortedCategories.length > 0 ? sortedCategories[sortedCategories.length - 1] : null);
  
  // 获取选中分类的差异题目
  const getCategoryDifferences = (category) => {
    if (!category) return [];
    const categoryDiffs = predictionDiffs.filter(d => (d.category || 'Other') === category && !d.isAgreement);
    
    // 如果真实数据不足，使用假数据
    if (categoryDiffs.length === 0) {
      const mockDifferences = {
        'Stocks & Indexes': [
          { id: 1, title: 'Will the S&P 500 reach 7500 by end of 2026?', userPrediction: 'Yes', aiPrediction: 'No', userConfidence: 75, aiConfidence: 68, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Stocks & Indexes' },
          { id: 2, title: 'Will Fed cut rates in Q2 2025?', userPrediction: 'No', aiPrediction: 'Yes', userConfidence: 65, aiConfidence: 72, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Stocks & Indexes' }
        ],
        'AI & Technology': [
          { id: 3, title: 'Will GPT-6 ship by 2026?', userPrediction: 'Incremental GPT-5.x evolution', aiPrediction: 'Major architecture leap before 2026', userConfidence: 60, aiConfidence: 80, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'AI & Technology' },
          { id: 4, title: 'Will Apple release AR glasses in 2025?', userPrediction: 'Yes', aiPrediction: 'No', userConfidence: 70, aiConfidence: 55, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'AI & Technology' },
          { id: 5, title: 'Will quantum computing achieve commercial viability by 2026?', userPrediction: 'No', aiPrediction: 'Yes', userConfidence: 65, aiConfidence: 75, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'AI & Technology' }
        ],
        'Energy & Infra': [
          { id: 6, title: 'Will oil prices exceed $100/barrel in 2025?', userPrediction: 'Yes', aiPrediction: 'No', userConfidence: 68, aiConfidence: 58, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Energy & Infra' },
          { id: 7, title: 'Will renewable energy exceed 50% of US grid by 2026?', userPrediction: 'No', aiPrediction: 'Yes', userConfidence: 55, aiConfidence: 70, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Energy & Infra' }
        ]
      };
      return mockDifferences[category] || [];
    }
    return categoryDiffs;
  };

  const currentDifferences = defaultCategory ? getCategoryDifferences(defaultCategory.category) : [];
  
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
          <h1 className="font-semibold text-slate-900">AI Analyst</h1>
          <div className="text-xs text-slate-500 mt-0.5">
            Where your prediction differs from AI
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Category Dropdown */}
        {sortedCategories.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-slate-700">{defaultCategory?.category || 'Select category'}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {Math.round(defaultCategory?.agreementRate || 0)}% aligned
                </div>
              </div>
              {showCategoryDropdown ? (
                <ChevronUp size={16} className="text-slate-400" />
              ) : (
                <ChevronDown size={16} className="text-slate-400" />
              )}
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-30 max-h-60 overflow-y-auto">
                {sortedCategories.map((item) => {
                  const alignmentScore = Math.round(item.agreementRate);
                  const isSelected = defaultCategory?.category === item.category;
                  return (
                    <button
                      key={item.category}
                      onClick={() => {
                        setSelectedCategory(item);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-purple-50 border-l-2 border-purple-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-700">{item.category}</span>
                        <span className="text-xs text-slate-500 ml-2 font-medium">{alignmentScore}% aligned</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all ${
                            alignmentScore >= 70 ? 'bg-emerald-500' : 
                            alignmentScore >= 50 ? 'bg-yellow-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${alignmentScore}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Differences List */}
        {!showAnalyzeMode && currentDifferences.length > 0 && (
          <div className="space-y-3">
            {currentDifferences.map((diff) => (
              <div
                key={diff.id}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-all"
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-3">{diff.title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1.5 font-medium">You</div>
                    <div className="text-xs font-medium text-slate-700">{diff.userPrediction}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1.5 font-medium">AI</div>
                    <div className="text-xs font-medium text-slate-700">{diff.aiPrediction}</div>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setShowAnalyzeMode(true)}
              className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Analyze Difference
            </button>
          </div>
        )}

        {/* Analyze Mode - Selectable Differences */}
        {showAnalyzeMode && currentDifferences.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900 mb-2">Select a question to analyze:</div>
            {currentDifferences.map((diff) => (
              <div
                key={diff.id}
                onClick={() => {
                  setSelectedDifferences([diff.id]);
                  if (onCategoryClick) {
                    onCategoryClick(diff);
                  }
                }}
                className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
                  selectedDifferences.includes(diff.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-3">{diff.title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1.5 font-medium">You</div>
                    <div className="text-xs font-medium text-slate-700">{diff.userPrediction}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1.5 font-medium">AI</div>
                    <div className="text-xs font-medium text-slate-700">{diff.aiPrediction}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
