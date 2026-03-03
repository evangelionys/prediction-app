import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, RefreshCw, Bot, Lightbulb, TrendingUp, TrendingDown, BarChart3, Lock, X } from 'lucide-react';

const UNLOCK_THRESHOLD = 20;
const STORAGE_KEY = 'aiAnalystEnabled';

// 解锁模态框组件
const UnlockModal = ({ onStart, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-center z-10 relative">
          <h2 className="text-lg font-bold text-slate-900 text-center">AI Analyst Unlocked</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-slate-600 absolute right-4"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Intro */}
          <div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Compare your predictions with AI to discover where you align and where you differ.
            </p>
          </div>

          {/* Key Points */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
              <span>See alignment and divergence across topics</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
              <span>Spot your strengths and blind spots</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
              <span>Review evidence behind differences</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onStart}
              className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIAnalystCard = ({ 
  predictionAnalysis, 
  onNavigate, 
  lastUpdateTime = Date.now(),
  onUpdate,
  isUpdating = false,
  // 新增：对比数据
  comparisonData = null
}) => {
  const [isEnabled, setIsEnabled] = useState(() => {
    // 从 localStorage 读取激活状态
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  });
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const totalPredictions = predictionAnalysis?.totalPredictions || 0;
  
  // 确定状态：Locked (< 20), Ready to Unlock (>= 20 && !enabled), Enabled (enabled)
  const state = totalPredictions < UNLOCK_THRESHOLD 
    ? 'locked' 
    : !isEnabled 
    ? 'ready' 
    : 'enabled';

  const daysSinceUpdate = Math.floor((Date.now() - lastUpdateTime) / (24 * 60 * 60 * 1000));
  const canUpdate = daysSinceUpdate >= 7;

  const handleUpdate = (e) => {
    e.stopPropagation();
    if (!canUpdate || isUpdating || !onUpdate) return;
    onUpdate();
  };

  const handleDeepAnalysis = (e) => {
    e.stopPropagation();
    if (state === 'ready') {
      setShowUnlockModal(true);
    } else if (state === 'enabled') {
      onNavigate('ai_analyst');
    }
  };

  const handleStartAnalysis = () => {
    setIsEnabled(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowUnlockModal(false);
    onNavigate('ai_analyst');
  };

  // 计算一致性指标
  const agreementMetrics = useMemo(() => {
    // 假数据：用于演示
    const mockCategoryBreakdown = [
      { category: 'Stocks & Indexes', agreementRate: 82, total: 12, differenceCount: 2 },
      { category: 'AI & Technology', agreementRate: 31, total: 8, differenceCount: 5 },
      { category: 'Energy & Infra', agreementRate: 56, total: 5, differenceCount: 2 }
    ].filter(item => item.category !== 'Other'); // 过滤掉 Other，只显示有意义的分类

    if (!comparisonData) {
      return {
        predictionAgreement: 0,
        reasoningAlignment: 0,
        categoryBreakdown: mockCategoryBreakdown
      };
    }

    const { predictionDiffs = [], reasoningDiffs = [] } = comparisonData;
    
    // 预测一致性
    const totalPredictions = predictionDiffs.length;
    const agreements = predictionDiffs.filter(d => d.isAgreement).length;
    const predictionAgreement = totalPredictions > 0 ? (agreements / totalPredictions) * 100 : 0;

    // 推理路径对齐度（简化计算）
    const totalPaths = reasoningDiffs.length;
    const alignedPaths = reasoningDiffs.filter(d => d.differences.length === 0).length;
    const reasoningAlignment = totalPaths > 0 ? (alignedPaths / totalPaths) * 100 : 0;

    // 按领域分组，计算对齐度（过滤掉 Other）
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
      // 使用 alignmentScore 或回退到 isAgreement
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
        agreementRate: cat.total > 0 ? (cat.totalAlignment / cat.total) : 0, // Average alignment score
        differenceCount: cat.differences.length
      }))
      .sort((a, b) => b.total - a.total);

    // 如果真实数据不足，使用假数据补充
    if (categoryBreakdown.length === 0) {
      categoryBreakdown = mockCategoryBreakdown;
    } else if (categoryBreakdown.length < 3) {
      // 合并真实数据和假数据
      const existingCategories = new Set(categoryBreakdown.map(c => c.category));
      const additionalMock = mockCategoryBreakdown.filter(m => !existingCategories.has(m.category));
      categoryBreakdown = [...categoryBreakdown, ...additionalMock].slice(0, 3);
    }

    return {
      predictionAgreement: Math.round(predictionAgreement),
      reasoningAlignment: Math.round(reasoningAlignment),
      categoryBreakdown
    };
  }, [comparisonData]);

  return (
    <>
      <div className={`mx-4 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative border transition-all ${
        state === 'locked' 
          ? 'border-gray-200/50 opacity-60' 
          : 'border-cyan-200/50 hover:shadow-xl hover:border-cyan-300 hover-glow cursor-pointer'
      }`} onClick={state !== 'locked' ? handleDeepAnalysis : undefined}>
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          {state === 'enabled' && (
            <>
              <div className="absolute -right-8 -bottom-8 p-4 transform rotate-12 opacity-5">
                <Bot size={180} className="text-cyan-600" />
              </div>
              <div className="scan-line absolute inset-0" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/40 via-transparent to-blue-50/30" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {state === 'locked' ? (
                <Lock size={14} className="text-gray-400" />
              ) : (
                <Sparkles size={14} className="text-cyan-500/60" />
              )}
              <h3 className={`text-sm font-bold text-slate-900 ${state === 'locked' ? 'opacity-60' : ''}`}>AI Analyst</h3>
            </div>
            {state === 'enabled' && (
              <ArrowRight size={16} className="text-slate-400" />
            )}
          </div>
          
          {state === 'locked' ? (
            // State 1: Locked
            <div className="text-center py-4">
              <div className="mb-3">
                <Lock size={32} className="text-gray-400 mx-auto" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Make <span className="font-bold text-slate-900">{UNLOCK_THRESHOLD} predictions</span> to unlock AI-powered insights into your judgment style.
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((totalPredictions / UNLOCK_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">
                {totalPredictions} / {UNLOCK_THRESHOLD} Predictions
              </div>
            </div>
          ) : state === 'ready' ? (
            // State 2: Ready to Unlock
            <div className="text-center py-4">
              <div className="mb-4">
                <Sparkles size={32} className="text-cyan-500 mx-auto" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                You've reached {totalPredictions} predictions! Unlock AI Analyst to explore how your thinking compares with AI.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUnlockModal(true);
                }}
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
              >
                AI Analyst
              </button>
            </div>
          ) : (
            // State 3: Enabled
            <>
              {/* You vs AI: Alignment and Divergence */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 mb-3">You vs AI: Alignment & Divergence</div>
                
                {/* 差异条形图 - 只显示最高和最低 */}
                {agreementMetrics.categoryBreakdown.length > 0 ? (
                  <div className="space-y-2.5">
                    {(() => {
                      // 排序：按 aligned 值排序（从高到低）
                      const sorted = [...agreementMetrics.categoryBreakdown].sort((a, b) => b.agreementRate - a.agreementRate);
                      // 只取最高和最低
                      const highest = sorted[0];
                      const lowest = sorted[sorted.length - 1];
                      const displayItems = lowest === highest ? [highest] : [highest, lowest];
                      
                      // 根据吻合度返回对应的文案
                      const getAlignmentText = (score) => {
                        if (score >= 80) return 'Strong Alignment';
                        if (score >= 60) return 'Moderate Alignment';
                        if (score >= 40) return 'Mixed Signals';
                        if (score >= 20) return 'Moderate Divergence';
                        return 'Strong Divergence';
                      };
                      
                      return displayItems.map((item) => {
                        const alignmentScore = Math.round(item.agreementRate);
                        const alignmentText = getAlignmentText(alignmentScore);
                        return (
                          <div 
                            key={item.category}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (onNavigate) {
                                onNavigate(`ai_analyst_category_${item.category.replace(/\s+/g, '_')}`);
                              }
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-slate-700 truncate">{item.category}</span>
                                <span className="text-xs text-slate-500 ml-2 font-medium">{alignmentText}</span>
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
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 py-2">No comparison data available yet.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <UnlockModal
          onStart={handleStartAnalysis}
          onClose={() => setShowUnlockModal(false)}
        />
      )}
    </>
  );
};

export default AIAnalystCard;
