import React, { useState } from 'react';
import { ChevronLeft, Sparkles, Loader2, CheckCircle, XCircle, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { callGemini } from '../App';
import DivergenceSourceView from './DivergenceSourceView';

const DifferenceCard = ({ difference, onAnalyze, onUpdatePrediction, type = 'prediction' }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    if (isAnalyzing || showAnalysis) return;
    
    setIsAnalyzing(true);
    setShowAnalysis(true);

    try {
      // 调用 AI 分析差异
      const prompt = type === 'prediction' 
        ? `Analyze the difference between user prediction and AI prediction for this question:

Question: ${difference.title}
User Prediction: ${difference.userPrediction} (${difference.userConfidence}% confidence)
AI Prediction: ${difference.aiPrediction} (${difference.aiConfidence}% confidence)

Explain why there's a difference and provide evidence supporting the AI's prediction. Keep it concise and actionable.`
        : `Analyze the difference between user reasoning path and AI reasoning path:

Opportunity: ${difference.opportunityTitle}
Scenario: ${difference.scenarioTitle}

User Path Result: ${difference.userPath.result}
AI Path Result: ${difference.aiPath.result}

Explain the key differences in reasoning and provide evidence. Keep it concise.`;

      // 模板化差异分析
      const analysis = await callGemini(prompt, "You are an AI analyst. Analyze differences neutrally. Use this template: 'The divergence mainly comes from: (1) Different weighting of [factor], (2) Different interpretation of [evidence].' Be concise and factual.");
      
      // 解析分析结果，提取结构化信息
      const weightingMatches = analysis.match(/weighting of ([^,)]+)/gi) || [];
      const weighting = weightingMatches.map(m => m.replace(/weighting of /i, '').trim());
      
      // Mock evidence data - 实际应该从API获取
      const evidence = {
        ai: [
          "OpenAI hiring spike in systems research",
          "CapEx shift toward training infra"
        ],
        user: [
          "Slower-than-expected inference cost decline"
        ]
      };
      
      setAnalysisResult({
        explanation: analysis,
        divergenceAnalysis: {
          weighting: weighting.length > 0 ? weighting : [
            "AI weighs supply-side innovation higher",
            "You weigh demand-side constraints higher"
          ],
          evidence
        }
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult({
        explanation: "Unable to analyze at this time. Please try again later.",
        evidence: []
      });
    } finally {
      setIsAnalyzing(false);
    }

    if (onAnalyze) {
      onAnalyze(difference);
    }
  };

  if (type === 'prediction') {
    // 计算差异程度
    const divergenceLevel = difference.differenceScore !== undefined 
      ? Math.abs(difference.differenceScore) >= 50 ? 'High' 
        : Math.abs(difference.differenceScore) >= 30 ? 'Medium' 
        : 'Low'
      : 'Medium';

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
        {/* 预测题标题 */}
        <h3 className="font-semibold text-slate-900 mb-4 text-sm leading-snug">{difference.title}</h3>
        
        {/* 左右对照卡片 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* 用户选择 */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-xs text-blue-600 mb-2 font-medium">You chose:</div>
            <div className="flex items-start gap-2">
              <div className="text-blue-600 mt-0.5">▸</div>
              <div className="text-xs font-medium text-slate-700 leading-relaxed flex-1">
                {difference.userPrediction}
              </div>
            </div>
            {difference.userConfidence && (
              <div className="text-[10px] text-slate-500 mt-2">
                {difference.userConfidence}% confidence
              </div>
            )}
          </div>
          
          {/* AI 的路径 */}
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-xs text-purple-600 mb-2 font-medium">AI's leading path:</div>
            <div className="flex items-start gap-2">
              <div className="text-purple-600 mt-0.5">▸</div>
              <div className="text-xs font-medium text-slate-700 leading-relaxed flex-1">
                {difference.aiPrediction}
              </div>
            </div>
            {difference.aiConfidence && (
              <div className="text-[10px] text-slate-500 mt-2">
                {difference.aiConfidence}% confidence
              </div>
            )}
          </div>
        </div>
        
        {/* 差异指示器 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all ${
                divergenceLevel === 'High' ? 'bg-rose-500' : 
                divergenceLevel === 'Medium' ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(Math.abs(difference.differenceScore || 50), 100)}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${
            divergenceLevel === 'High' ? 'text-rose-600' : 
            divergenceLevel === 'Medium' ? 'text-yellow-600' : 'text-emerald-600'
          }`}>
            {divergenceLevel === 'High' ? '▲ High' : divergenceLevel === 'Medium' ? '▲ Medium' : '▲ Low'}
          </span>
        </div>
        
        {/* Why different 按钮 */}
        {!showAnalysis && (
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Why different?
                <ArrowRight size={14} />
              </>
            )}
          </button>
        )}
        
        {/* 差异来源可视化 */}
        {showAnalysis && analysisResult && (
          <DivergenceSourceView
            divergenceAnalysis={analysisResult.divergenceAnalysis}
            onKeepView={() => setShowAnalysis(false)}
            onResimulate={() => {
              if (onUpdatePrediction) {
                onUpdatePrediction(difference);
              }
            }}
          />
        )}
      </div>
    );
  } else {
    // Reasoning path difference
    const userPath = difference.userPath || {};
    const aiPath = difference.aiPath || {};
    const differences = difference.differences || [];
    
    // 提供默认的假数据
    const userResult = userPath.result || 'Based on your analysis: Efficiency gains will primarily compress costs in the short term, but long-term demand growth will offset these savings. Market dynamics suggest gradual cost reduction rather than dramatic shifts.';
    const aiResult = aiPath.result || 'Based on AI analysis: Efficiency gains compress costs without reducing total compute demand. Supply constraints and new workloads maintain overall demand. Cost reduction is gradual, not dramatic.';
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-slate-900 mb-2 text-sm">{difference.opportunityTitle || 'Reasoning Path Difference'}</h3>
        {difference.scenarioTitle && (
          <div className="text-xs text-slate-500 mb-3">{difference.scenarioTitle}</div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-xs text-blue-600 mb-2 font-medium">Your Path</div>
            <div className="text-xs text-slate-700 leading-relaxed">{userResult}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-xs text-purple-600 mb-2 font-medium">AI Path</div>
            <div className="text-xs text-slate-700 leading-relaxed">{aiResult}</div>
          </div>
        </div>

        {differences.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-slate-600 mb-1">Key Differences:</div>
            {differences.slice(0, 2).map((diff, idx) => (
              <div key={idx} className="text-xs text-slate-500 mb-1">• {diff}</div>
            ))}
          </div>
        )}

        {!showAnalysis && (
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Difference'}
          </button>
        )}

        {showAnalysis && analysisResult && (
          <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs font-semibold text-purple-700 mb-2">AI Analysis</div>
            <p className="text-sm text-slate-700 mb-3">{analysisResult.explanation}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => onUpdatePrediction && onUpdatePrediction(difference)}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium"
              >
                Update My Path
              </button>
              <button 
                onClick={() => setShowAnalysis(false)}
                className="flex-1 py-2 bg-gray-200 text-slate-700 rounded-lg text-sm font-medium"
              >
                Keep My View
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
};

const DifferenceDetailView = ({ 
  category, 
  type = 'predictions', // 'predictions' | 'reasoning'
  differences = [],
  onBack,
  onUpdatePrediction,
  onAnalyzeDifference
}) => {
  // 确保 differences 是数组
  const safeDifferences = Array.isArray(differences) ? differences : [];
  
  try {
    return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-slate-900">
            {category ? `${category} — Differences` : type === 'predictions' ? 'Prediction Differences' : 'Reasoning Differences'}
          </h1>
          <div className="text-xs text-slate-500 mt-0.5">
            {safeDifferences.length} {safeDifferences.length === 1 ? 'difference' : 'differences'} found
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {differences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle size={48} className="text-gray-300 mb-4" />
            <p className="text-slate-600">No differences found in this category.</p>
          </div>
        ) : (
          safeDifferences.map((diff) => (
            <DifferenceCard
              key={diff.id || diff.key || Math.random()}
              difference={diff}
              type={type}
              onAnalyze={onAnalyzeDifference}
              onUpdatePrediction={onUpdatePrediction}
            />
          ))
        )}
      </div>
    </div>
  );
  } catch (error) {
    console.error('DifferenceDetailView error:', error);
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

export default DifferenceDetailView;
