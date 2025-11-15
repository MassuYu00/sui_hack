'use client'

import { useState, useEffect } from 'react'
import DashboardNav from '@/components/dashboard-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Award, AlertCircle, CheckCircle2, Clock, TrendingUp, Target } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useScout } from '@/lib/scout-context'
import { ScoutModal } from '@/components/scout-modal'

export default function ScoutPage() {
  const { session, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { proposals, userProposals, getTotalStaked } = useScout()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/scout')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  const totalStaked = getTotalStaked()
  const pendingCount = proposals.filter(p => p.status === 'pending').length
  const approvedCount = proposals.filter(p => p.status === 'approved').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Under Review'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav title="Scout Recommendations" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">Scout Recommendations</h1>
              <p className="text-xl text-muted-foreground">
                Discover promising fighters and recommend them to the DAO.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-accent"
            >
              + Recommend Fighter
            </Button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3%</div>
                    <div className="text-sm text-muted-foreground">Scout Reward</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Receive 3% of total funding when recommended fighter succeeds
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">${totalStaked}</div>
                    <div className="text-sm text-muted-foreground">Staked</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Total amount you currently have staked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{pendingCount}</div>
                    <div className="text-sm text-muted-foreground">Under Review</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Recommendations being reviewed by the team
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{approvedCount}</div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Total number of approved recommendations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scout Modal */}
        <ScoutModal isOpen={showModal} onClose={() => setShowModal(false)} />

        {/* Proposals List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Recommendations</h2>
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(proposal.status)}
                        <h3 className="text-xl font-bold">{proposal.fighterNameJa}</h3>
                        <Badge variant="outline">{proposal.weightClass}</Badge>
                        <Badge variant="secondary">{proposal.nationality}</Badge>
                        {proposal.currentRecord && (
                          <Badge variant="outline">{proposal.currentRecord}</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{proposal.reason}</p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Proposer: {proposal.proposerName}</span>
                        <span>Stake: {proposal.stakeAmount} USDsui</span>
                        <span>
                          Submitted: {new Date(proposal.submittedAt).toLocaleDateString('en-US')}
                        </span>
                      </div>
                      {proposal.reviewComment && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Team Comment:</p>
                          <p className="text-sm text-muted-foreground">{proposal.reviewComment}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Badge
                        className={
                          proposal.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : proposal.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {getStatusText(proposal.status)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
