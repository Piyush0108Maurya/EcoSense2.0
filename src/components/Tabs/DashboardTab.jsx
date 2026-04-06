import React from 'react';
import { DB } from '../../services/db';

const DashboardTab = ({ activeSubTab }) => {
  const user = DB.getUser();
  if (!user) return null;

  const thresholds = [0, 500, 1500, 5000, 10000];
  const lvNames = ["Eco Seedling", "Eco Warrior", "Green Guardian", "Earth Protector", "Planet Champion"];
  const lvEmojis = ["🌱", "🌿", "🌳", "🌍", "⭐"];

  const currentLevelArrIndex = thresholds.findLastIndex(t => user.points >= t) >= 0 ? thresholds.findLastIndex(t => user.points >= t) : 0;
  const nextTarget = thresholds[currentLevelArrIndex + 1] || 10000;
  const progressPercent = Math.min((user.points / nextTarget) * 100, 100);

  // Derive stats
  const itemsClassified = user.history?.length || 0;
  
  // Calculate days active based on join history (just a rough calculation for realism)
  const joinDate = new Date(user.joinDate);
  const now = new Date();
  const diffTime = Math.abs(now - joinDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const renderOverview = () => {
    return (
      <section className="pt-8 pb-32 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-700 font-body">
        
        {/* Profile Card */}
        <div className="bg-[#0f2b21]/80 backdrop-blur-md rounded-2xl p-7 flex flex-col md:flex-row items-center gap-6 border border-[#384c44]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none rounded-full"></div>
          
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center font-headline font-bold text-4xl text-primary bg-gradient-to-br from-[#0f2b21] to-[#0a241c] border-[3px] border-primary/30 shadow-[0_0_25px_rgba(194,247,215,0.15)]">
               {user.initials}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#025d59] p-1.5 rounded-full border-4 border-[#01110b]">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="font-headline font-bold text-3xl text-on-surface mb-1">{user.name}</h1>
            <p className="font-body text-sm text-[#9ab0a6]">{user.email}</p>
            <p className="font-body text-[13px] text-[#9ab0a6]/70 mt-1 italic">Vanguard member since {joinDate.toLocaleDateString()}</p>
            <div className="inline-flex items-center gap-2 mt-4 bg-[#004643]/40 border border-primary/20 rounded-full px-4 py-1.5 shadow-[inset_0_0_10px_rgba(194,247,215,0.05)]">
              <span className="font-headline font-semibold text-[13px] text-primary tracking-wide">
                {lvEmojis[currentLevelArrIndex]} {user.level || lvNames[currentLevelArrIndex]}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0a241c] p-6 rounded-2xl border border-[#384c44]/30 text-center flex flex-col items-center shadow-lg transition-transform hover:-translate-y-1">
            <span className="material-symbols-outlined text-primary mb-3 text-3xl">category</span>
            <span className="font-headline font-bold text-3xl text-on-surface mb-1">{itemsClassified}</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#9ab0a6]">Items Classified</span>
          </div>
          <div className="bg-[#0a241c] p-6 rounded-2xl border border-[#384c44]/30 text-center flex flex-col items-center shadow-lg transition-transform hover:-translate-y-1">
            <span className="material-symbols-outlined text-primary mb-3 text-3xl">location_city</span>
            <span className="font-headline font-bold text-3xl text-on-surface mb-1">4</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#9ab0a6]">Cities Scanned</span>
          </div>
          <div className="bg-[#0a241c] p-6 rounded-2xl border border-[#384c44]/30 text-center flex flex-col items-center shadow-lg transition-transform hover:-translate-y-1">
            <span className="material-symbols-outlined text-[#efc680] mb-3 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="font-headline font-bold text-3xl text-on-surface mb-1">{user.points.toLocaleString()}</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#9ab0a6]">Net Points</span>
          </div>
          <div className="bg-[#0a241c] p-6 rounded-2xl border border-[#384c44]/30 text-center flex flex-col items-center shadow-lg transition-transform hover:-translate-y-1">
            <span className="material-symbols-outlined text-primary mb-3 text-3xl">calendar_today</span>
            <span className="font-headline font-bold text-3xl text-on-surface mb-1">{diffDays}</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#9ab0a6]">Days Active</span>
          </div>
        </div>

        {/* Eco Points Showcase */}
        <div className="bg-gradient-to-b from-[#0f2b21] to-[#0a241c] rounded-2xl p-8 md:p-10 border border-[#384c44]/40 shadow-xl overflow-hidden relative">
          
          <div className="text-center mb-10 relative z-10">
            <span className="font-label text-[11px] uppercase tracking-[0.3em] text-[#9ab0a6] block mb-3 font-semibold">Current Balance</span>
            <h2 className="font-headline font-black text-6xl md:text-8xl text-[#efc680] drop-shadow-[0_0_20px_rgba(239,198,128,0.25)] tracking-tighter mb-4">{user.points.toLocaleString()}</h2>
            <p className="font-body text-sm text-[#9ab0a6] bg-black/20 inline-block px-4 py-2 rounded-full border border-white/5">
              Next tier unlocked in <span className="text-primary font-bold">{nextTarget - user.points} pts</span>
            </p>
          </div>

          {/* Level progression track */}
          <div className="relative h-28 mb-4 max-w-3xl mx-auto z-10">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-black/40 -translate-y-1/2 rounded-full border border-white/5"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-emerald-400 -translate-y-1/2 rounded-full z-10 shadow-[0_0_10px_#c2f7d7]" style={{ width: `${progressPercent}%`, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
            
            <div className="flex justify-between items-center h-full relative z-20">
              {thresholds.map((t, i) => {
                 const reached = user.points >= t;
                 const active = currentLevelArrIndex === i;
                 return (
                  <div key={i} className={`flex flex-col items-center gap-2 ${reached ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                       ${reached ? 'bg-[#0f2b21] border-primary shadow-[0_0_15px_rgba(194,247,215,0.3)]' : 'bg-[#031710] border-[#384c44]'}
                       ${active && 'scale-125 bg-primary border-primary shadow-[0_0_20px_rgba(194,247,215,0.6)]'}
                    `}>
                      <span className={`material-symbols-outlined text-sm ${active ? 'text-[#01110b]' : reached ? 'text-primary' : 'text-[#9ab0a6]'}`} style={reached ? { fontVariationSettings: "'FILL' 1" } : {}}>
                         {reached ? 'eco' : 'lock'}
                      </span>
                    </div>
                    <div className="text-center absolute top-[70%] transform -translate-x-[0%]">
                      <p className={`font-headline font-bold text-[11px] whitespace-nowrap mt-4 ${active ? 'text-primary' : reached ? 'text-[#e2f9ed]' : 'text-[#9ab0a6]'}`}>{lvEmojis[i]} {lvNames[i]}</p>
                      <p className={`font-body text-[10px] ${reached ? 'text-primary/70' : 'text-[#9ab0a6]/50'}`}>{t.toLocaleString()} pts</p>
                    </div>
                  </div>
                 )
              })}
            </div>
          </div>
        </div>

        {/* History & Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Points History */}
          <div className="bg-[#0f2b21]/60 rounded-2xl p-6 border border-[#384c44]/30">
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-[#9ab0a6] mb-5">Ledger</h3>
            <div className="space-y-3">
              {user.history?.slice(0, 5).map((h, i) => (
                 <div key={i} className="flex items-center justify-between font-body text-sm bg-black/20 px-4 py-3 rounded-xl border border-white/5 hover:bg-black/30 transition-colors">
                   <div className="flex flex-col">
                     <span className="text-[#e2f9ed] font-medium">{h.item}</span>
                     <span className="text-[10px] text-[#9ab0a6] uppercase tracking-wider mt-0.5">{new Date(h.date).toLocaleDateString()}</span>
                   </div>
                   <span className="text-primary font-headline font-bold bg-primary/10 px-3 py-1 rounded-full">{h.points > 0 ? '+' : ''}{h.points}</span>
                 </div>
              )) || <div className="text-sm text-[#9ab0a6] italic">No ledger entries detected.</div>}
            </div>
          </div>

          {/* How to earn points */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#0a241c] rounded-2xl p-6 border border-[#384c44]/30">
              <h3 className="font-headline font-semibold text-lg text-[#e2f9ed] mb-5">Earn Telemetry Points</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-primary text-xl">recycling</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm text-[#e2f9ed] font-medium">Classify Unknown Matter</p>
                    <p className="text-[11px] text-[#9ab0a6] mt-0.5">+5 to 25 pts per successful scan</p>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#efc680]/10 group-hover:bg-[#efc680]/20 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-[#efc680] text-xl">login</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm text-[#e2f9ed] font-medium">Connection Bonus</p>
                    <p className="text-[11px] text-[#9ab0a6] mt-0.5">+10 pts per daily network sync</p>
                  </div>
                </li>
              </ul>
            </div>

            <button className="w-full flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl py-5 transition-all duration-300 active:scale-[0.98]">
              <span className="material-symbols-outlined text-primary">share</span>
              <span className="font-headline font-bold text-[#e2f9ed] tracking-wide">Share EcoSense <span className="text-primary font-black ml-1">+50 PTS</span></span>
            </button>
          </div>
        </div>

      </section>
    );
  };

  const renderSettings = () => {
    return (
      <section className="pt-8 pb-32 px-4 max-w-lg mx-auto flex flex-col gap-6 animate-in fade-in">
        <div className="bg-[#0f2b21]/80 rounded-2xl p-8 border border-[#384c44]/40 shadow-xl">
          <h2 className="font-headline text-2xl font-bold text-white mb-6">System Preferences</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-[#9ab0a6] mb-2 pl-1">Display Designation</label>
              <input type="text" readOnly value={user.name} className="w-full bg-[#031710] border border-[#384c44]/50 rounded-xl px-4 py-3 text-[#e2f9ed] opacity-80" />
            </div>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-[#9ab0a6] mb-2 pl-1">Network Identity</label>
              <input type="text" readOnly value={user.email} className="w-full bg-[#031710] border border-[#384c44]/50 rounded-xl px-4 py-3 text-[#e2f9ed] opacity-80" />
            </div>

            <hr className="border-[#384c44]/30 my-6" />

            <div className="p-4 rounded-xl border border-error/20 bg-error/5">
              <h3 className="font-headline font-semibold text-error mb-1">Purge Local Matrix</h3>
              <p className="font-body text-xs text-[#9ab0a6] mb-4">Warning: This will permanently eradicate all local progression, points, and history.</p>
              <button 
                className="w-full bg-error text-white font-label font-bold uppercase tracking-widest text-xs py-3 rounded-xl hover:bg-[#ff5564] transition-colors"
                onClick={() => { if(confirm('Eradicate all local telemetry?')) { localStorage.clear(); window.location.reload(); } }}
              >
                Initiate Purge
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="w-full">
      {activeSubTab === 0 && renderOverview()}
      {activeSubTab === 1 && renderOverview()} {/* Map points tab back to overview as it's consolidated */}
      {activeSubTab === 2 && renderOverview()} {/* Map activity tab back to overview */}
      {activeSubTab === 3 && renderSettings()}
    </div>
  );
};

export default DashboardTab;
