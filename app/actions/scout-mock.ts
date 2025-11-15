'use server'

export async function submitScoutProposalAction(proposalData: {
  fighterName: string
  fighterNameJa: string
  nationality: string
  weightClass: string
  currentRecord: string
  reason: string
  videoUrl?: string
  proposer?: string
  stakeAmount?: number
}) {
  try {
    console.log('🎯 スカウト提案開始（モック - 決済なし）:', {
      fighter: proposalData.fighterName,
      fighterNameJa: proposalData.fighterNameJa,
    })

    // モック: 実際の決済やブロックチェーン処理は行わない
    // ランダムなProposal IDを生成
    const mockProposalId = `0x${Math.random().toString(16).slice(2, 66)}`
    
    // 少し待機（リアルな感じを出すため）
    await new Promise(resolve => setTimeout(resolve, 800))

    console.log('✅ スカウト提案作成成功（モック）:', mockProposalId)

    return {
      success: true,
      proposalId: mockProposalId,
    }
  } catch (error) {
    console.error('❌ スカウト提案失敗:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    }
  }
}
