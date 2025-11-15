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
      alert(`Stake amount must be between ${minStake} and ${maxStake} USDsui`)
      return
    }

    if (formData.reason.length > 500) {
      alert('Recommendation reason must be 500 characters or less')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Submit scout proposal server-side
      console.log('🚀 Starting scout proposal transaction...')
      console.log('Proposal details:', formData)
      
      const result = await submitScoutProposalAction(formData)

      if (!result.success) {
        throw new Error(result.error || 'Transaction failed')
      }

      console.log('✅ Proposal submitted successfully!')
      console.log('Proposal ID:', result.proposalId)

      // Add to context
      const localProposalId = await addProposal({
        ...formData,
        proposerAddress: 'mock', // Sent from mock
        proposerName: 'You',
      })

      setProposalId(result.proposalId || localProposalId)
      setTxDigest(null)
      setIsSuccess(true)
    } catch (error: any) {
      console.error('❌ Proposal submission failed:', error)
      setError(error.message || 'Failed to submit recommendation. Please try again.')
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
                Recommendation Submitted!
              </DialogTitle>
              <DialogDescription className="text-center">
                The team will review your submission
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* 提案内容カード */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-background">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fighter Name</span>
                  <span className="font-semibold">{formData.fighterNameJa}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">Weight Class</span>
                  <span className="font-semibold">{formData.weightClass}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">Stake Amount</span>
                  <span className="font-semibold">${formData.stakeAmount} USDsui</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">Proposal ID</span>
                  <span className="font-mono text-xs">{proposalId.slice(0, 16)}...</span>
                </div>
              </div>
            </div>

            {/* 報酬の説明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Review Process</p>
                  <p className="mb-2">The team will evaluate the fighter's potential. If approved:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your stake will be returned</li>
                    <li>Earn 3% of total funding when fighter succeeds</li>
                    <li>Receive a Scout Master SBT</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 不承認の場合の説明 */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-900">
                  <p className="font-semibold mb-1">Important Notice</p>
                  <p>If rejected, your stake will not be returned. Please submit high-quality recommendations.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button onClick={handleClose} variant="outline" className="flex-1">
              Close
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
                View Transaction
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
          <DialogTitle>Recommend a Fighter</DialogTitle>
          <DialogDescription>
            Enter information about a talented fighter. The team will review your submission.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fighterName">Fighter Name (English)*</Label>
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
              <Label htmlFor="fighterNameJa">Fighter Name (Local)*</Label>
              <Input
                id="fighterNameJa"
                value={formData.fighterNameJa}
                onChange={(e) => setFormData({ ...formData, fighterNameJa: e.target.value })}
                placeholder="Takeshi Yamada"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nationality">Nationality*</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="Japan"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="weightClass">Weight Class*</Label>
              <Input
                id="weightClass"
                value={formData.weightClass}
                onChange={(e) => setFormData({ ...formData, weightClass: e.target.value })}
                placeholder="Featherweight"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="currentRecord">Record*</Label>
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
            <Label htmlFor="reason">Recommendation Reason*</Label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Describe this fighter's talent and potential in detail..."
              className="w-full min-h-32 px-3 py-2 border border-input rounded-md"
              maxLength={500}
              required
              disabled={isProcessing}
            />
            <div className="flex justify-end items-center mt-1">
              <p className={`text-xs ${
                formData.reason.length > 450 ? 'text-amber-600 font-medium' : 'text-muted-foreground'
              }`}>
                {formData.reason.length}/500 characters
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="videoUrl">Fight Video URL (Optional)</Label>
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
            <Label htmlFor="stakeAmount">Stake Amount (USDsui)*</Label>
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
              Minimum {minStake} USDsui. If approved, stake is returned and you earn 3% when fighter succeeds.
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-900">
                <strong>Error:</strong> {error}
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Recommendation'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
