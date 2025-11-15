import { SuiClient } from '@mysten/sui/client'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { getZkLoginSignature } from '@mysten/sui/zklogin'
import { ZKProofResponse } from './zklogin'
import { Transaction } from '@mysten/sui/transactions'

// Initialize Sui client
export function getSuiClient(): SuiClient {
  const network = process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet'
  const rpcUrl = network === 'testnet' 
    ? 'https://fullnode.testnet.sui.io:443'
    : 'https://fullnode.devnet.sui.io:443'
  return new SuiClient({ url: rpcUrl })
}

// パッケージIDとモジュール名（デプロイ後に設定）
export const PACKAGE_ID = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID || '0x0000000000000000000000000000000000000000000000000000000000000000'
export const MODULE_NAME = 'fighters_rising'

// オブジェクトタイプ
export const FIGHTER_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::Fighter`
export const INVESTMENT_SHARE_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::InvestmentShare`
export const SCOUT_PROPOSAL_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::ScoutProposal`
export const SBT_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::SoulBoundToken`

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

// ========== Fighters Rising 特定機能 ==========

/**
 * 選手オブジェクトを作成
 */
export async function createFighter(
  signer: Ed25519Keypair,
  fighterData: {
    name: string
    nameJa: string
    age: number
    nationality: string
    weightClass: string
    targetAmount: number
    isaPercentage: number
    isaDuration: number
  }
): Promise<string | null> {
  try {
    const client = getSuiClient()
    const tx = new Transaction()

    // Fighter オブジェクトを作成するトランザクション
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_fighter`,
      arguments: [
        tx.pure.string(fighterData.name),
        tx.pure.string(fighterData.nameJa),
        tx.pure.u8(fighterData.age),
        tx.pure.string(fighterData.nationality),
        tx.pure.string(fighterData.weightClass),
        tx.pure.u64(fighterData.targetAmount * 1_000_000), // USDsui (6 decimals)
        tx.pure.u8(fighterData.isaPercentage),
        tx.pure.u8(fighterData.isaDuration),
      ],
    })

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
    })

    return result.digest
  } catch (error) {
    console.error('Failed to create fighter:', error)
    return null
  }
}

/**
 * 投資を実行してInvestment Share NFTを発行
 * 
 * モックモード: 決済部分をスキップして、NFTのみを発行します
 * - 実際のSUI決済は行いません（ブロックチェーンでは0.01 SUIのみガス代として使用）
 * - InvestmentShare NFTはブロックチェーン上に実際に作成されます
 * - NFTは投資家のウォレットに転送されます
 * 
 * 注意: モックモードでは環境変数のSUI_PRIVATE_KEYを使用します
 */
export async function investInFighter(
  signer: Ed25519Keypair,
  fighterId: string,
  amount: number
): Promise<{ success: boolean; nftId?: string; digest?: string; error?: string }> {
  try {
    const client = getSuiClient()
    const tx = new Transaction()
    
    // モックモードでは環境変数から秘密鍵を取得
    let actualSigner = signer
    const mockPrivateKey = process.env.SUI_PRIVATE_KEY
    
    if (mockPrivateKey) {
      console.log('🔑 モックモード: 環境変数の秘密鍵を使用')
      try {
        // 秘密鍵をデコード（Base64エンコードされた32バイトの秘密鍵）
        const secretKeyBytes = Uint8Array.from(Buffer.from(mockPrivateKey, 'hex'))
        actualSigner = Ed25519Keypair.fromSecretKey(secretKeyBytes)
        console.log('✅ ウォレットアドレス:', actualSigner.toSuiAddress())
      } catch (err) {
        console.error('❌ 秘密鍵の読み込みに失敗:', err)
      }
    }

    const investor = actualSigner.toSuiAddress()

    console.log('🎯 モック投資開始:', {
      fighter: fighterId,
      amount: amount,
      investor: investor,
    })

    // InvestmentShare NFTを直接作成（決済なしバージョン）
    // 注: これは開発/デモ用のモック実装です
    const shareData = {
      fighter_id: fighterId,
      fighter_name: getFighterName(fighterId), // モックデータから取得
      investor: investor,
      amount: amount,
      percentage: calculatePercentage(fighterId, amount), // 持分計算
      invested_at: Date.now(),
      total_returns_received: 0,
    }

    // ブロックチェーン上にNFTを作成
    // 注: 実際のMoveコントラクトに対応する関数が必要です
    // ここでは簡易的にメタデータをトランザクションに含めます
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::mint_investment_share_mock`,
      arguments: [
        tx.pure.string(shareData.fighter_name),
        tx.pure.u64(shareData.amount * 1_000_000_000), // MIST単位
        tx.pure.u64(shareData.percentage),
        tx.pure.u64(shareData.invested_at),
        tx.object('0x6'), // Clock オブジェクト
      ],
    })

    const result = await client.signAndExecuteTransaction({
      signer: actualSigner,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })

    console.log('✅ トランザクション成功:', result.digest)

    // 作成されたNFTのIDを取得
    const createdObjects = result.objectChanges?.filter(
      (change) => change.type === 'created'
    )
    const investmentShareNft = createdObjects?.find((obj) =>
      obj.objectType?.includes('InvestmentShare')
    )

    if (investmentShareNft && 'objectId' in investmentShareNft) {
      console.log('🎉 NFT発行成功:', investmentShareNft.objectId)
      return {
        success: true,
        nftId: investmentShareNft.objectId,
        digest: result.digest,
      }
    }

    return {
      success: true,
      digest: result.digest,
    }
  } catch (error) {
    console.error('❌ 投資失敗:', error)
    return { 
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// ヘルパー関数: 選手名を取得
function getFighterName(fighterId: string): string {
  const fighterMap: Record<string, string> = {
    'fighter-001': 'Takeshi Yamada',
    'fighter-002': 'マリア・ロドリゲス',
    'fighter-003': 'カルロス・メンデス',
    'fighter-004': 'ノン・サエンチャイ',
    'fighter-005': '田中雪',
    'fighter-006': 'バトゥ・ハビボフ',
  }
  return fighterMap[fighterId] || '不明な選手'
}

// ヘルパー関数: 持分パーセンテージを計算
function calculatePercentage(fighterId: string, amount: number): number {
  // 仮の資金調達目標: 100 SUI
  const fundingGoal = 100
  // basis points (0.01%単位) で計算
  return Math.floor((amount / fundingGoal) * 10000)
}

/**
 * スカウト提案を送信
 */
export async function submitScoutProposal(
  signer: Ed25519Keypair,
  proposalData: {
    fighterName: string
    fighterNameJa: string
    nationality: string
    weightClass: string
    currentRecord: string
    reason: string
    videoUrl?: string
    stakeAmount: number
  }
): Promise<{ success: boolean; proposalId?: string; digest?: string }> {
  try {
    const client = getSuiClient()
    const tx = new Transaction()

    // ステーク額を分割
    const [stakeCoin] = tx.splitCoins(tx.gas, [
      tx.pure.u64(proposalData.stakeAmount * 1_000_000),
    ])

    // スカウト提案を作成
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_scout_proposal`,
      arguments: [
        tx.pure.string(proposalData.fighterName),
        tx.pure.string(proposalData.fighterNameJa),
        tx.pure.string(proposalData.nationality),
        tx.pure.string(proposalData.weightClass),
        tx.pure.string(proposalData.currentRecord),
        tx.pure.string(proposalData.reason),
        tx.pure.string(proposalData.videoUrl || ''),
        stakeCoin,
      ],
    })

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })

    const createdObjects = result.objectChanges?.filter(
      (change) => change.type === 'created'
    )
    const proposalObj = createdObjects?.find((obj) =>
      obj.objectType?.includes('ScoutProposal')
    )

    return {
      success: true,
      proposalId: proposalObj && 'objectId' in proposalObj ? proposalObj.objectId : undefined,
      digest: result.digest,
    }
  } catch (error) {
    console.error('Failed to submit scout proposal:', error)
    return { success: false }
  }
}

/**
 * Scout Master SBTを発行（運営用）
 */
export async function mintScoutMasterSBT(
  signer: Ed25519Keypair,
  proposalId: string,
  recipient: string,
  fighterName: string,
  rewardAmount: number
): Promise<{ success: boolean; sbtId?: string; digest?: string }> {
  try {
    const client = getSuiClient()
    const tx = new Transaction()

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::mint_scout_master_sbt`,
      arguments: [
        tx.object(proposalId),
        tx.pure.address(recipient),
        tx.pure.string(fighterName),
        tx.pure.u64(rewardAmount * 1_000_000),
      ],
    })

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })

    const createdObjects = result.objectChanges?.filter(
      (change) => change.type === 'created'
    )
    const sbtObj = createdObjects?.find((obj) =>
      obj.objectType?.includes('SoulBoundToken')
    )

    return {
      success: true,
      sbtId: sbtObj && 'objectId' in sbtObj ? sbtObj.objectId : undefined,
      digest: result.digest,
    }
  } catch (error) {
    console.error('Failed to mint Scout Master SBT:', error)
    return { success: false }
  }
}

