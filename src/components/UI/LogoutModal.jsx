import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ onConfirm, onCancel, user }) => {
  return (
    <div className="modal-overlay">
      <div className="logout-modal">
        <div className="modal-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        
        <h2 className="modal-title">Terminate Session?</h2>
        <p className="modal-text">
          Are you sure you want to logout from <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{user?.displayName || 'your account'}</span>? Your ecological progress will be safely stored in the cloud.
        </p>

        <div className="modal-actions">
          <button className="modal-btn btn-cancel" onClick={onCancel}>
            Keep Mission Active
          </button>
          <button className="modal-btn btn-confirm" onClick={onConfirm}>
            Logout Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
