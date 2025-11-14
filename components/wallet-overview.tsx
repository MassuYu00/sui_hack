'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getBalance, requestTokensFromFaucet } from '@/lib/sui-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, Copy, ExternalLink, Coins } from 'lucide-react'

export function WalletOverview() {
  const { session } = useAuth()
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(true)
  const [isRequestingTokens, setIsRequestingTokens] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (session?.address) {
      loadBalance()
    }
  }, [session?.address])

  const loadBalance = async () => {
    if (!session?.address) return
    
    try {
      setIsLoading(true)
      const bal = await getBalance(session.address)
      // Convert from MIST to SUI (1 SUI = 10^9 MIST)
      const suiBalance = Number(bal) / 1_000_000_000
      setBalance(suiBalance.toFixed(4))
    } catch (error) {
      console.error('Failed to load balance:', error)
      setBalance('0.0000')
    } finally {
      setIsLoading(false)
    }
  }

  const copyAddress = () => {
    if (session?.address) {
      navigator.clipboard.writeText(session.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRequestTokens = async () => {
    if (!session?.address) return
    
    setIsRequestingTokens(true)
    try {
      const success = await requestTokensFromFaucet(session.address)
      if (success) {
        alert('Tokens requested! Balance will update shortly.')
        setTimeout(() => loadBalance(), 3000)
      } else {
        alert('Failed to request tokens. Please try again.')
      }
    } catch (error) {
      console.error('Faucet request error:', error)
      alert('Failed to request tokens')
    } finally {
      setIsRequestingTokens(false)
    }
  }

  const openExplorer = () => {
    if (!session?.address) return
    const network = process.env.NEXT_PUBLIC_SUI_NETWORK || 'devnet'
    const explorerUrl = `https://suiscan.xyz/${network}/account/${session.address}`
    window.open(explorerUrl, '_blank')
  }

  const shortAddress = session?.address 
    ? `${session.address.slice(0, 6)}...${session.address.slice(-4)}`
    : '0x0000...0000'

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Sui Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Balance</p>
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <span className="text-4xl font-bold">{balance}</span>
                <span className="text-xl text-muted-foreground">SUI</span>
              </>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Address</p>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono bg-muted px-3 py-2 rounded flex-1 break-all">
              {shortAddress}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyAddress}
              title={copied ? 'Copied!' : 'Copy address'}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={loadBalance}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh Balance'}
          </Button>
          
          {process.env.NEXT_PUBLIC_SUI_NETWORK !== 'mainnet' && (
            <Button 
              className="w-full gap-2" 
              onClick={handleRequestTokens}
              disabled={isRequestingTokens}
              variant="secondary"
            >
              <Coins className="h-4 w-4" />
              {isRequestingTokens ? 'Requesting...' : 'Request Test Tokens'}
            </Button>
          )}

          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={openExplorer}
          >
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </Button>
        </div>

        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network:</span>
            <span className="font-medium capitalize">
              {process.env.NEXT_PUBLIC_SUI_NETWORK || 'devnet'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium capitalize">{session?.provider}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
