import React, { useEffect, useState } from 'react';
import './Landing.css';

const Landing = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ── NAVIGATION (Glassy Floating) ── */}
      <nav 
        style={{
          position: 'fixed', top: scrolled ? '20px' : '32px', left: '50%', transform: 'translateX(-50%)',
          width: 'min(90%, 1200px)', height: '64px', zIndex: 1000,
          background: scrolled ? 'rgba(7, 13, 31, 0.7)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          border: scrolled ? '1px solid rgba(138, 235, 255, 0.15)' : 'none',
          borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', background: '#8AEBFF', borderRadius: '3px' }} />
          EcoSense
        </div>
        <div style={{ display: 'flex', gap: '32px', color: '#94A3B8', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }} className="hide-mobile">
          <a href="#vision" style={{ color: 'inherit', textDecoration: 'none' }}>Vision</a>
          <a href="#command" style={{ color: 'inherit', textDecoration: 'none' }}>Command</a>
          <a href="#journey" style={{ color: 'inherit', textDecoration: 'none' }}>Journey</a>
        </div>
        <button 
          onClick={onStart}
          style={{
            padding: '10px 24px', background: '#8AEBFF', border: 'none', borderRadius: '12px',
            color: '#020617', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Get Started
        </button>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="hero-v2">
        <div className="hero-bg-fx">
          <div className="scan-line" />
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: '30vw', height: '30vw', background: 'rgba(138, 235, 255, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '40vw', height: '40vw', background: 'rgba(164, 214, 76, 0.03)', filter: 'blur(120px)', borderRadius: '50%' }} />
        </div>

        <div className="container hero-content-v2">
          <div className="badge-v2">Environmental Intelligence Platform</div>
          <h1 className="title-v2">
            Mission: <br/> 
            <span className="text-gradient">Planet Restoration</span>
          </h1>
          <p className="desc-v2">
            Experience the future of environmental stewardship. Real-time atmospheric monitoring, 
            AI-driven waste protocols, and a gamified journey to save our biosphere.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="get-started-btn" onClick={onStart}>
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button 
              className="btn-ghost" 
              style={{ padding: '0 40px', borderRadius: '16px', fontSize: '18px', fontWeight: 700 }}
              onClick={() => document.getElementById('vision').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Mission
            </button>
          </div>
        </div>
      </section>

      {/* ── VISION NEURAL CORE SECTION ── */}
      <section id="vision" className="section-v2">
        <div className="container">
          <div className="section-grid">
            <div className="section-content">
              <span className="section-tag">AI Innovation</span>
              <h2 className="section-title">Vision Neural <br/> Core Integration</h2>
              <p className="section-desc">
                Powered by Gemini 1.5 Flash, our AI core correctly identifies thousands of 
                waste materials in milliseconds. Recieve localized disposal protocols and 
                immediate impact credit for every successful classification.
              </p>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>99.2%</h4>
                  <p style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Precision</p>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>&lt; 50ms</h4>
                  <p style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Latency</p>
                </div>
              </div>
            </div>
            <div className="section-visual">
              <div className="glass-visual shadow-2xl">
                <div className="mesh-bg" />
                <div style={{ color: '#8AEBFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.5 }}>
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                  </svg>
                  <div style={{ fontStyle: 'italic', fontSize: '14px', opacity: 0.8, letterSpacing: '1px' }}>SCANNING BIOSPHERE...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABYSSAL COMMAND SECTION ── */}
      <section id="command" className="section-v2" style={{ background: 'rgba(7, 13, 31, 0.4)' }}>
        <div className="container">
          <div className="section-grid reverse">
            <div className="section-visual">
              <div className="glass-visual shadow-2xl">
                <div className="mesh-bg" style={{ transform: 'rotate(180deg)', opacity: 0.2 }} />
                <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ height: '4px', width: '60%', background: '#8AEBFF', borderRadius: '2px' }} />
                  <div style={{ height: '4px', width: '90%', background: 'rgba(138, 235, 255, 0.3)', borderRadius: '2px' }} />
                  <div style={{ height: '4px', width: '40%', background: 'rgba(138, 235, 255, 0.3)', borderRadius: '2px' }} />
                </div>
              </div>
            </div>
            <div className="section-content">
              <span className="section-tag">Atmospheric Data</span>
              <h2 className="section-title">Abyssal Command <br/> AQI Terminal</h2>
              <p className="section-desc">
                High-fidelity monitoring of life-sustaining gases. Track AQI, PM2.5, and 
                pollutant densities across major global nodes. Real-time alerts keeping 
                your community safe from atmospheric hazards.
              </p>
              <button 
                className="btn-ghost" 
                onClick={onStart}
                style={{ padding: '12px 32px', borderRadius: '12px' }}
              >
                Access Terminal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARDIAN JOURNEY SECTION ── */}
      <section id="journey" className="section-v2">
        <div className="container">
          <div className="section-grid">
            <div className="section-content">
              <span className="section-tag">Gamification</span>
              <h2 className="section-title">The Guardian <br/> Journey System</h2>
              <p className="section-desc">
                Every action is indexed. Earn Eco Points and unlock elite Guardian rank 
                medals. Compare your impact on local leaderboards and become a beacon 
                of restoration for your neighborhood.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#8AEBFF' }}>
                   <span>Eco Warrior Status</span>
                   <span>65% Progress</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: '65%', background: '#8AEBFF', borderRadius: '3px', boxShadow: '0 0 10px #8AEBFF' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="section-visual">
               <div className="glass-visual shadow-2xl">
                 <div style={{ fontSize: '72px' }}>🎖️</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="stats-v2">
        <div className="container">
          <div className="stats-grid">
            <div>
              <span className="stat-num">248K+</span>
              <span className="stat-label">Items Classified</span>
            </div>
            <div>
              <span className="stat-num">1.2M</span>
              <span className="stat-label">Impact Points Awarded</span>
            </div>
            <div>
              <span className="stat-num">50+</span>
              <span className="stat-label">Global Cities Monitored</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-v2">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-intro-col">
              <div className="footer-brand">EcoSense</div>
              <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '15px', maxWidth: '300px' }}>
                Dedicated to the preservation of our biosphere through advanced intelligence and collective action.
              </p>
            </div>
            <div className="footer-link-col">
              <h4>Platform</h4>
              <a href="#vision">Neural Core</a>
              <a href="#command">AQI Command</a>
              <a href="#journey">Journey Progress</a>
            </div>
            <div className="footer-link-col">
              <h4>Organization</h4>
              <a href="/">Our Mission</a>
              <a href="/">Global Partners</a>
              <a href="/">Impact Report</a>
            </div>
            <div className="footer-link-col">
              <h4>Mission Control</h4>
              <a href="/">Status</a>
              <a href="/">Protocols</a>
              <a href="/">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 EcoSense Environmental Intelligence. All protocols active.</div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
