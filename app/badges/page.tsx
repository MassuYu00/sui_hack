'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/components/dashboard-nav'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Trophy, Target, Shield } from 'lucide-react'
import Image from 'next/image'

// Mock SBT data
const mockSBTs = {
  winningSecond: [
    {
      id: '1',
      fighterId: '1',
      fighterName: '山田剛',
      fighterImage: '/Gemini_Generated_Image_3j4iq63j4iq63j4i.png',
      metadata: {
        eventName: 'UFC Fight Night 235',
        eventDate: '2025-10-15',
        opponentName: 'Carlos Silva',
      },
      issuedAt: '2025-10-16T02:00:00Z',
    },
    {
      id: '2',
      fighterId: '3',
      fighterName: 'Viktor Volkov',
      fighterImage: '/Gemini_Generated_Image_b2prmdb2prmdb2pr.png',
      metadata: {
        eventName: 'Bellator 312',
        eventDate: '2025-09-22',
        opponentName: 'Anderson Santos',
      },
      issuedAt: '2025-09-23T05:00:00Z',
    },
  ],
  scoutMaster: [
    {
      id: '3',
      fighterId: '2',
      fighterName: 'Maria Rodriguez',
      fighterImage: '/Gemini_Generated_Image_7ztmku7ztmku7ztm.png',
      metadata: {
        scoutedAt: '2025-08-01',
        totalFundingRaised: 45000,
        scoutReward: 1350, // 3% of 45000
      },
      issuedAt: '2025-08-15T10:00:00Z',
    },
  ],
}

export default function BadgesPage() {
  const { session, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/badges')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  const totalBadges =
    mockSBTs.winningSecond.length + mockSBTs.scoutMaster.length

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav title="マイバッジコレクション" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">マイバッジコレクション</h1>
          <p className="text-xl text-muted-foreground mb-8">
            あなたが獲得した譲渡不可能なSoul Bound Token（SBT）
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{totalBadges}</div>
                    <div className="text-sm text-muted-foreground">総バッジ数</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {mockSBTs.winningSecond.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Winning Second
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {mockSBTs.scoutMaster.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Scout Master
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Winning Second SBTs */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold">Winning Second SBT</h2>
            <Badge className="bg-green-100 text-green-800">
              {mockSBTs.winningSecond.length}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            投資した選手が勝利した瞬間を記録する名誉の証。「俺が育てた」という究極の当事者意識の証明。
          </p>

          {mockSBTs.winningSecond.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                まだWinning Second SBTを獲得していません。
                <br />
                選手に投資して、勝利の瞬間を共有しましょう。
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSBTs.winningSecond.map((sbt) => (
                <Card
                  key={sbt.id}
                  className="overflow-hidden border-2 border-green-200 bg-linear-to-br from-green-50 to-white hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 bg-gradient-to-br from-green-500 to-green-700">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Trophy className="w-24 h-24 text-white/20" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-white/90 text-green-800 mb-2">
                        Winning Second SBT
                      </Badge>
                      <h3 className="text-xl font-bold text-white">
                        {sbt.fighterName}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-200">
                        <Image
                          src={sbt.fighterImage}
                          alt={sbt.fighterName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{sbt.metadata.eventName}</p>
                        <p className="text-sm text-muted-foreground">
                          vs {sbt.metadata.opponentName}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">試合日:</span>
                        <span className="font-medium">
                          {new Date(sbt.metadata.eventDate).toLocaleDateString(
                            'ja-JP'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">発行日:</span>
                        <span className="font-medium">
                          {new Date(sbt.issuedAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>譲渡不可能（Soul Bound）</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Scout Master SBTs */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold">Scout Master SBT</h2>
            <Badge className="bg-purple-100 text-purple-800">
              {mockSBTs.scoutMaster.length}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            才能ある選手を発掘し、資金調達に成功させた目利きの証。スカウト報酬（調達額の3%）と共に発行されます。
          </p>

          {mockSBTs.scoutMaster.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                まだScout Master SBTを獲得していません。
                <br />
                有望な選手を推薦し、目利きの証を手に入れましょう。
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSBTs.scoutMaster.map((sbt) => (
                <Card
                  key={sbt.id}
                  className="overflow-hidden border-2 border-purple-200 bg-linear-to-br from-purple-50 to-white hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 bg-gradient-to-br from-purple-500 to-purple-700">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Target className="w-24 h-24 text-white/20" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-white/90 text-purple-800 mb-2">
                        Scout Master SBT
                      </Badge>
                      <h3 className="text-xl font-bold text-white">
                        {sbt.fighterName}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200">
                        <Image
                          src={sbt.fighterImage}
                          alt={sbt.fighterName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">スカウト成功</p>
                        <p className="text-sm text-muted-foreground">
                          目利きの証
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          推薦日:
                        </span>
                        <span className="font-medium">
                          {new Date(
                            sbt.metadata.scoutedAt!
                          ).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          調達総額:
                        </span>
                        <span className="font-medium">
                          ${sbt.metadata.totalFundingRaised?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          スカウト報酬:
                        </span>
                        <span className="font-bold text-purple-600">
                          ${sbt.metadata.scoutReward?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>譲渡不可能（Soul Bound）</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
