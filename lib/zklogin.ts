import { generateNonce, generateRandomness, jwtToAddress, getExtendedEphemeralPublicKey } from '@mysten/sui/zklogin'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { genAddressSeed, getZkLoginSignature } from '@mysten/sui/zklogin'

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

export interface ZKProofResponse {
  proof: string
  inputs: {
    addressSeed: string
    [key: string]: any
  }
}

// Generate ephemeral key pair and nonce
export function generateZKLoginState(maxEpoch: number): ZKLoginState {
  const ephemeralKeyPair = new Ed25519Keypair()
  const randomness = generateRandomness()
  
  // Generate nonce correctly for ZKLogin
  const nonce = generateNonce(
    ephemeralKeyPair.getPublicKey(),
    maxEpoch,
    randomness
  )

  console.log('🎯 Generated ZKLogin State:', {
    nonce,
    randomness,
    maxEpoch,
    publicKey: ephemeralKeyPair.getPublicKey().toBase64(),
    publicKeyBytes: Array.from(ephemeralKeyPair.getPublicKey().toRawBytes()),
  })

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
  if (config.provider === 'google') {
    // Use implicit flow with id_token in fragment
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'id_token',
      scope: 'openid email profile',
      nonce: nonce,
      state: state,
      prompt: 'select_account',
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  } else if (config.provider === 'facebook') {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'token id_token',
      scope: 'openid email public_profile',
      nonce: nonce,
      state: state,
    })
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

// Convert salt string to BigInt (must be within BN254 field)
function saltToBigInt(salt: string): bigint {
  // BN254 field modulus (max valid value)
  const BN254_FIELD_SIZE = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617')
  
  // If salt is already a number string, use it directly
  if (/^\d+$/.test(salt)) {
    const value = BigInt(salt)
    // Ensure it's within field size
    return value % BN254_FIELD_SIZE
  }
  
  // Hash the string to get a BigInt within valid range
  const encoder = new TextEncoder()
  const data = encoder.encode(salt)
  let hash = BigInt(0)
  
  for (let i = 0; i < data.length; i++) {
    hash = (hash * BigInt(256) + BigInt(data[i])) % BN254_FIELD_SIZE
  }
  
  // Ensure non-zero
  return hash === BigInt(0) ? BigInt(1) : hash
}

// Get Sui address from JWT
export async function getSuiAddressFromJWT(
  jwt: string,
  userSalt: string
): Promise<string> {
  try {
    // Parse JWT to get subject
    const decodedJWT = parseJWT(jwt)
    if (!decodedJWT || !decodedJWT.sub) {
      throw new Error('Invalid JWT: missing subject')
    }

    // Convert salt to BigInt
    const saltBigInt = saltToBigInt(userSalt)

    // Generate address seed
    const addressSeed = genAddressSeed(
      saltBigInt,
      'sub', // key claim name
      decodedJWT.sub,
      decodedJWT.aud as string
    )

    // Compute ZKLogin address
    const address = jwtToAddress(jwt, saltBigInt)
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
    console.log('🔐 Generating ZK proof...')
    
    // Parse JWT to verify nonce
    const decodedJWT = parseJWT(jwt)
    if (!decodedJWT) {
      throw new Error('Invalid JWT')
    }
    
    console.log('JWT nonce:', decodedJWT.nonce)
    console.log('🔑 Ephemeral public key (restored):', ephemeralKeyPair.getPublicKey().toBase64())
    console.log('📊 Randomness:', randomness)
    console.log('📅 Max epoch:', maxEpoch)
    
    // Regenerate nonce to verify it matches
    const expectedNonce = generateNonce(
      ephemeralKeyPair.getPublicKey(),
      maxEpoch,
      randomness
    )
    
    console.log('Expected nonce (regenerated):', expectedNonce)
    console.log('Nonces match:', decodedJWT.nonce === expectedNonce)
    
    if (decodedJWT.nonce !== expectedNonce) {
      console.error('⚠️ Nonce mismatch detected!')
      console.error('JWT nonce:', decodedJWT.nonce)
      console.error('Expected nonce:', expectedNonce)
      console.error('Public key:', ephemeralKeyPair.getPublicKey().toBase64())
      console.error('Randomness:', randomness)
      console.error('Max epoch:', maxEpoch)
      throw new Error('Nonce mismatch: JWT nonce does not match generated nonce')
    }

    const saltBigInt = saltToBigInt(userSalt)

    // Get extended ephemeral public key
    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralKeyPair.getPublicKey())

    // Generate address seed
    const addressSeed = genAddressSeed(
      saltBigInt,
      'sub',
      decodedJWT.sub,
      decodedJWT.aud as string
    ).toString()

    // Prepare payload for prover service
    // Try with BigInt string format as per official examples
    const extendedEphemeralPublicKeyBigInt = BigInt('0x' + Buffer.from(extendedEphemeralPublicKey).toString('hex'))
    
    const payload = {
      jwt,
      extendedEphemeralPublicKey: extendedEphemeralPublicKeyBigInt.toString(),
      maxEpoch: maxEpoch.toString(),
      jwtRandomness: randomness,
      salt: saltBigInt.toString(),
      keyClaimName: 'sub',
    }

    console.log('📦 Full Prover payload:', JSON.stringify(payload, null, 2))
    console.log('🔑 Extended ephemeral public key bytes:', Array.from(extendedEphemeralPublicKey))
    console.log('🔢 Extended ephemeral public key BigInt:', extendedEphemeralPublicKeyBigInt.toString())

    console.log('📡 Calling prover service...')

    // Call Mysten prover service
    const proverUrl = process.env.NEXT_PUBLIC_PROVER_URL || 'https://prover-dev.mystenlabs.com/v1'
    const response = await fetch(proverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Prover service error:', errorText)
      throw new Error(`Failed to generate ZK proof: ${response.status} ${errorText}`)
    }

    const proofData = await response.json()
    console.log('✅ ZK proof generated successfully')

    return {
      proof: proofData,
      inputs: {
        addressSeed,
        ...proofData,
      },
    }
  } catch (error) {
    console.error('Failed to generate ZK proof:', error)
    throw error
  }
}

