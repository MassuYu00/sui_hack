'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ZKLoginSession {
  address: string
  userEmail: string
  provider: string
  createdAt: number
}

interface AuthContextType {
  session: ZKLoginSession | null
  isLoading: boolean
  login: (provider: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ZKLoginSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem('zklogin_session')
    if (stored) {
      try {
        setSession(JSON.parse(stored))
      } catch (e) {
        localStorage.removeItem('zklogin_session')
      }
    }
  }, [])

  const login = async (provider: string) => {
    setIsLoading(true)
    try {
      // ZKLogin flow simulation - in production, this would integrate with actual Sui ZKLogin
      const mockSession: ZKLoginSession = {
        address: `0x${Math.random().toString(16).slice(2)}`,
        userEmail: 'user@example.com',
        provider,
        createdAt: Date.now(),
      }
      setSession(mockSession)
      localStorage.setItem('zklogin_session', JSON.stringify(mockSession))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setSession(null)
    localStorage.removeItem('zklogin_session')
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        login,
        logout,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
