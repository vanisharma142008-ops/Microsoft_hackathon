import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, ArrowRight, CornerDownLeft, Loader2, ShieldAlert } from 'lucide-react';
import { ChatMessage } from '../types/travel';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickClick = (text: string) => {
    if (isLoading) return;
    onSendMessage(text);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Conversational Travel Agent
            </h3>
            <p className="text-[11px] text-slate-400">Contextual multi-turn dialogue & adaptive re-planning</p>
          </div>
        </div>

        <div className="text-[10px] font-mono bg-slate-800/80 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
          Stateful Memory: Active
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent' || msg.sender === 'system';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAgent ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAgent
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  isAgent
                    ? 'bg-slate-950/90 text-slate-200 border border-slate-800'
                    : 'bg-indigo-600 text-white font-medium'
                }`}
              >
                {/* Text body with markdown-like formatting */}
                <div className="space-y-1.5 whitespace-pre-line">{msg.text}</div>

                {/* Inline Quick Replies if provided */}
                {isAgent && msg.suggestedQuickReplies && msg.suggestedQuickReplies.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.suggestedQuickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickClick(reply)}
                        disabled={isLoading}
                        className="bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-800 hover:border-amber-500/40 px-2.5 py-1 rounded-lg text-[11px] transition text-left flex items-center gap-1"
                      >
                        <span>{reply}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-amber-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Researching live APIs & validating constraints...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-950/80">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder='e.g. "Reduce my budget to ₹35,000" or "Make it more relaxed"'
            className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl pl-3.5 pr-20 py-2.5 text-xs border border-slate-800 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
          >
            <span>Send</span>
            <Send className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>Natural language intent • Bounded allowlisted tool calls</span>
          <span className="hidden sm:inline">Press Enter ↵</span>
        </div>
      </form>
    </div>
  );
};
