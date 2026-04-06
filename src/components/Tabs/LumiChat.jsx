import React, { useState, useRef, useEffect } from 'react';
import { askGemini } from '../../services/api';
import './LumiChat.css';

const LumiChat = ({ onPointsUpdate }) => {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Greetings, Eco Guardian! 👋 I am Lumi, your personal environmental intelligence. I'm here to help you navigate our changing planet and find ways to make a positive impact. What's on your mind today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const history = [
    "Sustainability advice",
    "AQI Health Impact",
    "Recycling guidelines",
    "Carbon footprint Tips"
  ];

  const suggestions = [
    "What does AQI 150 mean for my health?",
    "How can I reduce my household waste?",
    "Tell me a fun fact about composting.",
    "Show me some fast ways to save energy."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customInput = null) => {
    const textToSend = typeof customInput === 'string' ? customInput : input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const systemPrompt = `
      You are Lumi, the AI environmental companion for EcoSense. 
      Your personality: Wise, encouraging, slightly mystical (like a forest spirit), but grounded in scientific data.
      Tone: Warm, intelligent, and proactive. Use relevant emojis.
      Context: User is likely in India (based on city lists) but your knowledge is global.
      Keep answers concise (max 3-4 sentences unless complex). 
      If asked about AQI, guide them based on standard US AQI thresholds.
      Encourage them to collect 'Eco Points' by sorting waste or checking their dashboard.
    `;

    try {
      // Pass the last 6 messages as history for context
      const chatHistory = messages.slice(-6).map(m => ({
        role: m.role,
        text: m.text
      }));

      const reply = await askGemini(systemPrompt, textToSend, chatHistory);

      setMessages(prev => [...prev, {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      // Award points for AI interaction
      if (onPointsUpdate) onPointsUpdate('CHAT_INSIGHT');
    } catch (error) {
      console.error("Lumi AI error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I seem to have lost my connection to the Earth's pulse. 🌿 Please try asking me again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  return (
    <div className="lumi-chat-container">
      {/* Sidebar - History & Suggestions */}
      <aside className="lumi-sidebar">
        <div className="lumi-sidebar-header">
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>history_edu</span>
          <span className="lumi-sidebar-title">Recent Echoes</span>
        </div>

        <div className="lumi-history-list">
          {history.map((item, idx) => (
            <div key={idx} className="history-item">
              {item}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div className="lumi-suggestion-title">Eco-Prompts</div>
          <div className="lumi-suggestions">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="lumi-main-chat">
        <div className="lumi-bg-glow"></div>

        <header className="lumi-chat-header">
          <div className="lumi-header-info">
            <div className="lumi-avatar-container">
              <div className="lumi-avatar-glow"></div>
              <div className="lumi-avatar">
                <svg viewBox="0 0 64 64" style={{ width: '80%', height: '80%' }}>
                  <circle cx="32" cy="32" r="16" fill="none" stroke="var(--primary)" strokeWidth="1" strokeDasharray="4 2">
                    <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="10s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="32" cy="32" r="6" fill="var(--primary)">
                    <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="24" cy="28" r="1.5" fill="#000" />
                  <circle cx="40" cy="28" r="1.5" fill="#000" />
                </svg>
              </div>
            </div>
            <div className="lumi-status">
              <span className="lumi-name">Lumi AI</span>
              <span className="lumi-online"><div className="online-dot"></div> Online</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.2)', cursor: 'help' }} title="AI Intelligence Mode">bolt</span>
          </div>
        </header>

        <section className="lumi-chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-wrap ${msg.role}`}>
              <div className="message-bubble">
                {msg.text}
              </div>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}

          {loading && (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        <footer className="lumi-chat-input-area">
          <div className="lumi-input-container">
            <input
              type="text"
              className="lumi-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Synchronize with Lumi AI..."
              disabled={loading}
            />
            <button
              className="lumi-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || loading}
            >
              <span className="material-symbols-outlined">
                {loading ? 'hourglass_bottom' : 'send'}
              </span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LumiChat;
