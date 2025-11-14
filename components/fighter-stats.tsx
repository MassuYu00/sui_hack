'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Stats {
  wins: number
  losses: number
  draws: number
  winRate: string
}

interface FighterStatsProps {
  stats: Stats
}

export function FighterStats({ stats }: FighterStatsProps) {
  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Career Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground uppercase">Wins</p>
            <p className="text-3xl font-bold text-green-600">{stats.wins}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground uppercase">Losses</p>
            <p className="text-3xl font-bold text-red-600">{stats.losses}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground uppercase">Draws</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.draws}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-primary/5">
            <p className="text-xs text-muted-foreground uppercase">Win Rate</p>
            <p className="text-3xl font-bold text-primary">{stats.winRate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
