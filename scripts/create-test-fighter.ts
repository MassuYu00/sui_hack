/**
 * テスト用の選手を作成するスクリプト
 * 
 * プロセス：
 * 1. スカウト提案を提出
 * 2. 管理者が承認
 * 3. FighterオブジェクトとInvestorRegistryが作成される
 */

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Transaction } from '@mysten/sui/transactions'
import { getSuiClient } from '../lib/sui-client'

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!
const MODULE_NAME = 'fighters_rising'
const PLATFORM_ID = process.env.NEXT_PUBLIC_PLATFORM_ID!
const ADMIN_CAP_ID = process.env.NEXT_PUBLIC_ADMIN_CAP_ID!

// ウォレットを読み込む
function loadWallet(): Ed25519Keypair {
  const secretKey = process.env.SUI_PRIVATE_KEY
  if (!secretKey) {
    throw new Error('SUI_PRIVATE_KEY not found in environment')
  }
  return Ed25519Keypair.fromSecretKey(Uint8Array.from(Buffer.from(secretKey, 'hex')))
}

async function main() {
  const client = getSuiClient()
  const wallet = loadWallet()
  
  console.log('ウォレットアドレス:', wallet.toSuiAddress())
  console.log('\n=== ステップ1: スカウト提案を提出 ===')

  // ステップ1: スカウト提案を提出
  const tx1 = new Transaction()
  
  // ステーキング用のコイン（1 SUI）
  const [stakeCoin] = tx1.splitCoins(tx1.gas, [tx1.pure.u64(1_000_000_000)])
  
  tx1.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::submit_scout_proposal`,
    arguments: [
      tx1.object(PLATFORM_ID),
      tx1.pure.string('山田剛'), // 選手名
      tx1.pure.string('総合格闘技'), // スポーツ
      tx1.pure.string('日本'), // 国
      tx1.pure.u64(25), // 年齢
      tx1.pure.string('https://example.com/yamada.jpg'), // 画像URL
      tx1.pure.string('日本の有望なMMAファイター。アマチュア戦績15勝2敗。'), // 説明
      tx1.pure.u64(100_000_000_000), // 資金調達目標（100 SUI）
      stakeCoin,
      tx1.object('0x6'), // Clock
    ],
  })

  const result1 = await client.signAndExecuteTransaction({
    signer: wallet,
    transaction: tx1,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  })

  console.log('トランザクション成功:', result1.digest)
  
  // ScoutProposalオブジェクトのIDを取得
  const proposalObject = result1.objectChanges?.find(
    (change) => change.type === 'created' && change.objectType?.includes('ScoutProposal')
  )
  
  if (!proposalObject || proposalObject.type !== 'created') {
    throw new Error('ScoutProposal not found')
  }
  
  const proposalId = proposalObject.objectId
  console.log('スカウト提案ID:', proposalId)

  console.log('\n=== ステップ2: 管理者が承認（Fighter作成） ===')
  
  // 少し待つ
  await new Promise(resolve => setTimeout(resolve, 2000))

  // ステップ2: 管理者が承認
  const tx2 = new Transaction()
  
  tx2.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::approve_scout_proposal`,
    arguments: [
      tx2.object(ADMIN_CAP_ID),
      tx2.object(PLATFORM_ID),
      tx2.object(proposalId),
      tx2.object('0x6'), // Clock
    ],
  })

  const result2 = await client.signAndExecuteTransaction({
    signer: wallet,
    transaction: tx2,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  })

  console.log('承認トランザクション成功:', result2.digest)
  
  // FighterオブジェクトとInvestorRegistryを取得
  const createdObjects = result2.objectChanges?.filter(
    (change) => change.type === 'created'
  )
  
  const fighterObject = createdObjects?.find(
    (obj) => obj.type === 'created' && obj.objectType?.includes('Fighter')
  )
  
  const registryObject = createdObjects?.find(
    (obj) => obj.type === 'created' && obj.objectType?.includes('InvestorRegistry')
  )
  
  if (fighterObject && fighterObject.type === 'created') {
    console.log('\n✅ Fighter作成成功!')
    console.log('Fighter ID:', fighterObject.objectId)
  }
  
  if (registryObject && registryObject.type === 'created') {
    console.log('InvestorRegistry ID:', registryObject.objectId)
  }

  console.log('\n=== 完了 ===')
  console.log('この選手IDを使って投資できます！')
  console.log('\n.env.localに追加してください：')
  if (fighterObject && fighterObject.type === 'created') {
    console.log(`TEST_FIGHTER_ID=${fighterObject.objectId}`)
  }
  if (registryObject && registryObject.type === 'created') {
    console.log(`TEST_REGISTRY_ID=${registryObject.objectId}`)
  }
}

main().catch(console.error)
