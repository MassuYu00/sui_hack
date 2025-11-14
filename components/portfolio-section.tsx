'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'

export function PortfolioSection() {
  const supportedFighters = [
    {
      name: 'Alex Chen',
      nameJa: 'アレックス・チェン',
      sport: 'MMA',
      supported: '$2,500',
      badges: 3,
      status: 'training',
      statusLabel: '修行中',
      lastUpdate: 'タイでの修行開始',
    },
    {
      name: 'Jordan Martinez',
      nameJa: 'ジョーダン・マルティネス',
      sport: 'Boxing',
      supported: '$1,800',
      badges: 2,
      status: 'active',
      statusLabel: '活動中',
      lastUpdate: '次回試合: 2週間後',
    },
    {
      name: 'Sam Williams',
      nameJa: 'サム・ウィリアムズ',
      sport: 'Wrestling',
      supported: '$3,200',
      badges: 5,
      status: 'active',
      statusLabel: '活動中',
      lastUpdate: '前回試合: 勝利',
    },
    {
      name: 'Taylor Singh',
      nameJa: 'テイラー・シン',
      sport: 'Muay Thai',
      supported: '$1,950',
      badges: 1,
      status: 'fundraising',
      statusLabel: '資金調達中',
      lastUpdate: '目標の85%達成',
    },
  ]

  const statusColors = {
    fundraising: 'bg-blue-500',
    training: 'bg-orange-500',
    active: 'bg-green-500',
  }

  return (
    <Card className="border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>応援中の選手</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/invest">
            すべて見る <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {supportedFighters.map((fighter, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition">
              <div className="space-y-1 flex-1">
                <p className="font-medium">{fighter.nameJa}</p>
                <p className="text-sm text-muted-foreground">{fighter.sport}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{fighter.supported}</p>
                  <p className="text-xs text-muted-foreground">支援金額</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm font-medium">{fighter.badges}個</p>
                  </div>
                  <p className="text-xs text-muted-foreground">バッジ</p>
                </div>
                <Badge
                  className={`${statusColors[fighter.status as keyof typeof statusColors]} text-white border-0 ml-2`}
                >
                  {fighter.statusLabel}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
