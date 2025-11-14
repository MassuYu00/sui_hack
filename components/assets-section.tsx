'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function AssetsSection() {
  const assets = [
    {
      name: 'Sui Token',
      symbol: 'SUI',
      amount: 1250.5,
      value: '$8,753.50',
      change: '+5.2%',
      type: 'positive',
    },
    {
      name: 'USDC',
      symbol: 'USDC',
      amount: 5000,
      value: '$5,000.00',
      change: '0%',
      type: 'neutral',
    },
    {
      name: 'Fighter NFT',
      symbol: 'FNFT',
      amount: 8,
      value: '$3,200.00',
      change: '+12.5%',
      type: 'positive',
    },
    {
      name: 'Rising Stars SBT',
      symbol: 'RSBT',
      amount: 1,
      value: 'Soulbound',
      change: 'NFT',
      type: 'neutral',
    },
  ]

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assets.map((asset, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition">
              <div className="space-y-1">
                <p className="font-medium">{asset.name}</p>
                <p className="text-sm text-muted-foreground">{asset.amount} {asset.symbol}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{asset.value}</p>
                  {asset.type === 'positive' && (
                    <Badge variant="outline" className="gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">{asset.change}</span>
                    </Badge>
                  )}
                  {asset.type === 'neutral' && (
                    <Badge variant="secondary" className="mt-1">
                      {asset.change}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
