'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { FighterHeader } from '@/components/fighter-header'
import { FighterStats } from '@/components/fighter-stats'
import { InvestmentDetails } from '@/components/investment-details'
import { FighterAchievements } from '@/components/fighter-achievements'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function FighterProfilePage({ params }: { params: { name: string } }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isClient, router])

  const fighterData = {
    name: decodeURIComponent(params.name).replace('-', ' '),
    sport: 'MMA',
    rating: 4.8,
    location: 'Los Angeles, CA',
    achievements: 12,
    bio: 'Rising UFC prospect with an impressive undefeated record. Known for exceptional striking and grappling combination. Recently signed to major sponsorship deals and is rapidly climbing the lightweight rankings.',
    stats: {
      wins: 18,
      losses: 0,
      draws: 0,
      winRate: '100%',
    },
    fundingGoal: 5000,
    fundingCurrent: 3200,
    investors: 45,
    growth: '+15%',
    expectedReturn: '+18-25%/year',
    achievements_list: [
      {
        title: 'UFC Debut Victory',
        date: 'March 2024',
        type: 'championship' as const,
      },
      {
        title: 'Performance of the Night Bonus',
        date: 'January 2024',
        type: 'award' as const,
      },
      {
        title: 'Undefeated: 18-0 Record',
        date: 'December 2023',
        type: 'milestone' as const,
      },
      {
        title: 'National Amateur Championship',
        date: 'July 2022',
        type: 'championship' as const,
      },
    ],
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/invest">
              <ArrowLeft className="h-4 w-4" />
              Back to Fighters
            </Link>
          </Button>

          <FighterHeader
            name={fighterData.name}
            sport={fighterData.sport}
            rating={fighterData.rating}
            location={fighterData.location}
            achievements={fighterData.achievements}
            bio={fighterData.bio}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <FighterStats stats={fighterData.stats} />
              <FighterAchievements achievements={fighterData.achievements_list} />
            </div>

            <div className="lg:col-span-1">
              <InvestmentDetails
                fundingGoal={fighterData.fundingGoal}
                fundingCurrent={fighterData.fundingCurrent}
                investors={fighterData.investors}
                growth={fighterData.growth}
                expectedReturn={fighterData.expectedReturn}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
