'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Fighter } from '@/lib/types'
import { Loader2, Wallet, TrendingUp, Award, CheckCircle2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useInvestments } from '@/lib/investment-context'

interface InvestmentModalProps {
  fighter: Fighter
  isOpen: boolean
  onClose: () => void
}

export function InvestmentModal({ fighter, isOpen, onClose }: InvestmentModalProps) {
  const { addInvestment } = useInvestments()
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [nftDetails, setNftDetails] = useState<{
    nftId: string
    sharePercentage: number
    investmentAmount: number
  } | null>(null)

  const minInvestment = 100
  const maxInvestment = 10000
  const numAmount = parseFloat(amount) || 0

  // 投資額から獲得シェアを計算（簡易計算）
  const calculateShare = (investAmount: number) => {
    const remaining = fighter.funding.targetAmount - fighter.funding.currentAmount
    return ((investAmount / remaining) * 100).toFixed(2)
  }

  // 推定リターンを計算（年間賞金想定から）
  const calculateEstimatedReturn = (investAmount: number) => {
    const sharePercent = parseFloat(calculateShare(investAmount))
    const annualPrizeMoney = 50000 // 年間賞金想定額（仮）
    const isaPercent = fighter.isaContract?.percentage || 30
    const annualReturn = (annualPrizeMoney * (isaPercent / 100) * (sharePercent / 100))
    return annualReturn.toFixed(0)
  }

  const handleInvest = async () => {
    if (numAmount < minInvestment || numAmount > maxInvestment) {
      return
    }

    setIsProcessing(true)

    try {
      // TODO: 実際のSuiブロックチェーン処理
      // 1. ユーザーのウォレットから資金を転送
      // 2. Fighter Dynamic NFTの currentAmount を更新
      // 3. Investment Share NFT を mint してユーザーに送付
      
      // モック処理（3秒待機）
      await new Promise(resolve => setTimeout(resolve, 3000))

      // NFT発行成功
      const nftId = `0x${Math.random().toString(16).substr(2, 40)}`
      const sharePercentage = parseFloat(calculateShare(numAmount))
      
      setNftDetails({
        nftId,
        sharePercentage,
        investmentAmount: numAmount,
      })

      // 投資コンテキストに追加
      addInvestment({
        id: nftId,
        fighterId: fighter.id,
        fighterName: fighter.name,
        fighterNameJa: fighter.nameJa,
        fighterImage: fighter.image,
        investorAddress: '0x...',
        amount: numAmount,
        percentage: sharePercentage,
        investedAt: new Date().toISOString(),
        currentValue: numAmount,
        totalReturnsReceived: 0,
        status: 'active',
        fighterStatus: fighter.currentStatus,
        benefits: {
          documentaryAccess: true,
          ticketPresale: true,
          votingRight: true,
        },
      })
      
      setIsSuccess(true)
    } catch (error) {
      console.error('Investment failed:', error)
      alert('投資処理に失敗しました。もう一度お試しください。')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setAmount('')
    setIsSuccess(false)
    setNftDetails(null)
    onClose()
  }

  const handleViewNFT = () => {
    // TODO: NFT詳細ページへ遷移
    window.open(`https://suiscan.xyz/testnet/object/${nftDetails?.nftId}`, '_blank')
  }

  // 投資成功画面
  if (isSuccess && nftDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <DialogTitle className="text-2xl text-center">
                投資完了！
              </DialogTitle>
              <DialogDescription className="text-center">
                Investment Share NFTが発行されました
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* NFT カード */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-background">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                  <Image
                    src={fighter.image}
                    alt={fighter.nameJa}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{fighter.nameJa}</p>
                  <p className="text-sm text-muted-foreground">Investment Share NFT</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">投資額</span>
                  <span className="font-semibold">${nftDetails.investmentAmount.toLocaleString()} USDsui</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">獲得シェア</span>
                  <span className="font-semibold text-primary">{nftDetails.sharePercentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">NFT ID</span>
                  <span className="font-mono text-xs">{nftDetails.nftId.slice(0, 10)}...</span>
                </div>
              </div>
            </div>

            {/* 説明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">今後の流れ</p>
                  <p>選手が試合で獲得した賞金の一部が、あなたのNFT保有率に応じて自動的に分配されます。</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              閉じる
            </Button>
            <Button onClick={handleViewNFT} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              NFTを見る
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // 投資入力画面
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden">
              <Image
                src={fighter.image}
                alt={fighter.nameJa}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p>{fighter.nameJa} に投資</p>
              <p className="text-sm font-normal text-muted-foreground">{fighter.name}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            投資額を入力してください（{minInvestment} - {maxInvestment} USDsui）
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 投資額入力 */}
          <div className="space-y-2">
            <Label htmlFor="amount">投資額（USDsui）</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minInvestment}
                max={maxInvestment}
                className="text-lg pr-20"
                disabled={isProcessing}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USDsui
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              最小: ${minInvestment} | 最大: ${maxInvestment}
            </p>
          </div>

          {/* プレビュー情報 */}
          {numAmount >= minInvestment && (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm">投資内容</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    獲得シェア
                  </span>
                  <span className="font-semibold text-primary">
                    {calculateShare(numAmount)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    推定年間リターン
                  </span>
                  <span className="font-semibold text-green-600">
                    ${calculateEstimatedReturn(numAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    ISA契約
                  </span>
                  <span className="text-sm">
                    賞金の {fighter.isaContract?.percentage}% を {fighter.isaContract?.duration}年間
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 注意事項 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-900">
              <strong>注意:</strong> 投資後、Investment Share NFTが発行されます。このNFTは譲渡可能で、選手の将来的な収益を受け取る権利を表します。
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            キャンセル
          </Button>
          <Button
            onClick={handleInvest}
            disabled={numAmount < minInvestment || numAmount > maxInvestment || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                投資する
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
