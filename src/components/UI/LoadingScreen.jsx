import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';
import Logo from '../common/Logo';

const LoadingScreen = ({ onComplete, readyToUnmount }) => {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing Ecosystem");

  const phrases = [
    "Initializing Ecosystem",
    "Calibrating Air Sensors",
    "Syncing Bio-Data",
    "Nurturing Digital Flora",
    "Analyzing Carbon Footprint",
    "Preparing your Dashboard"
  ];

  useEffect(() => {
    // Progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random incremental progress
        const diff = Math.random() * 15;
        return Math.min(prev + diff, 100);
      });
    }, 150);

    // Text rotation
    const textInterval = setInterval(() => {
      setLoadingText(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100 && readyToUnmount) {
      setTimeout(() => {
        setIsFinishing(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800);
      }, 300);
    }
  }, [progress, onComplete, readyToUnmount]);

  return (
    <div className={`ls-root ${isFinishing ? 'ls-finish' : ''}`}>
      <div className="ls-background">
        <div className="ls-glow ls-glow-1"></div>
        <div className="ls-glow ls-glow-2"></div>
        <div className="ls-grid"></div>
      </div>

      <div className="ls-content">
        <div className="ls-visual">
          <div className="ls-ring-container">
            {/* Main Ring */}
            <svg viewBox="0 0 100 100" className="ls-svg">
              <circle cx="50" cy="50" r="45" className="ls-circle-bg" />
              <circle 
                cx="50" cy="50" r="45" 
                className="ls-circle-progress" 
                style={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              />
            </svg>
            
            {/* Center Icon replaced with Logo */}
            <div className="ls-center-icon">
               <Logo size={100} className="loading-logo-pulse-premium" />
            </div>

            {/* Orbiting Particles */}
            <div className="ls-orbit">
              <div className="ls-particle p1"></div>
              <div className="ls-particle p2"></div>
              <div className="ls-particle p3"></div>
            </div>
          </div>
        </div>

        <div className="ls-text-block">
          <h2 className="ls-percentage">{Math.floor(progress)}%</h2>
          <p className="ls-phrase">{loadingText}</p>
          <div className="ls-bar-track">
            <div className="ls-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="ls-brand">
          <Logo size={40} className="ls-brand-logo-glow" />
          <span className="ls-brand-name">ECOSENSE</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
