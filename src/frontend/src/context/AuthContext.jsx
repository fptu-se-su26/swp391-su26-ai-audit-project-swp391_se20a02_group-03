import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    const storedUser  = localStorage.getItem('user')  || sessionStorage.getItem('user')
    if (storedToken && storedUser) {
      try {
        // HIGH FIX: Validate JWT expiry claim before trusting stored token
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        const isExpired = payload.exp && Date.now() / 1000 > payload.exp
        if (isExpired) {
          // Token is expired — clear just auth keys, not all localStorage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('user')
        } else {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch {
        // HIGH FIX: Only remove auth-specific keys, don't nuke all localStorage (cart, preferences, etc)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((tokenValue, userData, remember = false) => {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem('token', tokenValue)
    storage.setItem('user', JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token,
      isAdmin:  user?.role === 'Admin',
      isStaff:  user?.role === 'Staff',
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