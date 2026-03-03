import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2, X } from 'lucide-react';

const DifferenceAnalysisView = ({ difference, onBack, onGoToDetail }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // 假数据：分析结果和 Drivers
  const mockAnalysisData = {
    'Will GPT-6 ship by 2026?': {
      analysis: "The divergence mainly comes from: (1) Different weighting of architectural innovation timelines, (2) Different interpretation of recent research breakthroughs. AI weighs recent transformer scaling research and multimodal integration progress more heavily, while you emphasize incremental evolution patterns from GPT-4 to GPT-5.",
      supportingAI: [
        {
          id: 1,
          title: 'Recent transformer scaling research breakthroughs',
          description: 'OpenAI and DeepMind have published papers showing 10x efficiency gains in transformer architectures, suggesting major leaps are possible before 2026.',
          evidence: ['OpenAI paper on transformer scaling (2024)', 'DeepMind efficiency research (2024)', 'Anthropic architecture improvements (2024)']
        },
        {
          id: 2,
          title: 'Multimodal integration progress',
          description: 'GPT-4V and recent models show rapid progress in combining vision, audio, and text, indicating architecture maturity for next-gen models.',
          evidence: ['GPT-4V performance benchmarks', 'Gemini multimodal capabilities', 'Claude vision integration']
        },
        {
          id: 3,
          title: 'Compute infrastructure readiness',
          description: 'Major cloud providers and chip manufacturers are scaling infrastructure specifically for next-gen AI training, suggesting industry confidence in 2026 timeline.',
          evidence: ['AWS AI infrastructure expansion', 'NVIDIA H200/H300 availability', 'Google TPU v5 rollout']
        }
      ],
      opposingUser: [
        {
          id: 4,
          title: 'Incremental evolution patterns',
          description: 'Historical patterns from GPT-3 to GPT-4 to GPT-5 show incremental improvements rather than revolutionary architecture changes.',
          evidence: ['GPT-3 to GPT-4 evolution timeline', 'GPT-4 to GPT-5 incremental updates', 'Industry standard development cycles']
        },
        {
          id: 5,
          title: 'Training complexity and safety requirements',
          description: 'Increasing regulatory scrutiny and safety requirements may slow down major architecture releases, favoring incremental updates.',
          evidence: ['EU AI Act implementation', 'Safety alignment requirements', 'Red team testing protocols']
        }
      ]
    },
    'Will the S&P 500 reach 7500 by end of 2026?': {
      analysis: "A strong case for “No” is that reaching 7,500 by the end of 2026 requires a combination of optimistic earnings growth and sustained multiple expansion, which is difficult under a plausible baseline macro regime.\nFirst, valuation math is already tight. From current levels, 7,500 implies either a forward P/E materially above long-run averages or a sharp acceleration in earnings. In a world of only modest rate cuts (25–50 bp) and a policy rate still well above pre-2020 norms, discount rates remain a constraint. That caps how far multiples can expand, even if inflation is under control.\nSecond, earnings growth is likely to normalize. The post-2023 surge was driven by margin recovery, cost cuts, and a narrow set of mega-cap AI beneficiaries. By 2026, margins face headwinds from wage stickiness, higher capex (especially for AI infrastructure), and more normalized pricing power. AI boosts productivity, but it also raises near-term costs, making a step-change in aggregate earnings less certain.",
      supportingAI: [
        {
          id: 6,
          title: 'Current inflation trends',
          description: 'Recent CPI data shows sustained disinflation, supporting continued economic growth and market expansion.',
          evidence: ['CPI data (2024)', 'PCE inflation trends', 'Core inflation decline']
        },
        {
          id: 7,
          title: 'Employment data strength',
          description: 'Strong labor market indicators suggest robust economic foundation for continued market growth.',
          evidence: ['Unemployment rate trends', 'Job creation numbers', 'Wage growth data']
        }
      ],
      opposingUser: [
        {
          id: 8,
          title: 'Historical market cycles',
          description: 'Historical data shows markets rarely sustain such rapid growth without corrections, suggesting 6000 is optimistic.',
          evidence: ['S&P 500 historical cycles', 'Market correction patterns', 'Valuation metrics']
        },
        {
          id: 9,
          title: 'Valuation concerns',
          description: 'Current P/E ratios and other valuation metrics suggest markets may be overvalued, limiting upside potential.',
          evidence: ['S&P 500 P/E ratios', 'Shiller CAPE ratio', 'Market cap to GDP ratio']
        }
      ]
    }
  };

  useEffect(() => {
    // 模拟分析过程，持续3秒
    const analyzeTimer = setTimeout(() => {
      let data = mockAnalysisData[difference.title];
      
      // 如果没有特定题目的数据，使用通用模板
      if (!data) {
        data = {
          analysis: `The divergence mainly comes from: (1) Different weighting of key factors, (2) Different interpretation of available evidence. AI weighs certain indicators more heavily than you do, leading to different conclusions about "${difference.title}".`,
          supportingAI: [
            {
              id: 100,
              title: 'AI weighs recent data trends more heavily',
              description: 'AI\'s prediction is based on recent trends and data patterns that suggest a different outcome than your view.',
              evidence: ['Recent market indicators', 'Latest research findings', 'Current data trends']
            }
          ],
          opposingUser: [
            {
              id: 101,
              title: 'Your view emphasizes historical patterns',
              description: 'Your prediction is based on historical patterns and long-term trends that differ from AI\'s short-term data focus.',
              evidence: ['Historical patterns', 'Long-term trends', 'Past performance data']
            }
          ]
        };
      }
      
      // 合并 drivers 并添加支持/反对标识
      const allDrivers = [
        ...(data.supportingAI || []).map(driver => ({
          ...driver,
          type: 'support',
          targetOption: difference.aiPrediction,
          actionText: `Support "${difference.aiPrediction}"`
        })),
        ...(data.opposingUser || []).map(driver => ({
          ...driver,
          type: 'undermine',
          targetOption: difference.userPrediction,
          actionText: `Undermine "${difference.userPrediction}"`
        }))
      ];
      
      setAnalysisResult({
        ...data,
        allDrivers
      });
      setIsAnalyzing(false);
    }, 3000);

    return () => clearTimeout(analyzeTimer);
  }, [difference]);

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-slate-900 text-sm leading-tight">{difference.title}</h1>
          <div className="text-xs text-slate-500 mt-1">
            You: <span className="text-blue-600 font-medium">{difference.userPrediction}</span> vs AI: <span className="text-purple-600 font-medium">{difference.aiPrediction}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={32} className="text-purple-600 animate-spin mb-4" />
            <p className="text-sm text-slate-600">Analyzing difference...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs font-semibold text-purple-700 mb-2">AI Analysis</div>
              {(() => {
                const analysisText = analysisResult?.analysis || analysisResult || '';
                const paragraphs = String(analysisText).split('\n').filter(p => p.trim().length > 0);
                return paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={`text-sm text-slate-700 leading-relaxed${idx > 0 ? ' mt-3' : ''}`}
                  >
                    {para}
                  </p>
                ));
              })()}
            </div>

            {/* All Drivers - Combined List */}
            {analysisResult?.allDrivers && analysisResult.allDrivers.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-xs font-semibold text-slate-900 mb-3">Related Drivers</div>
                <div className="space-y-2">
                  {analysisResult.allDrivers.map((driver) => {
                    const isSupport = driver.type === 'support';
                    const borderColor = isSupport ? 'border-purple-200' : 'border-blue-200';
                    const hoverBg = isSupport ? 'hover:bg-purple-50' : 'hover:bg-blue-50';
                    const badgeBg = isSupport ? 'bg-purple-50/60 text-purple-600/70' : 'bg-blue-50/60 text-blue-600/70';
                    
                    return (
                      <button
                        key={driver.id}
                        onClick={() => setSelectedDriver(driver)}
                        className={`w-full p-3 text-left flex items-start justify-between border ${borderColor} rounded-lg ${hoverBg} transition-colors`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-700 mb-1">{driver.title}</div>
                          <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeBg} inline-block`}>
                            {driver.actionText}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (onGoToDetail) {
                    onGoToDetail(difference);
                  }
                }}
                className="w-full py-2.5 px-4 bg-white border border-gray-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Change my mind
              </button>
              <button
                onClick={() => {
                  // TODO: 实现添加 driver 的逻辑
                  console.log('Add driver to support my prediction');
                }}
                className="w-full py-2.5 px-4 bg-white border border-gray-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Add a driver to support my prediction
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Driver Detail Overlay */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDriver(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-sm font-bold text-slate-900 pr-4">
                {selectedDriver.title}
              </h2>
              <button
                onClick={() => setSelectedDriver(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Type & Target */}
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    selectedDriver.type === 'support'
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {selectedDriver.type === 'support' ? 'Supports AI view' : 'Challenges your view'}
                </span>
                <span className="text-slate-500">
                  {selectedDriver.actionText}
                </span>
              </div>

              {/* Description */}
              {selectedDriver.description && (
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedDriver.description}
                </p>
              )}

              {/* Evidence */}
              {selectedDriver.evidence && selectedDriver.evidence.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-900 mb-2">Evidence</div>
                  <ul className="space-y-1.5">
                    {selectedDriver.evidence.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DifferenceAnalysisView;
