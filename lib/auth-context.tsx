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
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
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
  handleOAuthCallback: (jwt: string, state?: string) => Promise<void>
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
      console.log('🚀 Login button clicked for provider:', provider)
      
      // Check if we should use mock mode
      const useMockMode = MOCK_MODE || !isOAuthConfigured()
      console.log('🔍 Mock mode:', useMockMode, 'MOCK_MODE:', MOCK_MODE, 'OAuth configured:', isOAuthConfigured())
      
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
        console.log('✅ Mock login successful')
        return
      }

      // Real OAuth flow
      console.log('🔑 Starting real OAuth flow...')
      
      try {
        // Get current epoch from Sui network
        console.log('📡 Fetching current epoch from Sui network...')
        const currentEpoch = await getCurrentEpoch()
        const maxEpoch = currentEpoch + 10 // Valid for 10 epochs
        console.log('📅 Current epoch:', currentEpoch, 'Max epoch:', maxEpoch)

        // Generate ZKLogin state
        console.log('🎲 Generating ZKLogin state...')
        const zkLoginState = generateZKLoginState(maxEpoch)
        console.log('✅ Generated nonce:', zkLoginState.nonce)
        console.log('✅ Generated publicKey:', zkLoginState.ephemeralKeyPair.getPublicKey().toBase64())
        
        // Generate state parameter for CSRF protection AND to identify this login session
        const state = Math.random().toString(36).substring(7)
        console.log('🎲 Generated OAuth state:', state)
        
        // Get secret key and convert to plain array for JSON serialization
        const secretKey = zkLoginState.ephemeralKeyPair.getSecretKey()
        const secretKeyArray = Array.from(secretKey) // Convert Uint8Array to plain array
        
        // Store BOTH the ZKLogin state and OAuth state with the same key
        const storageKey = `zklogin_state_${state}`
        const stateData = {
          nonce: zkLoginState.nonce,
          randomness: zkLoginState.randomness,
          maxEpoch: zkLoginState.maxEpoch,
          ephemeralPrivateKey: secretKeyArray, // Store as plain array
        }
        
        // Store in default location (backward compatibility)
        storeZKLoginState(zkLoginState)
        
        // Store with state-specific key (primary method)
        sessionStorage.setItem(storageKey, JSON.stringify(stateData))
        sessionStorage.setItem('oauth_state', state)
        sessionStorage.setItem('oauth_provider', provider)
        
        console.log('💾 ZKLogin state stored with key:', storageKey)
        console.log('💾 Stored nonce:', stateData.nonce)
        console.log('💾 Secret key array length:', secretKeyArray.length)
        console.log('🔐 OAuth state stored:', state)
        
        // Verify it was stored correctly
        const verifyStored = sessionStorage.getItem(storageKey)
        if (verifyStored) {
          const verifyData = JSON.parse(verifyStored)
          console.log('✅ Verified: nonce matches:', verifyData.nonce === zkLoginState.nonce)
          console.log('✅ Verified: has ephemeralPrivateKey:', !!verifyData.ephemeralPrivateKey)
          console.log('✅ Verified: ephemeralPrivateKey is array:', Array.isArray(verifyData.ephemeralPrivateKey))
          console.log('✅ Verified: array length:', verifyData.ephemeralPrivateKey?.length)
        } else {
          console.error('❌ Failed to verify stored state!')
        }

        // Get OAuth config
        const config = getOAuthConfig(provider)
        console.log('⚙️ OAuth config:', {
          provider: config.provider,
          clientId: config.clientId.substring(0, 20) + '...',
          redirectUri: config.redirectUri,
        })

        // Redirect to OAuth provider with the SAME nonce
        const authUrl = getOAuthUrl(config, zkLoginState.nonce, state)
        console.log('🌐 Redirecting to OAuth provider...')
        console.log('📍 Auth URL (first 100 chars):', authUrl.substring(0, 100))
        
        window.location.href = authUrl
      } catch (innerError) {
        console.error('❌ Error in OAuth flow setup:', innerError)
        throw innerError
      }
    } catch (error) {
      console.error('❌ Login failed:', error)
      console.error('Error details:', error instanceof Error ? error.message : String(error))
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      setIsLoading(false)
      throw error
    }
  }

  const handleOAuthCallback = async (jwt: string, state?: string) => {
    setIsLoading(true)
    try {
      console.log('🔍 Callback received with state:', state)
      console.log('🔍 All sessionStorage keys:', Object.keys(sessionStorage))
      
      let zkLoginState: ZKLoginState | null = null
      
      // FIRST: Try the state-specific key (if state is provided)
      if (state) {
        const storageKey = `zklogin_state_${state}`
        console.log('🔍 Trying state-specific key:', storageKey)
        const stored = sessionStorage.getItem(storageKey)
        console.log('🔍 State-specific storage exists:', !!stored)
        
        if (stored) {
          try {
            const data = JSON.parse(stored)
            console.log('🔍 Stored ephemeralPrivateKey is array:', Array.isArray(data.ephemeralPrivateKey))
            console.log('🔍 Array length:', data.ephemeralPrivateKey?.length)
            
            // Convert array back to Uint8Array
            const privateKeyBytes = new Uint8Array(data.ephemeralPrivateKey)
            console.log('🔍 Private key bytes length:', privateKeyBytes.length)
            
            // Extract the 32-byte seed from the 70-byte secret key
            // Format: [scheme: 1 byte][seed: 32 bytes][public_key: 32 bytes][extra: 5 bytes]
            const seedBytes = privateKeyBytes.slice(1, 33)
            console.log('🔍 Seed bytes length:', seedBytes.length)
            
            // Create keypair from seed
            const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(seedBytes)
            
            zkLoginState = {
              nonce: data.nonce,
              randomness: data.randomness,
              maxEpoch: data.maxEpoch,
              ephemeralKeyPair,
            }
            console.log('✅ Found ZKLogin state with state-specific key')
            console.log('✅ Restored nonce:', zkLoginState.nonce)
            console.log('✅ Restored publicKey:', zkLoginState.ephemeralKeyPair.getPublicKey().toBase64())
          } catch (error) {
            console.error('❌ Failed to parse state-specific storage:', error)
          }
        } else {
          console.warn('⚠️ State-specific key not found:', storageKey)
        }
      }
      
      // FALLBACK: Try the default location only if state-specific not found
      if (!zkLoginState) {
        console.log('🔍 Trying default zklogin_state key')
        zkLoginState = retrieveZKLoginState()
        if (zkLoginState) {
          console.log('⚠️ Using default zklogin_state (may be old)')
          console.log('⚠️ Default nonce:', zkLoginState.nonce)
        }
      }
      
      if (!zkLoginState) {
        console.error('❌ No ZKLogin state found in any location')
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
