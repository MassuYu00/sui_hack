'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface ScoutProposal {
  id: string
  fighterId?: string // Assigned after approval
  fighterName: string
  fighterNameJa: string
  nationality: string
  weightClass: string
  currentRecord: string
  reason: string
  videoUrl?: string
  stakeAmount: number
  proposerAddress: string
  proposerName: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewComment?: string
  rewardAmount?: number // Reward amount if approved
}

interface ScoutContextType {
  proposals: ScoutProposal[]
  userProposals: ScoutProposal[]
  addProposal: (proposal: Omit<ScoutProposal, 'id' | 'status' | 'submittedAt'>) => Promise<string>
  getProposalById: (id: string) => ScoutProposal | undefined
  getProposalsByStatus: (status: ScoutProposal['status']) => ScoutProposal[]
  getTotalStaked: () => number
  updateProposalStatus: (id: string, status: ScoutProposal['status'], comment?: string) => void
}

const ScoutContext = createContext<ScoutContextType | undefined>(undefined)

export function ScoutProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<ScoutProposal[]>([
    {
      id: 'proposal-001',
      fighterName: 'Kenta Sato',
      fighterNameJa: 'Kenta Sato',
      nationality: 'Japan',
      weightClass: 'Lightweight',
      currentRecord: '8-1-0',
      reason: 'Showing overwhelming strength in regional competitions. Speed and technique stand out, has the potential to compete in major organizations.',
      stakeAmount: 100,
      proposerAddress: '0x...',
      proposerName: 'scout_master_123',
      status: 'pending',
      submittedAt: '2025-11-10T10:00:00Z',
    },
    {
      id: 'proposal-002',
      fighterId: 'fighter-002',
      fighterName: 'Mihyang Lee',
      fighterNameJa: 'Mihyang Lee',
      nationality: 'South Korea',
      weightClass: 'Women\'s Flyweight',
      currentRecord: '6-0-0',
      reason: 'Undefeated since amateur days. Striking is exceptional, a future champion candidate. Rising talent attracting attention in Korea.',
      videoUrl: 'https://youtube.com/watch?v=example',
      stakeAmount: 150,
      proposerAddress: '0x...',
      proposerName: 'talent_scout_pro',
      status: 'approved',
      submittedAt: '2025-11-05T14:30:00Z',
      reviewedAt: '2025-11-08T09:00:00Z',
      reviewComment: 'Excellent recommendation. Moving forward with curation team selection.',
      rewardAmount: 600, // 3% of 20000
    },
    {
      id: 'proposal-003',
      fighterName: 'Mike Thompson',
      fighterNameJa: 'Mike Thompson',
      nationality: 'USA',
      weightClass: 'Welterweight',
      currentRecord: '5-3-0',
      reason: 'Wrestling-based fighter with solid fundamentals.',
      stakeAmount: 50,
      proposerAddress: '0x...',
      proposerName: 'new_scout',
      status: 'rejected',
      submittedAt: '2025-11-01T18:00:00Z',
      reviewedAt: '2025-11-03T11:00:00Z',
      reviewComment: 'Record and recommendation reason are insufficient. Please provide more specific information.',
    },
  ])

  const addProposal = async (
    proposal: Omit<ScoutProposal, 'id' | 'status' | 'submittedAt'>
  ): Promise<string> => {
    // TODO: Actual blockchain processing
    // 1. Lock stake amount in smart contract
    // 2. Record proposal on-chain
    
    const newProposal: ScoutProposal = {
      ...proposal,
      id: `proposal-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    }

    setProposals((prev) => [newProposal, ...prev])
    return newProposal.id
  }

  const getProposalById = (id: string) => {
    return proposals.find((p) => p.id === id)
  }

  const getProposalsByStatus = (status: ScoutProposal['status']) => {
    return proposals.filter((p) => p.status === status)
  }

  // Current user's proposals (in practice, determined by wallet address)
  const userProposals = proposals.filter((p) => p.proposerAddress === '0x...')

  const getTotalStaked = () => {
    return userProposals
      .filter((p) => p.status === 'pending')
      .reduce((total, p) => total + p.stakeAmount, 0)
  }

  const updateProposalStatus = (
    id: string, 
    status: ScoutProposal['status'], 
    comment?: string
  ) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              reviewedAt: new Date().toISOString(),
              reviewComment: comment,
            }
          : p
      )
    )
  }

  return (
    <ScoutContext.Provider
      value={{
        proposals,
        userProposals,
        addProposal,
        getProposalById,
        getProposalsByStatus,
        getTotalStaked,
        updateProposalStatus,
      }}
    >
      {children}
    </ScoutContext.Provider>
  )
}

export function useScout() {
  const context = useContext(ScoutContext)
  if (context === undefined) {
    throw new Error('useScout must be used within a ScoutProvider')
  }
  return context
}
