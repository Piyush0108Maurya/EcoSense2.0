/* ═══════════════════════════════════════════════════════════════
   Waste Collector Registry — India
   ═══════════════════════════════════════════════════════════════
   Dataset of verified/representative waste collectors across
   major Indian cities. Each entry includes:
     - name, category, lat/lon, phone, address, timings, accepted
   ═══════════════════════════════════════════════════════════════ */

export const WASTE_CATEGORIES = [
  { id: 'plastic',    label: 'Plastic',       emoji: '♻️',  color: '#22D3EE', icon: 'water_drop' },
  { id: 'ewaste',     label: 'E-Waste',       emoji: '📱',  color: '#B0B0FF', icon: 'devices' },
  { id: 'organic',    label: 'Organic',       emoji: '🌿',  color: '#5AB87A', icon: 'compost' },
  { id: 'hazardous',  label: 'Hazardous',     emoji: '⚠️',  color: '#FF4D4D', icon: 'warning' },
  { id: 'paper',      label: 'Paper',         emoji: '📦',  color: '#FFBE32', icon: 'description' },
  { id: 'metal',      label: 'Metal/Scrap',   emoji: '🔩',  color: '#9CA3AF', icon: 'hardware' },
  { id: 'battery',    label: 'Battery',       emoji: '🔋',  color: '#F97316', icon: 'battery_alert' },
  { id: 'medical',    label: 'Medical',       emoji: '🏥',  color: '#EC4899', icon: 'medical_services' },
];

