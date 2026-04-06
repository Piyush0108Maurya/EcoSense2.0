import React from 'react';
import { getLevelInfo } from '../../services/gamification';

const PointsProgress = ({ user }) => {
  if (!user) return null;

  const points = user.points || 0;
  const level = getLevelInfo(points);

  return (
    <div className="points-progress-bar" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '3px',
      background: 'rgba(255,255,255,0.02)',
      zIndex: 3000,
      display: 'flex',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${level.progress}%`,
        height: '100%',
        background: `linear-gradient(90deg, ${level.color}, #8AEBFF)`,
        boxShadow: `0 0 15px ${level.color}`,
        transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}></div>
      <div style={{
        position: 'absolute',
        right: '16px',
        bottom: '8px',
        fontSize: '9px',
        fontWeight: 850,
        color: level.color,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        background: 'rgba(0,0,0,0.6)',
        padding: '2px 8px',
        borderRadius: '4px',
        backdropFilter: 'blur(4px)',
        border: `1px solid ${level.color}20`
      }}>
        {points.toLocaleString()} / {level.nextThreshold?.toLocaleString() || 'MAX'} XP &mdash; {level.label}
      </div>
    </div>
  );
};

export default PointsProgress;
