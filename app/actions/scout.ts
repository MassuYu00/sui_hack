'use server'

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Transaction } from '@mysten/sui/transactions'
import { SuiClient } from '@mysten/sui/client'

const PACKAGE_ID = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID!
const MODULE_NAME = 'fighters_rising'
const PLATFORM_ID = process.env.NEXT_PUBLIC_PLATFORM_ID!

interface ScoutProposalData {
  fighterName: string
  fighterNameJa: string
  nationality: string
  weightClass: string
  currentRecord: string
  reason: string
  videoUrl: string
  stakeAmount: number
}

export async function submitScoutProposalAction(
  proposalData: ScoutProposalData
): Promise<{ success: boolean; proposalId?: string; digest?: string; error?: string }> {
  try {
    // 環境変数から秘密鍵を取得
    const privateKeyHex = process.env.SUI_PRIVATE_KEY
    if (!privateKeyHex) {
      throw new Error('SUI_PRIVATE_KEY が設定されていません')
    }

    // 秘密鍵からKeypairを作成
    const secretKeyBytes = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'))
    const keypair = Ed25519Keypair.fromSecretKey(secretKeyBytes)
    const proposer = keypair.toSuiAddress()

    console.log('🎯 サーバーサイドでスカウト提案開始:', {
      fighter: proposalData.fighterName,
      proposer: proposer,
    })

    // Suiクライアントを作成
    const client = new SuiClient({
      url: 'https://fullnode.testnet.sui.io:443',
    })

    const walletAddress = keypair.toSuiAddress()
    console.log('📍 サーバーウォレットアドレス:', walletAddress)

    // ウォレットのコインを取得
    const coins = await client.getCoins({
      owner: walletAddress,
      coinType: '0x2::sui::SUI',
    })

    console.log('💰 利用可能なコイン数:', coins.data.length)
    if (coins.data.length > 0) {
      console.log('💰 コイン残高:', coins.data.map(c => `${parseInt(c.balance) / 1_000_000_000} SUI`))
    }

    if (coins.data.length === 0) {
      throw new Error('ウォレットにSUIコインがありません')
    }

    // 十分な残高があるコインを見つける（1 SUI + ガス代）
    const requiredAmount = 1_050_000_000 // 1.05 SUI
    const suitableCoin = coins.data.find(coin => parseInt(coin.balance) >= requiredAmount)

    if (!suitableCoin) {
      const totalBalance = coins.data.reduce((sum, coin) => sum + parseInt(coin.balance), 0)
      console.log('❌ 総残高:', totalBalance / 1_000_000_000, 'SUI')
      throw new Error(`不十分な残高です。必要: ${requiredAmount / 1_000_000_000} SUI、現在: ${totalBalance / 1_000_000_000} SUI`)
    }

    console.log('✅ 使用するコイン:', suitableCoin.coinObjectId, '残高:', parseInt(suitableCoin.balance) / 1_000_000_000, 'SUI')

    const tx = new Transaction()
    
    // ステーキング用のコイン（1 SUI）をガスコインから分割
    const [stakeCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(1_000_000_000)])

    // スカウト提案を提出
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::submit_scout_proposal`,
      arguments: [
        tx.pure.string('Server Scout'), // proposer_name
        tx.pure.string(proposalData.fighterName), // fighter_name
        tx.pure.string(proposalData.fighterNameJa), // fighter_name_ja
        tx.pure.string(proposalData.nationality), // nationality
        tx.pure.string(proposalData.weightClass), // weight_class
        tx.pure.string(proposalData.currentRecord), // record
        tx.pure.string(proposalData.reason), // reason
        tx.pure.string(proposalData.videoUrl || ''), // video_url
        stakeCoin, // stake
        tx.object('0x6'), // Clock
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
      requestType: 'WaitForLocalExecution',
    })

    console.log('✅ スカウト提案トランザクション成功:', result.digest)

    // 作成されたScoutProposalのIDを取得
    const createdObjects = result.objectChanges?.filter(
      (change) => change.type === 'created'
    )
    const scoutProposal = createdObjects?.find((obj) =>
      obj.objectType?.includes('ScoutProposal')
    )

    if (scoutProposal && 'objectId' in scoutProposal) {
      console.log('🎉 スカウト提案作成成功:', scoutProposal.objectId)
      return {
        success: true,
        proposalId: scoutProposal.objectId,
        digest: result.digest,
      }
    }

    return {
      success: true,
      digest: result.digest,
    }
  } catch (error) {
    console.error('❌ スカウト提案失敗:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