/* ── Raw Collector Database ─────────────────────────────────── */
const COLLECTORS_DB = [

  // ── DELHI NCR ──────────────────────────────────────────────
  {
    id: 1, name: 'Eco Recyclers Delhi',
    categories: ['plastic', 'paper', 'metal'],
    lat: 28.6129, lon: 77.2295,
    phone: '+91-9876543210',
    address: 'Okhla Industrial Area, Phase 2, New Delhi - 110020',
    timings: 'Mon–Sat: 9 AM – 6 PM',
    city: 'Delhi',
    rating: 4.5,
    verified: true,
  },
  {
    id: 2, name: 'GreenTech E-Waste Solutions',
    categories: ['ewaste', 'battery'],
    lat: 28.5355, lon: 77.3910,
    phone: '+91-9988776655',
    address: 'Sector 63, Noida, Uttar Pradesh - 201301',
    timings: 'Mon–Sat: 10 AM – 7 PM',
    city: 'Delhi NCR',
    rating: 4.8,
    verified: true,
  },
  {
    id: 3, name: 'BioGreen Organics Pvt. Ltd.',
    categories: ['organic'],
    lat: 28.6692, lon: 77.4538,
    phone: '+91-9871234560',
    address: 'Mayur Vihar Phase 3, New Delhi - 110096',
    timings: 'Daily: 8 AM – 5 PM',
    city: 'Delhi',
    rating: 4.3,
    verified: true,
  },
  {
    id: 4, name: 'SafeDispose Hazardous Waste',
    categories: ['hazardous', 'medical', 'battery'],
    lat: 28.4595, lon: 77.0266,
    phone: '+91-9112233445',
    address: 'Gurugram Industrial Sector 37, Haryana - 122001',
    timings: 'Mon–Fri: 9 AM – 5 PM',
    city: 'Gurugram',
    rating: 4.7,
    verified: true,
  },
  {
    id: 5, name: 'Kabadiwala Express Delhi',
    categories: ['paper', 'plastic', 'metal'],
    lat: 28.7041, lon: 77.1025,
    phone: '+91-8800112233',
    address: 'Rohini Sector 11, New Delhi - 110085',
    timings: 'Mon–Sun: 8 AM – 8 PM',
    city: 'Delhi',
    rating: 4.2,
    verified: false,
  },

  // ── MUMBAI ────────────────────────────────────────────────
  {
    id: 6, name: 'Primus Partners E-Waste',
    categories: ['ewaste', 'battery'],
    lat: 19.0760, lon: 72.8777,
    phone: '+91-9820123456',
    address: 'Andheri East MIDC, Mumbai - 400093',
    timings: 'Mon–Sat: 9 AM – 6 PM',
    city: 'Mumbai',
    rating: 4.6,
    verified: true,
  },
  {
    id: 7, name: 'Mumbai Green Collective',
    categories: ['organic', 'plastic'],
    lat: 19.0178, lon: 72.8478,
    phone: '+91-9930001234',
    address: 'Dharavi Recycling Hub, Mumbai - 400017',
    timings: 'Daily: 7 AM – 6 PM',
    city: 'Mumbai',
    rating: 4.4,
    verified: true,
  },
  {
    id: 8, name: 'MedWaste Mumbai',
    categories: ['medical', 'hazardous'],
    lat: 19.1136, lon: 72.8697,
    phone: '+91-9820987654',
    address: 'Goregaon West Industrial Area, Mumbai - 400062',
    timings: 'Mon–Fri: 8 AM – 4 PM',
    city: 'Mumbai',
    rating: 4.9,
    verified: true,
  },
  {
    id: 9, name: 'Recycle Express Mumbai',
    categories: ['paper', 'metal', 'plastic'],
    lat: 19.2183, lon: 72.9781,
    phone: '+91-9867543210',
    address: 'Bhiwandi Logistics Park, Thane - 421302',
    timings: 'Mon–Sat: 9 AM – 7 PM',
    city: 'Thane',
    rating: 4.1,
    verified: false,
  },

  // ── BANGALORE ─────────────────────────────────────────────
  {
    id: 10, name: 'E-Parisaraa Bangalore',
    categories: ['ewaste', 'battery'],
    lat: 12.9716, lon: 77.5946,
    phone: '+91-9845001234',
    address: 'Doddaballapur Industrial Area, Bangalore - 561203',
    timings: 'Mon–Sat: 9 AM – 5 PM',
    city: 'Bangalore',
    rating: 4.8,
    verified: true,
  },
  {
    id: 11, name: 'Hasiru Dala Cooperative',
    categories: ['organic', 'plastic', 'paper'],
    lat: 12.9352, lon: 77.6245,
    phone: '+91-9845098765',
    address: 'HSR Layout Sector 7, Bangalore - 560102',
    timings: 'Daily: 7 AM – 7 PM',
    city: 'Bangalore',
    rating: 4.7,
    verified: true,
  },
  {
    id: 12, name: 'Saahas Waste Management',
    categories: ['hazardous', 'plastic', 'metal'],
    lat: 12.9010, lon: 77.5867,
    phone: '+91-9880112233',
    address: 'Bannerghatta Road, Bangalore - 560076',
    timings: 'Mon–Sat: 8 AM – 6 PM',
    city: 'Bangalore',
    rating: 4.6,
    verified: true,
  },

  // ── HYDERABAD ─────────────────────────────────────────────
  {
    id: 13, name: 'GHMC Recycling Depot',
    categories: ['plastic', 'paper', 'metal'],
    lat: 17.3850, lon: 78.4867,
    phone: '+91-4024650000',
    address: 'Jeedimetla Industrial Area, Hyderabad - 500055',
    timings: 'Mon–Sat: 9 AM – 5 PM',
    city: 'Hyderabad',
    rating: 4.2,
    verified: true,
  },
  {
    id: 14, name: 'TechnoWaste Hyderabad',
    categories: ['ewaste', 'battery'],
    lat: 17.4401, lon: 78.3489,
    phone: '+91-9848012345',
    address: 'Madhapur Hi-Tech City Area, Hyderabad - 500081',
    timings: 'Mon–Sat: 10 AM – 7 PM',
    city: 'Hyderabad',
    rating: 4.5,
    verified: true,
  },
  {
    id: 15, name: 'Hyderabad BioWaste Solutions',
    categories: ['organic', 'medical'],
    lat: 17.3616, lon: 78.4747,
    phone: '+91-9866001122',
    address: 'Nampally, Hyderabad - 500001',
    timings: 'Daily: 7 AM – 5 PM',
    city: 'Hyderabad',
    rating: 4.3,
    verified: true,
  },

  // ── PATNA ─────────────────────────────────────────────────
  {
    id: 16, name: 'Patna Green Force',
    categories: ['organic', 'plastic'],
    lat: 25.5941, lon: 85.1376,
    phone: '+91-9801234567',
    address: 'Kankarbagh Colony, Patna - 800020',
    timings: 'Mon–Sat: 9 AM – 5 PM',
    city: 'Patna',
    rating: 4.0,
    verified: true,
  },
  // ── PUNE ──────────────────────────────────────────────────
  {
    id: 18, name: 'Pune Eco-Recycle Solutions',
    categories: ['plastic', 'paper', 'metal', 'organic'],
    lat: 18.5204, lon: 73.8567,
    phone: '+91-9890123456',
    address: 'Hadapsar Industrial Estate, Pune - 411013',
    timings: 'Mon–Sat: 9 AM – 6 PM',
    city: 'Pune',
    rating: 4.7,
    verified: true,
  },
  {
    id: 19, name: 'Maha-E-Waste Sorters',
    categories: ['ewaste', 'battery', 'hazardous'],
    lat: 18.5590, lon: 73.9270,
    phone: '+91-9876001122',
    address: 'Viman Nagar, Pune - 411014',
    timings: 'Mon–Sat: 10 AM – 7 PM',
    city: 'Pune',
    rating: 4.5,
    verified: true,
  },

  // ── CHENNAI ───────────────────────────────────────────────
  {
    id: 20, name: 'Chennai Green Initiatives',
    categories: ['plastic', 'organic', 'paper'],
    lat: 13.0827, lon: 80.2707,
    phone: '+91-4478901234',
    address: 'Ambattur Industrial Estate, Chennai - 600058',
    timings: 'Mon–Sun: 8 AM – 6 PM',
    city: 'Chennai',
    rating: 4.6,
    verified: true,
  },
  {
    id: 21, name: 'Safe-Medical Disposal Chennai',
    categories: ['medical', 'hazardous'],
    lat: 12.9717, lon: 80.2452,
    phone: '+91-9840011223',
    address: 'Guindy Industrial Estate, Chennai - 600032',
    timings: 'Mon–Fri: 9 AM – 5 PM',
    city: 'Chennai',
    rating: 4.8,
    verified: true,
  },

  // ── KOLKATA ───────────────────────────────────────────────
  {
    id: 22, name: 'Kolkata Urban Ecology Hub',
    categories: ['plastic', 'metal', 'paper'],
    lat: 22.5726, lon: 88.3639,
    phone: '+91-3345678901',
    address: 'Sector V, Salt Lake City, Kolkata - 700091',
    timings: 'Mon–Sat: 9 AM – 7 PM',
    city: 'Kolkata',
    rating: 4.4,
    verified: true,
  },
];

