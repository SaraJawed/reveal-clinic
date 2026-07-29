import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, TabType } from '../../types';
import { Bot, Send, Sparkles, User, RefreshCw, ChevronRight } from 'lucide-react';

interface AIChatBotProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onChangeTab: (tab: TabType) => void;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({
  messages,
  onSendMessage,
  onChangeTab
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What are the clinic working hours?',
    'How do I book HydraFacial with Dr. Fatima Al-Zahrani?',
    'What packages are available for skin rejuvenation?',
    'Post-laser care instructions for sensitive skin',
    'How do I earn and redeem loyalty points?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    setInputText('');
    setLoading(true);
    try {
      await onSendMessage(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[82vh] md:h-[86vh] bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-300 flex items-center justify-center text-slate-950 shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              Reveal AI Assistant
            </h2>
            <p className="text-[11px] text-slate-300">24/7 Skin Care, Treatments & Clinic Guidance</p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-500" /> FAQ Prompts:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            id={`chat-prompt-pill-${idx}`}
            onClick={() => handleSend(p)}
            className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium rounded-full border border-slate-200 shrink-0 transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-normal'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-[9px] text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                Me
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Reveal AI is generating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Reveal Assistant about skin treatments, doctors or bookings..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-hidden"
        />
        <button
          type="submit"
          id="chat-send-btn"
          disabled={loading || !inputText.trim()}
          className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
