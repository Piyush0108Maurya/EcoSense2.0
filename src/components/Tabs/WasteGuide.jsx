import React, { useState } from 'react';
import { askGemini } from '../../services/api';
import { addPoints } from '../../services/firebase';
import { DB } from '../../services/db';
import './WasteGuide.css';

const WasteGuide = ({ onPointsUpdate, user }) => {
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

      // Save to Cloud (Firebase) if user is logged in
      if (user?.uid) {
        await addPoints(user.uid, parsed.ecoPoints);
      }

      // Keep local for UI speed
      DB.addHistory(item, parsed);

      if (onPointsUpdate) onPointsUpdate(parsed.ecoPoints, `Classified ${item}! 🌿`);
    } catch (err) {
      setError("Lumi needs a fresh breath of air 🌿 Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-body w-full relative overflow-hidden" style={{ background: 'var(--surface)' }}>
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)] opacity-[0.08] blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[var(--primary)] opacity-[0.05] blur-[120px] rounded-full"></div>

      <section className="pt-12 pb-24 md:pb-12 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col gap-12">

          {/* ── TOP SECTION: SEARCH & HEADER ── */}
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto w-full">

            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8AEBFF]/10 border border-[#8AEBFF]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8AEBFF] animate-pulse"></span>
                <span className="text-[#8AEBFF] font-label text-[10px] uppercase tracking-[0.2em] font-bold">Intelligent Sorting Module</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tight leading-[0.9]">
                Eco<span className="text-[#8AEBFF]">Sort</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
                Harnessing AI to decode waste complexity. Type any object to receive instant disposal protocols.
              </p>
            </header>

            {/* Search Area */}
            <div className="w-full relative group">
              <div className="absolute inset-0 bg-[#8AEBFF]/5 blur-[20px] rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center p-2 bg-[#0A1020] border border-white/5 rounded-[24px] shadow-2xl focus-within:border-[#8AEBFF]/30 transition-all">
                <span className="material-symbols-outlined ml-6 text-gray-500">search</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClassify()}
                  disabled={loading}
                  className="flex-1 h-14 bg-transparent border-none text-white px-4 font-body text-lg outline-none placeholder:text-gray-600"
                  placeholder="Analyze object (e.g., Lithium Battery, Tetrapak)..."
                />
                <button
                  disabled={loading}
                  onClick={() => handleClassify()}
                  className={`h-14 px-10 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${loading ? 'bg-gray-800 text-gray-500' : 'bg-[#8AEBFF] text-[#070D1F] shadow-[0_0_20px_rgba(138,235,255,0.3)] hover:shadow-[0_0_40px_rgba(138,235,255,0.5)]'}`}
                >
                  {loading ? 'Processing...' : 'Analyze'}
                </button>
              </div>
            </div>

            {/* Example Chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-on-surface-variant font-label text-xs mr-2">Quick lookup:</span>
              {["Pizza box", "Coffee cup", "AA Battery", "LED Bulb", "Banana peel", "Old phone"].map(item => (
                <button
                  key={item}
                  onClick={() => { setInput(item); handleClassify(item); }}
                  className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-primary px-4 py-1.5 rounded-full text-xs font-label transition-all border border-outline-variant/20 hover:border-primary/30"
                >
                  {item}
                </button>
              ))}
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">{error}</div>}
          </div>

          {/* ── MAIN CONTENT GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* LEFT: RESULTS OR INTRO */}
            <div className="space-y-8">
              {result ? (
                /* RESULT CARD */
                <div className="bg-[#0E1428] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 md:p-12 space-y-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl flex items-center justify-center border shadow-inner" style={{ backgroundColor: `${result.color}15`, borderColor: `${result.color}30` }}>
                          <span className="material-symbols-outlined text-5xl" style={{ color: result.color }}>
                            {result.category === 'Recyclable' ? 'recycling' : result.category === 'Compostable' ? 'compost' : result.category === 'Hazardous' ? 'warning' : result.category === 'E-Waste' ? 'devices' : result.category === 'Wet Waste' ? 'water_drop' : 'delete'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">Classified Object</span>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: result.color, boxShadow: `0 0 10px ${result.color}` }}></span>
                          </div>
                          <h2 className="text-4xl font-headline font-black text-white">{result.itemName}</h2>
                          <p className="text-[#8AEBFF] font-bold text-sm tracking-widest uppercase mt-1">{result.category}</p>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">AI Precision</div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-[#8AEBFF]" style={{ width: `${result.confidence}%` }}></div>
                          </div>
                          <span className="text-xl font-headline font-black text-[#8AEBFF]">{result.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-[#8AEBFF]/05 border border-[#8AEBFF]/10 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3 text-[#8AEBFF]">
                          <span className="material-symbols-outlined">verified</span>
                          <span className="font-bold text-xs uppercase tracking-widest">Protocols</span>
                        </div>
                        <ul className="space-y-3">
                          {result.dos.map((d, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                              <span className="w-1 h-1 bg-[#8AEBFF] rounded-full"></span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 bg-red-500/05 border border-red-500/10 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3 text-red-400">
                          <span className="material-symbols-outlined">dangerous</span>
                          <span className="font-bold text-xs uppercase tracking-widest">Restrictions</span>
                        </div>
                        <ul className="space-y-3">
                          {result.donts.map((d, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black italic">E</div>
                        <div>
                          <div className="text-xl font-headline font-black text-white">+{result.ecoPoints} CREDITS</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Added to synchronization</div>
                        </div>
                      </div>
                      <button onClick={() => setResult(null)} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all">Dismiss Analysis</button>
                    </div>
                  </div>
                </div>
              ) : (
                /* EMPTY STATE / INTRO */
                <div className="p-12 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-600">bubble_chart</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold text-white">System Idle</h3>
                    <p className="text-gray-500 max-w-sm">Awaiting input for real-time waste decomposition. Lumi core is ready for analysis.</p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: SIDEBAR */}
            <div className="space-y-8">
              {/* Category Legend */}
              <div className="p-8 bg-[#0E1428] border border-white/5 rounded-[32px] space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Protocols</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Wet Waste', color: '#8AEBFF', bin: 'Ocean' },
                    { label: 'Dry Waste', color: '#22D3EE', bin: 'Blue' },
                    { label: 'Hazardous', color: '#FF4D4D', bin: 'Red' },
                    { label: 'E-Waste', color: '#B0B0B0', bin: 'Black' }
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: cat.color, backgroundColor: cat.color }}></div>
                        <span className="text-sm font-bold text-gray-300">{cat.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full uppercase">{cat.bin}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Impact Card */}
              <div className="p-8 bg-gradient-to-br from-[#8AEBFF]/15 to-transparent border border-[#8AEBFF]/15 rounded-[32px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <span className="material-symbols-outlined text-8xl">eco</span>
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="text-[10px] font-bold text-[#8AEBFF] uppercase tracking-[0.3em]">Week Impact</div>
                  <div>
                    <div className="text-5xl font-headline font-black text-white">{user?.history?.reduce((acc, curr) => acc + curr.points, 0) || 0}</div>
                    <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Global Synchronization</div>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8AEBFF] shadow-[0_0_10px_#8AEBFF]" style={{ width: `${Math.min(((user?.history?.reduce((acc, curr) => acc + curr.points, 0) || 0) / 500) * 100, 100)}%` }}></div>
                  </div>
                  <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-xs text-gray-400 leading-relaxed italic">
                    "Each object classified is a step towards planetary restoration."
                  </div>
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