/* ── Haversine Distance (km) ────────────────────────────────── */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Main Query Function ────────────────────────────────────── */
/**
 * Get only verified waste collectors for given coords + category.
 */
export function getNearestCollectors(coords, categoryId, maxResults = 8) {
  const { lat, lon } = coords;

  return COLLECTORS_DB
    .filter(c => c.verified === true) // Strict Verify Rule
    .filter(c => !categoryId || c.categories.includes(categoryId))
    .map(c => ({
      ...c,
      distanceKm: Math.round(haversine(lat, lon, c.lat, c.lon) * 10) / 10,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, maxResults);
}

/**
 * Reverse-geocode: use Open-Meteo geocoding to resolve "city name" for given coords.
 * @param {{ lat: number, lon: number }} coords
 * @returns {Promise<string>} city name or fallback
 */
export async function reverseGeocode(coords) {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(coords.lat.toFixed(2) + ',' + coords.lon.toFixed(2))}&count=1`
    );
    // Open-Meteo geocoding is name-based, so for reverse, use nominatim (no key needed)
    const nomRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json&zoom=10`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'EcoSense/2.0' } }
    );
    const nomJson = await nomRes.json();
    return nomJson.address?.city
      || nomJson.address?.town
      || nomJson.address?.county
      || nomJson.address?.state
      || 'Your Location';
  } catch {
    return 'Your Location';
  }
}
