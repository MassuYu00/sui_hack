'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export function RecommendedFighters() {
  const fighters = [
    {
      name: 'Nicole Brooks',
      sport: 'MMA',
      profile_rating: 4.8,
      growth: '23%',
      fundingGoal: '$5,000',
      fundingCurrent: '$3,200',
      description: 'Rising UFC prospect',
    },
    {
      name: 'Marcus Thompson',
      sport: 'Boxing',
      profile_rating: 4.6,
      growth: '18%',
      fundingGoal: '$3,500',
      fundingCurrent: '$2,100',
      description: 'Heavyweight champion contender',
    },
    {
      name: 'Emma Young',
      sport: 'Wrestling',
      profile_rating: 4.9,
      growth: '31%',
      fundingGoal: '$4,000',
      fundingCurrent: '$2,800',
      description: 'Olympic gold medalist',
    },
  ]

  return (
    <Card className="border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recommended Fighters</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/invest">Browse All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fighters.map((fighter, index) => (
            <Link key={index} href={`/fighter/${fighter.name.replace(' ', '-')}`}>
              <div className="p-4 rounded-lg border border-border hover:bg-primary/5 hover:border-primary/30 transition cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{fighter.name}</p>
                    <p className="text-sm text-muted-foreground">{fighter.description}</p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {fighter.growth}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Funding Progress</span>
                    <span className="font-medium">
                      ${fighter.fundingCurrent} / ${fighter.fundingGoal}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(parseFloat(fighter.fundingCurrent) / parseFloat(fighter.fundingGoal)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
