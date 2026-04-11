import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
} from 'chart.js';
import { getLevelInfo, calculateImpact } from '../../services/gamification';
import './DashboardTab.css';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, Title, PointElement, 
  LineElement, Filler
);

const DashboardTab = ({ activeSubTab, user }) => {
  if (!user) return null;

  const points = user.points || 0;
  const level = getLevelInfo(points);
  const impact = calculateImpact(points);

  const joinDate = user.createdAt ? new Date(user.createdAt) : new Date();
  const history = user.impactHistory || [];

  // ── CHART DATA PREPARATION ──
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  }).reverse();

  const weeklyPoints = last7Days.map(dateStr => {
    return history
      .filter(item => new Date(item.date).toDateString() === dateStr)
      .reduce((sum, item) => sum + (item.points || 0), 0);
  });

  const catCounts = history.reduce((acc, item) => {
    const type = item.type || 'OTHER';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const doughnutData = {
    labels: ['Waste Sorting', 'AI Insights', 'Reporting', 'Daily Bonus'],
    datasets: [{
      data: [
        catCounts.WASTE_SCAN || 0,
        catCounts.CHAT_INSIGHT || 0,
        catCounts.WASTE_PIN || 0,
        (catCounts.DAILY_CHECKIN || 0) + (catCounts.SIGNUP_BONUS || 0)
      ],
      backgroundColor: ['#8AEBFF', '#2DD4BF', '#F59E0B', '#A4D64C'],
      hoverOffset: 4,
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  const barData = {
    labels: last7Days.map(d => d.split(' ')[0]),
    datasets: [{
      label: 'Points Gained',
      data: weeklyPoints,
      backgroundColor: 'rgba(138, 235, 255, 0.2)',
      borderColor: '#8AEBFF',
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: '#8AEBFF',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(7, 13, 31, 0.95)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Space Grotesk', size: 14 },
        bodyFont: { family: 'Inter', size: 12 }
      }
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } }
    }
  };

  const renderHome = () => (
    <div className="dash-home animate-in slide-in-bottom">
      {/* ── HERO SECTION ── */}
      <section className="dash-hero">
        <div className="hero-content">
          <div className="hero-welcome">
            <span className="welcome-tag">Eco Guardian Status</span>
            <h1 className="welcome-name">Hello, {user.displayName?.split(' ')[0] || 'Guardian'}</h1>
            <p className="welcome-sub">You've reached <span className="text-highlight">{level.label}</span>. Protect the planet, one step at a time.</p>
          </div>
          <div className="hero-level-box">
             <div className="level-circle">
                <span className="level-num">{Math.floor(points / 1000) + 1}</span>
                <span className="level-label">Level</span>
             </div>
             <div className="xp-details">
                <div className="xp-text">
                   <span>{points} / {level.nextThreshold} XP</span>
                   <span>{level.progress}%</span>
                </div>
                <div className="xp-bar-container">
                   <div className="xp-bar-fill" style={{ width: `${level.progress}%` }}></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT GRID ── */}
      <div className="impact-grid">
         <div className="impact-card co2">
            <div className="impact-icon-bg">💨</div>
            <div className="impact-info">
               <span className="impact-value">{impact.co2Saved}<small>kg</small></span>
               <span className="impact-label">CO2 Diverted</span>
            </div>
         </div>
         <div className="impact-card trees">
            <div className="impact-icon-bg">🌳</div>
            <div className="impact-info">
               <span className="impact-value">{impact.treesPlanted}</span>
               <span className="impact-label">Trees Equivalent</span>
            </div>
         </div>
         <div className="impact-card plastic">
            <div className="impact-icon-bg">♻️</div>
            <div className="impact-info">
               <span className="impact-value">{impact.plasticRecovered}<small>kg</small></span>
               <span className="impact-label">Plastic Saved</span>
            </div>
         </div>
         <div className="impact-card water">
            <div className="impact-icon-bg">💧</div>
            <div className="impact-info">
               <span className="impact-value">{impact.waterSaved}<small>L</small></span>
               <span className="impact-label">Water Purified</span>
            </div>
         </div>
      </div>

      {/* ── INSIGHTS & ACTIVITY ── */}
      <div className="dash-main-grid">
         <div className="insights-panel">
            <h3 className="panel-title">Environmental Contribution</h3>
            <div className="chart-layout">
               <div className="doughnut-container">
                  <Doughnut data={doughnutData} options={chartOptions} />
                  <div className="doughnut-center">
                     <span className="center-val">{history.length}</span>
                     <span className="center-lab">Actions</span>
                  </div>
               </div>
               <div className="chart-legend">
                  {doughnutData.labels.map((l, i) => (
                    <div key={i} className="legend-item">
                       <span className="dot" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }}></span>
                       <span className="lab">{l}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="activity-panel">
            <div className="panel-header">
               <h3 className="panel-title">Recent Gains</h3>
            </div>
            <div className="recent-list">
               {history.slice(0, 5).map((h, i) => (
                  <div key={i} className="recent-item">
                     <div className="recent-icon">
                        {h.type === 'SIGNUP_BONUS' ? '🎉' : h.type === 'DAILY_CHECKIN' ? '✅' : '🌟'}
                     </div>
                     <div className="recent-details">
                        <span className="recent-name">{h.label || 'Action Reward'}</span>
                        <span className="recent-time">{new Date(h.date).toLocaleDateString()}</span>
                     </div>
                     <div className="recent-points">+{h.points}</div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderEcoPoints = () => (
    <div className="dash-details animate-in zoom-in-95">
       <div className="stats-header">
          <div className="streak-box">
             <span className="streak-num">🔥 {user.streak || 1}</span>
             <span className="streak-lab">Day Streak</span>
          </div>
          <div className="rank-box">
             <span className="rank-num">#{(4500 - Math.floor(points / 5)).toLocaleString()}</span>
             <span className="rank-lab">Global Rank</span>
          </div>
       </div>

       <div className="full-chart-box">
          <h3 className="panel-title">Weekly Performance</h3>
          <div style={{ height: '300px', marginTop: '20px' }}>
             <Bar data={barData} options={{...chartOptions, scales: { y: { display: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }}} />
          </div>
       </div>
    </div>
  );

  const renderActivity = () => (
     <div className="dash-details animate-in slide-in-bottom">
        <div className="history-table-container">
          <h3 className="panel-title">Complete Activity Log</h3>
          <p className="panel-subtitle" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px' }}>
             A detailed telemetry of every action taken in the EcoSense network.
          </p>
          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="history-table">
               <thead>
                  <tr>
                     <th>Date</th>
                     <th>Activity</th>
                     <th>Impact</th>
                     <th>Status</th>
                  </tr>
               </thead>
               <tbody>
                  {history.map((h, i) => (
                     <tr key={i}>
                        <td>{new Date(h.date).toLocaleDateString()}</td>
                        <td>{h.label || h.type}</td>
                        <td className="text-primary">+{h.points} XP</td>
                        <td><span className="status-verify">Verified</span></td>
                     </tr>
                  ))}
               </tbody>
            </table>
          </div>
       </div>
     </div>
  );

  const renderSettings = () => (
    <div className="settings-page animate-in fade-in">
       <div className="settings-card">
          <h1 className="welcome-name">Account Settings</h1>
          <div className="settings-info">
             <div className="info-row"><span>Guardian Name:</span> <strong>{user.displayName}</strong></div>
             <div className="info-row"><span>Network ID:</span> <strong>{user.email}</strong></div>
             <div className="info-row"><span>Joined Date:</span> <strong>{joinDate.toLocaleDateString()}</strong></div>
          </div>
          <button 
            className="logout-action-btn"
            onClick={() => { if(confirm('Clear all local session data?')) { localStorage.clear(); window.location.reload(); } }}
          >
             Terminate Local Session
          </button>
       </div>
    </div>
  );

  return (
    <div className="new-dashboard">
      {activeSubTab === 0 && renderHome()}
      {activeSubTab === 1 && renderEcoPoints()}
      {activeSubTab === 2 && renderActivity()}
      {activeSubTab === 3 && renderSettings()}
    </div>
  );
};

export default DashboardTab;
