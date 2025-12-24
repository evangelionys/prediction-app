import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, MoreHorizontal } from 'lucide-react';

const CommentCard = ({ comment }) => {
  const [liked, setLiked] = useState(false);
  
  return (
    <div className="p-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-slate-600">
            {comment.avatar}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{comment.user}</div>
            <div className="text-[10px] text-gray-400">{comment.time}</div>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
          comment.prediction === 'Yes' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
        }`}>
          Predicted: {comment.prediction}
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        {comment.text}
      </p>
      <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
        <button 
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1 transition-colors ${liked ? 'text-cyan-600' : 'hover:text-slate-600'}`}
        >
          <ThumbsUp size={14} /> {comment.likes + (liked ? 1 : 0)}
        </button>
        <button className="flex items-center gap-1 hover:text-slate-600 transition-colors">
          <MessageSquare size={14} /> Reply
        </button>
        <button className="ml-auto hover:text-slate-600 transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
};

export default CommentCard;

