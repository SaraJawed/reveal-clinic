import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, TabType } from '../../types';
import { Bot, Send, Sparkles, X, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react';

interface FloatingChatWidgetProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onChangeTab: (tab: TabType) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  messages,
  onSendMessage,
  onChangeTab,
  isOpen,
  onToggleOpen
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What are the clinic working hours?',
    'Book HydraFacial with Dr. Maha Al-Otaibi',
    'Post-laser care instructions',
    'Redeem rewards & special offers'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, loading]);

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
    <>
      {/* Floating Chatbot Launcher Button (anchored within the phone-width column, not the true viewport edge) */}
      <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
        <div className="relative max-w-md mx-auto h-0">
          <div className="absolute bottom-20 right-4 sm:bottom-6 sm:right-8 pointer-events-auto">
            <button
              type="button"
              id="floating-chatbot-trigger-btn"
              onClick={onToggleOpen}
              className="relative group flex items-center gap-2.5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl border border-sky-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Open AI Clinic Chatbot"
            >
              {/* Pulsing Aura */}
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 opacity-40 blur-xs group-hover:opacity-80 transition duration-300 animate-pulse" />

              <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>

              <div className="relative z-10 text-left hidden sm:block pr-1">
                <div className="text-xs font-extrabold text-white flex items-center gap-1 leading-tight">
                  AI Assistant <Sparkles className="w-3 h-3 text-sky-400" />
                </div>
                <div className="text-[10px] text-sky-200 font-medium leading-tight">Instant Guidance</div>
              </div>

              {/* Unread badge / pulse indicator */}
              <span className="relative z-10 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-900"></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Chatbot Mode (capped to the same phone-width column) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex justify-center animate-fade-in">
        <div className="w-full max-w-md h-full bg-white flex flex-col text-slate-800">
          {/* Header */}
          <div
            className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0 shadow-md"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="floating-chat-back-btn"
                onClick={onToggleOpen}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-2xl transition font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                title="Return to Application"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2">
                  Reveal AI Assistant
                </h3>
                <p className="text-[11px] text-slate-300">24/7 Clinical & Treatment Guidance</p>
              </div>
            </div>

            <button
              type="button"
              id="floating-chat-close-btn"
              onClick={onToggleOpen}
              className="p-2.5 text-slate-300 hover:text-white rounded-2xl hover:bg-slate-800 transition cursor-pointer"
              title="Close Chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick FAQ Prompts */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 px-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" /> FAQs:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                id={`floating-chat-prompt-${idx}`}
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium rounded-full border border-slate-200 shrink-0 transition shadow-xs cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 max-w-4xl mx-auto w-full">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-1 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 justify-start">
                <div className="w-8 h-8 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-3.5 rounded-3xl rounded-tl-none border border-slate-200 text-xs text-slate-500 flex items-center gap-2.5 shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Generating response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="max-w-4xl mx-auto flex items-center gap-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask AI about treatments, skincare, or doctor availability..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold focus:bg-white focus:border-blue-500 outline-hidden shadow-xs"
              />
              <button
                type="submit"
                id="floating-chat-send-btn"
                disabled={loading || !inputText.trim()}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold flex items-center gap-2 shadow-md shrink-0 transition cursor-pointer text-xs sm:text-sm"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        </div>
      )}
    </>
  );
};
