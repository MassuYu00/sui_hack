'use server'

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Transaction } from '@mysten/sui/transactions'
import { SuiClient } from '@mysten/sui/client'

const PACKAGE_ID = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID!
const MODULE_NAME = 'fighters_rising'

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

export async function mintInvestmentShareNFT(
  fighterId: string,
  amount: number
): Promise<{ success: boolean; nftId?: string; digest?: string; error?: string }> {
  try {
    // 環境変数から秘密鍵を取得
    const privateKeyHex = process.env.SUI_PRIVATE_KEY
    if (!privateKeyHex) {
      throw new Error('SUI_PRIVATE_KEY が設定されていません')
    }

    // 秘密鍵からKeypairを作成
    const secretKeyBytes = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'))
    const keypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)
    const investor = keypair.toSuiAddress()

    console.log('🎯 サーバーサイドでNFT発行開始:', {
      fighter: fighterId,
      amount: amount,
      investor: investor,
    })

    // Suiクライアントを作成
    const client = new SuiClient({
      url: 'https://fullnode.testnet.sui.io:443',
    })

    const tx = new Transaction()
    
    // ガス予算を明示的に設定（0.02 SUI）
    tx.setGasBudget(20_000_000)

    const fighterName = getFighterName(fighterId)
    const percentage = calculatePercentage(fighterId, amount)
    const investedAt = Date.now()

    // NFT発行トランザクション
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::mint_investment_share_mock`,
      arguments: [
        tx.pure.string(fighterName),
        tx.pure.u64(amount * 1_000_000_000), // MIST単位
        tx.pure.u64(percentage),
        tx.pure.u64(investedAt),
        tx.object('0x6'), // Clock オブジェクト
      ],
    })

    // トランザクションを署名・実行
    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })

    console.log('✅ NFT発行トランザクション成功:', result.digest)

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
    console.error('❌ NFT発行失敗:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
