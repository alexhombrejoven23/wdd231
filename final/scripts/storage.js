const FAVS_KEY = 'bsd_favorites';
const PREFS_KEY = 'bsd_prefs';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVS_KEY)) || [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
  return favs.includes(id);
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY)) || { view: 'grid', filter: 'all', sort: 'name' };
  } catch {
    return { view: 'grid', filter: 'all', sort: 'name' };
  }
}
