'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Award, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { useInvestments } from '@/lib/investment-context'

export function PortfolioSection() {
  const { investments } = useInvestments()

  const statusColors = {
    fundraising: 'bg-blue-500',
    training: 'bg-orange-500',
    active: 'bg-green-500',
  }

  const statusLabels = {
    fundraising: '資金調達中',
    training: '修行中',
    active: '活動中',
  }

  return (
    <Card className="border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>応援ポートフォリオ</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            あなたが保有する応援持分NFT
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/invest">
            応援先を探す <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition cursor-pointer"
            >
              {/* 選手画像 */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={investment.fighterImage}
                  alt={investment.fighterNameJa}
                  fill
                  className="object-cover"
                />
              </div>

              {/* 選手情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{investment.fighterNameJa}</p>
                  <Badge
                    className={`${statusColors[investment.fighterStatus]} text-white border-0 shrink-0`}
                  >
                    {statusLabels[investment.fighterStatus]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  応援開始日: {new Date(investment.investedAt).toLocaleDateString('ja-JP')}
                </p>
              </div>

              {/* 応援情報 */}
              <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">応援額</p>
                  <p className="text-sm font-medium">${investment.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">持分</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Award className="h-3 w-3 text-purple-600" />
                    <p className="text-sm font-medium">{investment.percentage}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">リターン</p>
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingUp className={`h-3 w-3 ${investment.totalReturnsReceived > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${investment.totalReturnsReceived > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      ${investment.totalReturnsReceived}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {investments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">まだ応援している選手はいません</p>
              <Button asChild>
                <Link href="/invest">応援先を探す</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
