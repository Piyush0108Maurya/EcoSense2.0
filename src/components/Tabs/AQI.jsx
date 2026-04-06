import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAQI, WAQI_TOKEN } from '../../services/api';
import './AQI.css';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Filler, Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend);

/* ─── Severity Config ─────────────────────────────────────────────────────── */
const SEVERITY = [
  { max: 50, color: '#3FB950', bg: 'rgba(63,185,80,0.1)', label: 'Good', tip: 'Air quality is satisfactory. Enjoy outdoor activities without restriction.' },
  { max: 100, color: '#D29922', bg: 'rgba(210,153,34,0.1)', label: 'Moderate', tip: 'Acceptable quality. Unusually sensitive individuals should consider reducing prolonged outdoor exertion.' },
  { max: 150, color: '#E3642B', bg: 'rgba(227,100,43,0.1)', label: 'Unhealthy for Sensitive', tip: 'Sensitive groups (children, elderly, lung/heart conditions) should reduce outdoor exertion.' },
  { max: 200, color: '#F85149', bg: 'rgba(248,81,73,0.1)', label: 'Unhealthy', tip: 'Everyone may experience health effects. Sensitive groups face more serious risks.' },
  { max: 300, color: '#BC8CFF', bg: 'rgba(188,140,255,0.1)', label: 'Very Unhealthy', tip: 'Health alert — significant risk for everyone. Avoid prolonged outdoor exposure.' },
  { max: Infinity, color: '#A40021', bg: 'rgba(164,0,33,0.1)', label: 'Hazardous', tip: 'Health emergency. The entire population is very likely to be affected.' },
];
const getSeverity = (aqi) => SEVERITY.find(s => aqi <= s.max) ?? SEVERITY[SEVERITY.length - 1];

/* ─── Animated Counter Hook ───────────────────────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) { setValue(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

/* ─── Animated Progress Bar ───────────────────────────────────────────────── */
const AnimatedBar = ({ pct, color, delay = 0 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => { if (ref.current) ref.current.style.width = `${pct}%`; }, delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="aqi-progress-bar">
      <div ref={ref} className="aqi-progress-fill" style={{ background: color, width: 0 }} />
    </div>
  );
};

/* ─── Gauge SVG ───────────────────────────────────────────────────────────── */
const GAUGE_R = 80;
const GAUGE_C = GAUGE_R * 2 * Math.PI;

const AQIGauge = ({ aqi, color }) => {
  const displayed = useCountUp(aqi);
  const offset = GAUGE_C - Math.min(aqi / 500, 1) * GAUGE_C;
  return (
    <div className="aqi-gauge" style={{ borderColor: color }}>
      <svg className="aqi-gauge-svg" viewBox="0 0 180 180">
        <circle className="aqi-gauge-track" cx="90" cy="90" r={GAUGE_R} />
        <circle className="aqi-gauge-fill" cx="90" cy="90" r={GAUGE_R}
          stroke={color} strokeDasharray={GAUGE_C} strokeDashoffset={offset} />
      </svg>
      <div className="aqi-gauge-center">
        <span className="aqi-gauge-num" style={{ color }}>{displayed || '—'}</span>
        <span className="aqi-gauge-unit">AQI</span>
      </div>
    </div>
  );
};

/* ─── Pollutant Meta (US EPA thresholds) ──────────────────────────────────── */
const POLLUTANT_META = {
  'PM2.5': { limits: [12, 35.4, 55.4, 150.4, 250.4], max: 300, unit: 'µg/m³', fullName: 'Particulate Matter', sub: 'PM₂.₅' },
  'PM10': { limits: [54, 154, 254, 354, 424], max: 500, unit: 'µg/m³', fullName: 'Particulate Matter', sub: 'PM₁₀' },
  'O3': { limits: [54, 70, 85, 105, 200], max: 250, unit: 'ppb', fullName: 'Ozone', sub: 'O₃' },
  'NO2': { limits: [53, 100, 360, 649, 1249], max: 1500, unit: 'ppb', fullName: 'Nitrogen Dioxide', sub: 'NO₂' },
  'SO2': { limits: [35, 75, 185, 304, 604], max: 700, unit: 'ppb', fullName: 'Sulfur Dioxide', sub: 'SO₂' },
  'CO': { limits: [4.4, 9.4, 12.4, 15.4, 30.4], max: 40, unit: 'ppm', fullName: 'Carbon Monoxide', sub: 'CO' },
};

const getPollutantStatus = (name, val) => {
  const meta = POLLUTANT_META[name];
  if (!meta || val == null) return { label: 'N/A', color: '#7D8590', bg: 'rgba(125,133,144,0.1)', pct: 0, unit: meta?.unit ?? 'µg/m³' };
  const idx = meta.limits.findIndex(l => val <= l);
  const s = (idx === -1 ? SEVERITY[5] : SEVERITY[idx]) ?? SEVERITY[SEVERITY.length - 1];
  return { label: s.label, color: s.color, bg: `${s.color}20`, pct: Math.min((val / meta.max) * 100, 100), unit: meta.unit, alert: idx === -1 || idx >= 3 };
};