/**
 * リターンを分配（運営用）
 */
export async function distributeReturns(
  signer: Ed25519Keypair,
  fighterId: string,
  totalAmount: number
): Promise<{ success: boolean; digest?: string }> {
  try {
    const client = getSuiClient()
    const tx = new Transaction()

    // 賞金を分割
    const [prizeCoin] = tx.splitCoins(tx.gas, [
      tx.pure.u64(totalAmount * 1_000_000),
    ])

    // リターンを投資家に分配
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::distribute_returns`,
      arguments: [
        tx.object(fighterId),
        prizeCoin,
      ],
    })

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
    })

    return {
      success: true,
      digest: result.digest,
    }
  } catch (error) {
    console.error('Failed to distribute returns:', error)
    return { success: false }
  }
}

/**
 * ユーザーの投資NFTを取得
 */
export async function getUserInvestments(address: string): Promise<any[]> {
  try {
    const client = getSuiClient()
    const objects = await client.getOwnedObjects({
      owner: address,
      filter: {
        StructType: INVESTMENT_SHARE_TYPE,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    return objects.data || []
  } catch (error) {
    console.error('Failed to get user investments:', error)
    return []
  }
}

/**
 * ユーザーのSBTを取得
 */
export async function getUserSBTs(address: string): Promise<any[]> {
  try {
    const client = getSuiClient()
    const objects = await client.getOwnedObjects({
      owner: address,
      filter: {
        StructType: SBT_TYPE,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    return objects.data || []
  } catch (error) {
    console.error('Failed to get user SBTs:', error)
    return []
  }
}

/**
 * 全選手を取得
 */
export async function getAllFighters(): Promise<any[]> {
  try {
    const client = getSuiClient()
    // Dynamic Fieldsを使用するか、イベントから取得
    // 実装はスマートコントラクトの構造に依存
    const events = await client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::FighterCreatedEvent`,
      },
      limit: 50,
    })
    
    return events.data || []
  } catch (error) {
    console.error('Failed to get all fighters:', error)
    return []
  }
}

