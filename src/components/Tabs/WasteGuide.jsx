import React, { useState, useCallback, useRef, useEffect } from 'react';
import { WASTE_CATEGORIES, getNearestCollectors, reverseGeocode } from '../../services/collectors';
import { DB } from '../../services/db';
import './WasteGuide.css';

/* ── Minimal Proximity Hub ────────────────────────── */
const ProximityHub = ({ km }) => {
  const isNear = km < 10;
  const isExtreme = km > 100;
  let status = 'Mid-Range'; let color = '#22D3EE';
  if (isNear) { status = 'Local Spot'; color = '#5AB87A'; }
  if (isExtreme) { status = 'Extreme Reach'; color = '#F97316'; }

  return (
    <div className="wg-prox-hub" style={{ '--hub-color': color }}>
      <div className="wg-prox-bar">
        <div className="wg-prox-fill" style={{ width: `${Math.min((km/120)*100, 100)}%` }} />
      </div>
      <div className="wg-prox-meta">
        <span className="wg-prox-status">{status}</span>
        <span className="wg-prox-val">{km} <span>km</span></span>
      </div>
    </div>
  );
};

const WasteGuide = ({ onPointsUpdate }) => {
  const [location, setLocation]           = useState(null);
  const [cityName, setCityName]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [collectors, setCollectors]       = useState([]);
  const [locLoading, setLocLoading]       = useState(false);
  const [locError, setLocError]           = useState(null);
  const [contacted, setContacted]         = useState(new Set());
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  
  const menuRef = useRef(null);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocError('Geolocation not supported.'); return; }
    setLocLoading(true); setLocError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLocation(coords);
        const city = await reverseGeocode(coords);
        setCityName(city);
        if (selectedCategory) setCollectors(getNearestCollectors(coords, selectedCategory));
        setTimeout(() => setLocLoading(false), 1500); 
      },
      (err) => { setLocLoading(false); setLocError('Location access denied.'); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [selectedCategory]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId); setIsMenuOpen(false);
    if (location) setCollectors(getNearestCollectors(location, catId));
    else detectLocation();
  };

  const handleContacted = (collector) => {
    if (contacted.has(collector.id)) return;
    setContacted(prev => new Set([...prev, collector.id]));
    if (onPointsUpdate) onPointsUpdate('CONTACT_HUB', { name: collector.name });
  };

  useEffect(() => {
    const handleClickOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCat = WASTE_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="wg-root" id="waste-guide-root">
      <div className="wg-glow wg-glow-1" />
      <div className="wg-glow wg-glow-2" />
      <div className="wg-grid-overlay" />

      <section className="wg-section">
        
        {/* ── PREMIUM CENTERED HERO ── */}
        <div className="wg-hero-premium">
          <div className="wg-brand-stack">
            <div className="wg-badge-mini">🌍 Environment Dashboard</div>
            <h1 className="wg-title-premium">
              Eco<span>Sort</span>
            </h1>
          </div>

          <div className="wg-control-group">
            <div className="wg-location-scanner-v4">
              {locLoading ? (
                <div className="wg-radar-bar">
                  <div className="wg-radar-sweep-bar" />
                  <span className="wg-radar-text-mini">SEARCHING SATELLITE...</span>
                </div>
              ) : (
                <div className={`wg-loc-tile-v4 ${location ? 'located' : ''}`}>
                  {location ? (
                    <div className="wg-loc-found-v4 anim-pop-in">
                      <div className="wg-loc-city-wrap">
                        <div className="wg-loc-indicator"><span className="dot" /></div>
                        <div className="wg-loc-content">
                          <h3 className="city-label">{cityName || 'Unknown City'}</h3>
                          <span className="coords-label">{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
                        </div>
                      </div>
                      <button className="wg-refresh-mini" onClick={detectLocation} title="Refresh Location">
                        <span className="material-symbols-outlined">refresh</span>
                      </button>
                    </div>
                  ) : (
                    <button className="wg-btn-detect-v4" onClick={detectLocation}>
                      <span className="material-symbols-outlined">my_location</span>
                      <span>Detect Position</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className={`wg-selector-v4 ${isMenuOpen ? 'portal-active' : ''}`} ref={menuRef}>
              <button className={`wg-menu-trigger-v4 ${selectedCategory ? 'has-selection' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="wg-menu-trigger-content-v4">
                  <span className="material-symbols-outlined">{activeCat ? activeCat.icon : 'category'}</span>
                  <span className="label-text">{activeCat ? activeCat.label : 'Select Waste Type'}</span>
                </div>
                <span className={`material-symbols-outlined arrow ${isMenuOpen ? 'open' : ''}`}>expand_more</span>
              </button>

              {isMenuOpen && (
                <div className="wg-menu-dropdown-v4 anim-slide-down">
                  <div className="wg-menu-scroll">
                    <div className="wg-menu-grid">
                      {WASTE_CATEGORIES.map(cat => (
                        <button key={cat.id} className={`wg-menu-item-v4 ${selectedCategory === cat.id ? 'active' : ''}`} onClick={() => handleCategorySelect(cat.id)}>
                          <div className="wg-menu-item-icon-v4" style={{ color: cat.color }}><span className="material-symbols-outlined">{cat.icon}</span></div>
                          <span className="wg-menu-item-label-v4">{cat.label}</span>
                          <span className="wg-menu-item-emoji-v4">{cat.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {locError && <div className="wg-error-banner-v3">{locError}</div>}

        {/* ── LUXURY RESULTS AREA ── */}
        <div className="wg-main-display">
          {selectedCategory ? (
            <div className="wg-results-wrap">
              <div className="wg-results-top">
                <div className="wg-results-count"><span className="material-symbols-outlined">auto_awesome</span> Found {collectors.length} High-Ranked Collectors</div>
              </div>

              {location && collectors.length > 0 && (
                <div className="wg-collector-grid-v5">
                  {collectors.map((c, i) => (
                    <div key={c.id} className={`wg-card-v5 ${contacted.has(c.id) ? 'contacted' : ''}`} style={{ '--idx': i, '--prox-color': c.distanceKm < 10 ? '#5AB87A' : (c.distanceKm > 100 ? '#F97316' : '#22D3EE') }}>
                      
                      <div className="wg-card-v5-inner">
                        <div className="wg-card-v5-glow" />
                        
                        <div className="wg-card-v5-header">
                          <div className="wg-card-v5-brand">
                            <div className="wg-card-v5-avatar"><span className="material-symbols-outlined">recycling</span></div>
                            <div className="wg-card-v5-names">
                              <h3 className="collector-name">{c.name}</h3>
                              <span className="collector-city">{c.city}</span>
                            </div>
                          </div>
                          <div className="wg-card-v5-stats">
                            <div className="wg-card-v5-rating"><span className="material-symbols-outlined">star</span> {c.rating}</div>
                            {c.verified && <div className="wg-card-v5-verified" title="Verified Expert"><span className="material-symbols-outlined">verified</span></div>}
                          </div>
                        </div>

                        <ProximityHub km={c.distanceKm} />

                        <div className="wg-card-v5-info">
                          <div className="info-item"><span className="material-symbols-outlined">map</span> <span>{c.address}</span></div>
                          <div className="info-item"><span className="material-symbols-outlined">schedule</span> <span>{c.timings}</span></div>
                        </div>

                        <div className="wg-card-v5-actions">
                          <a href={`tel:${c.phone}`} className="wg-card-v5-btn-call" onClick={() => handleContacted(c)}>
                            <span className="material-symbols-outlined">call</span>
                            <span>{c.phone}</span>
                          </a>
                          <button className={`wg-card-v5-btn-done ${contacted.has(c.id) ? 'active' : ''}`} onClick={() => handleContacted(c)}>
                            <span className="material-symbols-outlined">{contacted.has(c.id) ? 'check_circle' : 'handshake'}</span>
                          </button>
                        </div>
                      </div>

                      {contacted.has(c.id) && (
                        <div className="wg-card-v5-overlay-done">
                          <span className="material-symbols-outlined">verified</span>
                          <p>Met & Secured +10 XP</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {location && collectors.length === 0 && (
                <div className="wg-empty-shelf"><span className="material-symbols-outlined">query_stats</span><p>No hubs found for this type in your area.</p></div>
              )}
            </div>
          ) : (
            <div className="wg-idle-v3">
              <div className="wg-orb-stack">
                <div className="wg-orb-core-v3" />
                <div className="wg-orb-ring-v3 r1" />
                <div className="wg-orb-ring-v3 r2" />
              </div>
              <div className="wg-idle-text-v3">
                <h2>Ready to Recycle?</h2>
                <p>Choose a material to pinpoint verified collectors across the country.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WasteGuide;
