import { SuiClient } from '@mysten/sui/client'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { getZkLoginSignature } from '@mysten/sui/zklogin'
import { ZKProofResponse } from './zklogin'

// Initialize Sui client
export function getSuiClient(): SuiClient {
  const rpcUrl = process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.devnet.sui.io:443'
  return new SuiClient({ url: rpcUrl })
}

// Get current epoch from Sui network
export async function getCurrentEpoch(): Promise<number> {
  try {
    const client = getSuiClient()
    const systemState = await client.getLatestSuiSystemState()
    return Number(systemState.epoch)
  } catch (error) {
    console.error('Failed to get current epoch:', error)
    return 0
  }
}

// Get account balance
export async function getBalance(address: string): Promise<bigint> {
  try {
    const client = getSuiClient()
    const balance = await client.getBalance({
      owner: address,
    })
    return BigInt(balance.totalBalance)
  } catch (error) {
    console.error('Failed to get balance:', error)
    return BigInt(0)
  }
}

// Get account objects
export async function getOwnedObjects(address: string) {
  try {
    const client = getSuiClient()
    const objects = await client.getOwnedObjects({
      owner: address,
    })
    return objects.data
  } catch (error) {
    console.error('Failed to get owned objects:', error)
    return []
  }
}

// Create ZKLogin signature for transaction
export async function createZKLoginSignature(
  userSignature: Uint8Array,
  zkProof: any,
  ephemeralPublicKey: Uint8Array
): Promise<string> {
  try {
    // zkProof should contain all necessary fields from prover
    const zkLoginSignature = getZkLoginSignature({
      inputs: zkProof,
      maxEpoch: zkProof.maxEpoch,
      userSignature: Array.from(userSignature),
    })

    return zkLoginSignature
  } catch (error) {
    console.error('Failed to create ZKLogin signature:', error)
    throw error
  }
}

// Sign and execute transaction with ZKLogin
export async function signAndExecuteTransaction(
  txBytes: Uint8Array,
  ephemeralKeyPair: Ed25519Keypair,
  zkProof: any,
  senderAddress: string
) {
  try {
    const client = getSuiClient()

    // Sign the transaction bytes with ephemeral private key
    const userSignature = await ephemeralKeyPair.sign(txBytes)

    // Create ZKLogin signature
    const zkLoginSignature = await createZKLoginSignature(
      userSignature,
      zkProof,
      ephemeralKeyPair.getPublicKey().toRawBytes()
    )

    // Execute transaction
    const result = await client.executeTransactionBlock({
      transactionBlock: txBytes,
      signature: zkLoginSignature,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })

    return result
  } catch (error) {
    console.error('Failed to sign and execute transaction:', error)
    throw error
  }
}

// Request tokens from faucet (devnet/testnet only)
export async function requestTokensFromFaucet(address: string): Promise<boolean> {
  try {
    const network = process.env.NEXT_PUBLIC_SUI_NETWORK || 'devnet'
    
    if (network === 'mainnet') {
      throw new Error('Faucet not available on mainnet')
    }

    const faucetUrl = network === 'testnet' 
      ? 'https://faucet.testnet.sui.io/v1/gas'
      : 'https://faucet.devnet.sui.io/v1/gas'

    const response = await fetch(faucetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FixedAmountRequest: {
          recipient: address,
        },
      }),
    })

    if (!response.ok) {
      console.error('Faucet request failed:', await response.text())
      return false
    }

    console.log('Successfully requested tokens from faucet')
    return true
  } catch (error) {
    console.error('Failed to request tokens from faucet:', error)
    return false
  }
}

// Get transaction history
export async function getTransactionHistory(address: string, limit: number = 10) {
  try {
    const client = getSuiClient()
    const txns = await client.queryTransactionBlocks({
      filter: {
        FromAddress: address,
      },
      limit,
      order: 'descending',
    })
    return txns.data
  } catch (error) {
    console.error('Failed to get transaction history:', error)
    return []
  }
}

// Check if address exists on chain
export async function addressExists(address: string): Promise<boolean> {
  try {
    const client = getSuiClient()
    const objects = await client.getOwnedObjects({
      owner: address,
      limit: 1,
    })
    return true
  } catch (error) {
    return false
  }
}

// Get gas price
export async function getReferenceGasPrice(): Promise<bigint> {
  try {
    const client = getSuiClient()
    const gasPrice = await client.getReferenceGasPrice()
    return BigInt(gasPrice)
  } catch (error) {
    console.error('Failed to get gas price:', error)
    return BigInt(1000)
  }
}
