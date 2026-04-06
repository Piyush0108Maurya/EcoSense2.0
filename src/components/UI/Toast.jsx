import React, { useEffect, useState } from 'react';

const Toast = ({ message, points, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: '100px', right: '24px', zIndex: 3000,
      background: 'rgba(0,10,6,0.95)', border: '1px solid var(--accent)',
      borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
      transform: visible ? 'translateX(0)' : 'translateX(400px)',
      opacity: visible ? 1 : 0, transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: '280px'
    }}>
      <div style={{ fontSize: '32px' }}>🌿</div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Points Earned!</div>
        <div style={{ color: 'var(--sand1)', fontSize: '14px', margin: '2px 0' }}>{message}</div>
        <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '18px', fontFamily: 'Space Grotesk' }}>+{points} Eco Points</div>
      </div>
      
      <style>{`
        @keyframes toastIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Toast;
