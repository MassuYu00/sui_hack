'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WalletButton } from '@/components/wallet-button'
import { useAuth } from '@/lib/auth-context'

export default function Navigation() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">◆</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              FIGHTER'S RISING
            </span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#fighters" className="text-foreground hover:text-primary transition">
              投資先
            </Link>
            <Link href="/#documentaries" className="text-foreground hover:text-primary transition">
              ドキュメンタリー
            </Link>
            <Link href="/scout" className="text-foreground hover:text-primary transition">
              スカウト
            </Link>
            <Link href="/badges" className="text-foreground hover:text-primary transition">
              マイバッジ
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <WalletButton />
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">ダッシュボード</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">ログイン</Link>
                </Button>
                <Button className="bg-primary hover:bg-accent text-primary-foreground" asChild>
                  <Link href="/login?action=signup">はじめる</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
