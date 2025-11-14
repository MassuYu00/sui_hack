'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Users, TrendingUp, DollarSign } from 'lucide-react'

interface InvestmentDetailsProps {
  fundingGoal: number
  fundingCurrent: number
  investors: number
  growth: string
  expectedReturn: string
}

export function InvestmentDetails({
  fundingGoal,
  fundingCurrent,
  investors,
  growth,
  expectedReturn,
}: InvestmentDetailsProps) {
  const [investAmount, setInvestAmount] = useState('')
  const fundingPercent = (fundingCurrent / fundingGoal) * 100

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Investment Opportunity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Funding Goal</span>
            <span className="font-medium">
              ${fundingCurrent.toLocaleString()} / ${fundingGoal.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${Math.min(fundingPercent, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">{Math.round(fundingPercent)}% funded</p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-xs text-muted-foreground">Total Investors</p>
            </div>
            <p className="text-2xl font-bold">{investors}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-muted-foreground">Growth Rate</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{growth}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <p className="text-xs text-muted-foreground">Expected Return</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{expectedReturn}</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div>
            <Label htmlFor="amount" className="text-sm">
              Investment Amount (USD)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              className="mt-2"
            />
          </div>
          {investAmount && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">You will receive:</p>
              <p className="text-sm font-semibold">
                {(parseFloat(investAmount) / fundingGoal * 100).toFixed(2)}% of fighter stake
              </p>
            </div>
          )}
          <Button className="w-full" size="lg">
            Invest Now
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          By investing, you agree to the investment terms and conditions
        </p>
      </CardContent>
    </Card>
  )
}
