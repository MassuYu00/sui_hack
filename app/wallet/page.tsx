'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { WalletOverview } from '@/components/wallet-overview'
import { AssetsSection } from '@/components/assets-section'
import { TransactionHistory } from '@/components/transaction-history'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function WalletPage() {
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
          <div>
            <h1 className="text-3xl font-bold">Wallet & Assets</h1>
            <p className="text-muted-foreground mt-1">Manage your Sui blockchain assets and investments</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <WalletOverview />

                <Card className="border-primary/10 bg-blue-50 dark:bg-blue-950/20 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Balance</p>
                      <p className="text-2xl font-bold">$16,953.50</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Invested</p>
                      <p className="text-lg font-semibold">$12,450.00</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Returns</p>
                      <p className="text-lg font-semibold text-green-600">+$1,287.50</p>
                    </div>
                    <Button className="w-full">Add Funds</Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <AssetsSection />
              <TransactionHistory />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
