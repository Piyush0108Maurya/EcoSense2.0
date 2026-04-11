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
      {/* Clickable High-Fidelity Nature Fairy */}
      <div 
        className="lumi-botanical-fairy"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="fairy-magic-field">
          {/* Bioluminescent Bloom Aura */}
          <div className="bloom-aura inner"></div>
          <div className="bloom-aura outer"></div>
          
          {/* Quad-Wing System */}
          <div className="fairy-wings-system">
             <div className="wing-pair pair-upper">
                <div className="fairy-wing wing-tl"></div>
                <div className="fairy-wing wing-tr"></div>
             </div>
             <div className="wing-pair pair-lower">
                <div className="fairy-wing wing-bl"></div>
                <div className="fairy-wing wing-br"></div>
             </div>
          </div>
          
          {/* Botanical Deity Silhouette */}
          <div className="fairy-silhouette-vessel">
            <svg viewBox="0 0 100 100" width="64" height="64" className="fairy-body-svg">
              <defs>
                <filter id="fairyGlow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="wispGrad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="60%" stopColor="#2DD4BF" />
                  <stop offset="100%" stopColor="#064E3B" />
                </radialGradient>
              </defs>

              <g filter="url(#fairyGlow)">
                 {/* Head - Spiritual Essence */}
                 <circle cx="50" cy="28" r="4.5" fill="#fff" />
                 
                 {/* Ethereal Wisp Body - No "Stick Man" limbs */}
                 <path 
                    d="M50 32 
                       C60 40, 65 55, 52 75 
                       C50 78, 48 75, 46 72
                       C40 55, 45 40, 50 32" 
                    fill="url(#wispGrad)" 
                    opacity="0.9"
                    className="spirit-wisp-body"
                 />

                 {/* Internal Life-Flow Sparkle */}
                 <circle cx="50" cy="45" r="1.5" fill="#fff" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                 </circle>
              </g>

              {/* Mystical Floating Petals around the core */}
              <circle cx="35" cy="40" r="1" fill="#FCD34D" opacity="0.5">
                 <animate attributeName="cy" values="40;35;40" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="65" cy="45" r="1.2" fill="#A7F3D0" opacity="0.4">
                 <animate attributeName="cy" values="45;50;45" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
            
            {/* Swirling Nature Orbs */}
            <div className="nature-orb o1"></div>
            <div className="nature-orb o2"></div>
          </div>

          {/* Exterior Fairy Dust Path */}
          <div className="dust-stream">
             {[...Array(6)].map((_, i) => (
                <div key={i} className={`dust-particle p${i}`}></div>
             ))}
          </div>
        </div>
        
        {/* Interaction Hint */}
        {isHovered && !isOpen && (
          <div className="fairy-premium-hint">
             <div className="hint-content">
                <span className="hint-main">Nature's Wisdom</span>
                <span className="hint-sub">Tap to speak with Lumi</span>
             </div>
             <div className="hint-icon">🌿</div>
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
