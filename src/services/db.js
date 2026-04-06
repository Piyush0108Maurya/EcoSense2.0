// DATABASE NOTE — READ BEFORE BUILDING abstraction layer for gamification
export const DB = {
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("ecosense_user"));
    } catch { return null; }
  },

  saveUser: (user) => {
    try {
      localStorage.setItem("ecosense_user", JSON.stringify(user));
      return true;
    } catch { return false; }
  },

  updatePoints: (pts) => {
    const user = DB.getUser();
    if (!user) return null;
    user.points += pts;
    user.level = getLevel(user.points);
    DB.saveUser(user);
    return user;
  },

  addHistory: (item, result) => {
    const user = DB.getUser();
    if (!user) return null;
    if (!user.impactHistory) user.impactHistory = [];
    user.impactHistory.unshift({
      item, 
      category: result.category,
      points: result.ecoPoints,
      date: new Date().toISOString()
    });
    user.impactHistory = user.impactHistory.slice(0, 20); // keep last 20
    DB.saveUser(user);
    return user;
  },

  logout: () => {
    localStorage.removeItem("ecosense_user");
  }
};

export const getLevel = (pts) => {
  if (pts >= 10000) return "⭐ Planet Champion";
  if (pts >= 5000) return "🌍 Earth Protector";
  if (pts >= 1500) return "🌳 Green Guardian";
  if (pts >= 500) return "🌿 Eco Warrior";
  return "🌱 Eco Seedling";
};
