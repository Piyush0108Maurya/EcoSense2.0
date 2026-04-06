import React, { useState } from 'react';
import logo from '../../assets/logo.png';

const NAV_ITEMS = [
  {
    tab: 'aqi',
    label: 'Air Quality',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18M3 8c0-2 4-4 9-4s9 2 9 4M3 16c0 2 4 4 9 4s9-2 9-4"/>
      </svg>
    ),
  },
  {
    tab: 'waste',
    label: 'Eco Sort',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 2 16 8 22 8"/>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5z"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="14" y2="17"/>
      </svg>
    ),
  },
  {
    tab: 'neighbour',
    label: 'Neighbour Waste',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const SideNav = ({ activeTab, setActiveTab, user, expanded, setExpanded, onLogout }) => {
  const COLLAPSED_W = 56;
  const EXPANDED_W = 220;
  const width = expanded ? EXPANDED_W : COLLAPSED_W;

  return (
    <>
      {/* ── SIDEBAR ── */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width,
        zIndex: 1000,
        background: '#0B1120',
        borderRight: '1px solid rgba(138,235,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>

        {/* ── BURGER BUTTON ── */}
        <button
          onClick={() => setExpanded(e => !e)}
          title={expanded ? 'Collapse' : 'Expand'}
          style={{
            flexShrink: 0,
            width: COLLAPSED_W,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: 'rgba(138,235,255,0.5)',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#8AEBFF')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(138,235,255,0.5)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* ── BRANDING (expanded only) ── */}
        <div style={{
          height: expanded ? 'auto' : 0,
          padding: expanded ? '2px 16px 18px' : '0 16px',
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
          transition: 'opacity 0.2s',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <img src={logo} alt="Logo" style={{ width: '22px', height: '22px' }} />
            <div style={{
              fontSize: '9px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'rgba(138,235,255,0.35)',
              textTransform: 'uppercase',
            }}>
              Mission
            </div>
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            color: '#E8F4FD',
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}>
            EcoSense
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: '1px', background: 'rgba(138,235,255,0.07)', margin: '0 10px', flexShrink: 0 }} />

        {/* ── NAV LABEL (expanded only) ── */}
        <div style={{
          height: expanded ? 'auto' : 0,
          padding: expanded ? '12px 16px 6px' : '0',
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.2s',
          fontSize: '9px',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: 'rgba(138,235,255,0.35)',
          textTransform: 'uppercase',
          flexShrink: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}>
          Navigation
        </div>

        {/* ── NAV ITEMS ── */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '8px 8px 0' }}>
          {NAV_ITEMS.map(({ tab, label, icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                title={!expanded ? label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(138,235,255,0.12)' : 'transparent',
                  color: isActive ? '#8AEBFF' : 'rgba(232,244,253,0.5)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'left',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  boxShadow: isActive ? '0 0 0 1px rgba(138,235,255,0.18) inset' : 'none',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(138,235,255,0.06)';
                    e.currentTarget.style.color = 'rgba(232,244,253,0.8)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(232,244,253,0.5)';
                  }
                }}
              >
                {/* Active left accent bar */}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    height: '60%',
                    width: '3px',
                    borderRadius: '0 2px 2px 0',
                    background: 'linear-gradient(180deg, #8AEBFF, #22D3EE)',
                    boxShadow: '0 0 8px rgba(138,235,255,0.5)',
                  }} />
                )}
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {icon}
                </span>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13.5px',
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 0.15s',
                  letterSpacing: '0.01em',
                }}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── BOTTOM ITEMS ── */}
        <div style={{
          marginTop: 'auto',
          padding: '10px 8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          borderTop: '1px solid rgba(138,235,255,0.07)',
        }}>
          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab('dashboard')}
            title={!expanded ? 'Dashboard' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'dashboard' ? 'rgba(138,235,255,0.12)' : 'transparent',
              color: activeTab === 'dashboard' ? '#8AEBFF' : 'rgba(232,244,253,0.5)',
              transition: 'all 0.2s',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              if (activeTab !== 'dashboard') {
                e.currentTarget.style.background = 'rgba(138,235,255,0.06)';
                e.currentTarget.style.color = 'rgba(232,244,253,0.8)';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'dashboard') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(232,244,253,0.5)';
              }
            }}
          >
            {activeTab === 'dashboard' && (
              <span style={{
                position: 'absolute',
                left: 0,
                top: '20%',
                height: '60%',
                width: '3px',
                borderRadius: '0 2px 2px 0',
                background: 'linear-gradient(180deg, #8AEBFF, #22D3EE)',
              }} />
            )}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: activeTab === 'dashboard' ? 700 : 500,
              fontSize: '13.5px',
              opacity: expanded ? 1 : 0,
              transition: 'opacity 0.15s',
              whiteSpace: 'nowrap',
            }}>
              Dashboard
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title={!expanded ? 'Logout' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: 'rgba(255,100,100,0.6)',
              transition: 'all 0.2s',
              textAlign: 'left',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,100,100,0.1)';
              e.currentTarget.style.color = 'rgba(255,100,100,0.9)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,100,100,0.6)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: '13.5px',
              opacity: expanded ? 1 : 0,
              transition: 'opacity 0.15s',
            }}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── SPACER — shifts page content right ── */}
      <div style={{
        width,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
    </>
  );
};

export { SideNav };
export default SideNav;
