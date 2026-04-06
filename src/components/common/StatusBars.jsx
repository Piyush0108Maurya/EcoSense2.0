import React, { useState, useEffect } from 'react';

const StatusBars = ({ activeTab, user, activeSubTab, setActiveSubTab }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const subTabs = {
    aqi: ["Live Monitor", "Forecast", "Historical", "Health Tips"],
    waste: ["Classify Item", "My History", "Eco Tips", "Leaderboard"],
    lumi: ["AI Portal", "Eco-Consult", "Knowledge Base"],
    neighbour: ["Feed", "Statistics", "Challenges", "Heatmap"],
    dashboard: ["Overview", "Eco Points", "Activity", "Settings"]
  };

  const currentSubTabs = subTabs[activeTab] || [];

  return (
    <div 
      className="status-bars-wrapper"
      style={{
        position: 'sticky',
        top: '16px',
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none',
        marginBottom: '-10px'
      }}
    >
      {/* ── CENTRAL FLOATING NAV PILL ── */}
      <div 
        className="glass-nav-pill"
        style={{
          pointerEvents: 'auto',
          background: 'rgba(7, 13, 31, 0.65)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(138, 235, 255, 0.15)',
          borderRadius: '100px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 12px rgba(138, 235, 255, 0.05)',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {currentSubTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(i)}
              style={{
                all: 'unset',
                padding: '10px 24px',
                borderRadius: '100px',
                fontFamily: 'var(--font-headline)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                color: activeSubTab === i ? '#070D1F' : 'var(--on-surface-muted)',
                background: activeSubTab === i ? 'var(--primary)' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeSubTab === i ? '0 0 15px rgba(138, 235, 255, 0.3)' : 'none',
              }}
              onMouseEnter={e => {
                if (activeSubTab !== i) {
                  e.currentTarget.style.color = 'var(--on-surface)';
                  e.currentTarget.style.background = 'rgba(138, 235, 255, 0.08)';
                }
              }}
              onMouseLeave={e => {
                if (activeSubTab !== i) {
                  e.currentTarget.style.color = 'var(--on-surface-muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: 'rgba(138, 235, 255, 0.2)', margin: '0 12px' }} />

        {/* Refresh Action */}
        <button
          onClick={() => window.location.reload()}
          title="Refresh Data"
          style={{
            all: 'unset',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            background: 'rgba(138, 235, 255, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '1px solid rgba(138, 235, 255, 0.1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(138, 235, 255, 0.2)';
            e.currentTarget.style.transform = 'rotate(30deg)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(138, 235, 255, 0.1)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 600 }}>refresh</span>
        </button>
      </div>
    </div>
  );
};

export default StatusBars;
