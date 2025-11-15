'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, TrendingUp, Trophy, UserPlus } from 'lucide-react'

export function RecentActivity() {
  const activities = [
    {
      id: '1',
      type: 'return',
      icon: TrendingUp,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      title: 'Return Distribution',
      description: 'Maria Rodriguez - Brazil Fight Night 2024',
      amount: '+$150',
      date: '2025-01-05',
    },
    {
      id: '2',
      type: 'sbt',
      icon: Trophy,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-50',
      title: 'Winning Second SBT Acquired',
      description: 'Viktor Volkov - Victory at Bellator 312',
      date: '2024-09-23',
    },
    {
      id: '3',
      type: 'investment',
      icon: Award,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      title: 'Investment Share NFT Acquired',
      description: 'Tsuyoshi Yamada - $500 investment',
      date: '2025-01-11',
    },
    {
      id: '4',
      type: 'scout',
      icon: UserPlus,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      title: 'Scout Recommendation',
      description: 'Maria Rodriguez - Recommendation approved',
      date: '2024-11-08',
    },
  ]

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition"
              >
                <div className={`h-10 w-10 rounded-lg ${activity.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    {activity.amount && (
                      <Badge variant="outline" className="text-green-600 border-green-200 shrink-0">
                        {activity.amount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.date).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
