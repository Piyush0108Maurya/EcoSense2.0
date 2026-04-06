/**
 * EcoSense Gamification Engine v2.0
 * Centralized logic for points, levels, streaks, and environmental impact.
 */

export const REWARD_TYPES = {
  DAILY_CHECKIN: { xp: 50,  label: 'Daily Synchronization', icon: 'event_available' },
  WASTE_SCAN:    { xp: 30,  label: 'Object Analysis',       icon: 'biotech' },
  WASTE_PIN:     { xp: 100, label: 'Geo-Waste Reporting',   icon: 'add_location_alt' },
  CHAT_INSIGHT:  { xp: 5,   label: 'Lumi Intelligence',     icon: 'forest' },
  CONTACT_HUB:   { xp: 15,  label: 'Collector Outreach',    icon: 'handshake' },
  QUIZ_MASTER:   { xp: 200, label: 'Eco-Expertise',         icon: 'school' },
  AQI_CHECK:     { xp: 10,  label: 'Air Quality Audit',     icon: 'air' }
};

export const LEVELS = [
  { minXP: 0,      label: "🌱 Eco Seedling",   color: "#A4D64C" },
  { minXP: 500,    label: "🌿 Eco Warrior",    color: "#5AB87A" },
  { minXP: 1500,   label: "🌳 Green Guardian", color: "#34D399" },
  { minXP: 5000,   label: "🌍 Earth Protector",color: "#059669" },
  { minXP: 10000,  label: "⭐ Planet Champion", color: "#FBBF24" },
  { minXP: 25000,  label: "🌌 Cosmic Steward",  color: "#8AEBFF" }
];

/**
 * Calculates current level details based on total XP.
 */
export const getLevelInfo = (totalXP) => {
  let current = LEVELS[0];
  let next = LEVELS[1];
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }

  const progress = next 
    ? ((totalXP - current.minXP) / (next.minXP - current.minXP)) * 100 
    : 100;

  return {
    ...current,
    nextThreshold: next ? next.minXP : null,
    progress: Math.min(progress, 100),
    xpToNext: next ? next.minXP - totalXP : 0
  };
};

/**
 * Translates XP into estimated environmental impact metrics.
 */
export const calculateImpact = (totalXP) => {
  return {
    co2Saved: (totalXP * 0.05).toFixed(2), // kg of CO2
    treesPlanted: (totalXP / 1000).toFixed(1),
    plasticRecovered: (totalXP * 0.1).toFixed(1), // kg of plastic
    waterSaved: (totalXP * 2).toFixed(0) // Liters
  };
};

/**
 * Logic for daily activity and streaks.
 */
export const checkStreak = (lastActiveDate, currentStreak) => {
  const today = new Date().toDateString();
  const last = lastActiveDate ? new Date(lastActiveDate).toDateString() : null;

  if (today === last) return { updatedStreak: currentStreak, newActivity: false };
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = last === yesterday.toDateString();

  return {
    updatedStreak: wasYesterday ? currentStreak + 1 : 1,
    newActivity: true,
    bonusMultiplier: wasYesterday ? Math.min(1 + (currentStreak * 0.1), 2) : 1
  };
};
