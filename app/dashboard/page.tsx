'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardStats } from '@/components/dashboard-stats'
import { PortfolioSection } from '@/components/portfolio-section'
import { RecommendedFighters } from '@/components/recommended-fighters'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
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

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <p className="text-muted-foreground mt-1">Manage your fighter investments and portfolio</p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/invest">
                <Plus className="h-4 w-4" />
                New Investment
              </Link>
            </Button>
          </div>

          <DashboardStats />
          <PortfolioSection />
          <RecommendedFighters />
        </div>
      </main>
    </div>
  )
}
