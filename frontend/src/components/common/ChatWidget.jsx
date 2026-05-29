import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/api';
import { FiSend, FiX, FiMinus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hey! I'm Dieto 🥦, your AI nutrition buddy. Ask me anything about food, fitness, or health!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (isOpen) { setUnread(0); inputRef.current?.focus(); } }, [isOpen]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await sendChatMessage(msg);
      setMessages(prev => [...prev, { role: 'ai', content: data.data.response }]);
      if (!isOpen || isMinimized) setUnread(prev => prev + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: "Oops! I'm having trouble right now. Try again in a moment!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div className={`w-[360px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slide-up ${isMinimized ? 'h-14' : 'h-[500px]'} transition-all duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex-shrink-0 cursor-pointer"
            onClick={() => setIsMinimized(!isMinimized)}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg">
                🥦
              </div>
              <div>
                <h4 className="font-bold text-sm">Dieto</h4>
                <p className="text-[10px] text-green-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" /> AI Nutrition Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <FiMinus className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-xs flex-shrink-0">
                        🥦
                      </div>
                    )}
                    <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-green-500 text-white rounded-2xl rounded-tr-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-xs flex-shrink-0">
                      🥦
                    </div>
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions (only when few messages) */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                  {['Post-workout meal?', 'High protein foods', 'Lose weight tips'].map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full whitespace-nowrap text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 hover:border-green-300 transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex items-center gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown} disabled={loading}
                  className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                  placeholder="Ask Dieto anything..." />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                  className="w-9 h-9 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-40">
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-xl hover:shadow-2xl hover:shadow-green-500/30 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95">
          {/* Avatar */}
          <span className="text-2xl">🥦</span>

          {/* Unread badge */}
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {unread}
            </span>
          )}

          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with Dieto 🥦
          </span>

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
