import React, { useState } from 'react';
import { ChevronLeft, TrendingUp, TrendingDown, X } from 'lucide-react';
import { MOCK_CARDS } from '../App';

// HOT_ASSETS 数据（与 TrendView.jsx 中的保持一致）
const HOT_ASSETS = [
  {
    id: 1,
    asset: 'Bitcoin',
    opportunityTitle: 'Invest in Bitcoin, targeting a 15–25% gain by Q2 2025.',
    bullish: 245,
    bearish: 89,
    price: 43250.50,
    priceChange: 2.35,
    sentiment: 73.3,
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
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
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
        price: 2.7 + Math.random() * 0.3
      }))
    }
];

const AssetOpportunityDetailPage = ({ assetId, onBack, onPredictionClick }) => {
  const [activeTab, setActiveTab] = useState('bullish');
  const [showPriceChart, setShowPriceChart] = useState(false);
  
  // 查找资产数据
  const asset = HOT_ASSETS.find(a => a.id === assetId || a.id.toString() === assetId.toString());
  
  if (!asset) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <span className="font-semibold text-slate-900">Momentum</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-slate-600">Asset not found</p>
        </div>
      </div>
    );
  }

  const isPositive = asset.priceChange >= 0;
  const bullishCount = asset.bullishViews?.length || 0;
  const bearishCount = asset.bearishViews?.length || 0;
  const predictionCount = Math.min(asset.relatedPredictions?.length || 0, 3);

  // 获取相关预测题（最多3个）
  const relatedPredictions = (asset.relatedPredictions || []).slice(0, 3).map(pred => {
    // 尝试从 MOCK_CARDS 中查找匹配的预测题
    let prediction = MOCK_CARDS.find(c => c.id === pred.predictionId || c.id.toString() === pred.predictionId?.toString());
    if (!prediction && MOCK_CARDS.length > 0) {
      prediction = MOCK_CARDS[0]; // 使用第一个作为占位符
    }
    return {
      ...pred,
      predictionData: prediction
    };
  });

  // 计算 Drivers 数量（模拟数据）
  const getDriversCount = (predictionId) => {
    // 这里可以根据实际数据返回，暂时返回模拟值
    return Math.floor(Math.random() * 5) + 3;
  };

  // 获取 TOP 1 选项和投票比例
  const getTopOption = (predictionData) => {
    if (!predictionData) return { option: 'Yes', percentage: 0 };
    const yesPercentage = predictionData.stats.yes;
    const noPercentage = predictionData.stats.no;
    if (yesPercentage > noPercentage) {
      return { option: 'Yes', percentage: yesPercentage };
    } else {
      return { option: 'No', percentage: noPercentage };
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">Momentum</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* 机会标题和基本信息 */}
        <div className="bg-white border-b border-gray-200 p-5">
          <h1 className="text-lg font-bold text-slate-900 leading-relaxed mb-2">
            {asset.opportunityTitle}
          </h1>

          {/* Sentiment 右对齐 */}
          <div className="flex items-center justify-end mb-3">
            <div className={`text-xs font-bold px-2.5 py-1 rounded ${
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
          </div>

          {/* 第二行：价格卡片 - Asset 标签和价格 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <button
              onClick={() => setShowPriceChart(true)}
              className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              <div className="text-sm font-semibold text-slate-900">
                {asset.asset}
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-lg font-bold text-slate-900">
                  ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-xs font-semibold flex items-center gap-1 ${
                  isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  ${(Math.abs(asset.price * asset.priceChange / 100)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="sticky top-[73px] z-10 bg-white border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('bullish')}
              className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-all border-b-2 ${
                activeTab === 'bullish'
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Bullish ({bullishCount})
            </button>
            <button
              onClick={() => setActiveTab('bearish')}
              className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-all border-b-2 ${
                activeTab === 'bearish'
                  ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Bearish ({bearishCount})
            </button>
            <button
              onClick={() => setActiveTab('prediction')}
              className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-all border-b-2 ${
                activeTab === 'prediction'
                  ? 'border-cyan-500 text-cyan-600 bg-cyan-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Prediction ({predictionCount})
            </button>
          </div>
        </div>

        {/* Tab 内容 */}
        <div className="p-4">
          {/* Bullish Tab */}
          {activeTab === 'bullish' && (
            <div className="space-y-2.5">
              {asset.bullishViews && asset.bullishViews.length > 0 ? (
                asset.bullishViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => {
                      // 点击标题跳转到对应内容链接（这里可以导航到相关预测题或详情）
                      if (onPredictionClick && asset.relatedPredictions?.[0]) {
                        const pred = MOCK_CARDS.find(c => 
                          c.id === asset.relatedPredictions[0].predictionId || 
                          c.id.toString() === asset.relatedPredictions[0].predictionId?.toString()
                        );
                        if (pred) onPredictionClick(pred);
                      }
                    }}
                    className="w-full text-left border border-gray-200 rounded-lg p-3.5 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 mb-1.5">{view.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{view.description}</p>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">No bullish views yet</p>
              )}
            </div>
          )}

          {/* Bearish Tab */}
          {activeTab === 'bearish' && (
            <div className="space-y-2.5">
              {asset.bearishViews && asset.bearishViews.length > 0 ? (
                asset.bearishViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => {
                      // 点击标题跳转到对应内容链接
                      if (onPredictionClick && asset.relatedPredictions?.[0]) {
                        const pred = MOCK_CARDS.find(c => 
                          c.id === asset.relatedPredictions[0].predictionId || 
                          c.id.toString() === asset.relatedPredictions[0].predictionId?.toString()
                        );
                        if (pred) onPredictionClick(pred);
                      }
                    }}
                    className="w-full text-left border border-gray-200 rounded-lg p-3.5 hover:border-rose-300 hover:bg-rose-50/50 transition-all"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 mb-1.5">{view.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{view.description}</p>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">No bearish views yet</p>
              )}
            </div>
          )}

          {/* Prediction Tab */}
          {activeTab === 'prediction' && (
            <div className="space-y-2.5">
              {relatedPredictions.length > 0 ? (
                relatedPredictions.map((pred) => (
                  <div
                    key={pred.id}
                    className="border border-gray-200 rounded-lg p-3.5 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all"
                  >
                    <button
                      onClick={() => {
                        if (pred.predictionData && onPredictionClick) {
                          onPredictionClick(pred.predictionData);
                        }
                      }}
                      className="w-full text-left"
                    >
                      <h4 className="font-semibold text-sm text-slate-900 mb-2">{pred.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-xs text-slate-600">
                          <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-700 font-semibold">
                            {getTopOption(pred.predictionData).option} {getTopOption(pred.predictionData).percentage}%
                          </span>
                          <span>{getDriversCount(pred.predictionId)} Drivers</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (pred.predictionData && onPredictionClick) {
                              onPredictionClick(pred.predictionData);
                            }
                          }}
                          className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg font-semibold text-xs hover:bg-cyan-700 transition-colors shrink-0"
                        >
                          Predict
                        </button>
                      </div>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">No related predictions</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 价格趋势图模态框 */}
      {showPriceChart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">30-Day Price Trend: {asset.asset}</h3>
              <button
                onClick={() => setShowPriceChart(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="h-48 relative border border-gray-200 rounded-lg p-2 bg-gray-50">
                  <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" className="overflow-visible">
                    <defs>
                      <linearGradient id={`priceGradient-${asset.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const maxPrice = Math.max(...asset.priceHistory.map(p => p.price));
                      const minPrice = Math.min(...asset.priceHistory.map(p => p.price));
                      const priceRange = maxPrice - minPrice || 1;
                      const width = 380;
                      const height = 180;
                      const points = asset.priceHistory.map((point, idx) => {
                        const x = 10 + (idx / (asset.priceHistory.length - 1)) * width;
                        const y = 10 + height - ((point.price - minPrice) / priceRange) * height;
                        return `${x},${y}`;
                      }).join(' ');
                      
                      const firstPoint = asset.priceHistory[0];
                      const lastPoint = asset.priceHistory[asset.priceHistory.length - 1];
                      const firstX = 10;
                      const firstY = 10 + height - ((firstPoint.price - minPrice) / priceRange) * height;
                      const lastX = 10 + width;
                      const lastY = 10 + height;
                      const areaPoints = `M ${firstX},${firstY} ${points} L ${lastX},${lastY} L ${firstX},${lastY} Z`;
                      
                      return (
                        <>
                          <path
                            d={areaPoints}
                            fill={`url(#priceGradient-${asset.id})`}
                          />
                          <polyline
                            points={points}
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {asset.priceHistory.map((point, idx) => {
                            const x = 10 + (idx / (asset.priceHistory.length - 1)) * width;
                            const y = 10 + height - ((point.price - minPrice) / priceRange) * height;
                            return (
                              <g key={idx}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#06b6d4"
                                  stroke="white"
                                  strokeWidth="2"
                                  className="hover:r-5 transition-all cursor-pointer"
                                />
                                <title>{`${point.date.toLocaleDateString()}: $${point.price.toFixed(2)}`}</title>
                              </g>
                            );
                          })}
                          <text x="5" y="15" fontSize="10" fill="#64748b" textAnchor="start">
                            ${maxPrice.toFixed(0)}
                          </text>
                          <text x="5" y={10 + height - 5} fontSize="10" fill="#64748b" textAnchor="start">
                            ${minPrice.toFixed(0)}
                          </text>
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-400 px-2">
                  {asset.priceHistory.filter((_, idx) => idx % 5 === 0 || idx === asset.priceHistory.length - 1).map((point, idx, arr) => {
                    return (
                      <span key={idx} className="flex-1 text-center">
                        {point.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetOpportunityDetailPage;
