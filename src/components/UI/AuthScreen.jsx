import React, { useState } from 'react';
import './AuthScreen.css';
import { loginEmail, signUpEmail, loginWithGoogle, logout } from '../../services/firebase.js';

const AuthScreen = ({ onBack }) => {

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginEmail(email, password);
      // onAuthStateChanged in App.js will handle the state update
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await signUpEmail(email, password, displayName);
      // Auto-signed in by Firebase, so logout to redirect to sign-in
      await logout();
      
      // Clear password for security, keep email for convenience
      setPassword('');
      
      // Show Success Modal
      setShowSuccessModal(true);
      setCountdown(5);

    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCESS MODAL REDIRECTION TIMER ──
  React.useEffect(() => {
    let timer;
    if (showSuccessModal && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (showSuccessModal && countdown === 0) {
      setShowSuccessModal(false);
      setIsSignUp(false);
      setSuccess('Protocol initialized. Please sign in to continue.');
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal, countdown]);

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google Auth Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── BACK BUTTON ── */}
      <button className="auth-back-btn" onClick={onBack} title="Return to Landing">
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="back-text">Mission Brief</span>
      </button>

      {/* ── Parallax Decor ── */}
      <div className="auth-bg-decor">
        <div className="glow-circle glow-1" />
        <div className="glow-circle glow-2" />
      </div>

      <div className={`auth-container ${isSignUp ? 'signup-mode' : ''}`}>
        <div className="auth-content-wrapper shadow-2xl">

          {/* ────── LOGIN FORM ────── */}
          <div className="form-container login-container">
            <form onSubmit={handleLogin} className="auth-form">
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Continue your journey as an Eco Guardian.</p>

              {error && !isSignUp && <div style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '10px', padding: '10px', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>{error}</div>}
              {success && !isSignUp && <div style={{ color: '#00cc88', fontSize: '13px', marginBottom: '10px', padding: '10px', background: 'rgba(0, 204, 136, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 204, 136, 0.2)' }}>{success}</div>}

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-container">
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined input-icon">alternate_email</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-container">
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined input-icon">lock</span>
                </div>
              </div>

              <button type="submit" className="auth-btn primary-auth-btn" disabled={loading}>
                {loading ? 'Authenticating...' : 'Commence Mission'}
              </button>

              <div className="divider">OR</div>

              <button type="button" onClick={handleGoogle} className="auth-btn google-btn" disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sync with Google
              </button>
            </form>
          </div>

          {/* ────── SIGNUP FORM ────── */}
          <div className="form-container signup-container">
            <form onSubmit={handleSignUp} className="auth-form">
              <h1 className="auth-title">Hello Guardian</h1>
              <p className="auth-subtitle">Join the elite force protecting our planet.</p>

              {error && isSignUp && <div style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '10px', padding: '10px', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>{error}</div>}

              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-container">
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Master Chief"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined input-icon">person</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-container">
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="guardian@unsc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined input-icon">alternate_email</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-container">
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined input-icon">lock</span>
                </div>
              </div>

              <button type="submit" className="auth-btn primary-auth-btn" disabled={loading}>
                {loading ? 'Creating Profile...' : 'Initialize Protocol'}
              </button>

              <div className="divider">OR</div>

              <button type="button" onClick={handleGoogle} className="auth-btn google-btn" disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sync with Google
              </button>
            </form>
          </div>


          {/* ────── OVERLAY SLIDER ────── */}
          <div className="auth-overlay">
            <div className="overlay-panel overlay-left">
              <div className="overlay-icon" style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.9 }}>🛡️</div>
              <h1 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>Already a Member?</h1>
              <p style={{ opacity: 0.6, marginBottom: '32px', fontSize: '15px', maxWidth: '300px', lineHeight: 1.6 }}>Re-establish your encrypted connection to the EcoSense neural grid.</p>
              <button className="auth-btn ghost-auth-btn" onClick={toggleMode}>
                Back to Command
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <div className="overlay-icon" style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.9 }}>🌿</div>
              <h1 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>New Recruiter?</h1>
              <p style={{ opacity: 0.6, marginBottom: '32px', fontSize: '15px', maxWidth: '300px', lineHeight: 1.6 }}>Start your specialized environmental mission and protect the biosphere.</p>
              <button className="auth-btn ghost-auth-btn" onClick={toggleMode}>
                Join the Network
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── SUCCESS MODAL ── */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <div className="success-icon-wrapper">
              <div className="success-icon-ring"></div>
              <span className="material-symbols-outlined success-check-icon">check_circle</span>
            </div>
            <h1 className="success-title">Guardian Created</h1>
            <p className="success-message">
              Protocol initialized successfully. Your identity has been verified and added to the EcoSense neural grid.
            </p>
            <div className="success-redirect-info">
              Redirecting to Command Center in <span className="countdown-timer">{countdown}s</span>
            </div>
            <button 
              className="auth-btn primary-auth-btn success-btn" 
              onClick={() => {
                setShowSuccessModal(false);
                setIsSignUp(false);
                setSuccess('Protocol initialized. Please sign in to continue.');
              }}
            >
              Access Command Center
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AuthScreen;
