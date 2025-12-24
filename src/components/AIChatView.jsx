import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Bot, Send, Loader2, Sparkles, Lightbulb, Target, Clock, History } from 'lucide-react';
import { callGemini } from '../App';

const AIChatView = ({ onBack, questionTitle, initialContext = "", onAddDriverFromAI, isAIInsight = false }) => {
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

  const [messages, setMessages] = useState(
    isAIInsight 
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const systemInstruction = `You are a helpful AI assistant analyzing predictions. Be concise and insightful.`;
      const response = await callGemini(input, systemInstruction);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          {isAIInsight ? (
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          if (isAIInsight && msg.role === 'assistant' && msg.type) {
            // AI Insight定制化卡片样式
            const isBehavioralPattern = msg.type === 'behavioral-pattern';
            return (
              <div key={idx} className="flex justify-start">
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
          
          // 普通消息样式
          return (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-slate-900'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {typeof msg.content === 'string' ? msg.content : msg.content?.description || msg.content?.title}
                </p>
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
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isAIInsight ? "Ask follow-up questions about AI Insight" : "Ask a question..."}
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

