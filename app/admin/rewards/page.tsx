'use client'

import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWallet } from '@/lib/wallet-context'
import { distributeReturns } from '@/lib/sui-client'
import { TrendingUp, DollarSign, Users, Award } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// モックデータ（実際はブロックチェーンから取得）
const mockFighters = [
  {
    id: 'fighter-001',
    nameJa: 'Takeshi Yamada',
    name: 'Takeshi Yamada',
    totalInvested: 5000,
    investorCount: 12,
    nextMatch: '2025-11-20',
    expectedPrize: 3000,
  },
  {
    id: 'fighter-002',
    nameJa: 'マリア・ロドリゲス',
    name: 'Maria Rodriguez',
    totalInvested: 8000,
    investorCount: 25,
    nextMatch: '2025-11-25',
    expectedPrize: 5000,
  },
  {
    id: 'fighter-003',
    nameJa: '李美香',
    name: 'Mihyang Lee',
    totalInvested: 20000,
    investorCount: 45,
    nextMatch: '2025-12-01',
    expectedPrize: 15000,
  },
]

export default function RewardsPage() {
  const { keypair } = useWallet()
  const [selectedFighter, setSelectedFighter] = useState<any>(null)
  const [prizeAmount, setPrizeAmount] = useState('')
  const [isDistributing, setIsDistributing] = useState(false)
  const [showDistributeDialog, setShowDistributeDialog] = useState(false)

  const handleDistribute = async () => {
    if (!selectedFighter || !keypair || !prizeAmount) return

    setIsDistributing(true)
    try {
      const amount = parseFloat(prizeAmount)
      
      // ブロックチェーンでリターンを分配
      const result = await distributeReturns(
        keypair,
        selectedFighter.id,
        amount
      )

      if (result.success) {
        alert(
          `リターンを分配しました！\n\n` +
          `選手: ${selectedFighter.nameJa}\n` +
          `賞金額: $${amount.toLocaleString()}\n` +
          `投資家数: ${selectedFighter.investorCount}名\n` +
          `トランザクション: ${result.digest?.slice(0, 8)}...`
        )
        setShowDistributeDialog(false)
        setSelectedFighter(null)
        setPrizeAmount('')
      } else {
        alert('リターン分配に失敗しました。')
      }
    } catch (error) {
      console.error('Distribution error:', error)
      alert('分配中にエラーが発生しました。')
    } finally {
      setIsDistributing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">報酬分配管理</h1>
          <p className="text-muted-foreground">
            試合結果に基づいて投資家へのリターンを自動分配
          </p>
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
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総投資額</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockFighters.reduce((sum, f) => sum + f.totalInvested, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総投資家数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockFighters.reduce((sum, f) => sum + f.investorCount, 0)}名
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">アクティブ選手</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockFighters.length}名</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">予想総リターン</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${mockFighters.reduce((sum, f) => sum + f.expectedPrize, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 選手リスト */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">リターン分配可能な選手</h2>
          <div className="grid gap-4">
            {mockFighters.map((fighter) => (
              <Card key={fighter.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {fighter.nameJa}
                        <span className="text-muted-foreground ml-2 text-sm">
                          ({fighter.name})
                        </span>
                      </CardTitle>
                      <CardDescription>次回試合: {fighter.nextMatch}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      アクティブ
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">総投資額</p>
                      <p className="text-lg font-semibold">
                        ${fighter.totalInvested.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">投資家数</p>
                      <p className="text-lg font-semibold">{fighter.investorCount}名</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">予想賞金</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${fighter.expectedPrize.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ISA比率</p>
                      <p className="text-lg font-semibold">15%</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2 text-sm">分配シミュレーション</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">賞金総額:</span>
                        <span className="font-medium">
                          ${fighter.expectedPrize.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">プラットフォーム手数料 (5%):</span>
                        <span className="font-medium">
                          ${(fighter.expectedPrize * 0.05).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">選手取り分 (ISA 15%):</span>
                        <span className="font-medium">
                          ${(fighter.expectedPrize * 0.15).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-semibold">投資家への分配額:</span>
                        <span className="font-bold text-green-600">
                          ${(fighter.expectedPrize * 0.8).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>投資家1人あたり平均:</span>
                        <span>
                          $
                          {((fighter.expectedPrize * 0.8) / fighter.investorCount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setSelectedFighter(fighter)
                      setPrizeAmount(fighter.expectedPrize.toString())
                      setShowDistributeDialog(true)
                    }}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    リターンを分配
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* 分配ダイアログ */}
      <Dialog open={showDistributeDialog} onOpenChange={setShowDistributeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>リターンを分配</DialogTitle>
            <DialogDescription>
              {selectedFighter?.nameJa} の試合賞金を投資家に自動分配します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prizeAmount">賞金総額 (USDsui)</Label>
              <Input
                id="prizeAmount"
                type="number"
                placeholder="例: 3000"
                value={prizeAmount}
                onChange={(e) => setPrizeAmount(e.target.value)}
                min="100"
              />
            </div>

            {prizeAmount && selectedFighter && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <h4 className="font-semibold mb-2">分配内訳</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">投資家数:</span>
                  <span className="font-medium">{selectedFighter.investorCount}名</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">総投資額:</span>
                  <span className="font-medium">
                    ${selectedFighter.totalInvested.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">分配額:</span>
                  <span className="font-bold text-green-600">
                    ${(parseFloat(prizeAmount) * 0.8).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  ※ 投資持分に応じて自動的に比例配分されます
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDistributeDialog(false)
                setSelectedFighter(null)
                setPrizeAmount('')
              }}
            >
              キャンセル
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleDistribute}
              disabled={!prizeAmount || isDistributing}
            >
              {isDistributing ? '分配中...' : 'リターンを分配する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
