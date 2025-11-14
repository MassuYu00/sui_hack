'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Users, Trophy, Flame } from 'lucide-react'

export function DashboardStats() {
  const stats = [
    {
      title: '応援中の選手',
      value: '8人',
      change: '今月+2人',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: '総支援金額',
      value: '$12,450',
      change: '+12.5%',
      icon: Heart,
      color: 'text-red-600',
    },
    {
      title: '保有バッジ',
      value: '15個',
      change: 'Winning Second: 5個',
      icon: Trophy,
      color: 'text-yellow-600',
    },
    {
      title: 'コミュニティ貢献度',
      value: 'レベル 4',
      change: '次のレベルまで 1,200pt',
      icon: Flame,
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
