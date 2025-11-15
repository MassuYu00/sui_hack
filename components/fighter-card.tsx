'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Heart, Target, Users } from 'lucide-react'
import { Fighter } from '@/lib/types'
import Image from 'next/image'
import { InvestmentModal } from '@/components/investment-modal'

interface FighterCardProps {
  fighter: Fighter
}

export function FighterCard({ fighter }: FighterCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  if (!fighter) {
    return null
  }
  
  const fundingPercent = Math.min(100, (fighter.funding.currentAmount / fighter.funding.targetAmount) * 100)
  const statusLabels = {
    fundraising: 'Fundraising',
    training: 'In Training',
    active: 'Active',
  }
  const statusColors = {
    fundraising: 'bg-blue-500',
    training: 'bg-orange-500',
    active: 'bg-green-500',
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/20 group">
      {/* Fighter Image Area - Emphasizing Story */}
      <div className="relative h-56 bg-linear-to-br from-primary/30 via-primary/10 to-background overflow-hidden">
        <Image
          src={fighter.image}
          alt={fighter.nameJa}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-4 right-4 z-10">
          <Badge className={`${statusColors[fighter.currentStatus]} text-white border-0`}>
            {statusLabels[fighter.currentStatus]}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-1">
            {fighter.nameJa}
          </h3>
          <p className="text-sm text-white/90 drop-shadow">{fighter.name}</p>
        </div>
      </div>

      <CardHeader className="pb-3 space-y-3">
        {/* Basic Information */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{fighter.nationality}</span>
            <span>•</span>
            <span>{fighter.age} y/o</span>
            <span>•</span>
            <span>{fighter.weightClass}</span>
          </div>
          <Badge variant="outline" className="font-mono">
            {fighter.record.wins}-{fighter.record.losses}-{fighter.record.draws}
          </Badge>
        </div>

        {/* Goal - Inspiring Support */}
        <div className="flex gap-2 items-start bg-muted/50 p-3 rounded-lg">
          <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed">{fighter.goal}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Fundraising Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-muted-foreground">Funding Progress</p>
              <p className="text-lg font-bold">
                ${fighter.funding.currentAmount.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  / ${fighter.funding.targetAmount.toLocaleString()}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{Math.round(fundingPercent)}%</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-primary to-primary/70 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${Math.min(fundingPercent, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Number of Investors */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Investors</span>
          </div>
          <span className="text-lg font-semibold">{fighter.funding.investorCount}</span>
        </div>

        {/* Invest Button */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full group-hover:shadow-lg transition-all" 
          size="lg"
        >
          <Heart className="h-4 w-4 mr-2" />
          Invest
        </Button>
      </CardContent>

      <InvestmentModal 
        fighter={fighter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  )
}
