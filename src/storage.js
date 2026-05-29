const KEY = 'coffee-brews';

export function loadBrews() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBrews(brews) {
  localStorage.setItem(KEY, JSON.stringify(brews));
}
