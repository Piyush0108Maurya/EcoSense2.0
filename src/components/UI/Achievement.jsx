import React, { useEffect, useState } from 'react';
import './Achievement.css';

const Achievement = ({ title, message, points, icon = "🏆", onComplete }) => {
  const [show, setShow] = useState(false);
  const [countingPoints, setCountingPoints] = useState(0);

  useEffect(() => {
    // Stage 1: Entrance
    const timer1 = setTimeout(() => setShow(true), 500);
    
    // Stage 2: Point Counter Animation
    const timer2 = setTimeout(() => {
      let current = 0;
      const step = points / 40; // 40 steps over 1s (25ms per step)
      const interval = setInterval(() => {
        current += step;
        if (current >= points) {
          setCountingPoints(points);
          clearInterval(interval);
        } else {
          setCountingPoints(Math.floor(current));
        }
      }, 25);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [points]);

  if (!show && countingPoints === 0) return null;

  return (
    <div className={`achievement-overlay ${show ? 'visible' : ''}`}>
      <div className="achievement-card">
        {/* Particle bursts (CSS only) */}
        <div className="achievement-burst"></div>
        <div className="achievement-burst-delayed"></div>
        
        <div className="achievement-content">
          <div className="achievement-icon-wrapper">
            <div className="achievement-glow"></div>
            <span className="achievement-icon">{icon}</span>
          </div>

          <div className="achievement-badge">New Achievement unlocked</div>
          <h1 className="achievement-title">{title}</h1>
          <p className="achievement-message">{message}</p>

          <div className="achievement-points-display">
            <span className="points-label">ECO XP GAINED</span>
            <div className="points-value">
              <span className="points-plus">+</span>
              {countingPoints}
            </div>
          </div>

          <button className="achievement-claim-btn" onClick={() => {
            setShow(false);
            setTimeout(onComplete, 600);
          }}>
            Claim & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
