'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function PortfolioSection() {
  const portfolio = [
    {
      name: 'Alex Chen',
      sport: 'MMA',
      invested: '$2,500',
      returns: '$287.50',
      status: 'active',
      roi: '+11.5%',
    },
    {
      name: 'Jordan Martinez',
      sport: 'Boxing',
      invested: '$1,800',
      returns: '$156.00',
      status: 'active',
      roi: '+8.7%',
    },
    {
      name: 'Sam Williams',
      sport: 'Wrestling',
      invested: '$3,200',
      returns: '$512.00',
      status: 'pending',
      roi: '+16.0%',
    },
    {
      name: 'Taylor Singh',
      sport: 'Muay Thai',
      invested: '$1,950',
      returns: '$78.00',
      status: 'active',
      roi: '+4.0%',
    },
  ]

  return (
    <Card className="border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Portfolio</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/invest">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {portfolio.map((fighter, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition">
              <div className="space-y-1">
                <p className="font-medium">{fighter.name}</p>
                <p className="text-sm text-muted-foreground">{fighter.sport}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{fighter.invested}</p>
                  <p className="text-xs text-muted-foreground">invested</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{fighter.returns}</p>
                  <p className="text-xs text-green-600">{fighter.roi}</p>
                </div>
                <Badge
                  variant={fighter.status === 'active' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {fighter.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
