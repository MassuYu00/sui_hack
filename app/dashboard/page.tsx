'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardStats } from '@/components/dashboard-stats'
import { PortfolioSection } from '@/components/portfolio-section'
import { RecentActivity } from '@/components/recent-activity'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Target, Award, Trophy } from 'lucide-react'

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
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20 hover:border-primary/40 transition cursor-pointer">
              <CardContent className="pt-6">
                <Link href="/invest" className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">新しい選手を応援</p>
                    <p className="text-sm text-muted-foreground">応援先を探す</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition cursor-pointer">
              <CardContent className="pt-6">
                <Link href="/scout" className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">選手をスカウト</p>
                    <p className="text-sm text-muted-foreground">有望選手を推薦</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition cursor-pointer">
              <CardContent className="pt-6">
                <Link href="/badges" className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold">マイバッジ</p>
                    <p className="text-sm text-muted-foreground">SBTコレクション</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <DashboardStats />

          {/* Portfolio and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PortfolioSection />
            </div>
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
