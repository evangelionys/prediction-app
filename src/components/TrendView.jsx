import React, { useState, useEffect } from 'react';
import { Trophy, Lightbulb, Target, ChevronDown, User, ArrowUpRight, Medal, Crown, Bot, Calendar } from 'lucide-react';
import { LEADERBOARD_DATA, USER_PROFILE } from '../App';

const TrendView = ({ onUserClick, onMomentumClick }) => {
  const [activeTab, setActiveTab] = useState('influence');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('This Month');

  const categories = ['All', 'Business', 'Politics', 'Tech'];
  
  // 时间筛选选项
  const timeFilters = {
    influence: ['This Month', 'Last Month', '2 Months Ago', '3 Months Ago'],
    accuracy: ['This Month', 'Last Month', '2 Months Ago', '3 Months Ago'],
    momentum: ['This Week', 'Last Week', '2 Weeks Ago', '3 Weeks Ago']
  };

  // 当切换tab时，更新时间筛选
  useEffect(() => {
    if (activeTab === 'momentum') {
      setTimeFilter('This Week');
    } else {
      setTimeFilter('This Month');
    }
  }, [activeTab]);

  // 影响力榜组件
  const InfluenceLeaderboard = () => {
    const data = LEADERBOARD_DATA.influence
      .filter(item => categoryFilter === 'All' || item.category === categoryFilter)
      .sort((a, b) => b.score - a.score);
    
    // 找到当前用户的排名
    const userScore = LEADERBOARD_DATA.currentUser?.influence?.score || 0;
    const userRank = data.findIndex(item => item.score < userScore) + 1;
    const finalUserRank = userRank === 0 ? data.length + 1 : userRank;
    
    const displayData = data.slice(0, 20);

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
                    <div className="text-xs text-slate-500">
                      {item.drivers} drivers • {item.opportunities} opportunities
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
              <div className="font-bold text-sm text-slate-900">You</div>
              <div className="text-xs text-slate-500 truncate">{USER_PROFILE.name}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-cyan-600">{userScore}</div>
              <div className="text-[10px] text-slate-400">Rank #{finalUserRank}</div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-2 ml-[52px]">
            {LEADERBOARD_DATA.currentUser?.influence?.drivers || 0} drivers • {LEADERBOARD_DATA.currentUser?.influence?.opportunities || 0} opportunities
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

    const displayData = sortedData.slice(0, 20);

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
              <div className="font-bold text-sm text-slate-900">You</div>
              <div className="text-xs text-slate-500 truncate">{USER_PROFILE.name}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-emerald-600">{userData.accuracy}%</div>
              <div className="text-[10px] text-slate-400">Rank #{finalUserRank}</div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-2 ml-[52px]">
            {userData.correctPredictions} correct / {userData.totalPredictions} total
          </div>
        </div>
      </>
    );
  };

  // Momentum榜组件
  const MomentumLeaderboard = () => {
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

  return (
    <div className="flex flex-col h-full bg-gray-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-slate-900 mb-3">Trend</h1>
          
          {/* Tab切换 */}
          <div className="flex gap-2 mb-3">
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
          </div>

          {/* 分类筛选和时间筛选 - 同一行 */}
          <div className="flex items-center gap-2">
            {/* 分类筛选 - 平铺按钮 */}
            <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-normal whitespace-nowrap transition-all ${
                    categoryFilter === cat
                      ? 'bg-gray-100 text-slate-700'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 时间筛选 - 下拉框 */}
            <div className="relative shrink-0">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-2 py-0.5 pr-6 bg-transparent border-0 rounded text-[11px] font-normal text-slate-400 appearance-none cursor-pointer hover:text-slate-600 transition-colors focus:outline-none"
              >
                {timeFilters[activeTab].map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'influence' && <InfluenceLeaderboard />}
        {activeTab === 'accuracy' && <AccuracyLeaderboard />}
        {activeTab === 'momentum' && <MomentumLeaderboard />}
      </div>
    </div>
  );
};

export default TrendView;
