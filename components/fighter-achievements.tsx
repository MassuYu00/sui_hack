'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award } from 'lucide-react'

interface Achievement {
  title: string
  date: string
  type: 'championship' | 'tournament' | 'milestone' | 'award'
}

interface FighterAchievementsProps {
  achievements: Achievement[]
}

export function FighterAchievements({ achievements }: FighterAchievementsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'championship':
        return <Trophy className="h-5 w-5 text-yellow-600" />
      case 'tournament':
        return <Medal className="h-5 w-5 text-blue-600" />
      case 'award':
        return <Award className="h-5 w-5 text-green-600" />
      case 'milestone':
        return <Award className="h-5 w-5 text-purple-600" />
      default:
        return null
    }
  }

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Achievements & Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <div className="flex-shrink-0 mt-1">
                {getIcon(achievement.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{achievement.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {achievement.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
