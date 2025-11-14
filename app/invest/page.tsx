'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/components/dashboard-nav'
import { FighterCard } from '@/components/fighter-card'
import { FilterSidebar } from '@/components/filter-sidebar'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Wallet, Shield, TrendingUp, Award } from 'lucide-react'
import { mockFighters } from '@/lib/mock-data'

export default function InvestPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{ 
    sports: string[]
    fundingRange: number[]
    minRating: number 
  }>({ 
    sports: [], 
    fundingRange: [0, 100000], 
    minRating: 0 
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login?redirect=/invest')
    }
  }, [isAuthenticated, isClient, router])

  const filteredFighters = mockFighters
    .filter(f => f.currentStatus === 'fundraising') // 資金調達中のみ
    .filter((fighter) => {
      const matchesSearch =
        fighter.nameJa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fighter.weightClass.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFunding =
        fighter.funding.currentAmount >= filters.fundingRange[0] &&
        fighter.funding.currentAmount <= filters.fundingRange[1]

      return matchesSearch && matchesFunding
    })

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav title="選手に投資する" />
      
      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">選手に投資する</h1>
          <p className="text-xl text-muted-foreground mb-8">
            プロスペクト選手のエンジェル投資家になり、成功をリターンとして受け取る
          </p>

          {/* Investment Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">投資持分NFT</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  賞金の一部を自動分配
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Winning Second SBT</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  勝利の瞬間を刻む名誉
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">ドキュメンタリー</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  限定映像へのアクセス
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold">特典アクセス</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  チケット先行販売など
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">投資の仕組み</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Badge className="mb-2">Step 1</Badge>
                  <h4 className="font-semibold mb-1">USDsuiで投資</h4>
                  <p className="text-sm text-muted-foreground">
                    ステーブルコインで選手に投資。投資持分NFTを受け取る。
                  </p>
                </div>
                <div>
                  <Badge className="mb-2">Step 2</Badge>
                  <h4 className="font-semibold mb-1">選手が成長</h4>
                  <p className="text-sm text-muted-foreground">
                    ISA契約に基づき、運営が選手をサポート。修行ドキュメンタリーを制作。
                  </p>
                </div>
                <div>
                  <Badge className="mb-2">Step 3</Badge>
                  <h4 className="font-semibold mb-1">リターン獲得</h4>
                  <p className="text-sm text-muted-foreground">
                    賞金の一部を自動分配。勝利時にSBTも発行。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="選手名、階級で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredFighters.length}名の投資先を表示中
              </div>
              <Badge variant="outline">資金調達中のみ表示</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFighters.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </div>

            {filteredFighters.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    現在、資金調達中の選手はいません
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
