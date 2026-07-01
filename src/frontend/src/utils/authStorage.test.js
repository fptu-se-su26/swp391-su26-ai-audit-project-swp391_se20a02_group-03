import { describe, it, expect, beforeEach } from 'vitest';
import { clearAuthStorage, persistAuth, getAuthToken } from './authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    clearAuthStorage();
  });

  it('clears both storages on persistAuth so sessions do not mix', () => {
    localStorage.setItem('token', 'stale-token');
    localStorage.setItem('user', '{"id":1}');
    persistAuth('new-token', '{"id":2}', false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(getAuthToken()).toBe('new-token');
  });

  it('uses localStorage when remember is true', () => {
    persistAuth('remembered', '{"id":3}', true);
    expect(localStorage.getItem('token')).toBe('remembered');
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(getAuthToken()).toBe('remembered');
  });

  it('stores token in sessionStorage when remember is false', () => {
    localStorage.setItem('token', 'stale-local');
    sessionStorage.setItem('token', 'stale-session');
    persistAuth('fresh', '{"id":10}', false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('token')).toBe('fresh');
    expect(getAuthToken()).toBe('fresh');
  });
});
