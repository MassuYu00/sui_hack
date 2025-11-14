'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Award, Trophy, TrendingUp } from 'lucide-react'
import { useInvestments } from '@/lib/investment-context'

export function DashboardStats() {
  const { investments, getTotalInvestedAmount, getTotalReturns } = useInvestments()
  
  const totalInvested = getTotalInvestedAmount()
  const totalReturns = getTotalReturns()
  const returnPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : '0'
  
  const stats = [
    {
      title: '総応援額',
      value: `$${totalInvested.toLocaleString()}`,
      change: `${investments.length}選手を応援中`,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '応援持分NFT',
      value: `${investments.length}個`,
      change: `${investments.length}選手分の権利証`,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Soul Bound Token',
      value: '2個',
      change: 'Winning Second: 2個',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'リターン総額',
      value: `$${totalReturns.toLocaleString()}`,
      change: `応援額の${returnPercentage}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-primary/10 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
