'use client'

import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useScout } from '@/lib/scout-context'
import { useWallet } from '@/lib/wallet-context'
import { approveScoutProposal, rejectScoutProposal, mintScoutMasterSBT } from '@/lib/sui-client'
import { CheckCircle2, XCircle, User, MapPin, Trophy, Video, FileText, Coins } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminDashboard() {
  const { proposals, updateProposalStatus } = useScout()
  const { keypair } = useWallet()
  const [selectedProposal, setSelectedProposal] = useState<any>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [fundingGoal, setFundingGoal] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const pendingProposals = proposals.filter(p => p.status === 'pending')
  const approvedProposals = proposals.filter(p => p.status === 'approved')
  const rejectedProposals = proposals.filter(p => p.status === 'rejected')

  const handleApprove = async () => {
    if (!selectedProposal || !keypair) return
    
    setIsApproving(true)
    try {
      const fundingAmount = parseInt(fundingGoal)
      
      // 1. 提案を承認してFighterオブジェクトを作成
      const result = await approveScoutProposal(
        keypair,
        selectedProposal.id,
        fundingAmount
      )

      if (result.success) {
        // 2. Scout Master SBTを発行（報酬は資金調達目標の3%）
        const rewardAmount = fundingAmount * 0.03
        const sbtResult = await mintScoutMasterSBT(
          keypair,
          selectedProposal.id,
          selectedProposal.proposerAddress,
          selectedProposal.fighter.nameJa,
          rewardAmount
        )

        if (sbtResult.success) {
          // 3. ローカル状態を更新
          updateProposalStatus(selectedProposal.id, 'approved', `承認されました。Scout Master SBT (ID: ${sbtResult.sbtId}) が発行されました。`)
          alert(
            `提案を承認しました！\n\n` +
            `✅ 選手ページを作成\n` +
            `✅ Scout Master SBT を発行\n` +
            `💰 報酬額: $${rewardAmount.toFixed(2)}\n` +
            `📜 SBT ID: ${sbtResult.sbtId?.slice(0, 8)}...`
          )
        } else {
          alert('承認は成功しましたが、SBT発行に失敗しました。')
        }
        
        setShowApproveDialog(false)
        setSelectedProposal(null)
        setFundingGoal('')
      } else {
        alert('承認に失敗しました。')
      }
    } catch (error) {
      console.error('Approve error:', error)
      alert('承認中にエラーが発生しました。')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!selectedProposal || !keypair) return
    
    setIsRejecting(true)
    try {
      // ブロックチェーンにトランザクションを送信
      const result = await rejectScoutProposal(
        keypair,
        selectedProposal.id,
        rejectReason
      )

      if (result.success) {
        // ローカル状態を更新
        updateProposalStatus(selectedProposal.id, 'rejected')
        alert('提案を却下しました。ステークは没収されます。')
        setShowRejectDialog(false)
        setSelectedProposal(null)
        setRejectReason('')
      } else {
        alert('却下に失敗しました。')
      }
    } catch (error) {
      console.error('Reject error:', error)
      alert('却下中にエラーが発生しました。')
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">運営ダッシュボード</h1>
          <p className="text-muted-foreground">スカウト提案の審査と管理</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" asChild>
              <Link href="/admin">提案審査</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/rewards">報酬分配</Link>
            </Button>
          </div>
        </div>

        {/* 統計 */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">審査待ち</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProposals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">承認済み</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedProposals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">却下</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedProposals.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* 審査待ちの提案 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">審査待ち提案</h2>
          {pendingProposals.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">審査待ちの提案はありません</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {pendingProposals.map((proposal) => (
                <Card key={proposal.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {proposal.fighterNameJa}
                          <span className="text-muted-foreground ml-2">({proposal.fighterName})</span>
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            {proposal.nationality}
                          </Badge>
                          <Badge variant="outline">
                            <Trophy className="h-3 w-3 mr-1" />
                            {proposal.weightClass}
                          </Badge>
                          <Badge variant="outline">{proposal.currentRecord}</Badge>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500">審査待ち</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        推薦理由
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {proposal.reason}
                      </p>
                    </div>

                    {proposal.videoUrl && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          動画URL
                        </h4>
                        <a 
                          href={proposal.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {proposal.videoUrl}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">ステーク:</span>
                      <span>${proposal.stakeAmount} USDsui</span>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedProposal(proposal)
                          setShowApproveDialog(true)
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        承認
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          setSelectedProposal(proposal)
                          setShowRejectDialog(true)
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        却下
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 承認済み提案 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">承認済み提案</h2>
          {approvedProposals.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">承認済みの提案はありません</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {approvedProposals.map((proposal) => (
                <Card key={proposal.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {proposal.fighterNameJa}
                      <span className="text-muted-foreground ml-2 text-sm">({proposal.fighterName})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {proposal.weightClass} • {proposal.currentRecord}
                      </div>
                      <Badge className="bg-green-600">承認済み</Badge>
                    </div>
                    {proposal.rewardAmount && (
                      <div className="mt-2 text-sm">
                        <span className="font-semibold">報酬:</span> ${proposal.rewardAmount}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 却下された提案 */}
        {rejectedProposals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">却下された提案</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {rejectedProposals.map((proposal) => (
                <Card key={proposal.id} className="opacity-60">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {proposal.fighterNameJa}
                      <span className="text-muted-foreground ml-2 text-sm">({proposal.fighterName})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {proposal.weightClass} • {proposal.currentRecord}
                      </div>
                      <Badge variant="destructive">却下</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 承認ダイアログ */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>提案を承認</DialogTitle>
            <DialogDescription>
              この選手の資金調達目標を設定してください。承認後、選手ページが作成され投資が開始されます。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fundingGoal">資金調達目標 (USDsui)</Label>
              <Input
                id="fundingGoal"
                type="number"
                placeholder="例: 10000"
                value={fundingGoal}
                onChange={(e) => setFundingGoal(e.target.value)}
                min="1000"
                max="100000"
              />
              <p className="text-xs text-muted-foreground">
                推奨範囲: $5,000 - $50,000
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveDialog(false)
                setSelectedProposal(null)
                setFundingGoal('')
              }}
            >
              キャンセル
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={!fundingGoal || isApproving}
            >
              {isApproving ? '承認中...' : '承認する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 却下ダイアログ */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>提案を却下</DialogTitle>
            <DialogDescription>
              却下理由を入力してください。提案者のステークは没収されます。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectReason">却下理由</Label>
              <Input
                id="rejectReason"
                placeholder="例: 実績が不十分"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false)
                setSelectedProposal(null)
                setRejectReason('')
              }}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason || isRejecting}
            >
              {isRejecting ? '却下中...' : '却下する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
