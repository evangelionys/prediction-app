import React, { useState, useEffect } from 'react';
import { Trophy, Lightbulb, Target, ChevronDown, User, ArrowUpRight, Medal, Crown, Bot, Calendar, TrendingUp, TrendingDown, X, ChevronRight, Flame, FileText, Info } from 'lucide-react';
import { LEADERBOARD_DATA, USER_PROFILE, MOCK_CARDS } from '../App';

const TrendView = ({ onUserClick, onMomentumClick, onPredictionClick, initialTab, onBack }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'influence');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showInfoModal, setShowInfoModal] = useState(false);
  

  // 影响力榜组件
  const InfluenceLeaderboard = () => {
    const data = LEADERBOARD_DATA.influence
      .filter(item => categoryFilter === 'All' || item.category === categoryFilter)
      .sort((a, b) => b.score - a.score);
    
    // 找到当前用户的排名
    const userScore = LEADERBOARD_DATA.currentUser?.influence?.score || 0;
    const userRank = data.findIndex(item => item.score < userScore) + 1;
    const finalUserRank = userRank === 0 ? data.length + 1 : userRank;
    
    const displayData = data.slice(0, 10);

    return (
      <>
        <div className="space-y-2 pb-20">
          {displayData.map((item, index) => {
            const isTopThree = index < 3;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-lg border p-3 flex items-center gap-3 transition-all ${
                  isTopThree
                    ? 'border-cyan-300 shadow-md bg-gradient-to-r from-cyan-50/50 to-white'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`shrink-0 w-8 text-center flex items-center justify-center ${
                    isTopThree ? 'text-cyan-600' : 'text-slate-400'
                  }`}>
                    {index === 0 ? (
                      <Crown size={20} className="text-yellow-500 fill-yellow-500" />
                    ) : index === 1 ? (
                      <Medal size={18} className="text-slate-400 fill-slate-300" />
                    ) : index === 2 ? (
                      <Medal size={18} className="text-amber-600 fill-amber-300" />
                    ) : (
                      <span className="text-lg font-bold">{index + 1}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onUserClick && onUserClick(item.userId)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-md shrink-0 hover:scale-105 transition-transform"
                  >
                    {item.avatar}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm truncate ${
                      isTopThree ? 'text-slate-900' : 'text-slate-700'
                    }`}>
                      {item.username}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <FileText size={12} className="text-slate-400" />
                        <span>{item.predictions || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={12} className="text-slate-400" />
                        <span>{item.drivers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Lightbulb size={12} className="text-slate-400" />
                        <span>{item.opportunities}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right shrink-0 ${
                    isTopThree ? 'text-cyan-600 font-bold' : 'text-slate-600'
                  }`}>
                    <div className="text-sm">{item.score}</div>
                    <div className="text-[10px] text-slate-400">Points</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 用户自己的数据 - 底部悬浮 */}
        <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">
              {USER_PROFILE.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-slate-900">{USER_PROFILE.name}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <div className="flex items-center gap-1">
                  <FileText size={12} className="text-slate-400" />
                  <span>{LEADERBOARD_DATA.currentUser?.influence?.predictions || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target size={12} className="text-slate-400" />
                  <span>{LEADERBOARD_DATA.currentUser?.influence?.drivers || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lightbulb size={12} className="text-slate-400" />
                  <span>{LEADERBOARD_DATA.currentUser?.influence?.opportunities || 0}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-cyan-600">{userScore}</div>
              <div className="text-[10px] text-slate-400">Rank #{finalUserRank}</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // 准确率榜组件
  const AccuracyLeaderboard = () => {
    const userData = LEADERBOARD_DATA.currentUser?.accuracy || { accuracy: 0, totalPredictions: 0, correctPredictions: 0 };
    
    // 合并用户数据和AI模型数据
    const allData = [
      ...(LEADERBOARD_DATA.accuracy || [])
        .filter(item => categoryFilter === 'All' || item.category === categoryFilter)
        .map(item => ({ ...item, isAI: false, isCurrentUser: false })),
      ...(LEADERBOARD_DATA.aiModels || []).map(item => ({ ...item, isAI: true, isCurrentUser: false }))
    ];

    // 排序
    const sortedData = allData.sort((a, b) => {
      if (b.accuracy !== a.accuracy) {
        return b.accuracy - a.accuracy;
      }
      return b.totalPredictions - a.totalPredictions;
    });

    // 找到用户排名
    const userRank = sortedData.findIndex(item => 
      item.accuracy < userData.accuracy || 
      (item.accuracy === userData.accuracy && item.totalPredictions < userData.totalPredictions)
    ) + 1;
    const finalUserRank = userRank === 0 ? sortedData.length + 1 : userRank;

    const displayData = sortedData.slice(0, 10);

    return (
      <>
        <div className="space-y-2 pb-20">
          {displayData.map((item, index) => {
            const isTopThree = index < 3;
            const isAI = item.isAI;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-lg border p-3 flex items-center gap-3 transition-all ${
                  isTopThree
                    ? 'border-emerald-300 shadow-md bg-gradient-to-r from-emerald-50/50 to-white'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                } ${isAI ? 'border-purple-200 bg-purple-50/30' : ''}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`shrink-0 w-8 text-center flex items-center justify-center ${
                    isTopThree ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {index === 0 ? (
                      <Crown size={20} className="text-yellow-500 fill-yellow-500" />
                    ) : index === 1 ? (
                      <Medal size={18} className="text-slate-400 fill-slate-300" />
                    ) : index === 2 ? (
                      <Medal size={18} className="text-amber-600 fill-amber-300" />
                    ) : (
                      <span className="text-lg font-bold">{index + 1}</span>
                    )}
                  </div>
                  {isAI ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-md shrink-0 relative">
                      <Bot size={16} />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">AI</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onUserClick && onUserClick(item.userId)}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-md shrink-0 hover:scale-105 transition-transform"
                    >
                      {item.avatar}
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm truncate flex items-center gap-1.5 ${
                      isTopThree ? 'text-slate-900' : 'text-slate-700'
                    }`}>
                      {item.name || item.username}
                      {isAI && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-bold">
                          AI
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.correctPredictions} correct / {item.totalPredictions} total
                    </div>
                  </div>
                  <div className={`text-right shrink-0 ${
                    isTopThree ? 'text-emerald-600 font-bold' : 'text-slate-600'
                  }`}>
                    <div className="text-sm">{item.accuracy}%</div>
                    <div className="text-[10px] text-slate-400">accuracy</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 用户自己的数据 - 底部悬浮 */}
        <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">
              {USER_PROFILE.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-slate-900">{USER_PROFILE.name}</div>
              <div className="text-xs text-slate-500 mt-1">
                {userData.correctPredictions} correct / {userData.totalPredictions} total
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-emerald-600">{userData.accuracy}%</div>
              <div className="text-[10px] text-slate-400">Rank #{finalUserRank}</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Mock data for hot assets (近14天热门投资标的)
  const HOT_ASSETS = [
    {
      id: 1,
      asset: 'Bitcoin',
      opportunityTitle: 'Invest in Bitcoin, targeting a 15–25% gain by Q2 2025.',
      bullish: 245,
      bearish: 89,
      price: 43250.50,
      priceChange: 2.35,
      sentiment: 73.3, // bullish percentage
      relatedPredictions: [
        { id: 1, title: 'Will Bitcoin reach $50,000 by Q2 2025?', predictionId: 'btc-1' },
        { id: 2, title: 'Will Bitcoin ETF approval drive institutional adoption?', predictionId: 'btc-2' }
      ],
      bullishViews: [
        { id: 1, title: 'Institutional adoption accelerating', description: 'Major institutions are increasing Bitcoin allocations as a hedge against inflation.' },
        { id: 2, title: 'ETF approval creates new demand', description: 'Spot Bitcoin ETFs have seen consistent inflows, creating sustained buying pressure.' }
      ],
      bearishViews: [
        { id: 1, title: 'Regulatory uncertainty remains', description: 'Potential regulatory changes could negatively impact Bitcoin adoption.' },
        { id: 2, title: 'High volatility concerns', description: 'Bitcoin remains highly volatile, making it risky for conservative investors.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 42000 + Math.random() * 2000
      }))
    },
    {
      id: 2,
      asset: 'Crude Oil',
      opportunityTitle: 'Invest in Crude Oil, targeting a 10–18% gain by Q3 2025.',
      bullish: 189,
      bearish: 156,
      price: 78.45,
      priceChange: -1.2,
      sentiment: 54.8,
      relatedPredictions: [
        { id: 1, title: 'Will oil prices exceed $85 per barrel by Q3 2025?', predictionId: 'oil-1' }
      ],
      bullishViews: [
        { id: 1, title: 'OPEC+ production cuts support prices', description: 'Continued production cuts by OPEC+ are expected to maintain supply constraints.' }
      ],
      bearishViews: [
        { id: 1, title: 'Global demand concerns', description: 'Slowing global economic growth may reduce oil demand.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 75 + Math.random() * 5
      }))
    },
    {
      id: 3,
      asset: 'French OATs',
      opportunityTitle: 'Invest in French OATs, targeting a 5–10% gain by end of 2026.',
      bullish: 67,
      bearish: 134,
      price: 98.25,
      priceChange: 0.45,
      sentiment: 33.3,
      relatedPredictions: [
        { id: 1, title: 'Will French bond yields rise above 3% in 2025?', predictionId: 'oat-1' }
      ],
      bullishViews: [
        { id: 1, title: 'ECB policy normalization', description: 'European Central Bank policy shifts may benefit bond markets.' }
      ],
      bearishViews: [
        { id: 1, title: 'Political uncertainty in France', description: 'Political risks may increase volatility in French bonds.' },
        { id: 2, title: 'Inflation concerns', description: 'Persistent inflation may pressure bond prices downward.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 97.5 + Math.random() * 1
      }))
    },
    {
      id: 4,
      asset: 'US Bonds',
      opportunityTitle: 'Invest in US Bonds, targeting a 6–12% gain by end of 2026.',
      bullish: 312,
      bearish: 98,
      price: 101.75,
      priceChange: 0.8,
      sentiment: 76.1,
      relatedPredictions: [
        { id: 1, title: 'Will the Fed cut rates by at least 25bps in March?', predictionId: 'bond-1' },
        { id: 2, title: 'Will 10-year Treasury yields fall below 4%?', predictionId: 'bond-2' }
      ],
      bullishViews: [
        { id: 1, title: 'Fed rate cuts expected', description: 'Anticipated Federal Reserve rate cuts should boost bond prices.' },
        { id: 2, title: 'Safe haven demand', description: 'Geopolitical tensions increase demand for safe assets like US bonds.' }
      ],
      bearishViews: [
        { id: 1, title: 'Inflation persistence', description: 'If inflation remains elevated, bonds may underperform.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 100.5 + Math.random() * 2
      }))
    },
    {
      id: 5,
      asset: 'Gold',
      opportunityTitle: 'Invest in Gold, targeting a 8–15% gain by end of 2026.',
      bullish: 278,
      bearish: 123,
      price: 2034.80,
      priceChange: 1.5,
      sentiment: 69.3,
      relatedPredictions: [
        { id: 1, title: 'Will gold exceed $2,100 per ounce in 2025?', predictionId: 'gold-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Central bank buying', description: 'Central banks continue to accumulate gold reserves.' },
        { id: 2, title: 'Inflation hedge demand', description: 'Gold remains attractive as an inflation hedge.' }
      ],
      bearishViews: [
        { id: 1, title: 'Strong dollar pressure', description: 'A strong US dollar may limit gold price gains.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 2000 + Math.random() * 50
      }))
    },
    {
      id: 6,
      asset: 'S&P 500',
      opportunityTitle: 'Invest in the S&P 500, targeting an 8–12% gain by the end of 2026.',
      bullish: 456,
      bearish: 234,
      price: 4850.25,
      priceChange: 0.9,
      sentiment: 66.1,
      relatedPredictions: [
        { id: 1, title: 'Will the S&P 500 reach 5,000 by end of 2025?', predictionId: 'sp500-1' }
      ],
      bullishViews: [
        { id: 1, title: 'AI-driven growth', description: 'AI technology continues to drive corporate earnings growth.' },
        { id: 2, title: 'Soft landing scenario', description: 'Economy appears headed for a soft landing, supporting stocks.' }
      ],
      bearishViews: [
        { id: 1, title: 'Valuation concerns', description: 'Current valuations may be stretched relative to earnings.' },
        { id: 2, title: 'Recession risks', description: 'Potential economic slowdown could pressure stock prices.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 4800 + Math.random() * 100
      }))
    },
    {
      id: 7,
      asset: 'Ethereum',
      opportunityTitle: 'Invest in Ethereum, targeting a 12–20% gain by Q2 2025.',
      bullish: 198,
      bearish: 87,
      price: 2650.30,
      priceChange: 3.2,
      sentiment: 69.5,
      relatedPredictions: [
        { id: 1, title: 'Will Ethereum reach $3,000 by Q2 2025?', predictionId: 'eth-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Ethereum ETF potential', description: 'Potential approval of Ethereum ETFs could drive significant demand.' },
        { id: 2, title: 'Layer 2 adoption', description: 'Growing adoption of Layer 2 solutions improves Ethereum scalability.' }
      ],
      bearishViews: [
        { id: 1, title: 'Competition from alternatives', description: 'Other blockchains may capture market share from Ethereum.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 2500 + Math.random() * 200
      }))
    },
    {
      id: 8,
      asset: 'Japanese Yen',
      opportunityTitle: 'Invest in Japanese Yen, targeting a 5–10% gain by end of 2026.',
      bullish: 45,
      bearish: 178,
      price: 149.25,
      priceChange: -0.8,
      sentiment: 20.2,
      relatedPredictions: [
        { id: 1, title: 'Will USD/JPY exceed 150 in 2025?', predictionId: 'jpy-1' }
      ],
      bullishViews: [
        { id: 1, title: 'BOJ policy shift', description: 'Bank of Japan may shift policy, strengthening the yen.' }
      ],
      bearishViews: [
        { id: 1, title: 'Yield differential', description: 'Wide yield differentials continue to pressure the yen.' },
        { id: 2, title: 'Weak economic data', description: 'Weak economic indicators suggest continued yen weakness.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 148 + Math.random() * 2
      }))
    },
    {
      id: 9,
      asset: 'Tesla Stock',
      opportunityTitle: 'Invest in Tesla Stock, targeting a 10–18% gain by end of 2025.',
      bullish: 234,
      bearish: 189,
      price: 248.50,
      priceChange: -2.1,
      sentiment: 55.3,
      relatedPredictions: [
        { id: 1, title: 'Will Tesla stock exceed $300 by end of 2025?', predictionId: 'tsla-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Cybertruck production ramp', description: 'Cybertruck production scaling could drive revenue growth.' },
        { id: 2, title: 'FSD progress', description: 'Full Self-Driving technology improvements may increase value.' }
      ],
      bearishViews: [
        { id: 1, title: 'Competition intensifies', description: 'Increasing competition in EV market may pressure margins.' },
        { id: 2, title: 'Demand concerns', description: 'Slowing EV demand growth could impact sales.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 250 + Math.random() * 10
      }))
    },
    {
      id: 10,
      asset: 'Apple Stock',
      opportunityTitle: 'Invest in Apple Stock, targeting a 8–15% gain by Q2 2025.',
      bullish: 389,
      bearish: 156,
      price: 195.80,
      priceChange: 1.2,
      sentiment: 71.4,
      relatedPredictions: [
        { id: 1, title: 'Will Apple stock reach $200 by Q2 2025?', predictionId: 'aapl-1' }
      ],
      bullishViews: [
        { id: 1, title: 'AI integration', description: 'Apple\'s AI integration across products could drive growth.' },
        { id: 2, title: 'Services revenue growth', description: 'Services segment continues to show strong growth.' }
      ],
      bearishViews: [
        { id: 1, title: 'China market risks', description: 'Regulatory and market risks in China may impact sales.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 193 + Math.random() * 5
      }))
    },
    {
      id: 11,
      asset: 'NVIDIA Stock',
      opportunityTitle: 'Invest in NVIDIA Stock, targeting a 15–25% gain by Q2 2025.',
      bullish: 312,
      bearish: 98,
      price: 485.60,
      priceChange: 2.8,
      sentiment: 76.1,
      relatedPredictions: [
        { id: 1, title: 'Will NVIDIA stock exceed $500 by Q2 2025?', predictionId: 'nvda-1' }
      ],
      bullishViews: [
        { id: 1, title: 'AI chip demand surge', description: 'Continued strong demand for AI chips drives revenue growth.' },
        { id: 2, title: 'Data center expansion', description: 'Data center customers expanding AI infrastructure rapidly.' }
      ],
      bearishViews: [
        { id: 1, title: 'Valuation concerns', description: 'High valuation may limit upside potential.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 470 + Math.random() * 20
      }))
    },
    {
      id: 12,
      asset: 'Microsoft Stock',
      opportunityTitle: 'Invest in Microsoft Stock, targeting a 10–18% gain by end of 2025.',
      bullish: 267,
      bearish: 112,
      price: 378.45,
      priceChange: 1.5,
      sentiment: 70.4,
      relatedPredictions: [
        { id: 1, title: 'Will Microsoft stock reach $400 by end of 2025?', predictionId: 'msft-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Azure cloud growth', description: 'Azure continues to gain market share in cloud computing.' },
        { id: 2, title: 'AI integration', description: 'Copilot and AI features driving productivity software growth.' }
      ],
      bearishViews: [
        { id: 1, title: 'Competition intensifies', description: 'Increased competition in cloud and AI markets.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 370 + Math.random() * 15
      }))
    },
    {
      id: 13,
      asset: 'Amazon Stock',
      opportunityTitle: 'Invest in Amazon Stock, targeting a 12–20% gain by Q3 2025.',
      bullish: 234,
      bearish: 145,
      price: 152.30,
      priceChange: 0.9,
      sentiment: 61.7,
      relatedPredictions: [
        { id: 1, title: 'Will Amazon stock exceed $170 by Q3 2025?', predictionId: 'amzn-1' }
      ],
      bullishViews: [
        { id: 1, title: 'AWS growth acceleration', description: 'AWS revenue growth accelerating with AI workloads.' },
        { id: 2, title: 'E-commerce recovery', description: 'E-commerce segment showing signs of recovery.' }
      ],
      bearishViews: [
        { id: 1, title: 'Margin pressure', description: 'Competitive pressures may impact profit margins.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 150 + Math.random() * 5
      }))
    },
    {
      id: 14,
      asset: 'Silver',
      opportunityTitle: 'Invest in Silver, targeting a 8–15% gain by end of 2026.',
      bullish: 178,
      bearish: 89,
      price: 24.85,
      priceChange: 1.8,
      sentiment: 66.7,
      relatedPredictions: [
        { id: 1, title: 'Will silver exceed $28 per ounce in 2025?', predictionId: 'silver-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Industrial demand', description: 'Growing industrial demand for silver in solar and electronics.' },
        { id: 2, title: 'Monetary hedge', description: 'Silver serves as a hedge against currency debasement.' }
      ],
      bearishViews: [
        { id: 1, title: 'Dollar strength', description: 'Strong US dollar may limit silver price gains.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 24 + Math.random() * 1.5
      }))
    },
    {
      id: 15,
      asset: 'Copper',
      opportunityTitle: 'Invest in Copper, targeting a 10–18% gain by Q3 2025.',
      bullish: 156,
      bearish: 123,
      price: 4.25,
      priceChange: 0.6,
      sentiment: 55.9,
      relatedPredictions: [
        { id: 1, title: 'Will copper exceed $4.50 per pound in 2025?', predictionId: 'copper-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Green energy demand', description: 'Copper demand rising with green energy transition.' },
        { id: 2, title: 'Supply constraints', description: 'Mining supply constraints support higher prices.' }
      ],
      bearishViews: [
        { id: 1, title: 'China slowdown', description: 'Slowing Chinese economy may reduce copper demand.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 4.1 + Math.random() * 0.3
      }))
    },
    {
      id: 16,
      asset: 'Euro',
      opportunityTitle: 'Invest in Euro, targeting a 5–10% gain by end of 2026.',
      bullish: 134,
      bearish: 167,
      price: 1.0825,
      priceChange: -0.3,
      sentiment: 44.5,
      relatedPredictions: [
        { id: 1, title: 'Will EUR/USD exceed 1.10 in 2025?', predictionId: 'eur-1' }
      ],
      bullishViews: [
        { id: 1, title: 'ECB policy shift', description: 'European Central Bank policy normalization may strengthen euro.' }
      ],
      bearishViews: [
        { id: 1, title: 'Economic weakness', description: 'Weak European economic data pressures the euro.' },
        { id: 2, title: 'Political uncertainty', description: 'Political risks in Europe may weaken the currency.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 1.08 + Math.random() * 0.01
      }))
    },
    {
      id: 17,
      asset: 'British Pound',
      opportunityTitle: 'Invest in British Pound, targeting a 6–12% gain by end of 2026.',
      bullish: 98,
      bearish: 145,
      price: 1.2650,
      priceChange: -0.5,
      sentiment: 40.3,
      relatedPredictions: [
        { id: 1, title: 'Will GBP/USD exceed 1.30 in 2025?', predictionId: 'gbp-1' }
      ],
      bullishViews: [
        { id: 1, title: 'BoE rate policy', description: 'Bank of England rate policy may support the pound.' }
      ],
      bearishViews: [
        { id: 1, title: 'Brexit impact', description: 'Ongoing Brexit-related economic challenges persist.' },
        { id: 2, title: 'Inflation concerns', description: 'Persistent inflation may pressure the currency.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 1.26 + Math.random() * 0.01
      }))
    },
    {
      id: 18,
      asset: 'German Bunds',
      opportunityTitle: 'Invest in German Bunds, targeting a 4–8% gain by end of 2026.',
      bullish: 89,
      bearish: 134,
      price: 97.80,
      priceChange: 0.3,
      sentiment: 39.9,
      relatedPredictions: [
        { id: 1, title: 'Will German 10-year yields fall below 2%?', predictionId: 'bund-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Safe haven demand', description: 'German bonds remain a safe haven in European markets.' }
      ],
      bearishViews: [
        { id: 1, title: 'ECB policy uncertainty', description: 'Uncertain ECB policy path may increase volatility.' },
        { id: 2, title: 'Inflation risks', description: 'Persistent inflation may pressure bond prices.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 97.5 + Math.random() * 0.6
      }))
    },
    {
      id: 19,
      asset: 'Wheat',
      opportunityTitle: 'Invest in Wheat, targeting a 8–15% gain by Q3 2025.',
      bullish: 123,
      bearish: 98,
      price: 5.85,
      priceChange: 1.2,
      sentiment: 55.7,
      relatedPredictions: [
        { id: 1, title: 'Will wheat prices exceed $6.50 per bushel in 2025?', predictionId: 'wheat-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Weather concerns', description: 'Adverse weather conditions may reduce global wheat supply.' },
        { id: 2, title: 'Export demand', description: 'Strong export demand supports wheat prices.' }
      ],
      bearishViews: [
        { id: 1, title: 'Supply recovery', description: 'Improved growing conditions may increase supply.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 5.7 + Math.random() * 0.3
      }))
    },
    {
      id: 20,
      asset: 'Natural Gas',
      opportunityTitle: 'Invest in Natural Gas, targeting a 10–20% gain by Q2 2025.',
      bullish: 145,
      bearish: 112,
      price: 2.85,
      priceChange: 2.1,
      sentiment: 56.4,
      relatedPredictions: [
        { id: 1, title: 'Will natural gas exceed $3.50 per MMBtu in 2025?', predictionId: 'ng-1' }
      ],
      bullishViews: [
        { id: 1, title: 'Winter demand', description: 'Increased winter heating demand supports prices.' },
        { id: 2, title: 'LNG export growth', description: 'Growing LNG export capacity drives demand.' }
      ],
      bearishViews: [
        { id: 1, title: 'Production growth', description: 'Rising US production may pressure prices.' }
      ],
      priceHistory: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        price: 2.7 + Math.random() * 0.3
      }))
    }
  ].sort((a, b) => (b.bullish + b.bearish) - (a.bullish + a.bearish)); // 按热度排序

  // Oppo榜组件 - 原先的Momentum内容（Opportunities排行榜）
  const OppoLeaderboard = () => {
    const data = (LEADERBOARD_DATA.opportunity || [])
      .filter(item => categoryFilter === 'All' || item.category === categoryFilter)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 20);

    return (
      <div className="space-y-2">
        {data.map((item, index) => {
          const isTopThree = index < 3;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-lg border p-4 transition-all ${
                isTopThree
                  ? 'border-purple-300 shadow-md bg-gradient-to-r from-purple-50/50 to-white'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`shrink-0 w-8 text-center flex items-center justify-center pt-1 ${
                  isTopThree ? 'text-purple-600' : 'text-slate-400'
                }`}>
                  {index === 0 ? (
                    <Crown size={20} className="text-yellow-500 fill-yellow-500" />
                  ) : index === 1 ? (
                    <Medal size={18} className="text-slate-400 fill-slate-300" />
                  ) : index === 2 ? (
                    <Medal size={18} className="text-amber-600 fill-amber-300" />
                  ) : (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onMomentumClick && onMomentumClick(item.predictionId, item.id)}
                    className="text-left w-full"
                  >
                    <div className={`font-bold text-sm mb-1 ${
                      isTopThree ? 'text-slate-900' : 'text-slate-700'
                    }`}>
                      {item.content}
                    </div>
                    <div className="text-xs text-slate-600 mb-2">{item.action}</div>
                    <div className="text-xs text-slate-500 italic mb-2">
                      From: {item.predictionTitle}
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUserClick && onUserClick(item.contributorId)}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold border border-white shadow-sm">
                        {item.contributorAvatar}
                      </div>
                      <span className="text-xs text-slate-600">{item.contributorName}</span>
                    </button>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Trophy size={12} className="text-yellow-500" />
                      <span>{item.votes} votes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Momentum榜组件 - 新的投资标的展示
  const MomentumLeaderboard = () => {
    const data = HOT_ASSETS.slice(0, 20);

    const handleAssetClick = (asset, e) => {
      e.preventDefault();
      e.stopPropagation();
      // 跳转到投资机会详情页
      if (onMomentumClick) {
        onMomentumClick(`asset_opportunity_${asset.id}`, asset.id);
      }
    };

    return (
      <>
        <div className="space-y-2 pb-20">
          {data.map((asset, index) => {
            const totalViews = asset.bullish + asset.bearish; // 热度指数
            
            return (
              <button
                key={asset.id}
                onClick={(e) => handleAssetClick(asset, e)}
                className="w-full text-left bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 transition-all hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* 排行 */}
                  <div className="shrink-0 w-8 text-center flex items-center justify-center text-slate-400">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>

                  {/* 内容区域 */}
                  <div className="flex-1 min-w-0">
                    {/* 机会标题 */}
                    <div className="font-bold text-sm mb-2 text-slate-700">
                      {asset.opportunityTitle}
                    </div>

                    {/* Asset tag、Sentiment 和热度指数 - 同一行 */}
                    <div className="flex items-center justify-between gap-2">
                      {/* Asset tag - 居左 */}
                      <div className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {asset.asset}
                      </div>

                      {/* Sentiment 和热度指数 - 居右 */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Sentiment */}
                        <div className={`text-xs font-bold px-2 py-1 rounded ${
                          asset.sentiment >= 60 ? 'bg-emerald-100 text-emerald-700' :
                          asset.sentiment >= 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {asset.sentiment >= 60 
                            ? `${asset.sentiment.toFixed(1)}% Bullish`
                            : asset.sentiment >= 40
                            ? `${asset.sentiment.toFixed(1)}% Neutral`
                            : `${(100 - asset.sentiment).toFixed(1)}% Bearish`}
                        </div>
                        {/* 热度指数 */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <Flame size={14} className="text-orange-500" />
                          <span className="font-semibold">{totalViews}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </>
    );
  };

  // 当从 detailSubView 恢复时，更新 activeTab
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="flex flex-col h-full bg-gray-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-slate-900">Trend</h1>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-slate-600 transition-colors"
              title="View ranking rules"
            >
              <Info size={18} />
            </button>
          </div>
          
          {/* Tab切换 */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveTab('momentum')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'momentum'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Trophy size={16} />
                <span>Momentum</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('influence')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'influence'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Lightbulb size={16} />
                <span>Influence</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('accuracy')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'accuracy'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Target size={16} />
                <span>Accuracy</span>
              </div>
            </button>
          </div>

        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'influence' && <InfluenceLeaderboard />}
        {activeTab === 'accuracy' && <AccuracyLeaderboard />}
        {activeTab === 'momentum' && <MomentumLeaderboard />}
      </div>

      {/* 说明模态框 */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Ranking Rules</h2>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={18} className="text-purple-600" />
                    <h3 className="font-semibold text-slate-900">Momentum</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Most-watched asset opportunities in the past 7 days.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={18} className="text-cyan-600" />
                    <h3 className="font-semibold text-slate-900">Influence</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    User rankings by contribution impact over the past 30 days.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className="text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">Accuracy</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    User rankings by prediction accuracy over the past 30 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendView;
