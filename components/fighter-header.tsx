'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Trophy } from 'lucide-react'

interface FighterHeaderProps {
  name: string
  sport: string
  rating: number
  location: string
  achievements: number
  bio: string
}

export function FighterHeader({
  name,
  sport,
  rating,
  location,
  achievements,
  bio,
}: FighterHeaderProps) {
  return (
    <Card className="overflow-hidden border-primary/10">
      <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-primary/20">{name.charAt(0)}</div>
        </div>
      </div>
      <CardContent className="pt-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold">{name}</h1>
          <p className="text-lg text-muted-foreground mt-1">{sport} Fighter</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="text-lg font-semibold">{rating}/5.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold">{location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-lg font-semibold">{achievements}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-muted-foreground">{bio}</p>
        </div>
      </CardContent>
    </Card>
  )
}