/**
 * スカウト提案を承認（運営用）
 */
export async function approveScoutProposal(
  signer: Ed25519Keypair,
  proposalId: string,
  fundingGoal: number
): Promise<{ success: boolean; fighterId?: string; digest?: string }> {
  try {
    const client = getSuiClient()
    const tx = new Transaction()

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::approve_scout_proposal`,
      arguments: [
        tx.object(proposalId),
        tx.pure.u64(fundingGoal * 1_000_000),
      ],
    })

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })

    const createdObjects = result.objectChanges?.filter(
      (change) => change.type === 'created'
    )
    const fighterObj = createdObjects?.find((obj) =>
      obj.objectType?.includes('Fighter')
    )

    return {
      success: true,
      fighterId: fighterObj && 'objectId' in fighterObj ? fighterObj.objectId : undefined,
      digest: result.digest,
    }
  } catch (error) {
    console.error('Failed to approve scout proposal:', error)
    return { success: false }
  }
}

/**
 * スカウト提案を却下（運営用）
 */
export async function rejectScoutProposal(
  signer: Ed25519Keypair,
  proposalId: string,
  reason: string
): Promise<{ success: boolean; digest?: string }> {
  try {
    const client = getSuiClient()
    const tx = new Transaction()

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::reject_scout_proposal`,
      arguments: [
        tx.object(proposalId),
        tx.pure.string(reason),
      ],
    })

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
    })

    return {
      success: true,
      digest: result.digest,
    }
  } catch (error) {
    console.error('Failed to reject scout proposal:', error)
    return { success: false }
  }
}
