'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { InvestmentShare } from './types'

interface ExtendedInvestmentShare extends InvestmentShare {
  fighterNameJa: string
  fighterImage: string
  currentValue: number
  totalReturnsReceived: number
  status: 'active' | 'completed'
  fighterStatus: 'fundraising' | 'training' | 'active'
}

interface InvestmentContextType {
  investments: ExtendedInvestmentShare[]
  addInvestment: (investment: ExtendedInvestmentShare) => void
  getInvestmentsByFighterId: (fighterId: string) => ExtendedInvestmentShare[]
  getTotalInvestedAmount: () => number
  getTotalReturns: () => number
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined)

export function InvestmentProvider({ children }: { children: ReactNode }) {
  // 初期モックデータ
  const [investments, setInvestments] = useState<ExtendedInvestmentShare[]>([
    {
      id: 'nft-001',
      fighterId: 'fighter-001',
      fighterName: 'Takeshi "Thunder" Yamada',
      fighterNameJa: '山田 剛',
      fighterImage: '/Gemini_Generated_Image_3j4iq63j4iq63j4i.png',
      investorAddress: '0x...',
      amount: 500,
      percentage: 5.88,
      investedAt: '2025-01-11T00:00:00Z',
      currentValue: 500,
      totalReturnsReceived: 0,
      status: 'active',
      fighterStatus: 'fundraising',
      benefits: {
        documentaryAccess: true,
        ticketPresale: true,
        votingRight: true,
      },
    },
    {
      id: 'nft-002',
      fighterId: 'fighter-002',
      fighterName: 'Maria "La Rosa" Rodriguez',
      fighterNameJa: 'マリア・ロドリゲス',
      fighterImage: '/Gemini_Generated_Image_7ztmku7ztmku7ztm.png',
      investorAddress: '0x...',
      amount: 1000,
      percentage: 5.0,
      investedAt: '2024-12-15T00:00:00Z',
      currentValue: 1150,
      totalReturnsReceived: 150,
      status: 'active',
      fighterStatus: 'training',
      benefits: {
        documentaryAccess: true,
        ticketPresale: true,
        votingRight: true,
      },
    },
  ])

  const addInvestment = (investment: ExtendedInvestmentShare) => {
    setInvestments((prev) => [...prev, investment])
  }

  const getInvestmentsByFighterId = (fighterId: string) => {
    return investments.filter((inv) => inv.fighterId === fighterId)
  }

  const getTotalInvestedAmount = () => {
    return investments.reduce((total, inv) => total + inv.amount, 0)
  }

  const getTotalReturns = () => {
    return investments.reduce((total, inv) => total + inv.totalReturnsReceived, 0)
  }

  return (
    <InvestmentContext.Provider
      value={{
        investments,
        addInvestment,
        getInvestmentsByFighterId,
        getTotalInvestedAmount,
        getTotalReturns,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  )
}

export function useInvestments() {
  const context = useContext(InvestmentContext)
  if (context === undefined) {
    throw new Error('useInvestments must be used within an InvestmentProvider')
  }
  return context
}
