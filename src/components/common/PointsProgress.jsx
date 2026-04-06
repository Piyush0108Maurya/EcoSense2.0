import React from 'react';

const PointsProgress = ({ user }) => {
  if (!user) return null;

  // Thresholds matching db.js logic
  const thresholds = [0, 500, 1500, 5000, 10000];
  const lvNames = ["Eco Seedling", "Eco Warrior", "Green Guardian", "Earth Protector", "Planet Champion"];

  const points = user.points || 0;
  const currentThresholdIndex = thresholds.findLastIndex(t => points >= t);
  const nextTarget = thresholds[currentThresholdIndex + 1] || 10000;
  const progressPercent = Math.min((points / nextTarget) * 100, 100);

  return (
    <div className="points-progress-bar" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '4px',
      background: 'rgba(171,223,192,0.1)',
      zIndex: 3000,
      display: 'flex'
    }}>
      <div style={{
        width: `${progressPercent}%`,
        height: '100%',
        background: 'linear-gradient(90deg, var(--accent), var(--gold))',
        boxShadow: '0 0 10px var(--accent)',
        transition: 'width 1s ease-out'
      }}></div>
      <div style={{
        position: 'absolute',
        right: '12px',
        bottom: '8px',
        fontSize: '10px',
        fontWeight: 700,
        color: 'var(--accent)',
        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        letterSpacing: '0.5px'
      }}>
        {points.toLocaleString()} / {nextTarget.toLocaleString()} PTS &mdash; {lvNames[currentThresholdIndex]?.toUpperCase()}
      </div>
    </div>
  );
};

export default PointsProgress;
