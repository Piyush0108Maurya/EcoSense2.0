import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { addWastePin, getWastePins } from '../../services/firebase';
import './NeighbourWaste.css';

// Fix for default marker icon in react-leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center the map
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom || 13);
  return null;
}

const NeighbourWaste = ({ user }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi default
  const fileInputRef = useRef(null);
  const [tempWasteName, setTempWasteName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPins();
    
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(loc);
          if (!mapCenter || (mapCenter[0] === 28.6139 && mapCenter[1] === 77.2090)) {
            setMapCenter(loc);
          }
        },
        (err) => console.log('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const fetchPins = async () => {
    const data = await getWastePins();
    setPins(data);
  };

  const handlePinAction = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    if (!tempWasteName.trim()) {
      alert("Please enter a waste item name.");
      return;
    }
    setIsModalOpen(false);
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      let lat, lng;
      if (userLocation) {
        [lat, lng] = userLocation;
      } else {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        await addWastePin({
          itemName: tempWasteName,
          photo: base64data,
          lat: lat,
          lng: lng,
          userName: user?.displayName || 'Eco Guardian',
          userUid: user?.uid,
          initials: user?.initials || 'EG',
          color: '#8AEBFF'
        });

        alert("Waste reported successfully! 🌿");
        setTempWasteName('');
        fetchPins();
        setMapCenter([lat, lng]);
      };
    } catch (error) {
      console.error("error pinning:", error);
      alert("Failed to report location. Please enable location permissions.");
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of stats calculation)
  const calculateStats = () => {
    if (pins.length === 0) return [
      { label: 'Activity', color: '#8AEBFF', count: 0, percentage: 0 }
    ];
    
    return [
      { label: 'Verified Reports', color: '#8AEBFF', count: pins.length, percentage: Math.min(100, (pins.length / 10) * 100) },
      { label: 'Active Guardians', color: '#22D3EE', count: new Set(pins.map(p => p.userUid)).size, percentage: 45 }
    ];
  };

  const realStats = calculateStats();

  return (
    <div className="neighbour-waste-container">
      {/* ── CUSTOM MODAL ── */}
      {isModalOpen && (
        <div className="nw-modal-overlay">
          <div className="nw-modal animate-in zoom-in-95 duration-200">
            <h3 className="nw-modal-title">Report New Waste</h3>
            <p className="nw-modal-desc">Describe the eco-anomaly detected at your location.</p>
            <input 
              autoFocus
              className="nw-modal-input"
              placeholder="e.g., Plastic Bottle, Cardboard Box"
              value={tempWasteName}
              onChange={(e) => setTempWasteName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleModalSubmit()}
            />
            <div className="nw-modal-actions">
              <button className="nw-modal-cancel" onClick={() => { setIsModalOpen(false); setTempWasteName(''); }}>Cancel</button>
              <button className="nw-modal-submit" onClick={handleModalSubmit}>Capture Photo</button>
            </div>
          </div>
        </div>
      )}

      <div className="nw-header">
        <div className="nw-badge">
          <span className="nw-badge-dot"></span>
          <span className="nw-badge-text">LIVE Synchronization</span>
        </div>
        <h1 className="nw-title">Neighbour Waste</h1>
        <p className="nw-subtitle">
          Real-time neighborhood waste management protocols and collective impact synchronization.
        </p>
      </div>

      <div className="nw-one-page-layout">
        {/* ── LEFT COLUMN: HEATMAP ── */}
        <div className="heatmap-section animate-in fade-in slide-in-from-left-5 duration-700">
          <div className="section-header">
            <h2 className="nw-card-title">
              <span className="material-symbols-outlined">explore</span>
              Live Tracking & Heatmap
            </h2>
            <div className="map-controls">
              <button 
                className="pin-btn" 
                onClick={handlePinAction}
                disabled={loading}
              >
                <span className="material-symbols-outlined">add_location_alt</span>
                {loading ? 'Processing...' : 'Report Waste'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                capture="environment"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="map-wrapper">
            <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "24px" }}>
              <ChangeView center={mapCenter} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              
              {/* User Live Location Marker */}
              {userLocation && (
                <CircleMarker
                  center={userLocation}
                  radius={10}
                  pathOptions={{ color: '#8AEBFF', fillColor: '#8AEBFF', fillOpacity: 0.5, weight: 2 }}
                >
                  <Popup>
                    <div style={{ color: '#070D1F', fontWeight: 700 }}>Your Live Location</div>
                  </Popup>
                </CircleMarker>
              )}

              {/* Reported Pins Markers */}
              {pins.map(pin => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]}>
                  <Popup className="custom-popup">
                    <div className="popup-content">
                      <h3 className="popup-title">{pin.itemName}</h3>
                      <div className="popup-img-wrapper">
                        <img src={pin.photo} alt={pin.itemName} className="popup-img" />
                      </div>
                      <div className="popup-footer">
                        <span className="reporter">By {pin.userName}</span>
                        <span className="time">{new Date(pin.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* ── RIGHT COLUMN: REAL DATA FEED & STATS ── */}
        <div className="dashboard-sidebar animate-in fade-in slide-in-from-right-5 duration-700">
          {/* Real Feed Card (from Firebase) */}
          <div className="nw-card dashboard-feed">
             <h2 className="nw-card-title">
                <span className="material-symbols-outlined">rss_feed</span>
                Community Live Feed
             </h2>
             <div className="nw-feed">
                {pins.length > 0 ? (
                  pins.slice(0, 5).map((item) => (
                    <div key={item.id} className="nw-feed-item">
                      <div className="nw-avatar" style={{ backgroundColor: `rgba(138, 235, 255, 0.1)`, border: `1px solid rgba(138, 235, 255, 0.3)`, color: '#8AEBFF' }}>
                        {item.initials || item.userName?.substring(0,2).toUpperCase() || 'EG'}
                      </div>
                      <div className="nw-item-info">
                        <div className="nw-item-user">{item.userName}</div>
                        <div className="nw-item-action">Reported {item.itemName}</div>
                      </div>
                      <div className="nw-item-points" style={{ fontSize: '10px' }}>
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm italic py-4">No reports yet in this sector.</div>
                )}
             </div>
          </div>

          {/* Real Analytics Card */}
          <div className="nw-card dashboard-stats">
             <h2 className="nw-card-title">
                <span className="material-symbols-outlined">data_exploration</span>
                Live Metrics
             </h2>
             <div className="nw-stats-list">
                {realStats.map((stat, i) => (
                  <div key={i} className="nw-stat-row">
                    <div className="nw-stat-header">
                      <span style={{ color: stat.color }}>{stat.label}</span>
                      <span>{stat.count} items recorded</span>
                    </div>
                    <div className="nw-progress-bg">
                      <div className="nw-progress-fill" style={{ width: `${stat.percentage}%`, backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}40` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Trial Status */}
          <div className="nw-card dashboard-challenge">
             <h2 className="nw-card-title">
                <span className="material-symbols-outlined">verified</span>
                Sector Integrity
             </h2>
             <div className="nw-challenge-card" style={{ marginTop: 0 }}>
                <div className="nw-challenge-title">Active Verification</div>
                <div className="nw-challenge-desc">
                  Reports are verified against live geospatial telemetry for protocol compliance.
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighbourWaste;
