import React, { useState, useCallback, useRef, useEffect } from 'react';
import { WASTE_CATEGORIES, getNearestCollectors, reverseGeocode } from '../../services/collectors';
import { DB } from '../../services/db';
import './WasteGuide.css';

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
    
    if (onPointsUpdate) onPointsUpdate('WASTE_SCAN', { item: WASTE_CATEGORIES.find(c => c.id === catId)?.label });
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
        <div className={`wg-zen-hero ${selectedCategory ? 'compact' : ''}`}>
          <div className="wg-zen-header">
            <div className="wg-zen-badge-wrap">
              <span className="wg-zen-badge">ECO-INTELLIGENCE</span>
              <div className="badge-glow" />
            </div>
            <h1 className="wg-zen-title">EcoLens <span>AI</span></h1>
            {!selectedCategory && <p className="wg-zen-subtitle">Synchronize with local recycling sanctuaries for an enhanced planet.</p>}
          </div>

          <div className="wg-zen-controls">
            {/* Location Pill */}
            <div className={`wg-glass-pill wg-loc-pill ${location ? 'synchronized' : ''}`}>
              {locLoading ? (
                <div className="wg-liquid-loader">
                  <div className="liquid-bubble" />
                  <span>SENSING...</span>
                </div>
              ) : (
                <div className="wg-pill-content">
                  <span className="material-symbols-outlined">{location ? 'share_location' : 'explore'}</span>
                  {location ? (
                    <div className="wg-pill-text">
                      <div className="primary-wrap">
                        <span className="primary-text">{cityName || 'Unknown Sector'}</span>
                        <span className="coord-tag">{location.lat.toFixed(3)}, {location.lon.toFixed(3)}</span>
                      </div>
                      <span className="secondary-text">GLOBAL SYNC ACTIVE</span>
                    </div>
                  ) : (
                    <button className="wg-pill-btn" onClick={detectLocation}>Initialize Position</button>
                  )}
                  {location && (
                    <button className="wg-pill-action" onClick={detectLocation} title="Recalibrate">
                      <span className="material-symbols-outlined">sync</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="wg-zen-connector">
               <span className="material-symbols-outlined">navigate_next</span>
            </div>

            <div className={`wg-glass-pill wg-cat-pill ${(!location || locLoading) ? 'is-dormant' : ''} ${selectedCategory ? 'has-selection' : ''}`} ref={menuRef}>
              <button 
                className="wg-pill-trigger" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                disabled={!location || locLoading}
              >
                <span className="material-symbols-outlined">{activeCat ? activeCat.icon : 'format_paint'}</span>
                <span className="trigger-label">{activeCat ? activeCat.label : 'Select Material'}</span>
                <span className={`material-symbols-outlined arrow ${isMenuOpen ? 'open' : ''}`}>
                  {(!location || locLoading) ? 'pending' : 'expand_more'}
                </span>
              </button>

              {isMenuOpen && (
                <div className="wg-zen-dropdown anim-pop-in">
                  <div className="dropdown-grid">
                    {WASTE_CATEGORIES.map(cat => (
                      <button key={cat.id} className={`wg-zen-item ${selectedCategory === cat.id ? 'active' : ''}`} onClick={() => handleCategorySelect(cat.id)}>
                        <div className="item-orb" style={{ background: `radial-gradient(circle at 30% 30%, ${cat.color}, transparent)` }} />
                        <span className="item-name">{cat.label}</span>
                        <span className="item-emoji">{cat.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="wg-main-display">
          {locError && <div className="wg-error-banner-v3">{locError}</div>}

          <div className="wg-results-wrap">
            {collectors.length > 0 ? (
              <div className="wg-zen-grid">
                {collectors.map((c, i) => (
                  <div 
                    key={c.id} 
                    className={`wg-zen-card ${contacted.has(c.id) ? 'contacted' : ''}`} 
                    style={{ '--idx': i, '--accent-color': c.distanceKm < 10 ? '#5AB87A' : (c.distanceKm > 100 ? '#F97316' : '#8AEBFF') }}
                  >
                    <div className="wg-zen-card-inner">
                      <div className="wg-zen-card-header">
                        <div className="wg-zen-avatar"><span className="material-symbols-outlined">nature_people</span></div>
                        <div className="wg-zen-titles">
                          <div className="title-row">
                            <h3>{c.name}</h3>
                            <span className="material-symbols-outlined verified-shield">verified</span>
                          </div>
                          <span className="zen-tag">{c.city} • VERIFIED SANCTUARY</span>
                        </div>
                      </div>

                      <div className="wg-zen-prox">
                         <div className="prox-track"><div className="prox-fill" style={{ width: `${Math.min((c.distanceKm/120)*100, 100)}%` }} /></div>
                         <div className="prox-labels">
                           <span>HUB DISTANCE</span>
                           <span className="dist">{c.distanceKm} KM</span>
                         </div>
                      </div>

                      <div className="wg-zen-details">
                        <div className="detail"><span className="material-symbols-outlined">distance</span> <span>{c.address}</span></div>
                        <div className="detail"><span className="material-symbols-outlined">nest_clock_farsight_analog</span> <span>{c.timings}</span></div>
                      </div>

                      <div className="wg-zen-actions">
                        <a href={`tel:${c.phone}`} className="zen-btn-call" onClick={() => handleContacted(c)}>
                          <span className="material-symbols-outlined">call</span>
                          <span>{c.phone}</span>
                        </a>
                        <button className={`zen-btn-secure ${contacted.has(c.id) ? 'active' : ''}`} onClick={() => handleContacted(c)}>
                          <span className="material-symbols-outlined">{contacted.has(c.id) ? 'eco' : 'add_task'}</span>
                        </button>
                      </div>
                    </div>

                    {contacted.has(c.id) && (
                      <div className="wg-zen-card-success">
                        <span className="material-symbols-outlined">eco</span>
                        <p>SYNCHRONIZED</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              selectedCategory && (
                <div className="wg-empty-shelf">
                  <span className="material-symbols-outlined">potted_plant</span>
                  <p>Searching for local sanctuaries...</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WasteGuide;
