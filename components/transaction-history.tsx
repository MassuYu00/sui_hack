'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDownRight, ArrowUpRight, Gift } from 'lucide-react'

export function TransactionHistory() {
  const transactions = [
    {
      id: '1',
      description: 'Invested in Alex Chen',
      amount: '-$2,500.00',
      date: '2 days ago',
      type: 'investment',
      status: 'completed',
    },
    {
      id: '2',
      description: 'Return from Jordan Martinez',
      amount: '+$156.00',
      date: '5 days ago',
      type: 'return',
      status: 'completed',
    },
    {
      id: '3',
      description: 'NFT Reward Claim',
      amount: '+1 Fighter NFT',
      date: '1 week ago',
      type: 'reward',
      status: 'completed',
    },
    {
      id: '4',
      description: 'Invested in Sam Williams',
      amount: '-$3,200.00',
      date: '2 weeks ago',
      type: 'investment',
      status: 'completed',
    },
    {
      id: '5',
      description: 'Return from Taylor Singh',
      amount: '+$78.00',
      date: '3 weeks ago',
      type: 'return',
      status: 'completed',
    },
    {
      id: '6',
      description: 'Platform Bonus',
      amount: '+$100.00',
      date: '1 month ago',
      type: 'bonus',
      status: 'completed',
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <ArrowDownRight className="h-4 w-4 text-orange-600" />
      case 'return':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'reward':
      case 'bonus':
        return <Gift className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getAmountColor = (amount: string) => {
    if (amount.startsWith('-')) return 'text-orange-600'
    if (amount.startsWith('+')) return 'text-green-600'
    return 'text-muted-foreground'
  }

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {getIcon(tx.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${getAmountColor(tx.amount)}`}>
                  {tx.amount}
                </p>
                <Badge variant="outline" className="text-xs">
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
