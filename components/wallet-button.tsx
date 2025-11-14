'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wallet, Copy, LogOut, Coins, ExternalLink } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'

export function WalletButton() {
  const { address, balance, isConnected, connect, disconnect, requestFaucet } = useWallet()
  const [isRequesting, setIsRequesting] = useState(false)

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      alert('アドレスをコピーしました')
    }
  }

  const handleRequestFaucet = async () => {
    setIsRequesting(true)
    const success = await requestFaucet()
    if (success) {
      alert('テストネットSUIを請求しました。数秒後に残高が更新されます。')
    } else {
      alert('Faucetの請求に失敗しました。')
    }
    setIsRequesting(false)
  }

  const handleViewExplorer = () => {
    if (address) {
      const network = process.env.NEXT_PUBLIC_SUI_NETWORK || 'devnet'
      window.open(`https://suiscan.xyz/${network}/account/${address}`, '_blank')
    }
  }

  if (!isConnected) {
    return (
      <Button onClick={connect} variant="outline" size="sm">
        <Wallet className="h-4 w-4 mr-2" />
        ウォレット接続
      </Button>
    )
  }

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">{shortAddress}</span>
          <Badge variant="secondary" className="ml-1">
            {balance.toFixed(2)} SUI
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>ウォレット</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="px-2 py-2">
          <p className="text-xs text-muted-foreground mb-1">アドレス</p>
          <p className="text-xs font-mono break-all">{address}</p>
        </div>

        <div className="px-2 py-2">
          <p className="text-xs text-muted-foreground mb-1">残高</p>
          <p className="text-sm font-semibold">{balance.toFixed(4)} SUI</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="h-4 w-4 mr-2" />
          アドレスをコピー
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleRequestFaucet} disabled={isRequesting}>
          <Coins className="h-4 w-4 mr-2" />
          {isRequesting ? 'Faucet請求中...' : 'テストSUIを取得'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewExplorer}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Explorerで見る
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={disconnect} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          切断
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
