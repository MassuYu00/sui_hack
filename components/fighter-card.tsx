'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Star, TrendingUp, Users } from 'lucide-react'

interface FighterCardProps {
  id: string
  name: string
  sport: string
  rating: number
  growth: string
  fundingGoal: number
  fundingCurrent: number
  investors: number
  description: string
}

export function FighterCard({
  id,
  name,
  sport,
  rating,
  growth,
  fundingGoal,
  fundingCurrent,
  investors,
  description,
}: FighterCardProps) {
  const fundingPercent = (fundingCurrent / fundingGoal) * 100

  return (
    <Card className="overflow-hidden hover:shadow-lg transition border-primary/10">
      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary/20">{name.charAt(0)}</div>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{sport}</p>
          </div>
          <Badge variant="outline" className="gap-1 whitespace-nowrap">
            <Star className="h-3 w-3 fill-current" />
            {rating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Funding Goal</span>
            <span className="font-medium">
              ${fundingCurrent.toLocaleString()} / ${fundingGoal.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(fundingPercent, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">{Math.round(fundingPercent)}% funded</p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Growth</p>
              <p className="text-sm font-medium text-green-600">{growth}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Investors</p>
              <p className="text-sm font-medium">{investors}</p>
            </div>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href={`/fighter/${name.replace(' ', '-')}`}>
            View & Invest
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