// Store ZKLogin state in session storage
export function storeZKLoginState(state: ZKLoginState): void {
  if (typeof window !== 'undefined') {
    // Get the secret key - this returns the 32-byte seed
    const secretKey = state.ephemeralKeyPair.getSecretKey()
    
    // Convert to base64 for storage
    const secretKeyBase64 = Buffer.from(secretKey).toString('base64')
    
    const stateToStore = {
      nonce: state.nonce,
      randomness: state.randomness,
      maxEpoch: state.maxEpoch,
      secretKey: secretKeyBase64,
    }
    
    sessionStorage.setItem('zklogin_state', JSON.stringify(stateToStore))
    
    console.log('💾 Stored ZKLogin state:', {
      nonce: state.nonce,
      randomness: state.randomness,
      maxEpoch: state.maxEpoch,
      publicKey: state.ephemeralKeyPair.getPublicKey().toBase64(),
      secretKeyLength: secretKey.length,
    })
  }
}

// Retrieve ZKLogin state from session storage
export function retrieveZKLoginState(): ZKLoginState | null {
  if (typeof window === 'undefined') return null

  const stored = sessionStorage.getItem('zklogin_state')
  if (!stored) {
    console.log('📂 No ZKLogin state found in sessionStorage')
    return null
  }

  try {
    const data = JSON.parse(stored)
    
    console.log('📂 Retrieved stored data:', {
      nonce: data.nonce,
      randomness: data.randomness,
      maxEpoch: data.maxEpoch,
      hasSecretKey: !!data.secretKey,
    })
    
    // Decode the base64 secret key
    const fullSecretKey = Buffer.from(data.secretKey, 'base64')
    
    console.log('📂 Full secret key length:', fullSecretKey.length)
    
    // getSecretKey() returns 70 bytes (Sui export format), but fromSecretKey() expects 32 bytes (seed)
    // Extract the 32-byte seed from the full export
    // Format: [scheme_flag: 1 byte] [seed: 32 bytes] [public_key: 32 bytes] [extra: 5 bytes]
    const seedBytes = fullSecretKey.slice(1, 33) // Skip first byte (scheme flag), take next 32 bytes
    
    console.log('📂 Seed bytes length:', seedBytes.length)
    console.log('📂 Seed first 10 bytes:', Array.from(seedBytes).slice(0, 10))
    
    // Create new keypair from the 32-byte seed
    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(seedBytes)
    
    console.log('📂 Restored keypair with public key:', ephemeralKeyPair.getPublicKey().toBase64())

    return {
      nonce: data.nonce,
      randomness: data.randomness,
      maxEpoch: data.maxEpoch,
      ephemeralKeyPair,
    }
  } catch (error) {
    console.error('❌ Failed to retrieve ZKLogin state:', error)
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
    // Import dynamically to avoid circular dependency
    const { getSuiClient } = await import('./sui-client')
    const client = getSuiClient()
    const systemState = await client.getLatestSuiSystemState()
    return Number(systemState.epoch)
  } catch (error) {
    console.error('Failed to get current epoch:', error)
    // Return a reasonable default for development
    return 100
  }
}
