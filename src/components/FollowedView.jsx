import React, { useState } from 'react';
import { Heart, Lightbulb, Target, TrendingUp, TrendingDown, MessageSquare, User, ArrowRight, Clock } from 'lucide-react';
import { FOLLOWED_PREDICTIONS, FOLLOWED_USERS, MOCK_CARDS } from '../App';

const FollowedView = ({ onCardClick, onUserClick }) => {
  const [activeTab, setActiveTab] = useState('predictions');

  // 关注的预测题更新卡片
  const FollowedPredictionCard = ({ item }) => {
    const getUpdateIcon = () => {
      if (item.updateType === 'driver') return <Lightbulb size={16} className="text-purple-600" />;
      if (item.updateType === 'opportunity') return <Target size={16} className="text-blue-600" />;
      if (item.updateType === 'vote_change') return <TrendingUp size={16} className="text-emerald-600" />;
      return null;
    };

    const getUpdateColor = () => {
      if (item.updateType === 'driver') return 'border-purple-200 bg-purple-50/30';
      if (item.updateType === 'opportunity') return 'border-blue-200 bg-blue-50/30';
      if (item.updateType === 'vote_change') return 'border-emerald-200 bg-emerald-50/30';
      return 'border-gray-200';
    };

    const getUpdateLabel = () => {
      if (item.updateType === 'driver') return 'New Driver';
      if (item.updateType === 'opportunity') return 'New Opportunity';
      if (item.updateType === 'vote_change') return 'Vote Shift';
      return 'Update';
    };

    return (
      <div 
        className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          // 找到完整的预测题数据
          const fullPrediction = MOCK_CARDS.find(c => c.id === item.prediction.id) || item.prediction;
          onCardClick && onCardClick(fullPrediction);
        }}
      >
        {/* 预测题信息 - 上方模块 */}
        <div className={`min-h-[6rem] w-full bg-gradient-to-r ${item.prediction.imageGradient} relative p-4 flex flex-col justify-end`}>
          <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
          <span className="relative z-10 bg-black/40 backdrop-blur-sm text-xs font-medium text-white px-2 py-1 rounded-md w-fit mb-2 border border-white/10">
            {item.prediction.category}
          </span>
          <h3 className="relative z-10 text-white font-bold text-sm leading-relaxed line-clamp-2 drop-shadow-md min-h-[2.8rem] pr-2">
            {item.prediction.question}
          </h3>
        </div>

        {/* 最新动态 - 下方模块 */}
        <div className={`p-4 border-t-2 ${getUpdateColor()}`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg border shrink-0 ${
              item.updateType === 'driver' 
                ? 'bg-purple-100 border-purple-200' 
                : item.updateType === 'opportunity'
                ? 'bg-blue-100 border-blue-200'
                : 'bg-emerald-100 border-emerald-200'
            }`}>
              {getUpdateIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-700">{getUpdateLabel()}</span>
                <span className="text-[10px] text-slate-400 font-mono">{item.timeAgo}</span>
              </div>
              {item.updateType === 'driver' && (
                <div>
                  <p className="text-sm text-slate-900 font-medium mb-1">{item.driverTitle}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.driverContent}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span>{item.votes} votes</span>
                    <span>•</span>
                    <span>{item.contributorName}</span>
                  </div>
                </div>
              )}
              {item.updateType === 'opportunity' && (
                <div>
                  <p className="text-sm text-slate-900 font-medium mb-1">{item.opportunityTitle}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.opportunityContent}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span>{item.votes} votes</span>
                    <span>•</span>
                    <span>{item.contributorName}</span>
                  </div>
                </div>
              )}
              {item.updateType === 'vote_change' && (
                <div>
                  <p className="text-sm text-slate-900 font-medium mb-2">Significant vote shift detected</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      {item.changeDirection === 'up' ? (
                        <TrendingUp size={14} className="text-emerald-600" />
                      ) : (
                        <TrendingDown size={14} className="text-rose-600" />
                      )}
                      <span className="text-xs font-bold text-slate-700">
                        {item.changeDirection === 'up' ? '+' : '-'}{item.changePercentage}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.newStats.yes}% Yes / {item.newStats.no}% No
                    </div>
                  </div>
                </div>
              )}
            </div>
            <ArrowRight size={16} className="text-slate-400 shrink-0 mt-1" />
          </div>
        </div>
      </div>
    );
  };

  // 关注的用户动态卡片
  const FollowedUserActivityCard = ({ item }) => {
    const getActivityIcon = () => {
      if (item.activityType === 'new_driver') return <Lightbulb size={16} className="text-purple-600" />;
      if (item.activityType === 'new_opportunity') return <Target size={16} className="text-blue-600" />;
      if (item.activityType === 'prediction') return <TrendingUp size={16} className="text-cyan-600" />;
      if (item.activityType === 'comment') return <MessageSquare size={16} className="text-emerald-600" />;
      return null;
    };

    const getActivityLabel = () => {
      if (item.activityType === 'new_driver') return 'added a new driver';
      if (item.activityType === 'new_opportunity') return 'added a new opportunity';
      if (item.activityType === 'prediction') return 'made a prediction';
      if (item.activityType === 'comment') return 'commented on';
      return 'updated';
    };

    const getActivityColor = () => {
      if (item.activityType === 'new_driver') return 'bg-purple-100 border-purple-200';
      if (item.activityType === 'new_opportunity') return 'bg-blue-100 border-blue-200';
      if (item.activityType === 'prediction') return 'bg-cyan-100 border-cyan-200';
      if (item.activityType === 'comment') return 'bg-emerald-100 border-emerald-200';
      return 'bg-gray-100 border-gray-200';
    };

    return (
      <div 
        className="bg-white rounded-xl border border-gray-200 mb-4 p-4 hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          if (item.prediction) {
            // 找到完整的预测题数据
            const fullPrediction = MOCK_CARDS.find(c => c.id === item.prediction.id) || item.prediction;
            onCardClick && onCardClick(fullPrediction);
          }
        }}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUserClick && onUserClick(item.userId);
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-md shrink-0 hover:scale-105 transition-transform"
          >
            {item.userAvatar}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUserClick && onUserClick(item.userId);
                }}
                className="font-bold text-sm text-slate-900 hover:text-cyan-600 transition-colors"
              >
                {item.userName}
              </button>
              <span className="text-xs text-slate-500">{getActivityLabel()}</span>
              <span className="text-[10px] text-slate-400 font-mono">{item.timeAgo}</span>
            </div>
            
            {/* 活动内容 */}
            <div className={`p-3 rounded-lg border mb-2 ${getActivityColor()}`}>
              <div className="flex items-start gap-2">
                <div className="shrink-0 mt-0.5">
                  {getActivityIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  {item.activityType === 'new_driver' && (
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-1">{item.driverTitle}</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.driverContent}</p>
                    </div>
                  )}
                  {item.activityType === 'new_opportunity' && (
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-1">{item.opportunityTitle}</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.opportunityContent}</p>
                    </div>
                  )}
                  {item.activityType === 'prediction' && (
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-1">
                        Predicted: <span className={item.predictionValue === 'yes' ? 'text-cyan-600' : 'text-rose-600'}>
                          {item.predictionValue.toUpperCase()}
                        </span>
                      </p>
                      {item.predictionReason && (
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">{item.predictionReason}</p>
                      )}
                    </div>
                  )}
                  {item.activityType === 'comment' && (
                    <div>
                      <p className="text-sm text-slate-900 line-clamp-3">{item.commentContent}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 相关预测题 */}
            {item.prediction && (
              <div 
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick && onCardClick(item.prediction);
                }}
              >
                <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${item.prediction.imageGradient}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.prediction.question}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.prediction.category}</p>
                </div>
                <ArrowRight size={12} className="text-slate-400 shrink-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-slate-900 mb-3">Followed</h1>
          
          {/* Tab切换 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('predictions')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'predictions'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Predictions
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Users
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'predictions' && (
          <div>
            {FOLLOWED_PREDICTIONS.map((item) => (
              <FollowedPredictionCard key={item.id} item={item} />
            ))}
            {FOLLOWED_PREDICTIONS.length === 0 && (
              <div className="text-center py-12">
                <Heart size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No followed predictions yet</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div>
            {FOLLOWED_USERS.map((item) => (
              <FollowedUserActivityCard key={item.id} item={item} />
            ))}
            {FOLLOWED_USERS.length === 0 && (
              <div className="text-center py-12">
                <User size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No followed users yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedView;

