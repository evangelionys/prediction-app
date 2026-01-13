import React, { useState } from 'react';
import { ChevronLeft, Share2, UserPlus, UserCheck, Zap, MessageSquare, Target, Lightbulb, CheckCircle2, BrainCircuit } from 'lucide-react';
import { MOCK_USER_PROFILES, USER_PROFILE, USER_METRICS, USER_STATS, COGNITION_TREND_DATA, COGNITIVE_DIMENSIONS, HISTORICAL_RECORDS } from '../App';

const UserProfileView = ({ userId, onBack, onNavigate }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeActivityTab, setActiveActivityTab] = useState('prediction');
  
  // 获取用户数据，如果没有则使用默认数据
  const userProfile = MOCK_USER_PROFILES[userId] || {
    id: userId,
    name: 'Unknown User',
    handle: '@unknown',
    bio: 'No bio available.',
    avatar: 'UU',
    followers: 0,
    following: 0,
    badges: [],
    isFollowing: false
  };

  // 判断是否是自己的主页（简化判断，实际应该从API获取当前用户ID）
  const isOwnProfile = false; // 客态查看，始终为false

  // 使用用户数据或默认数据
  const profileData = {
    ...userProfile,
    isFollowing: isFollowing || userProfile.isFollowing
  };

  // 使用相同的认知维度数据（实际应用中应该从API获取）
  const cognitiveData = COGNITIVE_DIMENSIONS;
  const metrics = USER_METRICS;
  const stats = USER_STATS;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // 认知雷达图（复用MyGrowthView的逻辑）
  const CognitiveRadarChart = () => {
    const size = 280;
    const padding = 50;
    const center = size / 2;
    const radius = 100;
    const levels = 5; // 0-10 scale, 5 levels
    
    const dimensions = [
      { name: 'Breadth', score: cognitiveData.breadth?.score || 1.5, color: '#06b6d4' },
      { name: 'Versatility', score: cognitiveData.versatility?.score || 3.2, color: '#8b5cf6' },
      { name: 'Accuracy', score: cognitiveData.accuracy?.score || 8.5, color: '#10b981' },
      { name: 'Conviction', score: cognitiveData.conviction?.score || 6.8, color: '#f59e0b' },
      { name: 'Influence', score: cognitiveData.influence?.score || 9.9, color: '#ef4444' },
      { name: 'Judgment', score: cognitiveData.judgment?.score || 4.5, color: '#6366f1' }
    ];
    
    const angleSlice = (Math.PI * 2) / dimensions.length;
    
    const getCoordinates = (score, index) => {
      const angle = index * angleSlice - Math.PI / 2;
      const r = (score / 10) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    };
    
    const userPoints = dimensions.map((dim, i) => {
      const coords = getCoordinates(dim.score, i);
      return `${coords.x},${coords.y}`;
    }).join(' ');

    // 计算等级
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
    
    // 大脑SVG路径（与MyGrowthView保持一致）
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
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-200/50 shadow-lg relative overflow-visible">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit size={18} className="text-cyan-600" />
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
                  <linearGradient id="brainGradientUser" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={levelInfo.color} stopOpacity={levelInfo.brainOpacity} />
                    <stop offset="50%" stopColor={levelInfo.glowColor} stopOpacity={levelInfo.brainOpacity * 0.8} />
                    <stop offset="100%" stopColor={levelInfo.color} stopOpacity={levelInfo.brainOpacity * 0.6} />
                  </linearGradient>
                  {/* 发光效果（仅Master等级） */}
                  <filter id="brainGlowUser">
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
                    filter={levelInfo.level === 'master' ? 'url(#brainGlowUser)' : 'none'}
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
                <linearGradient id="userGradientUser" x1="0%" y1="0%" x2="100%" y2="100%">
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
                fill="url(#userGradientUser)"
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="drop-shadow-sm"
              />
              
              {/* User data points */}
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
                    />
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="4"
                      fill="white"
                      stroke={dim.color}
                      strokeWidth="2"
                    />
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="2"
                      fill={dim.color}
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

  const ProfileHeader = () => (
    <div className="bg-white/90 backdrop-blur-md p-4 pb-4 border-b border-cyan-100/50 relative">
      <div className="absolute inset-0 grid-background opacity-20 overflow-hidden" />
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl overflow-hidden" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl overflow-hidden" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-xl">
              {profileData.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">{profileData.name}</h1>
              <div className="flex gap-4 text-sm">
                <button 
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(`followers_${userId}`);
                    }
                  }}
                  className="hover:text-cyan-600 transition-colors group"
                >
                  <span className="font-bold text-slate-900 group-hover:text-cyan-600">{profileData.followers}</span> <span className="text-slate-500">Followers</span>
                </button>
                <button 
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(`following_${userId}`);
                    }
                  }}
                  className="hover:text-cyan-600 transition-colors group"
                >
                  <span className="font-bold text-slate-900 group-hover:text-cyan-600">{profileData.following}</span> <span className="text-slate-500">Following</span>
                </button>
              </div>
            </div>
          </div>
          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                profileData.isFollowing
                  ? 'bg-gray-100 text-slate-700 border border-gray-200 hover:bg-gray-200'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-md'
              }`}
            >
              {profileData.isFollowing ? (
                <span className="flex items-center gap-1.5">
                  <UserCheck size={16} />
                  Following
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <UserPlus size={16} />
                  Follow
                </span>
              )}
            </button>
          )}
        </div>
        
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{profileData.bio}</p>
        
        <div className="flex gap-2 mt-4 pb-2 flex-wrap">
          {profileData.badges.slice(0, 3).map((badge, idx) => (
            <button
              key={idx}
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
      </div>
    </div>
  );

  const InsightCard = () => {
    // 客态查看时隐藏AI Insight
    if (!isOwnProfile) {
      return null;
    }

    return (
      <div className="mx-4 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative group cursor-pointer border border-cyan-200/50 hover:shadow-xl hover:border-cyan-300 transition-all">
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-xl border border-cyan-200">
                <Zap size={20} className="text-cyan-600" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-cyan-600 font-mono">AI INSIGHT</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 font-mono">
              Updated Today
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-0.5 p-1.5 bg-yellow-100 rounded-lg border border-yellow-200 shrink-0 h-fit">
                <Lightbulb size={18} className="text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Behavioral Pattern</div>
                <p className="text-sm leading-relaxed text-slate-700 font-medium whitespace-normal break-words">
                  Your accuracy in <span className="text-slate-900 font-bold">Tech hardware</span> is elite, but you consistently underestimate <span className="text-rose-600 font-bold">political tail risks</span>.
                </p>
              </div>
            </div>
            
            <div className="h-px w-full bg-gray-200" />
            
            <div className="flex gap-3">
              <div className="mt-0.5 p-1.5 bg-emerald-100 rounded-lg border border-emerald-200 shrink-0 h-fit">
                <Target size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Exclusive Opportunity</div>
                <p className="text-sm leading-relaxed text-slate-700 font-medium whitespace-normal break-words">
                  A new <span className="text-slate-900 font-bold">SpaceX contract</span> prediction matches your strengths perfectly (+85% Match).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 via-white to-gray-50 animate-in slide-in-from-right duration-300 relative overflow-y-auto pb-24 text-slate-900">
      <div className="fixed inset-0 grid-background opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl p-4 flex items-center justify-between border-b border-cyan-100/50 shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-cyan-50 border border-cyan-200/50 hover:border-cyan-300 text-slate-600 hover:text-cyan-600 transition-all">
          <ChevronLeft size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-cyan-50 border border-cyan-200/50 hover:border-cyan-300 text-slate-600 hover:text-cyan-600 transition-all">
          <Share2 size={20} />
        </button>
      </div>
      
      <ProfileHeader />
      <div className="px-4 pt-2 pb-4">
        <CognitiveRadarChart />
      </div>
      <InsightCard />
      
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-cyan-600" />
            <h3 className="font-bold text-slate-900 text-sm">Activities</h3>
          </div>
          <span className="text-xs text-cyan-600 hover:text-cyan-700 cursor-pointer font-mono">View All</span>
        </div>
        
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
        
        <div>
          {activeActivityTab === 'prediction' && (
            <div className="space-y-2">
              {HISTORICAL_RECORDS.predictions.slice(0, 3).map((record) => (
                <div key={record.id} className="bg-white/80 backdrop-blur-sm border border-cyan-200/50 p-3 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center border border-cyan-200 group-hover:bg-cyan-200 transition-colors shrink-0">
                      <Target size={18} className="text-cyan-600" />
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
              ))}
            </div>
          )}
          
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
  );
};

export default UserProfileView;

