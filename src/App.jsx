import React, { useState, useEffect } from 'react';
import { getLevel } from './services/db';
import SideNav from './components/common/SideNav';
import Particles from './components/common/Particles';
import AQI from './components/Tabs/AQI';
import WasteGuide from './components/Tabs/WasteGuide';
import DashboardTab from './components/Tabs/DashboardTab';
import NeighbourWaste from './components/Tabs/NeighbourWaste';
import StatusBars from './components/common/StatusBars';
import PointsProgress from './components/common/PointsProgress';
import LumiSpirit from './components/common/LumiSpirit';
import Toast from './components/UI/Toast';
import LoadingScreen from './components/UI/LoadingScreen';

const GUEST_USER = {
  uid: 'guest',
  displayName: 'Eco Guardian',
  email: 'guest@ecosense.io',
  points: 1250,
  initials: 'EG',
  level: getLevel(1250),
  photoURL: null
};

function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [user, setUser] = useState(GUEST_USER);
  const [activeTab, setActiveTab] = useState('aqi');
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [toast, setToast] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    // Artificial delay to mark readiness
    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSubTab(0);
  };

  const handlePointsUpdate = (pts, message) => {
    if (pts) setToast({ points: pts, message });
    setUser(prev => {
      const newPoints = (prev.points || 0) + pts;
      return {
        ...prev,
        points: newPoints,
        level: getLevel(newPoints)
      };
    });
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', position: 'relative' }}>
      {(!isAuthReady || !isAnimationDone) ? (
        <LoadingScreen onComplete={() => setIsAnimationDone(true)} readyToUnmount={isAuthReady} />
      ) : (
        <>
          <Particles />

          {/* ── SIDE NAV ── */}
          <SideNav
            user={user}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            expanded={sidebarExpanded}
            setExpanded={setSidebarExpanded}
          />

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '80px' }}>
            {activeTab === 'aqi' && (
              <StatusBars
                activeTab={activeTab}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                user={user}
              />
            )}

            <PointsProgress user={user} />

            <div className="view-panel" style={{ paddingTop: activeTab === 'aqi' ? '72px' : '32px' }}>
              {(activeTab === 'aqi') && <AQI activeSubTab={activeSubTab} />}
              {activeTab === 'waste' && <WasteGuide onPointsUpdate={handlePointsUpdate} activeSubTab={activeSubTab} user={user} />}
              {activeTab === 'neighbour' && <NeighbourWaste activeSubTab={activeSubTab} user={user} />}
              {activeTab === 'dashboard' && <DashboardTab activeSubTab={activeSubTab} />}
            </div>

            {/* Floating Lumi Spirit */}
            <LumiSpirit isSidebarExpanded={sidebarExpanded} />
          </div>

          {toast && (
            <Toast
              message={toast.message}
              points={toast.points}
              onComplete={() => setToast(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
