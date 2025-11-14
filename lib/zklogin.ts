import { generateNonce, generateRandomness, jwtToAddress } from '@mysten/sui/zklogin'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

// OAuth Configuration
export interface OAuthConfig {
  clientId: string
  redirectUri: string
  provider: 'google' | 'facebook'
}

export interface ZKLoginState {
  nonce: string
  randomness: string
  maxEpoch: number
  ephemeralKeyPair: Ed25519Keypair
}

// Generate ephemeral key pair and nonce
export function generateZKLoginState(maxEpoch: number): ZKLoginState {
  const ephemeralKeyPair = new Ed25519Keypair()
  const randomness = generateRandomness()
  const nonce = generateNonce(
    ephemeralKeyPair.getPublicKey(),
    maxEpoch,
    randomness
  )

  return {
    nonce,
    randomness,
    maxEpoch,
    ephemeralKeyPair,
  }
}

// Get OAuth authorization URL
export function getOAuthUrl(
  config: OAuthConfig,
  nonce: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: nonce,
    state: state,
  })

  if (config.provider === 'google') {
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  } else if (config.provider === 'facebook') {
    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
  }

  throw new Error(`Unsupported provider: ${config.provider}`)
}

// Parse JWT token and extract claims
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to parse JWT:', error)
    return null
  }
}

// Get Sui address from JWT
export async function getSuiAddressFromJWT(
  jwt: string,
  userSalt: string
): Promise<string> {
  try {
    const address = jwtToAddress(jwt, userSalt)
    return address
  } catch (error) {
    console.error('Failed to get Sui address from JWT:', error)
    throw error
  }
}

// Generate ZK Proof (this would call Mysten's prover service)
export async function generateZKProof(
  jwt: string,
  ephemeralKeyPair: Ed25519Keypair,
  randomness: string,
  maxEpoch: number,
  userSalt: string
): Promise<any> {
  try {
    // In production, this would call Mysten's ZK proof generation service
    // https://prover.mystenlabs.com/v1
    const response = await fetch(
      process.env.NEXT_PUBLIC_PROVER_URL || 'https://prover-dev.mystenlabs.com/v1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jwt,
          extendedEphemeralPublicKey: ephemeralKeyPair.getPublicKey().toSuiBytes(),
          maxEpoch,
          jwtRandomness: randomness,
          salt: userSalt,
          keyClaimName: 'sub',
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to generate ZK proof')
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to generate ZK proof:', error)
    throw error
  }
}

// Store ZKLogin state in session storage
export function storeZKLoginState(state: ZKLoginState): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('zklogin_state', JSON.stringify({
      nonce: state.nonce,
      randomness: state.randomness,
      maxEpoch: state.maxEpoch,
      ephemeralPrivateKey: state.ephemeralKeyPair.getSecretKey(),
    }))
  }
}

// Retrieve ZKLogin state from session storage
export function retrieveZKLoginState(): ZKLoginState | null {
  if (typeof window === 'undefined') return null

  const stored = sessionStorage.getItem('zklogin_state')
  if (!stored) return null

  try {
    const data = JSON.parse(stored)
    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(data.ephemeralPrivateKey)

    return {
      nonce: data.nonce,
      randomness: data.randomness,
      maxEpoch: data.maxEpoch,
      ephemeralKeyPair,
    }
  } catch (error) {
    console.error('Failed to retrieve ZKLogin state:', error)
    return null
  }
}

// Clear ZKLogin state
export function clearZKLoginState(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('zklogin_state')
  }
}

// Get current epoch from Sui network
export async function getCurrentEpoch(): Promise<number> {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.devnet.sui.io:443',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_getLatestSuiSystemState',
          params: [],
        }),
      }
    )

    const data = await response.json()
    return parseInt(data.result.epoch)
  } catch (error) {
    console.error('Failed to get current epoch:', error)
    return 0
  }
}
