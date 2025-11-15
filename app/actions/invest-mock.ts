'use server'

export async function mintInvestmentShareNFT(
  fighterId: string,
  amount: number
) {
  try {
    console.log('🎯 投資NFT発行開始（モック - 決済なし）:', {
      fighterId,
      amount,
    })

    // モック: 実際の決済やブロックチェーン処理は行わない
    // ランダムなNFT IDを生成
    const mockNftId = `0x${Math.random().toString(16).slice(2, 66)}`
    
    // 少し待機（リアルな感じを出すため）
    await new Promise(resolve => setTimeout(resolve, 800))

    console.log('✅ 投資NFT発行成功（モック）:', mockNftId)

    return {
      success: true,
      nftId: mockNftId,
    }
  } catch (error) {
    console.error('❌ 投資NFT発行失敗:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    }
  }
}
