import React, { useState, useEffect } from 'react';

const Navbar = ({ activeTab, setActiveTab, user, onAuthClick, onLogout }) => {
  return (
    <nav className="navbar" style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000, height: '64px',
      display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center',
      background: 'rgba(1, 13, 8, 0.85)', backdropFilter: 'blur(30px)',
      borderBottom: '1px solid var(--border-subtle)', padding: '0 28px'
    }}>
      <div className="nav-col-1" style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="130" height="32" viewBox="0 0 130 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-logo" style={{ cursor: 'pointer', transition: 'all 0.4s' }}>
          <path d="M14 30C11 30 3 24 3 15C3 8 9 3 12 7C14 10 14 30 14 30Z" fill="#2d6a4f" />
          <path d="M14 30C17 30 25 24 25 15C25 8 19 3 16 7C14 10 14 30 14 30Z" fill="#40916c" />
          <text
            x="36"
            y="23"
            fill="var(--on-surface)"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.3px' }}
          >EcoSense</text>
        </svg>
      </div>

      <div className="nav-col-2" style={{ display: 'flex', justifyContent: 'center' }}>
        {user && (
          <div className="tab-switcher" style={{
            background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '16px', padding: '4px', display: 'flex', gap: '4px'
          }}>
            {['aqi', 'waste', 'lumi', 'dashboard'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 20px', borderRadius: '12px', font: '700 12px var(--font-headline)',
                  background: activeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab ? '#000' : 'var(--on-surface-muted)',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeTab === tab ? '0 10px 25px var(--primary-dim)' : 'none'
                }}
              >
                {tab === 'aqi' ? 'Air Quality' : tab === 'waste' ? 'Eco-Sort' : tab === 'lumi' ? 'Lumi AI' : 'Dashboard'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="nav-col-3" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-active)', borderRadius: '99px', padding: '5px 12px', color: 'var(--primary)', fontSize: '12px', fontWeight: '600' }}>
              <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block', marginRight: '6px' }}></span>
              {user.points} pts
            </div>
            <div style={{
              fontSize: '12px', padding: '6px 14px', border: '1px solid var(--border-subtle)',
              borderRadius: '99px', background: 'var(--surface-card)', color: 'var(--on-surface-muted)'
            }}>
              👤 {user.initials} (Guest)
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