/* ─── Pollutant Squircle Icon ─────────────────────────────────────────────── */
const PollutantIcon = ({ name, color }) => {
  let iconName = '';
  switch (name) {
    case 'PM2.5': iconName = 'blur_circular'; break; // Fine particles
    case 'PM10': iconName = 'grain'; break; // Coarse particles
    case 'CO': iconName = 'cloud'; break; // Atmospheric gas
    case 'SO2': iconName = 'factory'; break; // Industrial emissions
    case 'NO2': iconName = 'directions_car'; break; // Vehicle exhaust
    case 'O3': iconName = 'public'; break; // Ozone layer / Earth
    default: iconName = 'lens_blur';
  }

  return (
    <div style={{
      width: 44, height: 44,
      borderRadius: 14,
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <span className="material-symbols-outlined" style={{ color, fontSize: 24, fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
        {iconName}
      </span>
    </div>
  );
};

/* ─── Pollutant Card (reference image style) ──────────────────────────────── */
const PollutantCard = ({ name, value, animDelay }) => {
  const ps = getPollutantStatus(name, value);
  const meta = POLLUTANT_META[name];
  const displayed = useCountUp(value ?? 0, 1100);
  const isNull = value == null;

  return (
    <div
      className="aqi-pol-card aqi-animate-in"
      style={{ animationDelay: animDelay }}
    >
      {/* Colored left accent border */}
      <div className="aqi-pol-accent" style={{ background: ps.color }} />

      {/* Icon */}
      <div className="aqi-pol-icon">
        <PollutantIcon name={name} color={ps.color} />
      </div>

      {/* Label block */}
      <div className="aqi-pol-label">
        <span className="aqi-pol-fullname">{meta?.fullName ?? name}</span>
        <span className="aqi-pol-sub">({meta?.sub ?? name})</span>
      </div>

      {/* Value block */}
      <div className="aqi-pol-value-wrap">
        <span className="aqi-pol-value" style={{ color: isNull ? '#7D8590' : '#E6EDF3' }}>
          {isNull ? '—' : displayed}
        </span>
        <span className="aqi-pol-unit">{ps.unit}</span>
      </div>

    </div>
  );
};

/* ─── Ticker ──────────────────────────────────────────────────────────────── */
const TICKER_CITIES = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'ahmedabad'];
const TICKER_LABELS = { delhi: 'Delhi', mumbai: 'Mumbai', bangalore: 'Bengaluru', chennai: 'Chennai', kolkata: 'Kolkata', hyderabad: 'Hyderabad', ahmedabad: 'Ahmedabad' };

const Ticker = ({ tickerData }) => {
  const items = TICKER_CITIES.map(k => ({ key: k, label: TICKER_LABELS[k], aqi: tickerData[k] }))
    .filter(c => c.aqi != null);
  if (!items.length) return null;
  const doubled = [...items, ...items];
  return (
    <div className="aqi-ticker">
      <div className="aqi-ticker-track">
        {doubled.map((c, i) => {
          const s = getSeverity(c.aqi);
          return (
            <div key={i} className="aqi-ticker-item">
              <div className="aqi-ticker-dot" style={{ background: s.color }} />
              <span style={{ color: '#CDD9E5', fontWeight: 500 }}>{c.label}</span>
              <span style={{ color: s.color, fontWeight: 700 }}>{c.aqi}</span>
              <span style={{ color: '#7D8590', fontSize: 10 }}>AQI</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Scale Legend ────────────────────────────────────────────────────────── */
const ScaleLegend = ({ aqi }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {SEVERITY.map((s, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: getSeverity(aqi).color === s.color ? 1 : 0.3, transition: 'opacity 0.6s ease' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
        <span style={{ fontSize: 11, color: '#7D8590', fontWeight: 500 }}>{s.label.split(' ')[0]}</span>
      </div>
    ))}
  </div>
);

/* ─── Chart Options ───────────────────────────────────────────────────────── */
const makeChartOptions = (color) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 2500,
    easing: 'easeInOutQuart',
  },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1C2128', titleColor: '#CDD9E5', bodyColor: color,
      borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: { x: 14, y: 10 },
      cornerRadius: 10, displayColors: false,
      titleFont: { family: 'Inter', size: 12, weight: '500' },
      bodyFont: { family: 'JetBrains Mono', size: 13, weight: '500' },
    },
  },
  scales: {
    y: {
      beginAtZero: true, border: { display: false },
      grid: { color: 'rgba(255,255,255,0.04)', drawTicks: false },
      ticks: { color: '#7D8590', font: { family: 'JetBrains Mono', size: 11 }, padding: 8, stepSize: 50 },
    },
    x: {
      border: { display: false }, grid: { display: false },
      ticks: { color: '#7D8590', font: { family: 'Inter', size: 11 }, maxRotation: 0, padding: 8 },
    },
  },
});

/* ─── Helper: safe round ─────────────────────────────────────────────────── */
const r1 = (v) => v != null ? Math.round(v * 10) / 10 : null;

/* ─── Cities ──────────────────────────────────────────────────────────────── */
const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad'];
const CITY_KEYS = { Delhi: 'delhi', Mumbai: 'mumbai', Bengaluru: 'bangalore', Chennai: 'chennai', Kolkata: 'kolkata', Hyderabad: 'hyderabad', Ahmedabad: 'ahmedabad' };

const CITY_COORDS = {
  Delhi: { lat: 28.61, lon: 77.20 },
  Mumbai: { lat: 19.07, lon: 72.87 },
  Bengaluru: { lat: 12.97, lon: 77.59 },
  Chennai: { lat: 13.08, lon: 80.27 },
  Kolkata: { lat: 22.57, lon: 88.36 },
  Hyderabad: { lat: 17.38, lon: 78.48 },
  Ahmedabad: { lat: 23.02, lon: 72.57 },
  'Your Location': { lat: 28.61, lon: 77.20 } // fallback
};

const pm25ToAQI = (pm25) => {
  if (pm25 <= 12.0) return Math.round((50 / 12.0) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.3) * (pm25 - 12.1) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 19.9) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 94.9) * (pm25 - 55.5) + 151);
  if (pm25 <= 250.4) return Math.round((99 / 99.9) * (pm25 - 150.5) + 201);
  if (pm25 <= 350.4) return Math.round((99 / 99.9) * (pm25 - 250.5) + 301);
  return Math.round((100 / 149.9) * (pm25 - 350.5) + 401);
};



/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
const AQI = ({ activeSubTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCity, setActiveCity] = useState('Delhi');
  const [cityLoading, setCityLoading] = useState(false);
  const [viewKey, setViewKey] = useState(0);
  const [tickerData, setTickerData] = useState({});  // { delhi: 80, mumbai: 153, ... }
  const [hourlyTrend, setHourlyTrend] = useState(null);
  const chartRef = useRef(null);

  /* ── Fetch active city ──────────────────────────────────────────────────── */
  const loadData = useCallback(async (target, cityName) => {
    setCityLoading(true);
    if (!data) setLoading(true);
    setError(null);
    setActiveCity(cityName);
    try {
      const coords = CITY_COORDS[cityName] || { lat: 28.61, lon: 77.20 };

      // Fetch both WAQI Live and Open-Meteo Hourly history concurrently
      const [waqiRes, histRes] = await Promise.all([
        fetchAQI(target),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=pm2_5&past_days=1`)
          .then(r => r.json())
      ]);

      setData(waqiRes);
      setViewKey(k => k + 1);

      // Process hourly trend (Open-Meteo)
      if (histRes.hourly) {
        const times = histRes.hourly.time;
        const pm25s = histRes.hourly.pm2_5;

        // Find index for the CURRENT hour
        const now = new Date();
        const tzOffset = now.getTimezoneOffset() * 60000;
        const localISO = new Date(now.getTime() - tzOffset).toISOString();
        const localDatePrefix = localISO.slice(0, 11); // "YYYY-MM-DD"

        let currentIndex = times.findIndex(t => t.startsWith(localISO.slice(0, 13)));
        if (currentIndex === -1) currentIndex = pm25s.findLastIndex(v => v != null && v !== 0);

        // Find index for 12 AM (Midnight) Today
        let startIndex = times.findIndex(t => t.startsWith(localDatePrefix + "00"));

        // If it's early (e.g., before 6 AM), provide at least 12 hours of context (back to yesterday)
        // to keep the chart from looking empty. Otherwise, start from Midnight.
        if (startIndex === -1 || (currentIndex - startIndex) < 4) {
          startIndex = Math.max(0, currentIndex - 12);
        }

        const tLabels = [];
        const tValues = [];

        // Dynamic step calculation to fill ~8-9 points between Start and Now
        const step = Math.max(1, Math.floor((currentIndex - startIndex) / 8)) || 3;

        for (let i = currentIndex; i >= startIndex; i -= step) {
          const t = new Date(times[i]);
          const isNow = i === currentIndex;
          tLabels.unshift(isNow ? 'Now' : t.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }));
          tValues.unshift(pm25ToAQI(pm25s[i]) || 0);
          if (tLabels.length >= 10) break; // limit density
        }

        // Sync the latest real trend point with the real-time WAQI level
        // only if both values are sane (prevent division by zero or huge scaling)
        const waqiVal = waqiRes.aqi || 0;
        const lastTrendVal = tValues[tValues.length - 1] || 1;
        let trendSync = waqiVal / lastTrendVal;

        // Safety cap: don't scale more than 3x or less than 0.3x
        // if discrepancy is too big, the sources are too different; just show raw or a slight offset.
        if (trendSync > 3 || trendSync < 0.3) trendSync = 1;

        setHourlyTrend({
          labels: tLabels,
          values: tValues.map(v => Math.round(v * trendSync))
        });
      }

      // Update ticker entry for this city
      const key = CITY_KEYS[cityName] || target.toLowerCase();
      setTickerData(prev => ({ ...prev, [key]: waqiRes.aqi }));
    } catch (err) {
      console.error("AQI Load Error:", err);
      setError('Could not load air quality data. Please try again.');
    } finally {
      setLoading(false);
      setCityLoading(false);
    }
  }, [data]);

  /* ── Fetch all ticker cities in background ──────────────────────────────── */
  useEffect(() => {
    const fetchTicker = async () => {
      const results = await Promise.allSettled(
        TICKER_CITIES.map(city =>
          fetch(`https://api.waqi.info/feed/${city}/?token=${WAQI_TOKEN}`)
            .then(r => r.json())
            .then(j => ({ city, aqi: j.status === 'ok' ? j.data.aqi : null }))
        )
      );
      const td = {};
      results.forEach(r => { if (r.status === 'fulfilled' && r.value.aqi != null) td[r.value.city] = r.value.aqi; });
      setTickerData(td);
    };
    fetchTicker();
  }, []);

  /* ── Initial load ───────────────────────────────────────────────────────── */
  useEffect(() => {
    // Hardcoded default to Delhi as requested - runs only once on mount
    loadData('delhi', 'Delhi');
  }, []);

  /* ── Derived from real API data ─────────────────────────────────────────── */
  const aqi = data?.aqi ?? 0;
  const sev = getSeverity(aqi);

  // Real pollutant values — null if not returned by API
  const pm25 = data?.iaqi?.pm25?.v ?? null;
  const pm10 = data?.iaqi?.pm10?.v ?? null;
  const o3 = data?.iaqi?.o3?.v ?? null;
  const no2 = data?.iaqi?.no2?.v ?? null;
  const so2 = data?.iaqi?.so2?.v ?? null;
  const co = data?.iaqi?.co?.v ?? null;

  // Real weather values
  const humidity = r1(data?.iaqi?.h?.v);
  const temperature = r1(data?.iaqi?.t?.v);
  const windSpeed = r1(data?.iaqi?.w?.v);
  const pressure = r1(data?.iaqi?.p?.v);
  const dewPoint = r1(data?.iaqi?.dew?.v);

  // Station name and update time from API
  const stationName = data?.city?.name ?? activeCity;
  const updatedAt = data?.time?.s
    ? new Date(data.time.s + (data.time.tz ?? '+05:30')).toLocaleString('en-IN', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
    : null;

  // Dominant pollutant from API
  const dominentPol = data?.dominentpol?.toUpperCase() ?? null;

  /* ── Trend chart: Hourly profile anchored to real-time AQI ─────────────── */
  const buildTrendChart = () => {
    // If we have real hourly data from Open-Meteo, use it.
    if (hourlyTrend && hourlyTrend.values.length > 0) {
      return hourlyTrend;
    }

    // Fallback: This should rarely be hit given the parallel fetch, but keeps the UI safe
    const nowLabel = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    return { labels: ['-', '-', '-', '-', '-', '-', '-', '-', 'Now'], values: [aqi, aqi, aqi, aqi, aqi, aqi, aqi, aqi, aqi] };
  };

  const trend = buildTrendChart();

  const liveChartData = {
    labels: trend.labels,
    datasets: [{
      fill: 'start', label: 'AQI',
      data: trend.values,
      borderColor: sev.color, borderWidth: 2, tension: 0.4,
      pointRadius: 3, pointHoverRadius: 5,
      pointBackgroundColor: sev.color, pointBorderColor: '#0D1117', pointBorderWidth: 2,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
        g.addColorStop(0, `${sev.color}35`);
        g.addColorStop(1, `${sev.color}00`);
        return g;
      },
    }],
  };

  /* ── States ─────────────────────────────────────────────────────────────── */
  const LoadingState = () => (
    <div className="aqi-loading">
      <div className="aqi-spinner" />
      <p className="aqi-loading-text">Fetching air quality data…</p>
    </div>
  );

  const ErrorState = () => (
    <div className="aqi-card aqi-error">
      <div className="aqi-error-icon"><span className="material-symbols-outlined">wifi_off</span></div>
      <p className="aqi-error-title">Connection failed</p>
      <p className="aqi-error-sub">{error}</p>
      <button className="aqi-retry-btn" onClick={() => loadData(CITY_KEYS[activeCity] || activeCity.toLowerCase(), activeCity)}>
        Retry
      </button>
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════════════
     VIEW: LIVE
  ════════════════════════════════════════════════════════════════════════════ */
  const viewLive = () => (
    <div key={viewKey} className="aqi-view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Hero ────────────────────────────────────────────────────────────── */}
      <div className="aqi-card aqi-card-lg aqi-hero">
        <div className="aqi-hero-glow" style={{ background: sev.color }} />

        <div className="aqi-hero-left">

          {/* Live indicator + station name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="aqi-location-pill">
              <div className="aqi-dot-live" />
              <span className="aqi-location-label">
                Live · {updatedAt ?? '—'} · {data?.time?.tz ?? '+05:30'}
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#7D8590', marginLeft: 16, maxWidth: 380 }}>
              Station: {stationName}
            </span>
          </div>

          <h2 className="aqi-city-name">{activeCity}</h2>

          {/* Dominant pollutant + status badge */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="aqi-status-badge" style={{ color: sev.color, borderColor: `${sev.color}40`, background: sev.bg }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: sev.color }} />
              {sev.label}
            </div>
            {dominentPol && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px',
                borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 12, color: '#7D8590', fontFamily: 'JetBrains Mono', fontWeight: 500,
              }}>
                <span style={{ fontSize: 10, color: '#7D8590', fontFamily: 'Inter' }}>Dominant·</span>
                <span style={{ color: sev.color, fontWeight: 700 }}>{dominentPol.replace('PM25', 'PM2.5').replace('PM10', 'PM10')}</span>
              </div>
            )}
          </div>

          <p className="aqi-city-tip">{sev.tip}</p>

          {/* AQI colour scale */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 2 }}>
            <div className="aqi-scale-bar">
              {SEVERITY.map((s, i) => (
                <div key={i} className="aqi-scale-segment" style={{ background: s.color, opacity: sev.color === s.color ? 1 : 0.18 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: '#7D8590' }}>0 — Good</span>
              <span style={{ fontSize: 10, color: '#7D8590' }}>300+ — Hazardous</span>
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div className="aqi-gauge-wrap">
          <AQIGauge aqi={aqi} color={sev.color} />
          <p style={{ fontSize: 12, color: '#7D8590', textAlign: 'center', margin: 0, maxWidth: 160, lineHeight: 1.7 }}>
            US AQI Index
            <br />
            <span style={{ fontFamily: 'JetBrains Mono', color: sev.color, fontWeight: 700, fontSize: 14 }}>
              {aqi} / 500
            </span>
          </p>
        </div>
      </div>

      {/* Ticker ─────────────────────────────────────────────────────────── */}
      {Object.keys(tickerData).length > 0 && <Ticker tickerData={tickerData} />}

      {/* Chart + Weather Stats ─────────────────────────────────────────── */}
      <div className="aqi-grid-2-3">

        <div className="aqi-card aqi-chart-card aqi-col-2 aqi-animate-in aqi-stagger-2">
          <div className="aqi-section-header">
            <h3 className="aqi-section-title">24-Hour Trend</h3>
            <span className="aqi-section-sub" title="Curve anchored to real-time AQI">
              Live updates · Real-time endpoint
            </span>
          </div>
          {cityLoading ? (
            <div style={{ height: 220, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10 }}>
              <div className="aqi-skeleton" style={{ height: '65%', borderRadius: 10 }} />
              <div className="aqi-skeleton" style={{ height: '25%', borderRadius: 10 }} />
            </div>
          ) : (
            <div style={{ height: 220 }}>
              <Line ref={chartRef} data={liveChartData} options={makeChartOptions(sev.color)} />
            </div>
          )}
        </div>

        {/* Real-time Weather Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Humidity', value: humidity != null ? `${humidity}%` : '—', icon: 'water_drop', color: '#58A6FF' },
            { label: 'Temperature', value: temperature != null ? `${temperature}°C` : '—', icon: 'thermostat', color: '#F97316' },
            { label: 'Wind Speed', value: windSpeed != null ? `${windSpeed} km/h` : '—', icon: 'air', color: '#A78BFA' },
          ].map((stat, i) => (
            <div key={i} className={`aqi-card aqi-weather-stat aqi-animate-in aqi-stagger-${i + 2}`}>
              <div className="aqi-weather-icon">
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: stat.color, fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                  {stat.icon}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#7D8590', marginBottom: 3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#E6EDF3', lineHeight: 1 }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extra stats row: pressure, dew point */}
      {(pressure != null || dewPoint != null) && (
        <div style={{ display: 'flex', gap: 12 }}>
          {pressure != null && (
            <div className="aqi-card aqi-animate-in aqi-stagger-4" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#7D8590', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>compress</span>
              <div>
                <div style={{ fontSize: 11, color: '#7D8590', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pressure</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#E6EDF3', fontFamily: 'JetBrains Mono' }}>{pressure} <span style={{ fontSize: 11, color: '#7D8590', fontWeight: 400 }}>hPa</span></div>
              </div>
            </div>
          )}
          {dewPoint != null && (
            <div className="aqi-card aqi-animate-in aqi-stagger-5" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#7D8590', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>dew_point</span>
              <div>
                <div style={{ fontSize: 11, color: '#7D8590', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dew Point</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#E6EDF3', fontFamily: 'JetBrains Mono' }}>{dewPoint}°C</div>
              </div>
            </div>
          )}
          {/* Attribution */}
          {data?.attributions?.[0] && (
            <div className="aqi-card aqi-animate-in aqi-stagger-5" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, flex: 2 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#3FB950', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>verified</span>
              <div>
                <div style={{ fontSize: 11, color: '#7D8590', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Source</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#E6EDF3' }}>{data.attributions[0].name}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pollutant Breakdown ──────────────────────────────────────────────── */}
      <div>
        <div className="aqi-section-header" style={{ marginBottom: 12, paddingLeft: 2 }}>
          <h3 className="aqi-section-title">Pollutant Breakdown</h3>
          <ScaleLegend aqi={aqi} />
        </div>
        {/* 3-column grid, 2 rows — matches reference image exactly */}
        <div className="aqi-pol-grid">
          {[
            { name: 'PM2.5', value: pm25 },
            { name: 'PM10', value: pm10 },
            { name: 'CO', value: co },
            { name: 'SO2', value: so2 },
            { name: 'NO2', value: no2 },
            { name: 'O3', value: o3 },
          ].map(({ name, value }, i) => (
            <PollutantCard key={name} name={name} value={value} animDelay={`${0.07 * (i + 2)}s`} />
          ))}
        </div>
      </div>

    </div>
  );

  /* ════════════════════════════════════════════════════════════════════════════
     VIEW: FORECAST (real pm25 + pm10 + uvi data)
  ════════════════════════════════════════════════════════════════════════════ */
  const viewForecast = () => {
    const pm25F = data?.forecast?.daily?.pm25 || [];
    const pm10F = data?.forecast?.daily?.pm10 || [];
    const uviF = data?.forecast?.daily?.uvi || [];

    if (!pm25F.length && !pm10F.length) {
      return (
        <div className="aqi-card aqi-view-enter" style={{ padding: 48, textAlign: 'center' }}>
          <p style={{ color: '#7D8590', fontSize: 14 }}>No forecast data available for {activeCity}.</p>
        </div>
      );
    }

    const days = pm25F.slice(0, 7);
    const fLabels = days.map(d => new Date(d.day).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));

    const fChartData = {
      labels: fLabels,
      datasets: [
        ...(pm10F.length ? [{
          label: 'PM10 Avg', data: pm10F.slice(0, 7).map(f => f.avg),
          borderColor: '#D29922', borderWidth: 2, borderDash: [5, 5],
          tension: 0.4, pointRadius: 3, pointBackgroundColor: '#0D1117',
          pointBorderColor: '#D29922', pointBorderWidth: 2, fill: false,
        }] : []),
        ...(pm25F.length ? [{
          label: 'PM2.5 Avg', data: pm25F.slice(0, 7).map(f => f.avg),
          borderColor: '#3FB950', borderWidth: 2.5, tension: 0.4, pointRadius: 3,
          pointBackgroundColor: '#0D1117', pointBorderColor: '#3FB950', pointBorderWidth: 2,
          backgroundColor: 'rgba(63,185,80,0.08)', fill: true,
        }] : []),
      ],
    };

    const fOpts = {
      ...makeChartOptions('#3FB950'),
      plugins: {
        ...makeChartOptions('#3FB950').plugins,
        legend: {
          display: true,
          labels: { color: '#7D8590', font: { family: 'Inter', size: 12 }, boxWidth: 8, boxHeight: 8, usePointStyle: true },
        },
      },
    };

    return (
      <div className="aqi-view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div className="aqi-card aqi-chart-card aqi-animate-in">
          <div className="aqi-section-header">
            <h3 className="aqi-section-title">Pollutant Forecast</h3>
            <span className="aqi-section-sub">Real data · WAQI</span>
          </div>
          <div style={{ height: 280 }}>
            <Line data={fChartData} options={fOpts} />
          </div>
        </div>

        {/* Daily cards */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(days.length, 7)}, 1fr)`, gap: 12 }}>
          {days.map((f, i) => {
            const s = getSeverity(f.avg);
            const uvi = uviF.find(u => u.day === f.day);
            return (
              <div key={i} className={`aqi-card aqi-forecast-day aqi-animate-in aqi-stagger-${Math.min(i + 1, 7)}`}>
                <span className="aqi-forecast-weekday">
                  {new Date(f.day).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span style={{ fontSize: 10, color: '#7D8590', fontFamily: 'JetBrains Mono' }}>PM2.5</span>
                <span className="aqi-forecast-score" style={{ color: s.color }}>{f.avg}</span>
                <span className="aqi-forecast-label" style={{ color: s.color, background: s.bg }}>
                  {s.label.split(' ')[0]}
                </span>
                {/* Min/Max range */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#3FB950', fontFamily: 'JetBrains Mono' }} title="Min">{f.min ?? '—'}</span>
                    <span style={{ fontSize: 10, color: '#F85149', fontFamily: 'JetBrains Mono' }} title="Max">{f.max}</span>
                  </div>
                  <AnimatedBar pct={Math.min((f.avg / 300) * 100, 100)} color={s.color} delay={i * 100} />
                </div>
                {/* UV Index from real data */}
                {uvi && (
                  <div style={{ fontSize: 10, color: '#7D8590', marginTop: 2 }}>
                    UV <span style={{ color: '#D29922', fontWeight: 600 }}>{uvi.avg}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PM10 forecast if available */}
        {pm10F.length > 0 && (
          <div>
            <div className="aqi-section-header" style={{ marginBottom: 12, paddingLeft: 2 }}>
              <h3 className="aqi-section-title">PM10 Forecast</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(pm10F.length, 7)}, 1fr)`, gap: 12 }}>
              {pm10F.slice(0, 7).map((f, i) => {
                const s = getSeverity(f.avg);
                return (
                  <div key={i} className={`aqi-card aqi-forecast-day aqi-animate-in aqi-stagger-${Math.min(i + 1, 7)}`}>
                    <span className="aqi-forecast-weekday">{new Date(f.day).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                    <span style={{ fontSize: 10, color: '#7D8590', fontFamily: 'JetBrains Mono' }}>PM10</span>
                    <span className="aqi-forecast-score" style={{ color: s.color }}>{f.avg}</span>
                    <span className="aqi-forecast-label" style={{ color: s.color, background: s.bg }}>{s.label.split(' ')[0]}</span>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 10, color: '#3FB950', fontFamily: 'JetBrains Mono' }}>{f.min ?? '—'}</span>
                        <span style={{ fontSize: 10, color: '#F85149', fontFamily: 'JetBrains Mono' }}>{f.max}</span>
                      </div>
                      <AnimatedBar pct={Math.min((f.avg / 500) * 100, 100)} color={s.color} delay={i * 100} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ════════════════════════════════════════════════════════════════════════════
     VIEW: HISTORICAL (Real 30-Day Open-Meteo Integration)
  ════════════════════════════════════════════════════════════════════════════ */
  const HistoricalView = ({ activeCity, currentAqi }) => {
    const [history, setHistory] = useState(null);

    useEffect(() => {
      let isMounted = true;
      const fetchHistory = async () => {
        try {
          const coords = CITY_COORDS[activeCity] || { lat: 28.61, lon: 77.20 };
          const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=pm2_5&past_days=30`);
          const json = await res.json();

          if (!isMounted) return;

          const hTimes = json.hourly.time;
          const hPm25 = json.hourly.pm2_5;

          const dailyMap = {};
          hTimes.forEach((t, i) => {
            const dateStr = t.split('T')[0];
            if (!dailyMap[dateStr]) dailyMap[dateStr] = { sum: 0, count: 0 };
            if (hPm25[i] != null) {
              dailyMap[dateStr].sum += hPm25[i];
              dailyMap[dateStr].count += 1;
            }
          });

          let rawLabels = [];
          let rawValues = [];
          const todayISO = new Date().toISOString().split('T')[0];
          const validDates = Object.keys(dailyMap).filter(d => d <= todayISO).sort();
          const last30Dates = validDates.slice(-30);

          last30Dates.forEach(date => {
            const avgPm25 = dailyMap[date].sum / (dailyMap[date].count || 1);
            const aqiVal = pm25ToAQI(avgPm25);
            const dStr = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            rawLabels.push(dStr);
            rawValues.push(aqiVal);
          });

          const stableValues = rawValues;

          let worst = { val: -1, date: '' };
          let best = { val: 9999, date: '' };
          let sum = 0;

          stableValues.forEach((v, i) => {
            sum += v;
            const dStr = rawLabels[i];
            if (v > worst.val) worst = { val: v, date: dStr };
            if (v < best.val) best = { val: v, date: dStr };
          });

          setHistory({
            labels: rawLabels,
            values: stableValues,
            avg: Math.round(sum / (stableValues.length || 1)),
            worst,
            best
          });
        } catch (e) {
          console.error("Open-Meteo Historical Fetch Error", e);
        }
      };
      fetchHistory();
      return () => { isMounted = false };
    }, [activeCity, currentAqi]);

    if (!history) return (
      <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingState />
      </div>
    );

    const hChartData = {
      labels: history.labels,
      datasets: [{
        label: 'Daily Average AQI',
        data: history.values,
        backgroundColor: history.values.map(v => getSeverity(v).color + 'CC'),
        hoverBackgroundColor: history.values.map(v => getSeverity(v).color),
        borderRadius: 4,
        borderWidth: 0,
      }]
    };

    const hOpts = {
      ...makeChartOptions('#CDD9E5'),
      scales: {
        y: { beginAtZero: true, border: { display: false }, grid: { color: 'rgba(255,255,255,0.04)', drawTicks: false }, ticks: { color: '#7D8590', font: { family: 'JetBrains Mono', size: 11 }, padding: 8 } },
        x: { border: { display: false }, grid: { display: false }, ticks: { color: '#7D8590', font: { family: 'Inter', size: 10 }, maxTicksLimit: 12, maxRotation: 0 } },
      }
    };

    return (
      <div className="aqi-view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 30-Day Bar Chart */}
        <div className="aqi-card aqi-chart-card aqi-animate-in">
          <div className="aqi-section-header">
            <h3 className="aqi-section-title">30-Day Air Quality History</h3>
            <span className="aqi-section-sub">
              Synced with WAQI Live Gauge · Real history from Open-Meteo
            </span>
          </div>
          <div style={{ height: 280, paddingTop: 10 }}>
            <Bar data={hChartData} options={hOpts} />
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div className="aqi-card aqi-animate-in aqi-stagger-1" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#7D8590', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Average</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: getSeverity(history.avg).color }}>{history.avg}</span>
              <span style={{ fontSize: 13, color: '#CDD9E5', fontWeight: 500 }}>AQI</span>
            </div>
            <span style={{ fontSize: 12, color: '#7D8590' }}>General trend for {activeCity} over the last month.</span>
          </div>

          <div className="aqi-card aqi-animate-in aqi-stagger-2" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#7D8590', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Worst Air Quality</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: getSeverity(history.worst.val).color }}>{history.worst.val}</span>
            </div>
            <span style={{ fontSize: 12, color: '#7D8590' }}>Recorded on <strong style={{ color: '#E6EDF3' }}>{history.worst.date}</strong>. {getSeverity(history.worst.val).label}.</span>
          </div>

          <div className="aqi-card aqi-animate-in aqi-stagger-3" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#7D8590', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Air Quality</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: getSeverity(history.best.val).color }}>{history.best.val}</span>
            </div>
            <span style={{ fontSize: 12, color: '#7D8590' }}>Recorded on <strong style={{ color: '#E6EDF3' }}>{history.best.date}</strong>. {getSeverity(history.best.val).label}.</span>
          </div>
        </div>
      </div>
    );
  };

  /* ════════════════════════════════════════════════════════════════════════════
     VIEW: HEALTH TIPS (Comprehensive Guide)
  ════════════════════════════════════════════════════════════════════════════ */
  const viewHealthTips = () => {
    const isBad = aqi > 100;

    const activityAdvice = () => {
      if (aqi <= 50) return { title: 'Safe / Perfect', body: 'Conditions are ideal for outdoor running, cycling, and yoga. Breathe deep and enjoy.', icon: 'mood' };
      if (aqi <= 100) return { title: 'Moderate / Safe', body: 'Generally safe, but sensitive individuals should avoid high-intensity sprints.', icon: 'directions_walk' };
      if (aqi <= 150) return { title: 'Limited / Caution', body: 'Shift intense cardio indoors. Avoid high-traffic roads while walking.', icon: 'warning' };
      if (aqi <= 200) return { title: 'Indoor Only', body: 'Avoid all outdoor exercise. Switch to indoor gym or home-based workouts.', icon: 'fitness_center' };
      return { title: 'Strict Restriction', body: 'Highly dangerous. Prolonged heavy exertion will cause lung inflammation. Stay inside.', icon: 'block' };
    };

    const dietAdvice = [
      { food: 'Antioxidants', s: 'Citrus, Amla', body: 'Boosts immunity and neutralizes toxins from fine particles.', icon: 'nutrition', color: '#FFD700' },
      { food: 'Respiratory Care', s: 'Almonds, Nuts', body: 'Vitamin E protects lung tissue from oxidant stress.', icon: 'energy_savings_leaf', color: '#FF8A65' },
      { food: 'Anti-Inflammatory', s: 'Walnuts, Seeds', body: 'Omega-3 reduces inflammation in the heart and lungs.', icon: 'spa', color: '#58A6FF' },
      { food: 'Detoxify', s: 'Warm Water', body: 'Clear out particles trapped in the respiratory tract.', icon: 'water_drop', color: '#4FC3F7' }
    ];

    const act = activityAdvice();

    return (
      <div className="aqi-view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Main Status Hero */}
        <div className="aqi-card aqi-health-hero aqi-animate-in"
          style={{
            padding: '32px 36px',
            background: `${sev.color}08`,
            borderColor: `${sev.color}30`,
            '--glow-color': `${sev.color}15`
          }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: sev.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${sev.color}40` }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, fontWeight: 300 }}>
                {isBad ? 'warning_amber' : 'verified_user'}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: 22, fontWeight: 700, color: sev.color, letterSpacing: '-0.01em' }}>
                {sev.label} Environment
              </h3>
              <p style={{ margin: 0, fontSize: 15, color: '#CDD9E5', lineHeight: 1.6, maxWidth: 650 }}>
                {isBad
                  ? `Levels of ${dominentPol || 'PM2.5'} are elevated today. Stagnant air is trapping industrial smoke and traffic exhaust near ground level. Limit your exposure to outside air.`
                  : 'Air balance is currently optimal. Atmospheric pressure and wind speeds are assisting the dispersal of pollutants. Enjoy your activities without worry.'}
              </p>
            </div>
          </div>
        </div>

        <div className="aqi-grid-2-3">

          {/* Section 1: Physical Activity */}
          <div className="aqi-card aqi-col-2 aqi-animate-in aqi-stagger-1" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#CDD9E5', fontSize: 20 }}>sprint</span>
              </div>
              <h4 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Exercise & Lifestyle Guide</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: 'rgba(63,185,80,0.06)', padding: 20, borderRadius: 16, border: '1px solid rgba(63,185,80,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#3FB950' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>thumb_up</span>
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Practices</span>
                </div>
                <p style={{ fontSize: 13, color: '#CDD9E5', margin: 0, lineHeight: 1.7 }}>
                  {aqi <= 100 ? 'Take advantage of the clean air with outdoor cardio, deep-breathing yoga, and neighborhood walks.' : 'Protect your lungs by staying hydrated and performing light indoor muscle stretches instead.'}
                </p>
              </div>
              <div style={{ background: 'rgba(248,81,73,0.06)', padding: 20, borderRadius: 16, border: '1px solid rgba(248,81,73,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#F85149' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>do_not_disturb_on</span>
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critical Alert</span>
                </div>
                <p style={{ fontSize: 13, color: '#CDD9E5', margin: 0, lineHeight: 1.7 }}>
                  {isBad ? 'Do not perform high-intensity workouts near congested areas. Morning smog is particularly thick.' : 'No major restrictions, but monitor local air if exercising near heavy industrial zones.'}
                </p>
              </div>
            </div>

            <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 16, background: `${sev.color}15`, border: `1px solid ${sev.color}30`, display: 'flex', gap: 16, alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: sev.color, fontSize: 28 }}>{act.icon}</span>
              <span style={{ fontSize: 14, color: '#E6EDF3', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', color: sev.color }}>{act.title}</strong>
                {act.body}
              </span>
            </div>
          </div>

          {/* Section 2: Precautions */}
          <div className="aqi-card aqi-animate-in aqi-stagger-2" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#CDD9E5', fontSize: 20 }}>safety_check</span>
              </div>
              <h4 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Protection</h4>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { i: 'masks', t: 'Air Filtering', d: isBad ? 'Use N95 respirator' : 'Standard comfort only' },
                { i: 'air_purifier_gen', t: 'Indoor Purifiers', d: isBad ? 'Seal room, High mode' : 'Energy saving mode' },
                { i: 'sensor_door', t: 'Ventilation', d: isBad ? 'Keep windows shut' : 'Open for circulation' },
                { i: 'stethoscope', t: 'Sensitive Groups', d: isBad ? 'Stay strictly indoors' : 'Safe to explore' },
              ].map((p, idx) => (
                <li key={idx} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#7D8590' }}>{p.i}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#E6EDF3' }}>{p.t}</div>
                    <div style={{ fontSize: 12, color: '#8B949E' }}>{p.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: Diet & Nutrition */}
        <div className="aqi-card aqi-animate-in aqi-stagger-3" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(88,166,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#58A6FF', fontSize: 20 }}>grocery</span>
            </div>
            <h4 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Nutrition & Detox Protocol</h4>
          </div>
          <div className="aqi-diet-grid">
            {dietAdvice.map((item, i) => (
              <div key={i} className="aqi-diet-card">
                <div className="aqi-health-icon-box" style={{ background: `${item.color}15`, color: item.color }}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#E6EDF3', marginBottom: 2 }}>{item.food}</div>
                <div style={{ fontSize: 11, color: item.color, fontWeight: 600, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>{item.s}</div>
                <div style={{ fontSize: 12, color: '#8B949E', lineHeight: 1.6 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  /* ════════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="aqi-page">
      <div className="aqi-page-inner">

        {/* Page Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
          <div className="aqi-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#E6EDF3', letterSpacing: '-0.02em' }}>
              Air Quality
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: '#7D8590', lineHeight: 1.5 }}>
              Real-time monitoring from official government sensors across India · Powered by WAQI
            </p>
          </div>

          {/* City Switcher */}
          <div className="aqi-city-bar aqi-animate-in aqi-stagger-1">
            {CITIES.map(city => (
              <button
                key={city}
                onClick={() => loadData(CITY_KEYS[city], city)}
                disabled={cityLoading}
                className={`aqi-city-chip${activeCity === city ? ' active' : ''}`}
                style={activeCity === city ? { background: sev.color, color: '#000', borderColor: 'transparent' } : {}}
              >
                {cityLoading && activeCity === city
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span className="aqi-spinner" style={{ width: 10, height: 10, borderWidth: 2, borderTopColor: '#000' }} />
                    {city}
                  </span>
                  : city
                }
              </button>
            ))}
          </div>

          <hr className="aqi-divider" />
        </div>

        {/* Content */}
        {loading ? <LoadingState /> : error ? <ErrorState /> : (
          <>
            {activeSubTab === 0 && viewLive()}
            {activeSubTab === 1 && viewForecast()}
            {activeSubTab === 2 && <HistoricalView activeCity={activeCity} currentAqi={aqi} />}
            {activeSubTab === 3 && viewHealthTips()}
          </>
        )}

      </div>
    </div>
  );
};

export default AQI;
