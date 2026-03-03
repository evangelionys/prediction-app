import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Bot, Send, Loader2, Sparkles, Lightbulb, Target, Clock, History, ArrowRight } from 'lucide-react';
import { callGemini, MOCK_CARDS } from '../App';

const AIChatView = ({ onBack, questionTitle, initialContext = "", onAddDriverFromAI, isAIInsight = false, isAIAnalyst = false, userPredictionAnalysis = null, onPredictionClick = null }) => {
  // AI Insight的初始消息
  const aiInsightInitialMessages = [
    {
      role: 'assistant',
      type: 'behavioral-pattern',
      content: {
        title: 'Behavioral Pattern',
        description: 'Your accuracy in Tech hardware is elite, but you consistently underestimate political tail risks. This pattern suggests you excel in domains with clear technical metrics but struggle with complex geopolitical dynamics where multiple variables interact unpredictably.'
      }
    },
    {
      role: 'assistant',
      type: 'exclusive-opportunity',
      content: {
        title: 'Exclusive Opportunity',
        description: 'A new SpaceX contract prediction matches your strengths perfectly (+85% Match). Based on your historical performance in tech hardware predictions, this opportunity aligns with your demonstrated expertise in technical analysis and market dynamics.'
      }
    }
  ];

  // AI分析师的初始消息
  const getAIAnalystInitialMessage = () => {
    if (!userPredictionAnalysis) {
      return {
        role: 'assistant',
        content: "I'm your AI Insight. I analyze your prediction behavior and platform data to surface insights and recommendations.",
        isInitial: true
      };
    }
    
    const strengthCategory = userPredictionAnalysis.strength?.category === 'Other' ? 'Stocks & Indexes' : (userPredictionAnalysis.strength?.category || '');
    const strengthText = userPredictionAnalysis.strength && strengthCategory
      ? userPredictionAnalysis.strength.total >= 5
        ? (() => {
            return `**Strength: ${strengthCategory}**\n${strengthCategory} is your strongest area.\n${userPredictionAnalysis.strength.accuracy.toFixed(0)}% accuracy, outperforming the platform average (${userPredictionAnalysis.averageAccuracy.toFixed(0)}%).`;
          })()
        : `**Strength: ${strengthCategory}**\n${strengthCategory} is your strongest area.\n60% accuracy, outperforming the platform average (35%).`
      : '';
    
    const blindSpotCategory = userPredictionAnalysis.blindSpot?.category || '';
    const blindSpotText = userPredictionAnalysis.blindSpot
      ? userPredictionAnalysis.blindSpot.isRecommended
        ? `**Blind Spot: ${blindSpotCategory}**\n${blindSpotCategory} is underrepresented in your predictions.`
        : (() => {
            return `**Blind Spot: ${blindSpotCategory}**\n${blindSpotCategory} is underrepresented in your predictions.\n${userPredictionAnalysis.blindSpot.accuracy.toFixed(0)}% accuracy, below the platform average (${userPredictionAnalysis.averageAccuracy.toFixed(0)}%).`;
          })()
      : '';
    
    return {
      role: 'assistant',
      content: `I'm your AI Insight. I analyze your prediction behavior and platform data to surface insights and recommendations.\n\n${strengthText}${strengthText && blindSpotText ? '\n\n' : ''}${blindSpotText}`,
      isInitial: true
    };
  };

  const [messages, setMessages] = useState(
    isAIAnalyst
      ? [getAIAnalystInitialMessage()]
      : isAIInsight 
      ? aiInsightInitialMessages
      : [
          {
            role: 'assistant',
            content: initialContext || `I'm here to help you analyze "${questionTitle}". What would you like to know?`
          }
        ]
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestedReplies, setShowSuggestedReplies] = useState(isAIAnalyst);
  const messagesEndRef = useRef(null);

  // AI Insight历史记录（近3天）
  const historyRecords = [
    {
      date: 'Today',
      insights: [
        { type: 'behavioral-pattern', title: 'Behavioral Pattern', summary: 'Tech hardware accuracy elite, political risks underestimated' },
        { type: 'exclusive-opportunity', title: 'Exclusive Opportunity', summary: 'SpaceX contract prediction matches strengths (+85%)' }
      ]
    },
    {
      date: 'Yesterday',
      insights: [
        { type: 'behavioral-pattern', title: 'Behavioral Pattern', summary: 'Strong performance in quantitative predictions' },
        { type: 'exclusive-opportunity', title: 'Exclusive Opportunity', summary: 'AI sector growth prediction opportunity' }
      ]
    },
    {
      date: '2 days ago',
      insights: [
        { type: 'behavioral-pattern', title: 'Behavioral Pattern', summary: 'Consistent accuracy in tech domain' },
        { type: 'exclusive-opportunity', title: 'Exclusive Opportunity', summary: 'Semiconductor market prediction match' }
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 点击外部关闭历史记录
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHistory && !event.target.closest('.history-container')) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHistory]);

  // 根据用户提问生成合理的模拟响应（demo模式）
  const generateMockResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // 推荐预测题相关
    if (message.includes('strengthen') || message.includes('strength') || message.includes('recommend') && message.includes('strength')) {
      const filtered = (MOCK_CARDS || []).filter(card => card.status !== 'closed').slice(0, 3);
      if (filtered.length > 0) {
        const categoryName = userPredictionAnalysis?.strength?.category === 'Other' ? 'Stocks & Indexes' : (userPredictionAnalysis?.strength?.category || 'your strengths');
        return {
          text: `Based on ${categoryName}, here are 3 recommended predictions:`,
          predictions: filtered
        };
      }
    }
    
    if (message.includes('blind spot') || message.includes('challenge') || message.includes('recommend') && message.includes('blind')) {
      const filtered = (MOCK_CARDS || []).filter(card => card.status !== 'closed').slice(0, 3);
      if (filtered.length > 0) {
        const categoryName = userPredictionAnalysis?.blindSpot?.category || 'your blind spots';
        return {
          text: `Based on ${categoryName}, here are 3 recommended predictions:`,
          predictions: filtered
        };
      }
    }
    
    // 准确率相关
    if (message.includes('accuracy') || message.includes('准确率') || message.includes('正确率')) {
      const accuracy = userPredictionAnalysis?.averageAccuracy || 60;
      return `Your current accuracy is ${accuracy.toFixed(1)}%, which is ${accuracy > 50 ? 'above' : 'below'} the platform average. Keep making thoughtful predictions to improve!`;
    }
    
    // 预测数量相关
    if (message.includes('how many') || message.includes('多少') || message.includes('数量')) {
      const total = userPredictionAnalysis?.totalPredictions || 30;
      const settled = userPredictionAnalysis?.settledCount || 15;
      return `You've made ${total} predictions in total, with ${settled} already settled. Your participation is helping build a more accurate collective intelligence.`;
    }
    
    // 优势/盲区相关
    if (message.includes('strength') || message.includes('优势') || message.includes('excel')) {
      const strength = userPredictionAnalysis?.strength;
      if (strength) {
        const categoryName = strength.category === 'Other' ? 'Stocks & Indexes' : strength.category;
        return `You excel in ${categoryName} with ${strength.accuracy.toFixed(1)}% accuracy. This is ${(strength.accuracy - (userPredictionAnalysis?.averageAccuracy || 50)).toFixed(1)}% higher than your average. Consider exploring more predictions in this area to leverage your expertise.`;
      }
      return `Based on your prediction history, you show strong performance in certain categories. Keep making predictions to unlock more detailed insights about your strengths.`;
    }
    
    if (message.includes('blind spot') || message.includes('盲区') || message.includes('weakness') || message.includes('improve')) {
      const blindSpot = userPredictionAnalysis?.blindSpot;
      if (blindSpot) {
        if (blindSpot.isRecommended) {
          return `Consider exploring ${blindSpot.category} more. You have fewer predictions in this area, which could be a great opportunity to diversify your prediction portfolio and discover new insights.`;
        } else {
          return `Your accuracy in ${blindSpot.category} is ${blindSpot.accuracy.toFixed(1)}%, which is below your average. Try analyzing more predictions in this category to understand the patterns better and improve your performance.`;
        }
      }
      return `Based on your prediction patterns, there are areas where you could expand your coverage. Making more diverse predictions will help you identify and address potential blind spots.`;
    }
    
    // 趋势相关
    if (message.includes('trend') || message.includes('趋势') || message.includes('pattern')) {
      return `Your prediction patterns show consistent engagement across multiple categories. Over time, you've developed a balanced approach to different types of predictions. Continue exploring new areas to maintain this diversity.`;
    }
    
    // 建议相关
    if (message.includes('advice') || message.includes('建议') || message.includes('suggestion') || message.includes('help')) {
      return `Here are some tips to improve your prediction accuracy:\n\n1. **Diversify your predictions**: Explore different categories to build a well-rounded understanding.\n2. **Review settled predictions**: Learn from past outcomes to refine your judgment.\n3. **Engage with reasoning**: Read other users' reasoning to gain new perspectives.\n4. **Track your patterns**: Use insights like this to identify areas for growth.`;
    }
    
    // 默认响应
    return `I understand you're asking about "${userMessage}". Based on your prediction history, I can help you understand your performance patterns, identify strengths and blind spots, and recommend predictions that match your expertise. What specific aspect would you like to explore?`;
  };

  const handleSend = async (customMessage = null) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim() || loading) return;

    const userMessage = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowSuggestedReplies(false); // 用户发起会话后，隐藏推荐回复

    try {
      // 等待5秒显示加载态
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Demo模式：使用模拟响应
      let response = generateMockResponse(messageToSend);
      
      // 如果模拟响应是对象（包含predictions），保存完整信息
      if (typeof response === 'object' && response.predictions) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.text, predictions: response.predictions }]);
      } else if (typeof response === 'string' && response.trim()) {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      // 如果出错，使用模拟响应
      const mockResponse = generateMockResponse(messageToSend);
      if (typeof mockResponse === 'object' && mockResponse.predictions) {
        setMessages(prev => [...prev, { role: 'assistant', content: mockResponse.text, predictions: mockResponse.predictions }]);
      } else if (typeof mockResponse === 'string') {
        setMessages(prev => [...prev, { role: 'assistant', content: mockResponse }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedReply = (reply, type) => {
    // 点击按钮后，代替用户输入对应指令
    handleSend(reply);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          {(isAIAnalyst || isAIInsight) ? (
            <>
              <div className="p-1.5 bg-cyan-100 rounded-lg border border-cyan-200">
                <Sparkles size={18} className="text-cyan-600" />
              </div>
              <span className="font-semibold text-slate-900">AI Insight</span>
            </>
          ) : (
            <>
              <Bot size={20} className="text-cyan-600" />
              <span className="font-semibold text-slate-900">AI Assistant</span>
            </>
          )}
        </div>
        {isAIInsight && (
          <div className="relative history-container">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-gray-100 text-slate-600"
            >
              <History size={20} />
            </button>
            {showHistory && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-30 history-container">
                <div className="text-xs font-bold text-slate-500 uppercase mb-3">History (Last 3 Days)</div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {historyRecords.map((record, idx) => (
                    <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <div className="text-xs font-bold text-slate-700 mb-2">{record.date}</div>
                      <div className="space-y-2">
                        {record.insights.map((insight, i) => (
                          <div key={i} className="text-xs text-slate-600">
                            <div className="font-semibold text-slate-800 mb-0.5">{insight.title}</div>
                            <div className="text-slate-500">{insight.summary}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, idx) => {
          if (isAIInsight && msg.role === 'assistant' && msg.type) {
            // AI Insight定制化卡片样式
            const isBehavioralPattern = msg.type === 'behavioral-pattern';
            return (
              <div key={idx} className="flex justify-start p-4">
                <div className="max-w-[90%] bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-cyan-200/50 relative">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 grid-background opacity-20" />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg border shrink-0 h-fit ${
                        isBehavioralPattern 
                          ? 'bg-yellow-100 border-yellow-200' 
                          : 'bg-emerald-100 border-emerald-200'
                      }`}>
                        {isBehavioralPattern ? (
                          <Lightbulb size={18} className="text-yellow-600" />
                        ) : (
                          <Target size={18} className="text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">{msg.content.title}</div>
                        <p className="text-sm leading-relaxed text-slate-700 font-medium whitespace-normal break-words">
                          {msg.content.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          
          // AI Analyst初始消息 - 全屏样式
          if (isAIAnalyst && msg.isInitial && msg.role === 'assistant') {
            const content = typeof msg.content === 'string' ? msg.content : msg.content?.description || msg.content?.title || '';
            const parts = content.split(/\n\n/);
            const intro = parts[0];
            const strengthPart = parts.find(p => p.includes('**Strength:'));
            const blindSpotPart = parts.find(p => p.includes('**Blind Spot:'));
            
            return (
              <div key={idx} className="p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-base leading-relaxed text-slate-700">
                    {intro}
                  </p>
                </div>
                
                {strengthPart && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb size={16} className="text-emerald-600" />
                      <h3 className="text-sm font-bold text-emerald-600">Strength</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line pl-6">
                      {strengthPart.replace(/\*\*Strength: (.*?)\*\*\n/, '')}
                    </p>
                  </div>
                )}
                
                {blindSpotPart && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-rose-600" />
                      <h3 className="text-sm font-bold text-rose-600">Blind Spot</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line pl-6">
                      {blindSpotPart.replace(/\*\*Blind Spot: (.*?)\*\*\n/, '')}
                    </p>
                  </div>
                )}
              </div>
            );
          }
          
          // 普通消息样式
          const content = typeof msg.content === 'string' ? msg.content : msg.content?.description || msg.content?.title || '';
          const hasPredictions = msg.predictions && Array.isArray(msg.predictions) && msg.predictions.length > 0;
          
          return (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} p-4`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-slate-900'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {content}
                </p>
                {/* 如果有推荐的预测题，显示为可点击的列表 */}
                {hasPredictions && msg.role === 'assistant' && (
                  <div className="mt-4 space-y-2">
                    {msg.predictions.map((prediction, predIdx) => (
                      <div
                        key={prediction.id || predIdx}
                        onClick={() => {
                          if (onPredictionClick) {
                            onPredictionClick(prediction);
                          }
                        }}
                        className="bg-white/80 border border-gray-300 rounded-lg p-3 hover:bg-white hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-cyan-600 mt-0.5">{predIdx + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 leading-relaxed">
                              {prediction.question}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                              <span>{prediction.category}</span>
                              <span>•</span>
                              <span>{prediction.followers} followers</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
        
        {/* 推荐回复 - 放在初始消息后面 */}
        {showSuggestedReplies && isAIAnalyst && messages.length === 1 && (
          <div className="px-6 pb-4 space-y-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSuggestedReply("Recommend predictions that match my strengths", 'strength')}
                className="text-left px-4 py-2.5 bg-cyan-50 border border-cyan-200 rounded-lg text-sm text-slate-700 hover:bg-cyan-100 hover:border-cyan-300 transition-all"
              >
                Strengthen my edge
              </button>
              <button
                onClick={() => handleSuggestedReply("Recommend predictions in my blind spot areas", 'blindSpot')}
                className="text-left px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-sm text-slate-700 hover:bg-rose-100 hover:border-rose-300 transition-all"
              >
                Challenge my blind spots
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isAIAnalyst ? "Ask about your predictions..." : isAIInsight ? "Ask follow-up questions about AI Insight" : "Ask a question..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;

