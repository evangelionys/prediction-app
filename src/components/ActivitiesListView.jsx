import React, { useState } from 'react';
import { ChevronLeft, Target, Lightbulb, MessageSquare, CheckCircle2, Plus } from 'lucide-react';
import { HISTORICAL_RECORDS } from '../App';

const ActivitiesListView = ({ onBack, initialTab = 'prediction' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activePredictionFilter, setActivePredictionFilter] = useState('predicted');

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 via-white to-gray-50 animate-in slide-in-from-right duration-300 relative overflow-y-auto text-slate-900">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200 shadow-sm">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-slate-900 text-lg">All Activities</span>
      </div>

      {/* Tab切换菜单 */}
      <div className="sticky top-[73px] z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 pt-4 pb-2">
        <div className="flex gap-2 bg-gray-100/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('prediction')}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'prediction'
                ? 'bg-white text-cyan-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Prediction
          </button>
          <button
            onClick={() => setActiveTab('contribution')}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'contribution'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Contribution
          </button>
          <button
            onClick={() => setActiveTab('interaction')}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'interaction'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Interaction
          </button>
        </div>
      </div>

      {/* 活动列表内容 */}
      <div className="p-4">
        {/* Prediction Activities */}
        {activeTab === 'prediction' && (
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
                return filteredRecords.map((record) => (
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
        {activeTab === 'contribution' && (
          <div className="space-y-2">
            {HISTORICAL_RECORDS.contributions.map((record) => (
              <div 
                key={record.id} 
                className="bg-white/80 backdrop-blur-sm border border-purple-200/50 p-3 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group"
              >
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
        {activeTab === 'interaction' && (
          <div className="space-y-2">
            {HISTORICAL_RECORDS.interactions.map((record) => (
              <div 
                key={record.id} 
                className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 p-3 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all group"
              >
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
  );
};

export default ActivitiesListView;

