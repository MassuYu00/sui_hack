'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  generateZKLoginState,
  getOAuthUrl,
  parseJWT,
  getSuiAddressFromJWT,
  generateZKProof,
  storeZKLoginState,
  retrieveZKLoginState,
  clearZKLoginState,
  getCurrentEpoch,
  type OAuthConfig,
  type ZKLoginState,
} from './zklogin'
import {
  loadSession,
  clearSessionWithNotification,
  createSession,
  startSessionMonitoring,
  addSessionListener,
  isSessionValid,
  saveSession,
  type SessionData,
} from './session-manager'
import { MOCK_MODE, mockLogin, getMockSession, isOAuthConfigured } from './mock-auth'

interface ZKLoginSession {
  address: string
  userEmail: string
  provider: string
  createdAt: number
}

interface AuthContextType {
  session: ZKLoginSession | null
  isLoading: boolean
  login: (provider: 'google' | 'facebook') => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  handleOAuthCallback: (jwt: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ZKLoginSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load session on mount
  useEffect(() => {
    const storedSession = loadSession()
    if (storedSession && isSessionValid()) {
      setSession({
        address: storedSession.address,
        userEmail: storedSession.userEmail,
        provider: storedSession.provider,
        createdAt: storedSession.createdAt,
      })
    }
    setIsLoading(false)

    // Start session monitoring
    const stopMonitoring = startSessionMonitoring()

    // Listen for session events
    const removeListener = addSessionListener((type) => {
      if (type === 'expired' || type === 'cleared') {
        setSession(null)
      }
    })

    return () => {
      stopMonitoring()
      removeListener()
    }
  }, [])

  const getOAuthConfig = (provider: 'google' | 'facebook'): OAuthConfig => {
    const redirectUri = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback'

    return {
      clientId: provider === 'google'
        ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
        : process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
      redirectUri,
      provider,
    }
  }

  const login = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    try {
      // Check if we should use mock mode
      const useMockMode = MOCK_MODE || !isOAuthConfigured()
      
      if (useMockMode) {
        console.log('🧪 Using mock authentication mode')
        
        // Simulate OAuth delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Get mock session data
        const mockSession = getMockSession(provider)
        
        // Save session
        saveSession(mockSession)
        
        // Update state
        setSession({
          address: mockSession.address,
          userEmail: mockSession.userEmail,
          provider: mockSession.provider,
          createdAt: mockSession.createdAt,
        })
        
        setIsLoading(false)
        return
      }

      // Real OAuth flow
      // Get current epoch from Sui network
      const currentEpoch = await getCurrentEpoch()
      const maxEpoch = currentEpoch + 10 // Valid for 10 epochs

      // Generate ZKLogin state
      const zkLoginState = generateZKLoginState(maxEpoch)
      
      // Store state for callback
      storeZKLoginState(zkLoginState)

      // Get OAuth config
      const config = getOAuthConfig(provider)

      // Generate state parameter for CSRF protection
      const state = Math.random().toString(36).substring(7)
      sessionStorage.setItem('oauth_state', state)

      // Redirect to OAuth provider
      const authUrl = getOAuthUrl(config, zkLoginState.nonce, state)
      window.location.href = authUrl
    } catch (error) {
      console.error('Login failed:', error)
      setIsLoading(false)
      throw error
    }
  }

  const handleOAuthCallback = async (jwt: string) => {
    setIsLoading(true)
    try {
      // Retrieve stored ZKLogin state
      const zkLoginState = retrieveZKLoginState()
      if (!zkLoginState) {
        throw new Error('No ZKLogin state found')
      }

      // Parse JWT to get user info
      const jwtPayload = parseJWT(jwt)
      if (!jwtPayload) {
        throw new Error('Invalid JWT')
      }

      // Generate user salt (in production, this should be derived securely)
      const userSalt = process.env.NEXT_PUBLIC_USER_SALT || 'default-salt'

      // Get Sui address from JWT
      const address = await getSuiAddressFromJWT(jwt, userSalt)

      // Generate ZK proof
      const zkProof = await generateZKProof(
        jwt,
        zkLoginState.ephemeralKeyPair,
        zkLoginState.randomness,
        zkLoginState.maxEpoch,
        userSalt
      )

      // Extract user email from JWT
      const userEmail = jwtPayload.email || jwtPayload.sub || 'unknown@example.com'
      const provider = jwtPayload.iss?.includes('google') ? 'google' : 'facebook'

      // Create session
      const sessionData = createSession(
        address,
        userEmail,
        provider,
        jwt,
        zkProof,
        zkLoginState.ephemeralKeyPair,
        zkLoginState.randomness,
        zkLoginState.maxEpoch
      )

      // Update state
      setSession({
        address: sessionData.address,
        userEmail: sessionData.userEmail,
        provider: sessionData.provider,
        createdAt: sessionData.createdAt,
      })

      // Clear ZKLogin state
      clearZKLoginState()
    } catch (error) {
      console.error('OAuth callback failed:', error)
      clearZKLoginState()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log('🚪 Logging out...')
    
    // Clear all session data
    clearSessionWithNotification()
    clearZKLoginState()
    
    // Update local state
    setSession(null)
    
    // Redirect to home page
    if (typeof window !== 'undefined') {
      // Clear any cached data from window
      sessionStorage.clear()
      
      console.log('✅ Logout successful')
      
      // Redirect to home
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        login,
        logout,
        isAuthenticated: !!session,
        handleOAuthCallback,
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
