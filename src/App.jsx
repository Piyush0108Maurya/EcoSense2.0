import React, { useState, useEffect } from 'react';
import { DB } from './services/db';
import { auth, logout, getUserStats, addActivityPoints } from './services/firebase';
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
import Achievement from './components/UI/Achievement';

function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [user, setUser] = useState(null);
  const [isLandingView, setIsLandingView] = useState(true);
  const [activeTab, setActiveTab] = useState('aqi');
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [toast, setToast] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);

  useEffect(() => {
    // ── FIREBASE AUTH LISTENER ──
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional stats from Firestore
        const stats = await getUserStats(firebaseUser.uid);

        if (stats) {
          setUser(stats);
          DB.saveUser(stats);

          // Trigger Daily Check-in automatically
          handlePointsUpdate('DAILY_CHECKIN');

          // ── CHECK FOR WELCOME ACHIEVEMENT ──
          const hasSignupBonus = stats.impactHistory?.some(h => h.type === 'SIGNUP_BONUS');
          const alreadySeen = localStorage.getItem(`achievement_seen_signup_${firebaseUser.uid}`);
          
          if (hasSignupBonus && !alreadySeen) {
            // Delay slightly to follow the landing animation
            setTimeout(() => {
              setShowAchievement({
                title: "Eco Genesis",
                message: "Welcome to the EcoSense network, Guardian! Your path to environmental preservation begins here.",
                points: 100,
                icon: "🌿",
                uid: firebaseUser.uid
              });
            }, 3000);
          }
        }
        setIsLandingView(false); // Move into app if logged in
      } else {
        setUser(null);
        DB.logout();
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

  /**
   * CENTRALIZED GAMIFIED POINT HANDLER
   * Handles Local UI updates and Firestore Sync
   */
  const handlePointsUpdate = async (activityType, metadata = {}) => {
    if (!user) return;

    // 1. Instant UI Feedback (Local Proxy)
    const result = DB.applyActivityXP(activityType, metadata);
    if (result) {
      setUser({ ...result.user });
      setToast({ points: result.addedXP, message: result.label });
      console.log(`[EcoSense Gamification] Activity: ${activityType} | XP: +${result.addedXP}`);
    }

    // 2. Cloud Synchronization
    try {
      const cloudRes = await addActivityPoints(user.uid, activityType, metadata);
      if (cloudRes && cloudRes.isNewDay) {
        // Refresh local user to get the new streak from cloud
        const freshStats = await getUserStats(user.uid);
        if (freshStats) {
          setUser(freshStats);
          DB.saveUser(freshStats);
        }
      }
    } catch (err) {
      console.warn("Gamification Sync Failed:", err);
    }
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
        {activeTab !== 'neighbour' && activeTab !== 'waste' && (
          <StatusBars
            activeTab={activeTab}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            user={user}
          />
        )}



        <div className="view-panel" style={{ paddingTop: (activeTab === 'neighbour' || activeTab === 'waste') ? '0' : '72px' }}>
          {(activeTab === 'aqi') && <AQI activeSubTab={activeSubTab} onPointsUpdate={handlePointsUpdate} />}
          {activeTab === 'waste' && <WasteGuide onPointsUpdate={handlePointsUpdate} activeSubTab={activeSubTab} user={user} />}
          {activeTab === 'neighbour' && <NeighbourWaste activeSubTab={activeSubTab} user={user} onPointsUpdate={handlePointsUpdate} />}
          {activeTab === 'dashboard' && <DashboardTab activeSubTab={activeSubTab} user={user} />}
        </div>

        {/* Floating Lumi Spirit (Hidden in Dashboard for better focus) */}
        {activeTab !== 'dashboard' && (
          <LumiSpirit isSidebarExpanded={sidebarExpanded} onPointsUpdate={handlePointsUpdate} />
        )}
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

      {/* ── ACHIEVEMENT MODAL ── */}
      {showAchievement && (
        <Achievement
          title={showAchievement.title}
          message={showAchievement.message}
          points={showAchievement.points}
          icon={showAchievement.icon}
          onComplete={() => {
            localStorage.setItem(`achievement_seen_signup_${showAchievement.uid}`, 'true');
            setShowAchievement(null);
          }}
        />
      )}
    </div>
  );
}

export default App;



