import React, { useState } from 'react';
import { askGemini } from '../../services/api';
import { addPoints } from '../../services/firebase';
import { DB } from '../../services/db';
import './WasteGuide.css';

const WasteGuide = ({ onPointsUpdate, user, activeSubTab }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClassify = async (item = input) => {
    if (!item.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const systemPrompt = `You are EcoBot, India's expert waste classification AI. Respond ONLY with a valid JSON object. Exact format:
    {
      "category": "Recyclable" | "Compostable" | "Hazardous" | "Dry Waste" | "Wet Waste" | "E-Waste",
      "color": "hex color (#5AB87A green, #E07C4A orange, #C94F4F red, #7AB8D4 blue)",
      "emoji": "single emoji matching the item",
      "confidence": integer (85-99),
      "tip": "one-sentence disposal tip for India",
      "dos": ["action1", "action2"], "donts": ["avoid1", "avoid2"],
      "ecoPoints": integer (5-25),
      "funFact": "surprising environmental fact string"
    }`;

    try {
      const raw = await askGemini(systemPrompt, `Classify this waste item for India: ${item}`);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult({ ...parsed, itemName: item });

      if (user?.uid) {
        await addPoints(user.uid, parsed.ecoPoints);
      }

      DB.addHistory(item, parsed);

      if (onPointsUpdate) onPointsUpdate(parsed.ecoPoints, `Classified ${item}! 🌿`);
    } catch (err) {
      setError("Lumi needs a fresh breath of air 🌿 Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ecosort-container">
      <div className="ecosort-glow-top"></div>
      <div className="ecosort-glow-bottom"></div>

      <section className="ecosort-section">
        <div className="flex flex-col gap-12">

          {/* ── TOP SECTION: SEARCH & HEADER ── */}
          <div className="ecosort-header">
            <header className="space-y-4">
              <div className="module-badge">
                <span className="module-badge-dot"></span>
                <span className="module-badge-text">Intelligent Sorting Module</span>
              </div>
              <h1 className="ecosort-title">
                Eco<span>Sort</span>
              </h1>
              <p className="ecosort-subtitle">
                Harnessing AI to decode waste complexity. Type any object to receive instant disposal protocols.
              </p>
            </header>

            {/* Search Area */}
            <div className="search-wrapper">
              <div className="search-glow"></div>
              <div className="search-bar shadow-xl">
                <span className="material-symbols-outlined ml-6 text-on-surface-variant/40">search</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClassify()}
                  disabled={loading}
                  className="search-input"
                  placeholder="Analyze object (e.g., Lithium Battery, Tetrapak)..."
                />
                <button
                  disabled={loading}
                  onClick={() => handleClassify()}
                  className="search-button"
                >
                  {loading ? 'Processing...' : 'Analyze'}
                </button>
              </div>
            </div>

            {/* Example Chips */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="text-on-surface-variant font-label text-xs mr-2">Quick lookup:</span>
              {["Pizza box", "Coffee cup", "AA Battery", "LED Bulb", "Banana peel", "Old phone"].map(item => (
                <button
                  key={item}
                  onClick={() => { setInput(item); handleClassify(item); }}
                  className="chip shadow-sm"
                >
                  {item}
                </button>
              ))}
            </div>

            {error && <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm">{error}</div>}
          </div>

          {/* ── MAIN CONTENT GRID ── */}
          <div className="ecosort-grid">

            {/* LEFT: RESULTS OR INTRO */}
            <div className="space-y-8">
              {result ? (
                /* RESULT CARD */
                <div className="result-card-container">
                    {/* Header */}
                    <div className="result-header">
                      <div className="flex items-center gap-6">
                        <div className="result-icon-box" style={{ backgroundColor: `${result.color}15`, borderColor: `${result.color}30` }}>
                          <span className="material-symbols-outlined text-5xl" style={{ color: result.color }}>
                            {result.category === 'Recyclable' ? 'recycling' : result.category === 'Compostable' ? 'compost' : result.category === 'Hazardous' ? 'warning' : result.category === 'E-Waste' ? 'devices' : result.category === 'Wet Waste' ? 'water_drop' : 'delete'}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Classified Object</span>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: result.color, boxShadow: `0 0 10px ${result.color}` }}></span>
                          </div>
                          <h2 className="text-4xl font-headline font-black text-on-surface uppercase tracking-tight">{result.itemName}</h2>
                          <p className="text-primary font-bold text-sm tracking-widest uppercase mt-1">{result.category}</p>
                        </div>
                      </div>
                      
                      <div className="ai-precision-box">
                        <div className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-2">AI Precision</div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${result.confidence}%` }}></div>
                          </div>
                          <span className="text-xl font-headline font-black text-primary">{result.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 md:p-12 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="protocol-box border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-3 text-primary">
                          <span className="material-symbols-outlined">verified</span>
                          <span className="font-bold text-xs uppercase tracking-widest">Protocols</span>
                        </div>
                        <ul className="space-y-3">
                          {result.dos.map((d, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-on-surface/80">
                              <span className="w-1 h-1 bg-primary rounded-full"></span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="protocol-box border-error/20 bg-error/5">
                        <div className="flex items-center gap-3 text-error">
                          <span className="material-symbols-outlined">dangerous</span>
                          <span className="font-bold text-xs uppercase tracking-widest">Restrictions</span>
                        </div>
                        <ul className="space-y-3">
                          {result.donts.map((d, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-on-surface/80">
                              <span className="w-1 h-1 bg-error rounded-full"></span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="result-footer">
                      <div className="credits-badge">
                        <div className="credits-circle">E</div>
                        <div className="text-left">
                          <div className="text-xl font-headline font-black text-on-surface">+{result.ecoPoints} CREDITS</div>
                          <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Added to synchronization</div>
                        </div>
                      </div>
                      <button onClick={() => setResult(null)} className="px-8 py-3 bg-surface-container-highest hover:bg-surface-bright border border-white/5 rounded-xl text-sm font-bold transition-all uppercase tracking-widest text-on-surface-variant">Dismiss</button>
                    </div>
                </div>
              ) : (
                /* EMPTY STATE */
                <div className="p-12 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center text-center space-y-6 bg-surface-container/20">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">bubble_chart</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-tight">System Idle</h3>
                    <p className="text-on-surface-variant max-w-sm">Awaiting input for real-time waste decomposition. Lumi core is ready for analysis.</p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: SIDEBAR */}
            <div className="space-y-8">
              <div className="sidebar-card">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant/60">Protocols</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Wet Waste', color: '#8AEBFF', bin: 'Ocean' },
                    { label: 'Dry Waste', color: '#22D3EE', bin: 'Blue' },
                    { label: 'Hazardous', color: '#FF4D4D', bin: 'Red' },
                    { label: 'E-Waste', color: '#B0B0B0', bin: 'Black' }
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color, boxShadow: `0 0 10px ${cat.color}` }}></div>
                        <span className="text-sm font-bold text-on-surface-variant">{cat.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-on-surface-variant/40 bg-surface-container-low px-3 py-1 rounded-full uppercase">{cat.bin}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="impact-card-gradient">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <span className="material-symbols-outlined text-8xl">eco</span>
                </div>
                <div className="relative z-10 space-y-6 text-left">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Week Impact</div>
                  <div>
                    <div className="text-5xl font-headline font-black text-on-surface">{user?.history?.reduce((acc, curr) => acc + curr.points, 0) || 0}</div>
                    <div className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-widest">Global Synchronization</div>
                  </div>
                  <button className="w-full py-3 bg-primary text-surface rounded-xl font-headline font-black uppercase text-xs tracking-widest shadow-lg">View Reports</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default WasteGuide;
