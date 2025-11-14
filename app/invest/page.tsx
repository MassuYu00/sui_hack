'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { FighterCard } from '@/components/fighter-card'
import { FilterSidebar } from '@/components/filter-sidebar'
import { useAuth } from '@/lib/auth-context'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function InvestPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{ sports: string[], fundingRange: number[], minRating: number }>({ sports: [], fundingRange: [0, 10000], minRating: 0 })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isClient, router])

  const allFighters = [
    {
      id: '1',
      name: 'Alex Chen',
      sport: 'MMA',
      rating: 4.8,
      growth: '+15%',
      fundingGoal: 5000,
      fundingCurrent: 3200,
      investors: 45,
      description: 'UFC prospect with impressive record',
    },
    {
      id: '2',
      name: 'Jordan Martinez',
      sport: 'Boxing',
      rating: 4.6,
      growth: '+12%',
      fundingGoal: 4000,
      fundingCurrent: 2100,
      investors: 32,
      description: 'Champion contender in heavyweight division',
    },
    {
      id: '3',
      name: 'Sam Williams',
      sport: 'Wrestling',
      rating: 4.9,
      growth: '+22%',
      fundingGoal: 6000,
      fundingCurrent: 4500,
      investors: 58,
      description: 'Olympic-trained wrestler with promising career',
    },
    {
      id: '4',
      name: 'Taylor Singh',
      sport: 'Muay Thai',
      rating: 4.7,
      growth: '+8%',
      fundingGoal: 3500,
      fundingCurrent: 2200,
      investors: 28,
      description: 'Rising star in international tournaments',
    },
    {
      id: '5',
      name: 'Nicole Brooks',
      sport: 'MMA',
      rating: 4.5,
      growth: '+18%',
      fundingGoal: 5500,
      fundingCurrent: 3800,
      investors: 42,
      description: 'Undefeated rookie with breakthrough potential',
    },
    {
      id: '6',
      name: 'Marcus Thompson',
      sport: 'Boxing',
      rating: 4.8,
      growth: '+20%',
      fundingGoal: 4500,
      fundingCurrent: 3100,
      investors: 51,
      description: 'Lightweight champion on championship run',
    },
    {
      id: '7',
      name: 'Emma Young',
      sport: 'Judo',
      rating: 4.9,
      growth: '+25%',
      fundingGoal: 5800,
      fundingCurrent: 4200,
      investors: 55,
      description: 'World champion with stellar record',
    },
    {
      id: '8',
      name: 'Ryan Chang',
      sport: 'BJJ',
      rating: 4.4,
      growth: '+10%',
      fundingGoal: 3200,
      fundingCurrent: 1800,
      investors: 22,
      description: 'Submission specialist with growing fanbase',
    },
  ]

  const filteredFighters = allFighters.filter((fighter) => {
    const matchesSearch =
      fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fighter.sport.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSport =
      filters.sports.length === 0 || filters.sports.includes(fighter.sport)

    const matchesFunding =
      fighter.fundingCurrent >= filters.fundingRange[0] &&
      fighter.fundingCurrent <= filters.fundingRange[1]

    const matchesRating = fighter.rating >= filters.minRating

    return matchesSearch && matchesSport && matchesFunding && matchesRating
  })

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Invest in Fighters</h1>
            <p className="text-muted-foreground mt-1">Discover and support rising athletes</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterSidebar onFilterChange={setFilters} />
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search fighters, sports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {filteredFighters.length} of {allFighters.length} fighters
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFighters.map((fighter) => (
                  <FighterCard key={fighter.id} {...fighter} />
                ))}
              </div>

              {filteredFighters.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No fighters match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
