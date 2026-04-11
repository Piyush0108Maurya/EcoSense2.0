import { getLevelInfo, REWARD_TYPES, checkStreak } from "./gamification";

/**
 * DATABASE PROXY (Local Cache)
 * Syncs with Firestore but provides instant UI updates.
 */
export const DB = {
  getUser: () => {
    try {
      const data = localStorage.getItem("ecosense_user");
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  saveUser: (user) => {
    try {
      localStorage.setItem("ecosense_user", JSON.stringify(user));
      return true;
    } catch { return false; }
  },

  // Internal Logic for Instant UI updates before Firestore sync
  applyActivityXP: (activityType, metadata = {}) => {
    const user = DB.getUser();
    if (!user) return null;

    const reward = REWARD_TYPES[activityType];
    if (!reward) return user;

    const streakRes = checkStreak(user.lastActive, user.streak || 0);

    // Limit daily login points to strictly once a day
    if (activityType === 'DAILY_CHECKIN' && !streakRes.newActivity) {
      return null;
    }

    const finalXP = Math.floor(reward.xp * (streakRes.bonusMultiplier || 1));

    user.points = (user.points || 0) + finalXP;
    user.lastActive = new Date().toISOString();
    
    if (streakRes.newActivity) {
      user.streak = streakRes.updatedStreak;
    }

    if (!user.impactHistory) user.impactHistory = [];
    user.impactHistory.unshift({
      type: activityType,
      points: finalXP,
      date: new Date().toISOString(),
      label: reward.label,
      ...metadata
    });

    DB.saveUser(user);
    return { user, addedXP: finalXP, label: reward.label };
  },

  logout: () => {
    localStorage.removeItem("ecosense_user");
  }
};

export { getLevelInfo };
