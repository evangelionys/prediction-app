import React, { useState, useMemo } from 'react';
import { Edit3, Share2, Bell, ArrowRight, Sparkles, Clock, Lightbulb, Target, Bot, MessageSquare, BrainCircuit, Zap, X, CheckCircle2, Plus, RefreshCw, Lock, Settings } from 'lucide-react';
import { USER_PROFILE, USER_METRICS, USER_STATS, COGNITION_TREND_DATA, COGNITIVE_DIMENSIONS, HISTORICAL_RECORDS, MOCK_CARDS } from '../App';
import EditProfileModal from './EditProfileModal';
import AIAnalystCard from './AIAnalystCard';

// 认知雷达图组件
const CognitiveRadarChart = ({ onPointClick }) => {
  const size = 280;
  const padding = 50;
  const center = size / 2;
  const radius = 100;
  const levels = 5; // 0-10 scale, 5 levels
  
  // 6个认知能力维度（0-10 scale）
  const dimensions = [
    { 
      name: 'Breadth',
      score: COGNITIVE_DIMENSIONS.breadth.score,
      explanation: COGNITIVE_DIMENSIONS.breadth.explanation,
      color: '#06b6d4'
    },
    { 
      name: 'Versatility',
      score: COGNITIVE_DIMENSIONS.versatility.score,
      explanation: COGNITIVE_DIMENSIONS.versatility.explanation,
      color: '#8b5cf6'
    },
    { 
      name: 'Accuracy',
      score: COGNITIVE_DIMENSIONS.accuracy.score,
      explanation: COGNITIVE_DIMENSIONS.accuracy.explanation,
      color: '#10b981'
    },
    { 
      name: 'Conviction',
      score: COGNITIVE_DIMENSIONS.conviction.score,
      explanation: COGNITIVE_DIMENSIONS.conviction.explanation,
      color: '#f59e0b'
    },
    { 
      name: 'Influence',
      score: COGNITIVE_DIMENSIONS.influence.score,
      explanation: COGNITIVE_DIMENSIONS.influence.explanation,
      color: '#ef4444'
    },
    { 
      name: 'Judgment',
      score: COGNITIVE_DIMENSIONS.judgment.score,
      explanation: COGNITIVE_DIMENSIONS.judgment.explanation,
      color: '#6366f1'
    }
  ];
  
  const angleSlice = (Math.PI * 2) / dimensions.length;
  
  // 将0-10的分数转换为雷达图坐标（0-10对应0-radius）
  const getCoordinates = (score, index) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (score / 10) * radius; // 0-10 scale to 0-radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };
  
  const userPoints = dimensions.map((dim, i) => {
    const coords = getCoordinates(dim.score, i);
    return `${coords.x},${coords.y}`;
  }).join(' ');
  
  // 计算综合得分来判断等级（基于6个维度的平均分）
  const calculateLevel = () => {
    const avgScore = dimensions.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length;
    
    if (avgScore < 4) return { 
      level: 'normal', 
      name: 'Normal', 
      color: '#94a3b8', 
      glowColor: '#cbd5e1',
      brainOpacity: 0.08,
      strokeOpacity: 0.2
    };
    if (avgScore < 7) return { 
      level: 'advanced', 
      name: 'Advanced', 
      color: '#06b6d4', 
      glowColor: '#22d3ee',
      brainOpacity: 0.12,
      strokeOpacity: 0.25
    };
    return { 
      level: 'master', 
      name: 'Master', 
      color: '#8b5cf6', 
      glowColor: '#a78bfa',
      brainOpacity: 0.15,
      strokeOpacity: 0.3
    };
  };
  
  const levelInfo = calculateLevel();
  
  // 大脑SVG路径（根据等级显示不同样式）
  const brainSize = 70;
  const brainPath = `M ${center - 35} ${center - 25}
    Q ${center - 50} ${center - 15}, ${center - 40} ${center}
    Q ${center - 50} ${center + 15}, ${center - 35} ${center + 25}
    Q ${center - 15} ${center + 30}, ${center} ${center + 30}
    Q ${center + 15} ${center + 30}, ${center + 35} ${center + 25}
    Q ${center + 50} ${center + 15}, ${center + 40} ${center}
    Q ${center + 50} ${center - 15}, ${center + 35} ${center - 25}
    Q ${center + 15} ${center - 30}, ${center} ${center - 30}
    Q ${center - 15} ${center - 30}, ${center - 35} ${center - 25} Z`;
  
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-200/50 shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit size={14} className="text-cyan-600" />
          <h3 className="text-sm font-bold text-slate-900">Cognitive Profile</h3>
          <div className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded ${
            levelInfo.level === 'normal' ? 'bg-slate-100 text-slate-600' :
            levelInfo.level === 'advanced' ? 'bg-cyan-100 text-cyan-600' :
            'bg-purple-100 text-purple-600'
          }`}>
            {levelInfo.name}
          </div>
        </div>
        <div className="flex justify-center relative">
          {/* 大脑背景 - 与雷达图居中对齐 */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <svg width={size} height={size} viewBox={`-${padding} -${padding} ${size + padding * 2} ${size + padding * 2}`}>
              <defs>
                {/* 大脑渐变 */}
                <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={levelInfo.color} stopOpacity={levelInfo.brainOpacity} />
                  <stop offset="50%" stopColor={levelInfo.glowColor} stopOpacity={levelInfo.brainOpacity * 0.8} />
                  <stop offset="100%" stopColor={levelInfo.color} stopOpacity={levelInfo.brainOpacity * 0.6} />
                </linearGradient>
                {/* 发光效果（仅Master等级） */}
                <filter id="brainGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* 大脑背景 */}
              <g>
                <path
                  d={brainPath}
                  fill={levelInfo.color}
                  fillOpacity={levelInfo.brainOpacity}
                  stroke={levelInfo.color}
                  strokeWidth={levelInfo.level === 'master' ? "2" : "1.5"}
                  strokeOpacity={levelInfo.strokeOpacity}
                  filter={levelInfo.level === 'master' ? 'url(#brainGlow)' : 'none'}
                />
                {/* 大脑内部纹理线条 */}
                <path
                  d={`M ${center - 30} ${center - 10} Q ${center} ${center - 5}, ${center + 30} ${center - 10}`}
                  fill="none"
                  stroke={levelInfo.color}
                  strokeWidth="1"
                  strokeOpacity={levelInfo.strokeOpacity * 0.8}
                />
                <path
                  d={`M ${center - 30} ${center + 10} Q ${center} ${center + 5}, ${center + 30} ${center + 10}`}
                  fill="none"
                  stroke={levelInfo.color}
                  strokeWidth="1"
                  strokeOpacity={levelInfo.strokeOpacity * 0.8}
                />
                <path
                  d={`M ${center - 20} ${center - 15} Q ${center} ${center}, ${center - 20} ${center + 15}`}
                  fill="none"
                  stroke={levelInfo.color}
                  strokeWidth="1"
                  strokeOpacity={levelInfo.strokeOpacity * 0.8}
                />
                <path
                  d={`M ${center + 20} ${center - 15} Q ${center} ${center}, ${center + 20} ${center + 15}`}
                  fill="none"
                  stroke={levelInfo.color}
                  strokeWidth="1"
                  strokeOpacity={levelInfo.strokeOpacity * 0.8}
                />
              </g>
            </svg>
          </div>
          
          <svg width={size} height={size} viewBox={`-${padding} -${padding} ${size + padding * 2} ${size + padding * 2}`} className="drop-shadow-sm overflow-visible relative z-10">
          <defs>
            <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Grid circles (0-10 scale, 5 levels) */}
          {[1, 2, 3, 4, 5].map(l => (
            <circle
              key={l}
              cx={center}
              cy={center}
              r={(l / levels) * radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.5"
              opacity={0.5}
            />
          ))}
          
          {/* Axes */}
          {dimensions.map((_, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const coords = getCoordinates(10, i);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={coords.x}
                y2={coords.y}
                stroke="#e2e8f0"
                strokeWidth="0.5"
                opacity={0.5}
              />
            );
          })}
          
          {/* User area */}
          <polygon
            points={userPoints}
            fill="url(#userGradient)"
            stroke="#06b6d4"
            strokeWidth="2.5"
            className="drop-shadow-sm"
          />
          
          {/* User data points - clickable */}
          {dimensions.map((dim, i) => {
            const coords = getCoordinates(dim.score, i);
            return (
              <g key={`user-${i}`}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="6"
                  fill={dim.color}
                  opacity="0.2"
                  className="cursor-pointer hover:opacity-0.4 transition-opacity"
                  onClick={() => onPointClick(i, dim)}
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="4"
                  fill="white"
                  stroke={dim.color}
                  strokeWidth="2"
                  className="cursor-pointer hover:r-5 transition-all"
                  onClick={() => onPointClick(i, dim)}
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="2"
                  fill={dim.color}
                  className="cursor-pointer"
                  onClick={() => onPointClick(i, dim)}
                />
              </g>
            );
          })}
          
          {/* Labels and Scores (0-10) */}
          {dimensions.map((dim, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const labelRadius = radius + 45;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            return (
              <g key={i}>
                <text
                  x={x}
                  y={y - 10}
                  fill="#475569"
                  fontSize="14"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="600"
                  className="cursor-pointer hover:fill-cyan-600 transition-colors"
                  onClick={() => onPointClick(i, dim)}
                >
                  {dim.name}
                </text>
                <text
                  x={x}
                  y={y + 10}
                  fill={dim.color}
                  fontSize="16"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="700"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onPointClick(i, dim)}
                >
                  {Math.round(dim.score)}
                </text>
              </g>
            );
          })}
        </svg>
        </div>
      </div>
    </div>
  );
};

// 趋势图组件
const TrendChart = ({ data, type, showAI = false }) => {
  const h = 120;
  const w = 300;
  const padding = 20;
  const yAxisLeftPadding = 30;
  const chartWidth = w - padding * 2;
  const chartHeight = h - padding * 2;
  const chartStartX = padding + yAxisLeftPadding;
  const chartStartY = padding;
  
  const xScale = (i) => chartStartX + (i / (data.length - 1)) * chartWidth;
  
  // 根据类型确定Y轴范围
  const getMaxValue = () => {
    if (type === 'accuracy') return 100;
    if (type === 'influence') return Math.max(...data.map(d => Math.max(d.user, d.community))) * 1.2;
    return Math.max(...data.map(d => Math.max(d.user, d.community))) * 1.2;
  };
  
  const maxValue = getMaxValue();
  const yScale = (val) => chartStartY + chartHeight - (val / maxValue) * chartHeight;
  
  const generateLine = (key) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d[key])}`).join(' ');
  };
  
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w + yAxisLeftPadding} ${h}`} className="w-full h-full overflow-visible">
        {/* Y轴网格线和标签 */}
        {[0, 25, 50, 75, 100].map((label) => {
          if (type !== 'accuracy' && label === 0) return null;
          const y = type === 'accuracy' 
            ? yScale(label)
            : yScale((label / 100) * maxValue);
          return (
            <g key={label}>
              <line
                x1={chartStartX}
                y1={y}
                x2={chartStartX + chartWidth}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="0.5"
                strokeDasharray="2 2"
                opacity={0.5}
              />
              {/* Y轴标签 - 仅对accuracy类型显示百分比 */}
              {type === 'accuracy' && (
                <text
                  x={chartStartX - 8}
                  y={y + 3}
                  fontSize="8"
                  fill="#64748b"
                  textAnchor="end"
                  fontWeight="500"
                >
                  {label}%
                </text>
              )}
            </g>
          );
        })}
        
        {/* Y轴线 */}
        <line 
          x1={chartStartX} 
          y1={chartStartY} 
          x2={chartStartX} 
          y2={chartStartY + chartHeight} 
          stroke="#e2e8f0" 
          strokeWidth="1" 
        />
        
        {/* X轴 */}
        <line 
          x1={chartStartX} 
          y1={chartStartY + chartHeight} 
          x2={chartStartX + chartWidth} 
          y2={chartStartY + chartHeight} 
          stroke="#e2e8f0" 
          strokeWidth="1" 
        />
        
        {/* Lines */}
        {showAI && data[0].ai !== undefined && (
          <path d={generateLine('ai')} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity={0.6} />
        )}
        <path d={generateLine('community')} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" opacity={0.6} />
        <path d={generateLine('user')} fill="none" stroke="#06b6d4" strokeWidth="3" />
        
        {/* Data points */}
        {data.map((d, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(d.user)} r="3" fill="white" stroke="#06b6d4" strokeWidth="2" />
        ))}
        
        {/* X轴标签 */}
        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={h - 5} fontSize="8" fill="#64748b" textAnchor="middle">{d.month}</text>
        ))}
      </svg>
      <div className="flex justify-center gap-4 mt-2 text-[10px]">
        <div className="flex items-center gap-1 text-cyan-600">
          <div className="w-2 h-2 rounded-full bg-cyan-500"/> User
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <div className="w-2 h-2 rounded-full bg-slate-400"/> Community
        </div>
        {showAI && (
          <div className="flex items-center gap-1 text-purple-500">
            <div className="w-2 h-2 rounded-full bg-purple-500"/> AI Avg
          </div>
        )}
      </div>
    </div>
  );
};

// 历史记录列表组件
const HistoryList = ({ records, type }) => {
  if (type === 'accuracy' || type === 'influence') {
    return null; // 准确率和影响力不显示历史记录
  }
  
  const displayRecords = type === 'predictions' 
    ? HISTORICAL_RECORDS.predictions 
    : HISTORICAL_RECORDS.contributions;
  
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {displayRecords.map((record) => (
        <div key={record.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{record.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{record.date}</div>
            </div>
            {record.status && (
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                record.status === 'closed' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-cyan-100 text-cyan-700'
              }`}>
                {record.status === 'closed' ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={10} /> {record.outcome}
                  </span>
                ) : (
                  record.status
                )}
              </div>
            )}
          </div>
          {record.prediction && (
            <div className="text-xs text-slate-600 mt-1">
              Prediction: <span className="font-bold">{record.prediction}</span>
            </div>
          )}
          {record.votes && (
            <div className="text-xs text-slate-500 mt-1">
              {record.votes} votes
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// 浮层组件
const DetailOverlay = ({ dimension, onClose }) => {
  const isAccuracy = dimension.name === 'Accuracy';
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-900">{dimension.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* 维度解释 */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Explanation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{dimension.explanation}</p>
          </div>
          
          {/* 当前分数 */}
          <div className="text-center">
            <div className="text-3xl font-black mb-1" style={{ color: dimension.color }}>
              {Math.round(dimension.score)}
            </div>
            <div className="text-sm text-slate-500">Score (0-10)</div>
          </div>
          
          {/* Accuracy特殊显示：准确率数值和趋势图 */}
          {isAccuracy && (
            <>
              <div className="text-center bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                <div className="text-2xl font-black text-cyan-600 mb-1">{USER_STATS.accuracy}%</div>
                <div className="text-sm text-slate-500">Prediction Accuracy</div>
              </div>
              
              {/* 趋势图 */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3">6-Month Trend</h3>
                <TrendChart 
                  data={COGNITION_TREND_DATA.accuracy} 
                  type="accuracy"
                  showAI={true}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MyGrowthView = ({ onNavigate, comparisonData = null }) => {
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [activeActivityTab, setActiveActivityTab] = useState('prediction');
  const [activePredictionFilter, setActivePredictionFilter] = useState('predicted');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localUserProfile, setLocalUserProfile] = useState(USER_PROFILE);
  const [lastUpdateTime, setLastUpdateTime] = useState(() => {
    // 从 localStorage 读取上次更新时间，如果没有则设置为7天前
    const saved = localStorage.getItem('aiInsightLastUpdate');
    return saved ? parseInt(saved) : Date.now() - 7 * 24 * 60 * 60 * 1000;
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const ProfileHeader = () => (
    <div className="bg-white/90 backdrop-blur-md p-4 pb-4 border-b border-cyan-100/50 relative">
      <div className="absolute inset-0 grid-background opacity-20 overflow-hidden" />
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl overflow-hidden" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl overflow-hidden" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-xl glow-effect overflow-hidden">
              {typeof localUserProfile.avatar === 'string' && localUserProfile.avatar.length <= 2 ? (
                localUserProfile.avatar
              ) : (
                <img src={localUserProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">{localUserProfile.name}</h1>
              <div className="flex gap-4 text-sm">
                <button onClick={() => onNavigate('list_followers')} className="hover:text-cyan-600 transition-colors group">
                  <span className="font-bold text-slate-900 group-hover:text-cyan-600">{localUserProfile.followers}</span> <span className="text-slate-500">Followers</span>
                </button>
                <button onClick={() => onNavigate('list_following')} className="hover:text-cyan-600 transition-colors group">
                  <span className="font-bold text-slate-900 group-hover:text-cyan-600">{localUserProfile.following}</span> <span className="text-slate-500">Following</span>
                </button>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 border border-cyan-200 rounded-full hover:bg-cyan-50 hover:border-cyan-300 text-slate-600 transition-all hover-glow"
          >
            <Edit3 size={18} />
          </button>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{localUserProfile.bio}</p>
        
        {/* 徽章功能已隐藏，等待后续通知显示 */}
        {false && (
          <div className="flex gap-2 mt-4 pb-2 flex-wrap">
            {USER_PROFILE.badges
              .filter(badge => badge.label !== 'U.S. Politics Expert')
              .slice(0, 3)
              .map((badge, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(`badge_detail_${badge.label.toLowerCase().replace(/\s+/g, '_')}`)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${badge.color.replace('text-', 'bg-').replace('border-', 'bg-opacity-10 ')} bg-opacity-5 hover:bg-opacity-15 hover:shadow-md hover:scale-105 transition-all cursor-pointer group relative overflow-hidden min-w-0`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-base filter drop-shadow-sm shrink-0 relative z-10">{badge.icon}</span>
                <div className="flex flex-col items-start min-w-0 relative z-10">
                  <span className="text-[10px] font-bold text-slate-900 leading-tight whitespace-normal break-words">{badge.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // 计算用户预测数据
  const predictionAnalysis = useMemo(() => {
    // 获取用户所有预测记录（实际应该从API获取，这里使用HISTORICAL_RECORDS作为模拟）
    const allPredictions = HISTORICAL_RECORDS.predictions || [];
    // 临时设置：为了测试 Enabled 状态，设置为 20 或更多
    const totalPredictions = Math.max(allPredictions.length, 20);
    
    // 获取已结算的预测（status === 'closed'）
    const settledPredictions = allPredictions.filter(p => p.status === 'closed' && p.isPredicted);
    
    // 计算平均准确率
    const correctCount = settledPredictions.filter(p => p.prediction === p.outcome).length;
    const averageAccuracy = settledPredictions.length > 0 
      ? (correctCount / settledPredictions.length) * 100 
      : 0;
    
    // 创建标题到分类的映射（从MOCK_CARDS获取）
    // 将简单分类映射到更细分的分类
    const categoryMapping = {
      'Space': 'Space & Aerospace',
      'Tech': 'AI & Technology',
      'Business': 'Stocks & Indexes',
      'Politics': 'Conflict & Security',
      'Geopolitics': 'Conflict & Security',
      'Other': 'Other'
    };
    
    const titleToCategory = {};
    (MOCK_CARDS || []).forEach(card => {
      if (card.question) {
        const baseCategory = card.category || 'Other';
        titleToCategory[card.question] = categoryMapping[baseCategory] || baseCategory;
      }
    });
    
    // 按分类统计（使用category作为二级分类的占位，实际应该使用subcategory）
    const categoryStats = {};
    settledPredictions.forEach(p => {
      // 从MOCK_CARDS中查找分类，如果没有则使用默认值
      const category = titleToCategory[p.title] || p.category || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, correct: 0 };
      }
      categoryStats[category].total++;
      if (p.prediction === p.outcome) {
        categoryStats[category].correct++;
      }
    });
    
    // 计算每个分类的准确率
    const categoryAccuracies = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      total: stats.total,
      correct: stats.correct,
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
    }));
    
    // 找出优势：准确率明显高于平均且>=5题的分类
    const strengths = categoryAccuracies
      .filter(cat => cat.total >= 5 && cat.accuracy > averageAccuracy + 10)
      .sort((a, b) => b.accuracy - a.accuracy);
    const strength = strengths.length > 0 ? strengths[0] : null;
    
    // 如果没有符合条件的优势，选择答题量最多的分类
    const topByVolume = categoryAccuracies.length > 0
      ? categoryAccuracies.sort((a, b) => b.total - a.total)[0]
      : null;
    const finalStrength = strength || topByVolume;
    
    // 找出盲区：准确率明显低于平均且>=5题的分类
    const blindSpots = categoryAccuracies
      .filter(cat => cat.total >= 5 && cat.accuracy < averageAccuracy - 10)
      .sort((a, b) => a.accuracy - b.accuracy);
    const blindSpot = blindSpots.length > 0 ? blindSpots[0] : null;
    
    // 如果没有符合条件的盲区，推荐答题较少的分类
    const allCategories = ['AI & Technology', 'Stocks & Indexes', 'Conflict & Security', 'Space & Aerospace', 'Crypto & Blockchain', 'Energy & Commodities'];
    const userCategories = new Set(categoryAccuracies.map(c => c.category));
    const recommendedCategory = allCategories.find(cat => !userCategories.has(cat)) || 
      categoryAccuracies.sort((a, b) => a.total - b.total)[0]?.category || 'AI & Technology';
    
    return {
      totalPredictions,
      settledCount: settledPredictions.length,
      averageAccuracy,
      strength: finalStrength,
      blindSpot: blindSpot || { category: recommendedCategory, total: 0, accuracy: 0, isRecommended: true }
    };
  }, []);
  
  // Use AIAnalystCard instead of InsightCard
  const InsightCard = () => {
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdateTime) / (24 * 60 * 60 * 1000));
    
    const handleUpdate = () => {
      if (isUpdating) return;
      setIsUpdating(true);
      setTimeout(() => {
        setLastUpdateTime(Date.now());
        localStorage.setItem('aiInsightLastUpdate', Date.now().toString());
        setIsUpdating(false);
      }, 1000);
    };
    
    return (
      <AIAnalystCard
        predictionAnalysis={predictionAnalysis}
        onNavigate={onNavigate}
        lastUpdateTime={lastUpdateTime}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
        comparisonData={comparisonData}
      />
    );
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 via-white to-gray-50 animate-in slide-in-from-right duration-300 relative overflow-y-auto pb-24 text-slate-900">
        <div className="fixed inset-0 grid-background opacity-10 pointer-events-none" />
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl p-4 flex items-center justify-between border-b border-cyan-100/50 shadow-sm">
          <button 
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-full hover:bg-cyan-50 border border-cyan-200/50 hover:border-cyan-300 text-slate-600 hover:text-cyan-600 transition-all hover-glow"
          >
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2">
             <button className="p-2 rounded-full hover:bg-cyan-50 border border-cyan-200/50 hover:border-cyan-300 text-slate-600 hover:text-cyan-600 transition-all hover-glow">
               <Share2 size={20} />
             </button>
             <button className="p-2 rounded-full hover:bg-cyan-50 border border-cyan-200/50 hover:border-cyan-300 text-slate-600 hover:text-cyan-600 transition-all hover-glow">
               <Bell size={20} />
             </button>
          </div>
        </div>
        <ProfileHeader />
        <InsightCard />
        <div className="px-4 mb-8">
          <CognitiveRadarChart onPointClick={(index, dimension) => setSelectedDimension({ index, ...dimension })} />
        </div>
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-cyan-600" />
              <h3 className="font-bold text-slate-900 text-sm">Activities</h3>
            </div>
            <span 
              className="text-xs text-cyan-600 hover:text-cyan-700 cursor-pointer font-mono"
              onClick={() => onNavigate(`activities_all_${activeActivityTab}`)}
            >
              View All
            </span>
          </div>
          
          {/* Activities Tab 切换菜单 */}
          <div className="flex gap-2 mb-4 bg-gray-100/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveActivityTab('prediction')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
                activeActivityTab === 'prediction'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Prediction
            </button>
            <button
              onClick={() => setActiveActivityTab('contribution')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
                activeActivityTab === 'contribution'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Contribution
            </button>
            <button
              onClick={() => setActiveActivityTab('interaction')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
                activeActivityTab === 'interaction'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Interaction
            </button>
          </div>
          
          {/* Activities 内容区域 */}
          <div>
            {/* Prediction Activities */}
            {activeActivityTab === 'prediction' && (
              <>
                {/* Prediction 子 Tab 筛选栏 - 弱化样式 */}
                <div className="flex gap-1 mb-2.5">
                  <button
                    onClick={() => setActivePredictionFilter('predicted')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                      activePredictionFilter === 'predicted'
                        ? 'text-cyan-600 bg-cyan-50'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Predicted
                  </button>
                  <button
                    onClick={() => setActivePredictionFilter('saved')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                      activePredictionFilter === 'saved'
                        ? 'text-cyan-600 bg-cyan-50'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Saved
                  </button>
                  <button
                    onClick={() => setActivePredictionFilter('created')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                      activePredictionFilter === 'created'
                        ? 'text-cyan-600 bg-cyan-50'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Created
                  </button>
                </div>
                
                <div className="space-y-2">
                  {(() => {
                    // 根据筛选条件过滤数据
                    let filteredRecords = HISTORICAL_RECORDS.predictions;
                    if (activePredictionFilter === 'predicted') {
                      // Predicted：参与预测的题目
                      filteredRecords = filteredRecords.filter(r => r.isPredicted);
                    } else if (activePredictionFilter === 'saved') {
                      // Saved：已保存的题目（isFollowed）
                      filteredRecords = filteredRecords.filter(r => r.isFollowed);
                    } else if (activePredictionFilter === 'created') {
                      // Created：创建的题目
                      filteredRecords = filteredRecords.filter(r => r.isCreated);
                    }
                    return filteredRecords.slice(0, 3).map((record) => (
                  <div 
                    key={record.id} 
                    className={`bg-white/80 backdrop-blur-sm border p-3 rounded-lg hover:shadow-md transition-all group relative ${
                      record.isCreated 
                        ? 'border-purple-200/50 hover:border-purple-300' 
                        : record.isPredicted && !record.isFollowed
                        ? 'border-cyan-200/50 hover:border-cyan-300'
                        : record.isFollowed && !record.isPredicted
                        ? 'border-blue-200/50 hover:border-blue-300'
                        : 'border-cyan-200/50 hover:border-cyan-300'
                    }`}
                  >
                    {/* Created 图标 - 放在卡片左上角 */}
                    {record.isCreated && (
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center z-10">
                        <Plus size={12} className="text-purple-600" />
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                        record.isCreated 
                          ? 'bg-purple-100 border-purple-200 group-hover:bg-purple-200' 
                          : record.isPredicted && !record.isFollowed
                          ? 'bg-cyan-100 border-cyan-200 group-hover:bg-cyan-200'
                          : record.isFollowed && !record.isPredicted
                          ? 'bg-blue-100 border-blue-200 group-hover:bg-blue-200'
                          : 'bg-cyan-100 border-cyan-200 group-hover:bg-cyan-200'
                      }`}>
                        <Target size={18} className={
                          record.isCreated 
                            ? 'text-purple-600' 
                            : record.isPredicted && !record.isFollowed
                            ? 'text-cyan-600'
                            : record.isFollowed && !record.isPredicted
                            ? 'text-blue-600'
                            : 'text-cyan-600'
                        } />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 mb-1">{record.title}</div>
                        <div className="text-xs text-slate-500 font-mono mb-2">
                          {record.prediction && `Prediction: ${record.prediction} • `}{record.timeAgo}
                        </div>
                        {record.topOptions && record.topOptions.length > 0 && (() => {
                          const totalVotes = record.topOptions.reduce((sum, opt) => sum + opt.votes, 0);
                          return (
                            <div className="flex gap-2 mt-2">
                              {record.topOptions.slice(0, 2).map((opt, idx) => {
                                const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                return (
                                  <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-cyan-50 rounded border border-cyan-200">
                                    <span className="text-xs font-bold text-cyan-700">{opt.option}</span>
                                    <span className="text-[10px] text-slate-500">{percentage}%</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                      {record.status && (
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          record.status === 'closed' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-cyan-100 text-cyan-700'
                        }`}>
                          {record.status === 'closed' ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 size={10} /> {record.outcome}
                            </span>
                          ) : (
                            record.status
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                    ));
                  })()}
                </div>
              </>
            )}
            
            {/* Contribution Activities */}
            {activeActivityTab === 'contribution' && (
              <div className="space-y-2">
                {HISTORICAL_RECORDS.contributions.slice(0, 3).map((record) => (
                  <div key={record.id} className="bg-white/80 backdrop-blur-sm border border-purple-200/50 p-3 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
                        record.type === 'driver' 
                          ? 'bg-purple-100 border-purple-200 group-hover:bg-purple-200' 
                          : 'bg-blue-100 border-blue-200 group-hover:bg-blue-200'
                      }`}>
                        <Lightbulb size={18} className={record.type === 'driver' ? 'text-purple-600' : 'text-blue-600'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 mb-1">{record.title}</div>
                        <div className="text-xs text-slate-500 font-mono mb-1">
                          {record.votes && `${record.votes} votes • `}{record.timeAgo}
                        </div>
                        {record.predictionTitle && (
                          <div className="text-xs text-slate-600 mt-1 italic">
                            {record.predictionTitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Interaction Activities */}
            {activeActivityTab === 'interaction' && (
              <div className="space-y-2">
                {HISTORICAL_RECORDS.interactions.slice(0, 3).map((record) => (
                  <div key={record.id} className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 p-3 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-200 transition-colors shrink-0">
                        <MessageSquare size={18} className="text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 mb-1">{record.title}</div>
                        <div className="text-xs text-slate-500 font-mono mb-1">
                          {record.target} • {record.timeAgo}
                        </div>
                        {record.predictionTitle && (
                          <div className="text-xs text-slate-600 mt-1 italic">
                            {record.predictionTitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedDimension && (
        <DetailOverlay 
          dimension={selectedDimension} 
          onClose={() => setSelectedDimension(null)} 
        />
      )}
      
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={localUserProfile}
        onSave={(updatedProfile) => {
          setLocalUserProfile(updatedProfile);
          // 这里可以添加保存到后端的逻辑
          console.log('Profile updated:', updatedProfile);
        }}
      />
    </>
  );
};

export default MyGrowthView;

