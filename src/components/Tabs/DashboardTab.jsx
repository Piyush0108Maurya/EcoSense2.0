import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import './DashboardTab.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardTab = ({ activeSubTab, user }) => {
  if (!user) return null;

  const thresholds = [0, 500, 1500, 5000, 10000];
  const lvNames = ["Eco Seedling", "Eco Warrior", "Green Guardian", "Earth Protector", "Planet Champion"];
  const lvEmojis = ["🌱", "🌿", "🌳", "🌍", "⭐"];

  const points = user.points || 0;
  const currentLevelIndex = thresholds.findLastIndex(t => points >= t);
  const nextTarget = thresholds[currentLevelIndex + 1] || 10000;
  const progressPercent = Math.min((points / nextTarget) * 100, 100);

  const joinDate = user.createdAt ? new Date(user.createdAt) : new Date();
  const diffDays = Math.ceil(Math.abs(new Date() - joinDate) / (1000 * 60 * 60 * 24)) || 1;

  const history = user.impactHistory || [];
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(7, 13, 31, 0.9)',
        titleColor: '#8AEBFF',
        bodyColor: '#E8F4FD',
        borderColor: 'rgba(138, 235, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Space Grotesk', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
      }
    },
    scales: { y: { display: false }, x: { display: false } }
  };

  const renderOverview = () => (
    <div className="dashboard-content animate-in zoom-in-95">
      
      {/* ── PROFILE HERO ── */}
      <div className="profile-hero">
        <div className="profile-hero-glow"></div>
        <div className="profile-hero-glow-alt"></div>
        
        <div className="avatar-wrapper">
          <div className="avatar-inner">
            <div className="avatar-box">
               {user.initials || user.displayName?.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div className="verified-badge">
             <span className="material-symbols-outlined" style={{ color: '#070D1F', fontSize: '20px', fontWeight: 'bold' }}>verified</span>
          </div>
        </div>

        <div className="profile-info-main">
          <div className="profile-name-row">
            <h1 className="profile-name-text">
              {user.displayName || 'Guardian'}
            </h1>
            <span className="level-badge">
              LEVEL {currentLevelIndex + 1}
            </span>
          </div>
          <p className="profile-desc">
            Environmental Vanguard designated since {joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. 
            Active in the {user.location || 'Global'} sector for {diffDays} cycles.
          </p>
          
          <div className="profile-tags">
             <div className="tag-pill primary-tag">
                <span className="tag-text">{lvEmojis[currentLevelIndex]} {lvNames[currentLevelIndex].toUpperCase()}</span>
             </div>
             <div className="tag-pill secondary-tag">
                <span className="tag-text">RANK #1,284</span>
             </div>
          </div>
        </div>

        <div className="impact-score-card">
           <span className="score-label">Impact Score</span>
           <span className="score-value">{Math.round(points / 12)}</span>
           <div className="score-progress-bg">
              <div className="score-progress-fill" style={{ width: '65%' }}></div>
           </div>
        </div>
      </div>

      {/* ── CORE STATS GRID ── */}
      <div className="dashboard-stats-grid">
        {[
          { label: 'Scans Logged', value: history.length, icon: 'qr_code_scanner', color: 'var(--primary)' },
          { label: 'Matter Diverted', value: '42.5kg', icon: 'auto_delete', color: 'var(--secondary)' },
          { label: 'Current Assets', value: points.toLocaleString(), icon: 'toll', color: '#F59E0B' },
          { label: 'Active Cycles', value: diffDays, icon: 'update', color: '#EF4444' }
        ].map((stat, i) => (
          <div key={i} className="stat-card">
             <div className="stat-icon-wrap">
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: stat.color }}>{stat.icon}</span>
                <span className="live-data-badge">Live data</span>
             </div>
             <span className="stat-value">{stat.value}</span>
             <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── PROGRESSION MATRIX ── */}
      <div className="matrix-layout-grid">
        <div className="progression-matrix-card">
           <div className="matrix-header">
              <div>
                <h3 className="matrix-title">Progression Matrix</h3>
                <p className="matrix-subtitle">Distance to {lvNames[currentLevelIndex + 1] || 'Final Rank'}</p>
              </div>
              <div className="matrix-telemetry">
                 <span className="telemetry-value">{points.toLocaleString()}</span>
                 <span className="telemetry-label">Total Telemetry</span>
              </div>
           </div>

           <div className="progression-track">
              <div className="progression-bar-bg"></div>
              <div className="progression-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              
              <div className="progression-nodes">
                {thresholds.map((t, i) => (
                  <div key={i} className="progression-node">
                    <div className={`node-dot ${points >= t ? 'active' : ''}`}></div>
                    <div className="node-label-wrap">
                       <span className={`node-rank ${points >= t ? 'text-white' : ''}`}>{lvNames[i].split(' ')[0]}</span>
                       <span className="node-points">{t >= 1000 ? (t/1000)+'K' : t}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="acceleration-tip">
              <div className="tip-icon-box">
                 <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>rocket_launch</span>
              </div>
              <p className="tip-text">
                You are outperforming <span className="text-primary">84%</span> of guardians in your sector. 
                Complete <span className="text-bold">5 more classifications</span> to accelerate rank progression.
              </p>
           </div>
        </div>

        <div className="impact-donut-card">
            <span className="hub-label">Carbon Offset Hub</span>
            <div className="hub-chart-container">
              <div className="hub-chart-wrap">
                <Doughnut 
                  data={{
                    labels: ['Scanned', 'Pending', 'Verified'],
                    datasets: [{
                      data: [65, 25, 10],
                      backgroundColor: ['#8AEBFF', 'rgba(138, 235, 255, 0.2)', 'rgba(164, 214, 76, 0.4)'],
                      borderWidth: 0,
                      cutout: '85%'
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
              <div className="impact-donut-inner">
                 <span className="hub-value">12.4</span>
                 <span className="hub-unit">Tons CO₂</span>
              </div>
            </div>
            <p className="hub-desc">Estimated environmental impact based on your logged classifications.</p>
            <button className="hub-report-btn">Download Report</button>
        </div>
      </div>
    </div>
  );

  const renderEcoPoints = () => (
    <div className="dashboard-content">
      <div className="balance-hero">
        <div className="hero-mesh"></div>
        <span className="hero-label">Available Assets</span>
        <h2 className="hero-value">{points.toLocaleString()}</h2>
        <div className="hero-status">
           <span className="status-dot"></span>
           <span className="status-text">Verified in Protocol</span>
        </div>
      </div>

      <div className="ledger-grid">
         <div className="ledger-card">
            <h3 className="ledger-title">
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>receipt_long</span>
              Recent Ledger
            </h3>
            <div className="ledger-list">
               {history.length > 0 ? history.slice(0, 8).map((entry, i) => (
                 <div key={i} className="ledger-item">
                    <div className="item-meta">
                       <div className="item-icon-box">
                          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '18px' }}>
                             {entry.category === 'Recyclable' ? 'recycling' : entry.category === 'Hazardous' ? 'warning' : 'delete'}
                          </span>
                       </div>
                       <div>
                          <p className="item-name">{entry.item || 'Item Analysis'}</p>
                          <p className="item-date">{new Date(entry.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <span className="item-points">+{entry.points}</span>
                 </div>
               )) : (
                 <div className="ledger-empty">No entries.</div>
               )}
            </div>
         </div>

         <div className="distribution-card">
            <h3 className="ledger-title">
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '20px' }}>analytics</span>
              Asset Distribution
            </h3>
            <div className="chart-canvas-wrap">
               <Bar 
                 data={{
                   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                   datasets: [{
                     label: 'Points',
                     data: [120, 450, 300, 600, 200, 800, 350],
                     backgroundColor: '#8AEBFF',
                     borderRadius: 4
                   }]
                 }}
                 options={{
                    ...chartOptions,
                    scales: {
                       y: { display: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8FA8BF', font: { size: 9 } } },
                       x: { display: true, grid: { display: false }, ticks: { color: '#8FA8BF', font: { size: 9 } } }
                    }
                 }}
               />
            </div>
         </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="dashboard-content">
       <div className="activity-card">
          <div className="activity-header">
             <h3 className="ledger-title">Activity Stream</h3>
             <span className="live-status-pill">Live</span>
          </div>
          
          <div className="table-overflow">
             {history.length > 0 ? (
                <table className="activity-table">
                   <thead>
                      <tr>
                         <th>Timestamp</th>
                         <th>Designation</th>
                         <th>Yield</th>
                         <th>Status</th>
                      </tr>
                   </thead>
                   <tbody>
                      {history.map((entry, i) => (
                         <tr key={i}>
                            <td>{new Date(entry.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                            <td>
                               <div className="td-item">
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary)' }}>science</span>
                                  <span>{entry.item || 'Generic Analysis'}</span>
                               </div>
                            </td>
                            <td><span className="yield-val">+{entry.points}</span></td>
                            <td><span className="status-pill-verified">Verified</span></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             ) : (
                <div className="ledger-empty" style={{ padding: '6rem' }}>No telemetry detected.</div>
             )}
          </div>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="dashboard-content" style={{ maxWidth: '36rem' }}>
       <div className="settings-card">
          <h2 className="matrix-title" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>settings_applications</span>
             Vanguard Settings
          </h2>
          
          <div className="settings-form">
             <div className="form-group">
                <label className="form-label">Guardian Designation</label>
                <input readOnly value={user.displayName || ''} className="form-input" />
             </div>

             <div className="form-group">
                <label className="form-label">Network Identity</label>
                <input readOnly value={user.email || ''} className="form-input muted-input" />
             </div>

             <div className="form-footer">
                <button 
                  onClick={() => { if(confirm('Initiate terminal purge?')) { localStorage.clear(); window.location.reload(); } }}
                  className="purge-button"
                >
                   Initiate Purge
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {activeSubTab === 0 && renderOverview()}
      {activeSubTab === 1 && renderEcoPoints()}
      {activeSubTab === 2 && renderActivity()}
      {activeSubTab === 3 && renderSettings()}
    </div>
  );
};

export default DashboardTab;
