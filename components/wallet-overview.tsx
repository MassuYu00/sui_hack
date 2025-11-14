'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export function WalletOverview() {
  const { session } = useAuth()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (session?.address) {
      navigator.clipboard.writeText(session.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Wallet Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Sui Network Address</p>
          <div className="flex items-center justify-between gap-4">
            <code className="text-sm font-mono font-medium break-all">{session?.address}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyAddress}
              className="flex-shrink-0"
              title={copied ? 'Copied!' : 'Copy address'}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            Bridge Funds
          </Button>
        </div>

        <div className="pt-4 border-t border-border space-y-2">
          <p className="text-sm font-medium">Connected Provider</p>
          <p className="text-sm text-muted-foreground capitalize">{session?.provider}</p>
        </div>
      </CardContent>
    </Card>
  )
}
