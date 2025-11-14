import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

// Session data structure
export interface SessionData {
  address: string
  userEmail: string
  provider: string
  jwt: string
  zkProof: any
  expiresAt: number
  createdAt: number
  ephemeralPrivateKey: string
  randomness: string
  maxEpoch: number
}

// Encrypted session storage key
const SESSION_KEY = 'zklogin_session_encrypted'
const SESSION_EXPIRY_HOURS = 24

// Encode session data (basic encoding, in production use proper encryption)
function encodeSession(data: SessionData): string {
  try {
    const jsonStr = JSON.stringify(data)
    return btoa(jsonStr)
  } catch (error) {
    console.error('Failed to encode session:', error)
    throw error
  }
}

// Decode session data
function decodeSession(encoded: string): SessionData | null {
  try {
    const jsonStr = atob(encoded)
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('Failed to decode session:', error)
    return null
  }
}

// Save session
export function saveSession(data: SessionData): void {
  if (typeof window === 'undefined') return

  try {
    const encoded = encodeSession(data)
    localStorage.setItem(SESSION_KEY, encoded)
    
    // Also store a simpler version in sessionStorage for quick access
    sessionStorage.setItem('zklogin_active', 'true')
  } catch (error) {
    console.error('Failed to save session:', error)
  }
}

// Load session
export function loadSession(): SessionData | null {
  if (typeof window === 'undefined') return null

  try {
    const encoded = localStorage.getItem(SESSION_KEY)
    if (!encoded) return null

    const session = decodeSession(encoded)
    if (!session) return null

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession()
      return null
    }

    return session
  } catch (error) {
    console.error('Failed to load session:', error)
    return null
  }
}

// Clear session
export function clearSession(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem('zklogin_active')
  sessionStorage.removeItem('zklogin_state')
}

// Check if session is valid
export function isSessionValid(): boolean {
  const session = loadSession()
  return session !== null && Date.now() < session.expiresAt
}

// Get session expiry time
export function getSessionExpiryTime(): number | null {
  const session = loadSession()
  return session ? session.expiresAt : null
}

// Refresh session (extend expiry)
export function refreshSession(): boolean {
  const session = loadSession()
  if (!session) return false

  // Extend expiry by SESSION_EXPIRY_HOURS
  session.expiresAt = Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000

  try {
    saveSession(session)
    return true
  } catch (error) {
    console.error('Failed to refresh session:', error)
    return false
  }
}

// Create new session
export function createSession(
  address: string,
  userEmail: string,
  provider: string,
  jwt: string,
  zkProof: any,
  ephemeralKeyPair: Ed25519Keypair,
  randomness: string,
  maxEpoch: number
): SessionData {
  const now = Date.now()
  const expiresAt = now + SESSION_EXPIRY_HOURS * 60 * 60 * 1000

  const session: SessionData = {
    address,
    userEmail,
    provider,
    jwt,
    zkProof,
    expiresAt,
    createdAt: now,
    ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
    randomness,
    maxEpoch,
  }

  saveSession(session)
  return session
}

// Get ephemeral keypair from session
export function getEphemeralKeyPair(): Ed25519Keypair | null {
  const session = loadSession()
  if (!session) return null

  try {
    return Ed25519Keypair.fromSecretKey(session.ephemeralPrivateKey)
  } catch (error) {
    console.error('Failed to restore ephemeral keypair:', error)
    return null
  }
}

// Check if session needs refresh (within 2 hours of expiry)
export function shouldRefreshSession(): boolean {
  const expiryTime = getSessionExpiryTime()
  if (!expiryTime) return false

  const twoHours = 2 * 60 * 60 * 1000
  return expiryTime - Date.now() < twoHours
}

// Auto-refresh session if needed
export function autoRefreshSession(): void {
  if (shouldRefreshSession()) {
    refreshSession()
  }
}

// Session event listeners
export type SessionEventType = 'expired' | 'refreshed' | 'created' | 'cleared'
export type SessionEventListener = (type: SessionEventType, data?: any) => void

const sessionListeners: SessionEventListener[] = []

export function addSessionListener(listener: SessionEventListener): () => void {
  sessionListeners.push(listener)
  return () => {
    const index = sessionListeners.indexOf(listener)
    if (index > -1) {
      sessionListeners.splice(index, 1)
    }
  }
}

function notifySessionListeners(type: SessionEventType, data?: any): void {
  sessionListeners.forEach((listener) => listener(type, data))
}

// Enhanced save with notifications
export function saveSessionWithNotification(data: SessionData): void {
  saveSession(data)
  notifySessionListeners('created', data)
}

// Enhanced clear with notifications
export function clearSessionWithNotification(): void {
  clearSession()
  notifySessionListeners('cleared')
}

// Start session monitoring (check expiry periodically)
export function startSessionMonitoring(): () => void {
  if (typeof window === 'undefined') return () => {}

  const checkInterval = setInterval(() => {
    if (!isSessionValid()) {
      const session = loadSession()
      if (session) {
        clearSessionWithNotification()
        notifySessionListeners('expired')
      }
    } else {
      autoRefreshSession()
    }
  }, 60000) // Check every minute

  return () => clearInterval(checkInterval)
}
