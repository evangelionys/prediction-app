import React from 'react';
import { ChevronLeft, UserPlus, UserCheck, Users } from 'lucide-react';

const FollowersFollowingListView = ({ userId, type, onBack, onUserClick }) => {
  // 模拟数据 - 实际应该从API获取
  // isMutualFollowing: true 表示双向关注（互相关注）
  const mockFollowers = [
    { id: 'user1', name: 'Alex Chen', avatar: 'AC', bio: 'Tech enthusiast. Focused on AI and hardware innovation.', isFollowing: false, isMutualFollowing: false },
    { id: 'user2', name: 'Sarah Kim', avatar: 'SK', bio: 'Business analyst. Expert in market trends and financial predictions.', isFollowing: true, isMutualFollowing: true },
    { id: 'user3', name: 'Mike Johnson', avatar: 'MJ', bio: 'Political analyst. Tracking global geopolitical developments.', isFollowing: false, isMutualFollowing: false },
    { id: 'user4', name: 'Emma Wilson', avatar: 'EW', bio: 'Investment strategist. Specializing in emerging markets and tech stocks.', isFollowing: true, isMutualFollowing: false },
    { id: 'user5', name: 'David Lee', avatar: 'DL', bio: 'Data scientist. Building predictive models for financial markets.', isFollowing: false, isMutualFollowing: false },
    { id: 'user6', name: 'Lisa Zhang', avatar: 'LZ', bio: 'Crypto researcher. Analyzing blockchain trends and DeFi protocols.', isFollowing: true, isMutualFollowing: true },
  ];

  const mockFollowing = [
    { id: 'user1', name: 'Alex Chen', avatar: 'AC', bio: 'Tech enthusiast. Focused on AI and hardware innovation.', isFollowing: true, isMutualFollowing: false },
    { id: 'user2', name: 'Sarah Kim', avatar: 'SK', bio: 'Business analyst. Expert in market trends and financial predictions.', isFollowing: true, isMutualFollowing: true },
    { id: 'user3', name: 'Mike Johnson', avatar: 'MJ', bio: 'Political analyst. Tracking global geopolitical developments.', isFollowing: true, isMutualFollowing: false },
    { id: 'user7', name: 'Tom Brown', avatar: 'TB', bio: 'Macro economist. Forecasting global economic trends and policy impacts.', isFollowing: true, isMutualFollowing: true },
    { id: 'user8', name: 'Anna White', avatar: 'AW', bio: 'Tech journalist. Covering Silicon Valley and startup ecosystem.', isFollowing: true, isMutualFollowing: false },
  ];

  const users = type === 'followers' ? mockFollowers : mockFollowing;
  const title = type === 'followers' ? 'Followers' : 'Following';

  const handleUserClick = (user) => {
    if (onUserClick) {
      onUserClick(user.id);
    }
  };

  const handleFollowToggle = (e, user) => {
    e.stopPropagation();
    // 实际应该调用API更新关注状态
    console.log(`Toggle follow for ${user.id}`);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 via-white to-gray-50 animate-in slide-in-from-right duration-300 relative overflow-y-auto pb-24 text-slate-900">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">{title}</span>
      </div>
      
      <div className="p-4">
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/50 p-4 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-lg font-bold border-2 border-white shadow-md shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-slate-900 mb-1 truncate">{user.name}</div>
                    {user.bio && (
                      <div className="text-sm text-slate-600 leading-relaxed line-clamp-2">{user.bio}</div>
                    )}
                  </div>
                </div>
                {type === 'followers' && (
                  <button
                    onClick={(e) => handleFollowToggle(e, user)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shrink-0 ${
                      user.isMutualFollowing
                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100'
                        : user.isFollowing
                        ? 'bg-gray-100 text-slate-700 border border-gray-200 hover:bg-gray-200'
                        : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-md'
                    }`}
                  >
                    {user.isMutualFollowing ? (
                      <span className="flex items-center gap-1.5">
                        <Users size={16} />
                        Mutual
                      </span>
                    ) : user.isFollowing ? (
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
                {type === 'following' && (
                  <button
                    onClick={(e) => handleFollowToggle(e, user)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shrink-0 ${
                      user.isMutualFollowing
                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100'
                        : 'bg-gray-100 text-slate-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {user.isMutualFollowing ? (
                      <span className="flex items-center gap-1.5">
                        <Users size={16} />
                        Mutual
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <UserCheck size={16} />
                        Following
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowingListView;
