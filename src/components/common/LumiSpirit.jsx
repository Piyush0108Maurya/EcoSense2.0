import React, { useState, useRef, useEffect } from 'react';
import { askGemini } from '../../services/api';
import './LumiSpirit.css';

const LumiSpirit = ({ isSidebarExpanded, onPointsUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Greetings, Eco Guardian! 👋 I am Lumi. How can I help you with your environmental journey today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sidebarWidth = isSidebarExpanded ? 220 : 56;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const systemPrompt = `
      You are Lumi, the AI environmental companion for EcoSense. 
      Your personality: Wise, encouraging, slightly mystical (like a forest spirit), but grounded in scientific data.
      Tone: Warm, intelligent, and proactive. Use relevant emojis.
      Keep answers concise (max 2-3 sentences) as this is a small chat window.
    `;

    try {
      const chatHistory = messages.slice(-4).map(m => ({
        role: m.role,
        text: m.text
      }));

      const reply = await askGemini(systemPrompt, input, chatHistory);

      setMessages(prev => [...prev, {
        role: 'model',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
    } catch (error) {
      console.error("Lumi AI error:", error);

      let errorText;
      if (error.message === "QUOTA_EXHAUSTED") {
        errorText = "My energy has been fully spent for today, Guardian. 🌙 The cosmic quota resets at midnight — come find me then! ✨";
      } else if (error.message === "RATE_LIMITED") {
        errorText = "I'm receiving too many echoes at once. 🌀 Please wait a moment before we speak again.";
      } else {
        errorText = "I seem to have lost my connection to the Earth's pulse. 🌿 Please try again shortly.";
      }

      setMessages(prev => [...prev, {
        role: 'model',
        text: errorText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`lumi-spirit-wrapper ${isOpen ? 'active' : ''}`}
      style={{ left: `${sidebarWidth + 16}px` }}
    >
      {/* Clickable Avatar Spirit */}
      <div 
        className="lumi-avatar-spirit"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="lumi-spirit-core">
          {/* Layered Spirit Glows */}
          <div className="spirit-layer layer-1"></div>
          <div className="spirit-layer layer-2"></div>
          <div className="spirit-layer layer-3"></div>
          
          {/* The Face / Core */}
          <div className="spirit-inner-core">
            <svg viewBox="0 0 64 64" width="40" height="40">
              <defs>
                <linearGradient id="spiritGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              
              {/* Mystical facial features */}
              <g className="spirit-features">
                <circle cx="26" cy="30" r="1.5" fill="#fff" className="eye-glow" />
                <circle cx="38" cy="30" r="1.5" fill="#fff" className="eye-glow" />
                <path d="M28 38 Q32 41 36 38" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />
              </g>
              
              {/* Floating particles inside SVG */}
              <circle cx="20" cy="20" r="1" fill="#fff" opacity="0.4">
                <animate attributeName="cy" values="20;15;20" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="44" cy="24" r="1" fill="#fff" opacity="0.3">
                <animate attributeName="cy" values="24;29;24" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          
          {/* Orbiting Orbs */}
          <div className="orbiting-orb orb-1"></div>
          <div className="orbiting-orb orb-2"></div>
        </div>
        
        {/* Hover Offer Message */}
        {isHovered && !isOpen && (
          <div className="lumi-offer-bubble">
            Need any help, Guardian? ✨
          </div>
        )}
      </div>

      {/* Small Chat Space */}
      {isOpen && (
        <div className="lumi-mini-chat">
          <div className="mini-chat-header">
            <div className="mini-chat-title">
              <span className="online-pulse"></span>
              Lumi Intelligence
            </div>
            <button className="mini-close-btn" onClick={() => setIsOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="mini-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mini-msg-wrap ${msg.role}`}>
                <div className="mini-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="mini-typing">Lumi is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="mini-chat-input">
            <input 
              type="text" 
              placeholder="Ask Lumi anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LumiSpirit;
