import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp, FileText } from 'lucide-react';

const DivergenceSourceView = ({ divergenceAnalysis, onKeepView, onResimulate }) => {
  const [expandedSections, setExpandedSections] = useState({
    weighting: true,
    evidence: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!divergenceAnalysis) {
    return null;
  }

  const { weighting = [], evidence = { ai: [], user: [] } } = divergenceAnalysis;

  return (
    <div className="mt-4 space-y-4">
      {/* 模块 A：差异来源标签 */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="text-xs font-semibold text-slate-700 mb-3">Main sources of divergence:</div>
        
        {/* Weighting Section */}
        <div className="mb-3">
          <button
            onClick={() => toggleSection('weighting')}
            className="w-full flex items-center justify-between text-xs font-medium text-slate-700 mb-2"
          >
            <span className="flex items-center gap-2">
              <TrendingUp size={14} className="text-slate-500" />
              Weighting
            </span>
            {expandedSections.weighting ? (
              <ChevronUp size={14} className="text-slate-500" />
            ) : (
              <ChevronDown size={14} className="text-slate-500" />
            )}
          </button>
          {expandedSections.weighting && (
            <div className="space-y-1.5 pl-6">
              {weighting.length > 0 ? (
                weighting.map((item, idx) => (
                  <div key={idx} className="text-xs text-slate-600">
                    • {item}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">No weighting differences identified</div>
              )}
            </div>
          )}
        </div>

        {/* Evidence Section */}
        <div>
          <button
            onClick={() => toggleSection('evidence')}
            className="w-full flex items-center justify-between text-xs font-medium text-slate-700 mb-2"
          >
            <span className="flex items-center gap-2">
              <FileText size={14} className="text-slate-500" />
              Evidence
            </span>
            {expandedSections.evidence ? (
              <ChevronUp size={14} className="text-slate-500" />
            ) : (
              <ChevronDown size={14} className="text-slate-500" />
            )}
          </button>
          {expandedSections.evidence && (
            <div className="space-y-2 pl-6">
              <div className="text-xs text-slate-600">
                • {evidence.ai.length} supporting AI
              </div>
              <div className="text-xs text-slate-600">
                • {evidence.user.length} supporting you
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 模块 B：证据对比 */}
      <div className="space-y-3">
        {/* AI's Evidence */}
        {evidence.ai.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-xs font-semibold text-purple-700 mb-2">Evidence driving AI's view:</div>
            <div className="space-y-1">
              {evidence.ai.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User's Evidence */}
        {evidence.user.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-xs font-semibold text-blue-700 mb-2">Evidence driving your view:</div>
            <div className="space-y-1">
              {evidence.user.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 交互按钮 */}
      <div className="pt-2 space-y-2">
        <div className="text-xs text-slate-600 mb-3">Based on this evidence:</div>
        <div className="flex gap-2">
          <button
            onClick={onKeepView}
            className="flex-1 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Keep my view
          </button>
          <button
            onClick={onResimulate}
            className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Re-simulate with AI path
          </button>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          Would you like to explore this alternative path?
        </div>
      </div>
    </div>
  );
};

export default DivergenceSourceView;
