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
      title: 'Total Support Amount',
      value: `$${totalInvested.toLocaleString()}`,
      change: `Supporting ${investments.length} fighters`,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Support Share NFTs',
      value: `${investments.length}`,
      change: `Certificates for ${investments.length} fighters`,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Soul Bound Token',
      value: '2',
      change: 'Winning Second: 2',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Returns',
      value: `$${totalReturns.toLocaleString()}`,
      change: `${returnPercentage}% of support amount`,
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
