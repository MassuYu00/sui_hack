'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InvestmentModal } from '@/components/investment-modal'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, Users, Target, Calendar, Trophy, TrendingUp, DollarSign } from 'lucide-react'
import { getFighterByName } from '@/lib/mock-data'

export default function FighterProfilePage({ params }: { params: { name: string } }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [showInvestModal, setShowInvestModal] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isClient, router])

  const fighterSlug = params.name
  const fighter = getFighterByName(fighterSlug)

  if (!fighter) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">選手が見つかりません</h1>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const fundingPercent = Math.min(100, (fighter.funding.currentAmount / fighter.funding.targetAmount) * 100)
  const statusLabels = {
    fundraising: '資金調達中',
    training: '修行中',
    active: '活動中',
  }
  const statusColors = {
    fundraising: 'bg-blue-500',
    training: 'bg-orange-500',
    active: 'bg-green-500',
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Fighters
            </Link>
          </Button>

          {/* ヒーローセクション */}
          <div className="relative rounded-xl overflow-hidden bg-linear-to-br from-primary/30 via-primary/10 to-background">
            <div className="relative h-[400px]">
              <Image
                src={fighter.image}
                alt={fighter.nameJa}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                <Badge className={`${statusColors[fighter.currentStatus]} text-white border-0 mb-4`}>
                  {statusLabels[fighter.currentStatus]}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{fighter.nameJa}</h1>
                <p className="text-xl text-white/90 mb-4">{fighter.name}</p>
                <div className="flex flex-wrap gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{fighter.age}歳</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>{fighter.weightClass}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🌍</span>
                    <span>{fighter.nationality}</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-lg px-4 py-2 border-white text-white">
                    {fighter.record.wins}-{fighter.record.losses}-{fighter.record.draws}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左側: ストーリーと目標 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 目標 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    選手の目標
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{fighter.goal}</p>
                </CardContent>
              </Card>

              {/* 背景ストーリー */}
              <Card>
                <CardHeader>
                  <CardTitle>ストーリー</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{fighter.backstory}</p>
                </CardContent>
              </Card>

              {/* ISA契約情報 */}
              {fighter.isaContract && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      リターン条件
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">配当割合</p>
                        <p className="text-2xl font-bold text-primary">{fighter.isaContract.percentage}%</p>
                        <p className="text-xs text-muted-foreground">賞金・収益から</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">契約期間</p>
                        <p className="text-2xl font-bold text-primary">{fighter.isaContract.duration}年</p>
                        <p className="text-xs text-muted-foreground">最初の契約から</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 右側: 応援パネル */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>応援する</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 調達進捗 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">調達進捗</p>
                        <p className="text-2xl font-bold">
                          ${fighter.funding.currentAmount.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-3xl font-bold text-primary">{Math.round(fundingPercent)}%</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-linear-to-r from-primary to-primary/70 h-3 rounded-full transition-all"
                        style={{ width: `${fundingPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      目標: ${fighter.funding.targetAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* 応援者数 */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">応援者</span>
                    </div>
                    <span className="text-xl font-bold">{fighter.funding.investorCount}人</span>
                  </div>

                  {/* 応援ボタン */}
                  <Button 
                    className="w-full" 
                    size="lg" 
                    disabled={fighter.currentStatus !== 'fundraising'}
                    onClick={() => setShowInvestModal(true)}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    {fighter.currentStatus === 'fundraising' ? '応援する' : '応援受付終了'}
                  </Button>

                  {fighter.currentStatus !== 'fundraising' && (
                    <p className="text-xs text-center text-muted-foreground">
                      この選手は現在{statusLabels[fighter.currentStatus]}です
                    </p>
                  )}

                  {/* 特典情報 */}
                  <div className="pt-4 border-t space-y-2">
                    <p className="text-sm font-semibold">応援者特典</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ 投資持分NFTの取得</li>
                      <li>✓ 勝利時のWinning Second SBT</li>
                      <li>✓ 限定ドキュメンタリー視聴</li>
                      <li>✓ 試合チケット先行販売</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* 投資モーダル */}
      {fighter && (
        <InvestmentModal
          fighter={fighter}
          isOpen={showInvestModal}
          onClose={() => setShowInvestModal(false)}
        />
      )}
    </div>
  )
}
