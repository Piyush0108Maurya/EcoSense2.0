import React, { useEffect, useState } from 'react';
import './Landing.css';
import Logo from '../common/Logo';

const Landing = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">

      {/* ── NAVIGATION ── */}
      <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav__brand">
          <Logo size={32} className="lp-nav__logo" />
          <span className="lp-nav__name">EcoSense</span>
        </div>
        <div className="lp-nav__links">
          <a href="#features">Features</a>
          <a href="#aqi">AQI</a>
          <a href="#gamify">Gamify</a>
        </div>
        <button className="lp-nav__cta" onClick={onStart}>Authorize Access</button>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero__bg" />
        <div className="lp-hero__overlay" />
        <div className="lp-hero__particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`lp-particle lp-particle--${i + 1}`} />
          ))}
        </div>
        <div className="container lp-hero__content">
          <div className="lp-badge">
            <span className="lp-badge__dot" />
            Live Monitoring Active · Powered by Gemini 1.5 Flash
          </div>
          <h1 className="lp-hero__title">
            Breathe Smarter.<br />
            <span className="grad-cyan-purple">Waste Wiser.</span>
          </h1>
          <p className="lp-hero__desc">
            EcoSense is your AI-powered environmental command center — delivering
            real-time air quality intelligence, instant waste classification,
            neighbourhood pollution heatmaps, and gamified eco-rewards.
          </p>
          <div className="lp-feature-pills">
            {[
              { icon: '🌬️', label: 'AQI Monitor' },
              { icon: '♻️', label: 'AI Waste Sort' },
              { icon: '📍', label: 'Eco Heatmap' },
              { icon: '🏆', label: 'Guardian Ranks' },
            ].map(({ icon, label }) => (
              <div key={label} className="lp-pill">{icon} {label}</div>
            ))}
          </div>
          <div className="lp-hero__actions">
            <button className="lp-btn-primary" onClick={onStart}>
              Launch EcoSense
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button className="lp-btn-ghost" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section id="features" className="lp-features">
        <div className="lp-features__glow lp-features__glow--cyan" />
        <div className="lp-features__glow lp-features__glow--purple" />
        <div className="container">
          <div className="lp-section-header">
            <span className="lp-tag">What EcoSense Offers</span>
            <h2 className="lp-section-title">Four Superpowers.<br /><span className="grad-cyan-white">One Platform.</span></h2>
          </div>
          <div className="lp-features__grid">
            {[
              {
                icon: '🌬️',
                color: '#8AEBFF',
                colorDim: 'rgba(138,235,255,0.12)',
                title: 'Live AQI Radar',
                desc: 'Real-time air quality index, PM2.5, CO₂ and pollutant density pulled from global sensor nodes. Alerts before the air turns dangerous.',
              },
              {
                icon: '♻️',
                color: '#A4D64C',
                colorDim: 'rgba(164,214,76,0.12)',
                title: 'AI Waste Classifier',
                desc: 'Point your camera and Gemini 1.5 Flash identifies the material, assigns a disposal protocol, and awards you EcoPoints instantly.',
              },
              {
                icon: '📍',
                color: '#FB923C',
                colorDim: 'rgba(251,146,60,0.12)',
                title: 'Neighbour Waste Heatmap',
                desc: "Pin waste violations on a live Leaflet map. See your area's pollution hotspots and coordinate community clean-ups.",
              },
              {
                icon: '🏆',
                color: '#BB86FC',
                colorDim: 'rgba(187,134,252,0.12)',
                title: 'Guardian Rank System',
                desc: 'Earn XP for every action. Climb from Recruit to Supreme Guardian. Leaderboards, medals, and impact reports keep you motivated.',
              },
            ].map(({ icon, color, colorDim, title, desc }) => (
              <div key={title} className="lp-feature-card" style={{ '--card-color': color, '--card-dim': colorDim }}>
                <div className="lp-feature-card__icon">{icon}</div>
                <h3 className="lp-feature-card__title" style={{ color }}>{title}</h3>
                <p className="lp-feature-card__desc">{desc}</p>
                <div className="lp-feature-card__bar" style={{ background: color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AQI SECTION ── */}
      <section id="aqi" className="lp-split lp-split--aqi">
        <div className="lp-split__glow" />
        <div className="container lp-split__inner">
          <div className="lp-split__visual">
            <div className="lp-aqi-card glass-card">
              <div className="lp-aqi-card__header">
                <span className="lp-live-dot" />
                <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', color: '#8AEBFF' }}>LIVE AQI FEED</span>
              </div>
              <div className="lp-aqi-bars">
                {[
                  { label: 'PM2.5', val: 72, color: '#8AEBFF' },
                  { label: 'CO₂',   val: 55, color: '#A4D64C' },
                  { label: 'NO₂',   val: 38, color: '#FB923C' },
                  { label: 'O₃',    val: 85, color: '#BB86FC' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="lp-aqi-row">
                    <span className="lp-aqi-label">{label}</span>
                    <div className="lp-aqi-track">
                      <div className="lp-aqi-fill" style={{ width: `${val}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
                    </div>
                    <span className="lp-aqi-val" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="lp-aqi-card__footer">
                <span style={{ color: '#64748B', fontSize: '12px' }}>Updated · Just now</span>
                <span style={{ color: '#8AEBFF', fontSize: '12px', fontWeight: 700 }}>MODERATE</span>
              </div>
            </div>
          </div>
          <div className="lp-split__content">
            <span className="lp-tag" style={{ color: '#8AEBFF' }}>Atmospheric Intelligence</span>
            <h2 className="lp-section-title">Know Your Air.<br /><span className="grad-cyan-white">Before It Harms You.</span></h2>
            <p className="lp-split__desc">
              EcoSense pulls live atmospheric data across hundreds of global monitoring nodes —
              giving you instant AQI scores, pollutant breakdowns, trend graphs, and 
              personalised health advisories. All updated in real time.
            </p>
            <ul className="lp-check-list">
              {['PM2.5 · CO₂ · NO₂ · O₃ tracking', 'City-level & neighbourhood resolution', 'Health advisory alerts pushed live', 'Historical AQI trend visualisation'].map(item => (
                <li key={item}><span className="lp-check">✦</span>{item}</li>
              ))}
            </ul>
            <button className="lp-btn-primary" onClick={onStart}>Access AQI Terminal</button>
          </div>
        </div>
      </section>

      {/* ── AI SORT + GUARDIAN SECTION ── */}
      <section id="gamify" className="lp-split lp-split--reverse lp-split--purple">
        <div className="lp-split__glow lp-split__glow--purple" />
        <div className="container lp-split__inner">
          <div className="lp-split__content">
            <span className="lp-tag" style={{ color: '#BB86FC' }}>Gamified Eco Action</span>
            <h2 className="lp-section-title">Every Scan Earns.<br /><span className="grad-purple-cyan">Every Action Counts.</span></h2>
            <p className="lp-split__desc">
              Photograph any waste item and our Gemini-powered AI classifies it, assigns disposal
              instructions, and drops EcoPoints into your profile. Unlock rank medals and
              climb the Guardian leaderboard as you protect your neighbourhood.
            </p>
            <div className="lp-rank-pills">
              {[
                { rank: '🌿 Seedling', xp: '0 XP', color: '#A4D64C' },
                { rank: '💧 Conservator', xp: '500 XP', color: '#8AEBFF' },
                { rank: '⚡ Vanguard', xp: '2K XP', color: '#FB923C' },
                { rank: '👑 Supreme Guardian', xp: '10K XP', color: '#BB86FC' },
              ].map(({ rank, xp, color }) => (
                <div key={rank} className="lp-rank-pill" style={{ borderColor: color, color }}>
                  <span>{rank}</span>
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>{xp}</span>
                </div>
              ))}
            </div>
            <button className="lp-btn-accent" onClick={onStart}>Start Earning XP</button>
          </div>
          <div className="lp-split__visual">
            <div className="lp-guardian-card glass-card">
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🏆</div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 800, color: '#BB86FC', marginBottom: '8px' }}>Supreme Guardian</h3>
              <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '24px' }}>Rank #1 in your district</p>
              <div className="lp-xp-bar-wrap">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#BB86FC', marginBottom: '8px' }}>
                  <span>Progress</span><span>8,340 / 10,000 XP</span>
                </div>
                <div className="lp-xp-track">
                  <div className="lp-xp-fill" style={{ width: '83%', background: 'linear-gradient(90deg, #BB86FC, #8AEBFF)' }} />
                </div>
              </div>
              <div className="lp-medal-row">
                {['🌿', '💧', '⚡', '🔥', '🌍'].map((m, i) => (
                  <div key={i} className="lp-medal">{m}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT STRIP ── */}
      <section className="lp-impact">
        <div className="lp-impact__glow" />
        <div className="container">
          <div className="lp-section-header">
            <span className="lp-tag">Global Footprint</span>
            <h2 className="lp-section-title"><span className="grad-cyan-purple">Real Impact.</span> Real World.</h2>
          </div>
          <div className="lp-impact__grid">
            {[
              { icon: '♻️', label: 'Items Classified', sublabel: 'by AI every day', color: '#8AEBFF' },
              { icon: '🌍', label: 'Cities Monitored', sublabel: 'across global nodes', color: '#A4D64C' },
              { icon: '📍', label: 'Waste Pins', sublabel: 'reported by community', color: '#FB923C' },
              { icon: '🏆', label: 'Guardians Active', sublabel: 'climbing the ranks', color: '#BB86FC' },
            ].map(({ icon, label, sublabel, color }) => (
              <div key={label} className="lp-impact-card">
                <div className="lp-impact-card__icon" style={{ color, filter: `drop-shadow(0 0 12px ${color})` }}>{icon}</div>
                <div className="lp-impact-card__label" style={{ color }}>{label}</div>
                <div className="lp-impact-card__sub">{sublabel}</div>
                <div className="lp-impact-card__line" style={{ background: color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-cta-banner">
        <div className="lp-cta-banner__glow" />
        <div className="container lp-cta-banner__inner">
          <h2 className="lp-cta-banner__title">Ready to Protect <span className="grad-cyan-purple">Your Environment?</span></h2>
          <p className="lp-cta-banner__sub">Join EcoSense and become a Guardian of your neighbourhood today.</p>
          <button className="lp-btn-primary lp-btn-primary--xl" onClick={onStart}>
            Get Started Free
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="container lp-footer__inner">
          <div className="lp-footer__brand">
            <div className="lp-footer__logo">
              <Logo size={28} />
              <span>EcoSense</span>
            </div>
            <p className="lp-footer__tagline">Engineering the future of planetary restoration through AI and collective community action.</p>
          </div>
          {[
            { heading: 'Features', links: ['AQI Monitor', 'AI Waste Sort', 'Eco Heatmap', 'Guardian Ranks'] },
            { heading: 'Platform', links: ['How It Works', 'Leaderboard', 'Impact Report', 'API Docs'] },
            { heading: 'Company', links: ['Our Mission', 'Privacy Policy', 'Terms', 'Contact'] },
          ].map(({ heading, links }) => (
            <div key={heading} className="lp-footer__col">
              <h4>{heading}</h4>
              <ul>{links.map(l => <li key={l}><a href="/">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="container lp-footer__bottom">
          <span>© 2026 EcoSense Environmental Intelligence. All systems operational.</span>
          <div className="lp-footer__bottom-links">
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            <a href="/">Security</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
