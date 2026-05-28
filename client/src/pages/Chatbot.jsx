import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { FiSend, FiMessageSquare, FiUser, FiCpu } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hey there! I'm Dieto 🥦, your AI nutrition buddy! Ask me anything about food, fitness, workouts, or health tips!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const quickQuestions = [
    'What should I eat after workout?',
    'How can I lose weight safely?',
    'Suggest vegetarian protein sources',
    'Give me a quick morning workout',
    'How much water should I drink daily?',
    'Best foods for muscle building',
  ];

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await sendChatMessage(msg);
      setMessages(prev => [...prev, { role: 'ai', content: data.data.response }]);
    } catch (err) {
      toast.error('Failed to get response');
      setMessages(prev => [...prev, { role: 'ai', content: "Oops! Dieto is having trouble right now. Please try again!" }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-xl">
          🥦
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dieto</h1>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> AI Nutrition Assistant
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-primary-500 text-white'
                : 'bg-gradient-to-br from-green-400 to-emerald-500'
            }`}>
              {msg.role === 'user' ? <FiUser className="w-4 h-4" /> : <span className="text-sm">🥦</span>}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-primary-500 text-white rounded-tr-sm'
                : 'glass-card rounded-tl-sm'
            }`}>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}>{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🥦</span>
            </div>
            <div className="glass-card p-4 rounded-2xl rounded-tl-sm">
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

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="mb-4 px-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className="text-xs px-3 py-2 glass-card hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass-card p-3 flex items-center gap-3">
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown} disabled={loading}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 px-2"
          placeholder="Ask Dieto anything about health & nutrition..." />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
          className="p-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white hover:shadow-lg transition-all disabled:opacity-50">
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
