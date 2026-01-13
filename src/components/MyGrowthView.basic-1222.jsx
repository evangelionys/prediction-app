import React from 'react';
import { Edit3, Share2, Bell, Plus, ArrowRight, Sparkles, Clock, Lightbulb, Target, Bot, MessageSquare, BrainCircuit, Zap, Cpu, Network } from 'lucide-react';
import { USER_PROFILE, USER_METRICS, USER_STATS, TREND_DATA } from '../App';

// Accuracy Trend Chart Component
const AccuracyTrendChart = () => {
  const data = TREND_DATA;
  const h = 150;
  const w = 300;
  const padding = 20;
  const yAxisLeftPadding = 35; // 为Y轴标签留出空间
  const chartWidth = w - padding * 2;
  const chartHeight = h - padding * 2;
  const chartStartX = padding + yAxisLeftPadding;
  const chartStartY = padding;
  
  const xScale = (i) => chartStartX + (i / (data.length - 1)) * chartWidth;
  const yScale = (val) => chartStartY + chartHeight - (val / 100) * chartHeight;
  const volScale = (val) => chartStartY + chartHeight - (val / 50) * chartHeight;

  const generateLine = (key) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d[key])}`).join(' ');
  };

  const volumeArea = `M${chartStartX},${chartStartY + chartHeight} ` + 
    data.map((d, i) => `L${xScale(i)},${volScale(d.vol)}`).join(' ') + 
    ` L${chartStartX + chartWidth},${chartStartY + chartHeight} Z`;

  // Y轴刻度值
  const yAxisLabels = [0, 25, 50, 75, 100];
  
  return (
    <div className="w-full relative mt-4 mb-2 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-200/50 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-background opacity-30" />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-cyan-100 rounded-lg">
            <Cpu size={14} className="text-cyan-600" />
          </div>
          <h3 className="text-xs font-bold text-slate-700 mb-0 uppercase tracking-wider">Accuracy Trend</h3>
          <div className="ml-auto text-[10px] text-cyan-600 font-mono bg-cyan-50 px-2 py-0.5 rounded">6M</div>
        </div>
        <svg viewBox={`0 0 ${w + yAxisLeftPadding} ${h}`} className="w-full h-full overflow-visible">
        {/* Y轴网格线和标签 */}
        {yAxisLabels.map((label) => {
          const y = yScale(label);
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
            </g>
          );
        })}
        
        {/* X轴 */}
        <line 
          x1={chartStartX} 
          y1={chartStartY + chartHeight} 
          x2={chartStartX + chartWidth} 
          y2={chartStartY + chartHeight} 
          stroke="#e2e8f0" 
          strokeWidth="1" 
        />
        
        {/* Y轴 */}
        <line 
          x1={chartStartX} 
          y1={chartStartY + chartHeight} 
          x2={chartStartX} 
          y2={chartStartY} 
          stroke="#e2e8f0" 
          strokeWidth="1" 
        />
        
        {/* Volume area */}
        <path d={volumeArea} fill="#f1f5f9" />
        
        {/* Lines with glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d={generateLine('platform')} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" opacity={0.6} />
        <path d={generateLine('ai')} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity={0.6} />
        <path d={generateLine('user')} fill="none" stroke="#06b6d4" strokeWidth="3" filter="url(#glow)" />
        
        {/* Data points with glow */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xScale(i)} cy={yScale(d.user)} r="4" fill="#06b6d4" opacity="0.2" className="pulse-glow" />
            <circle cx={xScale(i)} cy={yScale(d.user)} r="3" fill="white" stroke="#06b6d4" strokeWidth="2" />
          </g>
        ))}
        
        {/* X轴标签 */}
        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={h - 5} fontSize="8" fill="#64748b" textAnchor="middle">{d.month}</text>
        ))}
      </svg>
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-cyan-600 font-medium">
            <div className="w-2 h-2 rounded-full bg-cyan-500 pulse-glow"/> You
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-purple-600 font-medium">
            <div className="w-2 h-2 rounded-full bg-purple-500"/> AI Avg
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <div className="w-2 h-2 rounded-full bg-slate-400"/> Platform
          </div>
        </div>
        <div className="mt-3 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Correct Predictions</div>
          <div className="text-lg font-black text-cyan-600">{USER_METRICS.correctPredictions}</div>
        </div>
      </div>
    </div>
  );
};

const MyGrowthView = ({ onNavigate }) => {
  const ProfileHeader = () => (
    <div className="bg-white/90 backdrop-blur-md p-4 pb-4 border-b border-cyan-100/50 relative">
      {/* Subtle grid background - clipped */}
      <div className="absolute inset-0 grid-background opacity-20 overflow-hidden" />
      
      {/* Glow effects - clipped */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl overflow-hidden" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl overflow-hidden" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-xl glow-effect">
              {USER_PROFILE.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">{USER_PROFILE.name}</h1>
              <div className="text-slate-500 text-sm mb-2 font-mono">{USER_PROFILE.handle}</div>
              <div className="flex gap-4 text-sm">
                <button onClick={() => onNavigate('list_followers')} className="hover:text-cyan-600 transition-colors group">
                  <span className="font-bold text-slate-900 group-hover:text-cyan-600">{USER_PROFILE.followers}</span> <span className="text-slate-500">Followers</span>
                </button>
                <button onClick={() => onNavigate('list_following')} className="hover:text-cyan-600 transition-colors group">
                  <span className="font-bold text-slate-900 group-hover:text-cyan-600">{USER_PROFILE.following}</span> <span className="text-slate-500">Following</span>
                </button>
              </div>
            </div>
          </div>
          <button className="p-2 border border-cyan-200 rounded-full hover:bg-cyan-50 hover:border-cyan-300 text-slate-600 transition-all hover-glow">
            <Edit3 size={18} />
          </button>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{USER_PROFILE.bio}</p>
        
        <div className="flex gap-2 mt-4 pb-4">
          {USER_PROFILE.badges.slice(0, 3).map((badge, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(`badge_detail_${badge.label.toLowerCase().replace(/\s+/g, '_')}`)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${badge.color.replace('text-', 'bg-').replace('border-', 'bg-opacity-10 ')} bg-opacity-5 hover:bg-opacity-15 hover:shadow-md hover:scale-105 transition-all cursor-pointer flex-1 justify-center group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-base filter drop-shadow-sm shrink-0 relative z-10">{badge.icon}</span>
              <div className="flex flex-col items-start min-w-0 flex-1 relative z-10">
                <span className="text-[10px] font-bold text-slate-900 leading-tight truncate w-full">{badge.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const DetailedStats = () => {
    const StatItem = ({ label, value, sub, onClick }) => (
      <button onClick={onClick} className="flex flex-col items-center justify-center p-3 bg-white/80 backdrop-blur-sm border border-cyan-200/50 rounded-xl hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-center group w-full relative overflow-hidden hover-glow">
        {/* Subtle gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/0 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="text-xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors relative z-10 font-mono">{value}</div>
        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider relative z-10">{label}</div>
        {sub && <div className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded relative z-10">{sub}</div>}
      </button>
    );

    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        <StatItem 
          label="Predictions" 
          value={USER_METRICS.predictions.total} 
          sub={`Top ${USER_METRICS.predictions.percentile}%`}
          onClick={() => onNavigate('list_predictions')}
        />
        <StatItem 
          label="Streak" 
          value={`${USER_METRICS.streak.days}d`} 
          sub={`Top ${USER_METRICS.streak.percentile}%`}
          onClick={() => {}}
        />
        <StatItem 
          label="Drivers" 
          value={USER_METRICS.contributions.drivers} 
          sub={`Top ${USER_METRICS.contributions.percentile}%`}
          onClick={() => onNavigate('list_drivers')}
        />
        <StatItem 
          label="Influence" 
          value={(USER_METRICS.influence.score / 1000).toFixed(1) + 'k'} 
          sub={`Top ${USER_METRICS.influence.percentile}%`}
          onClick={() => {}}
        />
      </div>
    );
  };

  const InsightCard = () => (
    <div className="mx-4 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative group cursor-pointer border border-cyan-200/50 hover:shadow-xl hover:border-cyan-300 transition-all hover-glow" onClick={() => onNavigate('ai_insight')}>
      {/* Background decoration container - clipped */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        {/* Grid background */}
        <div className="absolute inset-0 grid-background opacity-20" />
        
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Background decoration - AI bot */}
        <div className="absolute -right-8 -bottom-8 p-4 transform rotate-12 opacity-5">
          <Bot size={180} className="text-cyan-600" />
        </div>
        
        {/* Scan line effect */}
        <div className="scan-line absolute inset-0" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/40 via-transparent to-blue-50/30" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-cyan-100 rounded-xl border border-cyan-200 glow-effect pulse-glow">
               <Sparkles size={20} className="text-cyan-600" />
             </div>
             <span className="text-sm font-bold uppercase tracking-widest text-cyan-600 font-mono">PROBABLE AI INSIGHT</span>
           </div>
           <div className="flex items-center gap-1.5 text-[11px] text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 font-mono">
              <Clock size={12} /> Updated Today
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
        <div className="mt-4 flex items-center justify-end text-xs font-bold text-slate-500 group-hover:text-cyan-600 transition-colors gap-2 font-mono">
          Tap for Deep Analysis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 via-white to-gray-50 animate-in slide-in-from-right duration-300 relative overflow-y-auto pb-24 text-slate-900">
      {/* Ambient background effects */}
      <div className="fixed inset-0 grid-background opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl p-4 flex items-center justify-between border-b border-cyan-100/50 shadow-sm">
        <div className="flex items-center gap-2">
          <BrainCircuit size={18} className="text-cyan-600" />
          <span className="font-bold text-slate-900">Cognitive Engine</span>
        </div>
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
      <DetailedStats />
      <InsightCard />
      <div className="p-4 pt-0 space-y-6">
        <AccuracyTrendChart />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-cyan-600" />
              <h3 className="font-bold text-slate-900 text-sm">Activities</h3>
            </div>
            <span className="text-xs text-cyan-600 hover:text-cyan-700 cursor-pointer font-mono">View All</span>
          </div>
          <div className="space-y-2">
            <div className="bg-white/80 backdrop-blur-sm border border-cyan-200/50 p-3 rounded-lg flex items-center gap-3 hover:border-cyan-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center border border-cyan-200 group-hover:bg-cyan-200 transition-colors">
                <Target size={18} className="text-cyan-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">Made a prediction</div>
                <div className="text-xs text-slate-500 font-mono">"Will GPT-5 achieve AGI by Q4 2025?" • 2h ago</div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 p-3 rounded-lg flex items-center gap-3 hover:border-purple-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200 group-hover:bg-purple-200 transition-colors">
                <Lightbulb size={18} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">Added a driver</div>
                <div className="text-xs text-slate-500 font-mono">"Increased military movement observed..." • 5h ago</div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 p-3 rounded-lg flex items-center gap-3 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-200 transition-colors">
                <MessageSquare size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">Commented on prediction</div>
                <div className="text-xs text-slate-500 font-mono">"The probability is overstated..." • 1d ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGrowthView;

