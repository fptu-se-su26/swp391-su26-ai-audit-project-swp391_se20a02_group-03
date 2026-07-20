import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { clearAuthStorage, getAuthToken, getAuthUserRaw, persistAuth } from '../utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = getAuthToken()
    const storedUser = getAuthUserRaw()
    if (storedToken && storedUser) {
      try {
        let base64Url = storedToken.split('.')[1]
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const padding = '='.repeat((4 - base64.length % 4) % 4)
        const payload = JSON.parse(atob(base64 + padding))
        const isExpired = payload.exp && Date.now() / 1000 > payload.exp
        if (isExpired) {
          clearAuthStorage()
        } else {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch {
        clearAuthStorage()
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((tokenValue, userData, remember = false) => {
    persistAuth(tokenValue, JSON.stringify(userData), remember)
    setToken(tokenValue)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    clearAuthStorage()
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    function onSessionExpired() {
      logout()
    }
    window.addEventListener('auth:session-expired', onSessionExpired)
    return () => window.removeEventListener('auth:session-expired', onSessionExpired)
  }, [logout])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token,
      isAdmin:  user?.role === 'Admin',
      isStaff:  user?.role === 'Staff',
      isCourtOwner: user?.role === 'CourtOwner',
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider')
  return ctx
}