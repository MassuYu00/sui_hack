'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface ScoutProposal {
  id: string
  fighterId?: string // 承認後に割り当て
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
  rewardAmount?: number // 承認された場合の報酬額
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
      fighterNameJa: '佐藤健太',
      nationality: '日本',
      weightClass: 'ライト級',
      currentRecord: '8-1-0',
      reason: '地方大会で圧倒的な強さを見せている。スピードとテクニックが際立っており、メジャー団体でも通用する素質がある。',
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
      fighterNameJa: '李美香',
      nationality: '韓国',
      weightClass: '女子フライ級',
      currentRecord: '6-0-0',
      reason: 'アマチュア時代から無敗。打撃のキレが素晴らしく、将来のチャンピオン候補。韓国で注目されている逸材。',
      videoUrl: 'https://youtube.com/watch?v=example',
      stakeAmount: 150,
      proposerAddress: '0x...',
      proposerName: 'talent_scout_pro',
      status: 'approved',
      submittedAt: '2025-11-05T14:30:00Z',
      reviewedAt: '2025-11-08T09:00:00Z',
      reviewComment: '素晴らしい推薦です。キュレーションチームで選抜を進めます。',
      rewardAmount: 600, // 20000の3%
    },
    {
      id: 'proposal-003',
      fighterName: 'Mike Thompson',
      fighterNameJa: 'マイク・トンプソン',
      nationality: 'アメリカ',
      weightClass: 'ウェルター級',
      currentRecord: '5-3-0',
      reason: 'レスリングベースの選手で地力がある。',
      stakeAmount: 50,
      proposerAddress: '0x...',
      proposerName: 'new_scout',
      status: 'rejected',
      submittedAt: '2025-11-01T18:00:00Z',
      reviewedAt: '2025-11-03T11:00:00Z',
      reviewComment: '戦績と推薦理由が不十分です。より具体的な情報をお願いします。',
    },
  ])

  const addProposal = async (
    proposal: Omit<ScoutProposal, 'id' | 'status' | 'submittedAt'>
  ): Promise<string> => {
    // TODO: 実際のブロックチェーン処理
    // 1. ステーク額をスマートコントラクトにロック
    // 2. 提案をオンチェーンに記録
    
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

  // 現在のユーザーの提案（実際はウォレットアドレスで判定）
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
