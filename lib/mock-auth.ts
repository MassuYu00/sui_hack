// Mock mode utilities for testing without OAuth setup

export const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true'

export interface MockUser {
  address: string
  userEmail: string
  provider: string
}

// Mock users for testing
export const MOCK_USERS: Record<string, MockUser> = {
  google: {
    address: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    userEmail: 'test.google@example.com',
    provider: 'google',
  },
  facebook: {
    address: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    userEmail: 'test.facebook@example.com',
    provider: 'facebook',
  },
}

// Generate mock JWT
export function generateMockJWT(provider: 'google' | 'facebook'): string {
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    sub: MOCK_USERS[provider].address,
    email: MOCK_USERS[provider].userEmail,
    iss: provider === 'google' ? 'https://accounts.google.com' : 'https://www.facebook.com',
    aud: 'mock-client-id',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    nonce: 'mock-nonce',
  }

  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = 'mock-signature'

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Mock login function
export async function mockLogin(provider: 'google' | 'facebook'): Promise<string> {
  // Simulate OAuth flow delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return generateMockJWT(provider)
}

// Check if OAuth is configured
export function isOAuthConfigured(): boolean {
  const googleConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const facebookConfigured = !!process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID
  
  return googleConfigured || facebookConfigured
}

// Get mock session data
export function getMockSession(provider: 'google' | 'facebook') {
  return {
    ...MOCK_USERS[provider],
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    jwt: generateMockJWT(provider),
    zkProof: { mock: true },
    ephemeralPrivateKey: 'mock-private-key',
    randomness: 'mock-randomness',
    maxEpoch: 1000,
  }
}
