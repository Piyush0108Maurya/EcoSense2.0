import React, { useState, useEffect } from 'react';
import { getLevel } from './services/db';
import { auth, logout, getUserStats } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
import AuthScreen from './components/UI/AuthScreen';
import LogoutModal from './components/UI/LogoutModal';
import Landing from './components/Landing/Landing';

function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [user, setUser] = useState(null);
  const [isLandingView, setIsLandingView] = useState(true);
  const [activeTab, setActiveTab] = useState('aqi');
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [toast, setToast] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // ── FIREBASE AUTH LISTENER ──
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional stats from Firestore
        const stats = await getUserStats(firebaseUser.uid);
        const points = stats?.points || 0;
        
        setUser({
          uid: firebaseUser.uid,
          displayName: stats?.displayName || firebaseUser.displayName || 'Eco Guardian',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          points: points,
          level: getLevel(points),
          initials: (stats?.displayName || firebaseUser.displayName || 'EG').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
        });
        setIsLandingView(false); // Move into app if logged in
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSubTab(0);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsLandingView(true); // Return to landing
      setShowLogoutModal(false);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const handlePointsUpdate = (pts, message) => {
    if (pts) setToast({ points: pts, message });
    // In a real app we would call addPoints(user.uid, pts) here
    // For now we update local state
    setUser(prev => {
      if (!prev) return prev;
      const newPoints = (prev.points || 0) + pts;
      return {
        ...prev,
        points: newPoints,
        level: getLevel(newPoints)
      };
    });
  };

  // If loading, show splash
  if (!isAuthReady || !isAnimationDone) {
    return <LoadingScreen onComplete={() => setIsAnimationDone(true)} readyToUnmount={isAuthReady} />;
  }

  // If not logged in and in landing view
  if (!user && isLandingView) {
    return <Landing onStart={() => setIsLandingView(false)} />;
  }

  // If not logged in and not in landing view (User clicked "Initialize")
  if (!user) {
    return <AuthScreen onBack={() => setIsLandingView(true)} />;
  }


  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', position: 'relative' }}>
      <Particles />

      {/* ── SIDE NAV ── */}
      <SideNav
        user={user}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        onLogout={handleLogoutClick}
      />

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '80px' }}>
        <StatusBars
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          user={user}
        />

        <PointsProgress user={user} />

        <div className="view-panel" style={{ paddingTop: '72px' }}>
          {(activeTab === 'aqi') && <AQI activeSubTab={activeSubTab} />}
          {activeTab === 'waste' && <WasteGuide onPointsUpdate={handlePointsUpdate} activeSubTab={activeSubTab} user={user} />}
          {activeTab === 'neighbour' && <NeighbourWaste activeSubTab={activeSubTab} user={user} />}
          {activeTab === 'dashboard' && <DashboardTab activeSubTab={activeSubTab} user={user} />}
        </div>

        {/* Floating Lumi Spirit */}
        <LumiSpirit isSidebarExpanded={sidebarExpanded} />
      </div>

      {showLogoutModal && (
        <LogoutModal 
          user={user}
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          points={toast.points}
          onComplete={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;



