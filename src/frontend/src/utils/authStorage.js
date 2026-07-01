const REMEMBER_KEY = 'auth_remember';

export function clearAuthStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  localStorage.removeItem(REMEMBER_KEY);
}

/** Resolve token from the active storage only (avoids mixing sessions). */
export function getAuthToken() {
  const remember = localStorage.getItem(REMEMBER_KEY) === '1';
  const primary = remember ? localStorage : sessionStorage;
  const token = primary.getItem('token');
  if (token) return token;

  // Legacy: both storages may hold tokens — pick one and clear the other
  const localToken = localStorage.getItem('token');
  const sessionToken = sessionStorage.getItem('token');
  if (localToken && sessionToken && localToken !== sessionToken) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return localToken;
  }
  return localToken || sessionToken || null;
}

export function getAuthUserRaw() {
  const remember = localStorage.getItem(REMEMBER_KEY) === '1';
  const primary = remember ? localStorage : sessionStorage;
  return primary.getItem('user') || localStorage.getItem('user') || sessionStorage.getItem('user');
}

export function persistAuth(token, userJson, remember = false) {
  clearAuthStorage();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('token', token);
  storage.setItem('user', userJson);
  localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
}
