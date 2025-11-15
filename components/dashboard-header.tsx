'use client'

import { UserMenu } from './user-menu'
import { WalletButton } from './wallet-button'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">FIGHTER'S RISING DAO</span>
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="/Gemini_Generated_Image_4fla5q4fla5q4fla.png"
              alt="FIGHTER'S RISING DAO"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <WalletButton />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
