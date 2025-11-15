'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Award, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react'
import { useScout } from '@/lib/scout-context'
import { submitScoutProposalAction } from '@/app/actions/scout-mock'

interface ScoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScoutModal({ isOpen, onClose }: ScoutModalProps) {
  const { addProposal } = useScout()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proposalId, setProposalId] = useState<string | null>(null)
  const [txDigest, setTxDigest] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fighterName: '',
    fighterNameJa: '',
    nationality: '',
    weightClass: '',
    currentRecord: '',
    reason: '',
    videoUrl: '',
    stakeAmount: 100,
  })

  const minStake = 100
  const maxStake = 1000

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.stakeAmount < minStake || formData.stakeAmount > maxStake) {
      alert(`ステーク額は${minStake}〜${maxStake} USDsuiの範囲で設定してください`)
      return
    }

    if (formData.reason.length > 500) {
      alert('推薦理由は500文字以内で入力してください')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // サーバーサイドでスカウト提案を提出
      console.log('🚀 スカウト提案トランザクション開始...')
      console.log('提案内容:', formData)
      
      const result = await submitScoutProposalAction(formData)

      if (!result.success) {
        throw new Error(result.error || 'トランザクションが失敗しました')
      }

      console.log('✅ 提案送信成功!')
      console.log('Proposal ID:', result.proposalId)

      // コンテキストに追加
      const localProposalId = await addProposal({
        ...formData,
        proposerAddress: 'mock', // モックから送信
        proposerName: 'あなた',
      })

      setProposalId(result.proposalId || localProposalId)
      setTxDigest(null)
      setIsSuccess(true)
    } catch (error: any) {
      console.error('❌ 提案送信失敗:', error)
      setError(error.message || '推薦の送信に失敗しました。もう一度お試しください。')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setFormData({
      fighterName: '',
      fighterNameJa: '',
      nationality: '',
      weightClass: '',
      currentRecord: '',
      reason: '',
      videoUrl: '',
      stakeAmount: 100,
    })
    setIsSuccess(false)
    setProposalId(null)
    setTxDigest(null)
    setError(null)
    onClose()
  }

  // 成功画面
  if (isSuccess && proposalId) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <DialogTitle className="text-2xl text-center">
                推薦を送信しました！
              </DialogTitle>
              <DialogDescription className="text-center">
                運営チームが審査を行います
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* 提案内容カード */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-background">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">選手名</span>
                  <span className="font-semibold">{formData.fighterNameJa}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">階級</span>
                  <span className="font-semibold">{formData.weightClass}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">ステーク額</span>
                  <span className="font-semibold">${formData.stakeAmount} USDsui</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">推薦ID</span>
                  <span className="font-mono text-xs">{proposalId.slice(0, 16)}...</span>
                </div>
              </div>
            </div>

            {/* 報酬の説明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">審査について</p>
                  <p className="mb-2">運営チームが選手の将来性を評価します。承認されると：</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>ステーク額が返却されます</li>
                    <li>選手の調達成功時に総額の3%を報酬として獲得</li>
                    <li>Scout Master SBTが発行されます</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 不承認の場合の説明 */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-900">
                  <p className="font-semibold mb-1">注意事項</p>
                  <p>不承認の場合、ステーク額は返却されません。質の高い推薦をお願いします。</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button onClick={handleClose} variant="outline" className="flex-1">
              閉じる
            </Button>
            {txDigest && (
              <Button
                onClick={() => {
                  const network = process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet'
                  window.open(`https://suiscan.xyz/${network}/tx/${txDigest}`, '_blank')
                }}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                トランザクションを表示
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // 入力フォーム画面
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新しい選手を推薦</DialogTitle>
          <DialogDescription>
            才能ある選手の情報を入力してください。運営チームが審査します。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fighterName">選手名（英語）*</Label>
              <Input
                id="fighterName"
                value={formData.fighterName}
                onChange={(e) => setFormData({ ...formData, fighterName: e.target.value })}
                placeholder="Takeshi Yamada"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="fighterNameJa">選手名（日本語）*</Label>
              <Input
                id="fighterNameJa"
                value={formData.fighterNameJa}
                onChange={(e) => setFormData({ ...formData, fighterNameJa: e.target.value })}
                placeholder="山田剛"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nationality">国籍*</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="日本"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="weightClass">階級*</Label>
              <Input
                id="weightClass"
                value={formData.weightClass}
                onChange={(e) => setFormData({ ...formData, weightClass: e.target.value })}
                placeholder="フェザー級"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="currentRecord">戦績*</Label>
              <Input
                id="currentRecord"
                value={formData.currentRecord}
                onChange={(e) => setFormData({ ...formData, currentRecord: e.target.value })}
                placeholder="10-2-0"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">推薦理由*</Label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="この選手の才能や将来性について、具体的に説明してください..."
              className="w-full min-h-32 px-3 py-2 border border-input rounded-md"
              maxLength={500}
              required
              disabled={isProcessing}
            />
            <div className="flex justify-end items-center mt-1">
              <p className={`text-xs ${
                formData.reason.length > 450 ? 'text-amber-600 font-medium' : 'text-muted-foreground'
              }`}>
                {formData.reason.length}/500文字
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="videoUrl">試合動画URL（任意）</Label>
            <Input
              id="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://youtube.com/..."
              disabled={isProcessing}
            />
          </div>

          <div>
            <Label htmlFor="stakeAmount">ステーク額（USDsui）*</Label>
            <Input
              id="stakeAmount"
              type="number"
              min={minStake}
              max={maxStake}
              value={formData.stakeAmount}
              onChange={(e) => setFormData({ ...formData, stakeAmount: parseInt(e.target.value) || minStake })}
              required
              disabled={isProcessing}
            />
            <p className="text-sm text-muted-foreground mt-1">
              最低{minStake} USDsui。推薦が承認されれば返却され、選手の調達成功時に3%の報酬を獲得できます。
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-900">
                <strong>エラー:</strong> {error}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  送信中...
                </>
              ) : (
                '推薦を送信'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
