import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  const login = async (payload) => {
    // payload can be { token, user } from server or a legacy user object
    if (payload && payload.token) {
      localStorage.setItem('auth_token', payload.token)
      if (payload.user) {
        setUser(payload.user)
        localStorage.setItem('auth_user', JSON.stringify(payload.user))
        return
      }
    }
    // fallback: direct user object
    setUser(payload)
    localStorage.setItem('auth_user', JSON.stringify(payload))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  // validate token on mount
  useEffect(() => {
    let mounted = true
    async function validate() {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await api.get('/auth/me')
        if (mounted && res && res.user) {
          setUser(res.user)
          localStorage.setItem('auth_user', JSON.stringify(res.user))
        }
      } catch (err) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    validate()
    return () => { mounted = false }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
