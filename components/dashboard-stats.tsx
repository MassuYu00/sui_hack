'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Award, Wallet } from 'lucide-react'

export function DashboardStats() {
  const stats = [
    {
      title: 'Total Investments',
      value: '$12,450.00',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'Fighters Following',
      value: '8',
      change: '+2 this month',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Returns Generated',
      value: '$1,287.50',
      change: '+8.2%',
      icon: Award,
      color: 'text-purple-600',
    },
    {
      title: 'Wallet Balance',
      value: '$5,120.75',
      change: 'Connected',
      icon: Wallet,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
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
