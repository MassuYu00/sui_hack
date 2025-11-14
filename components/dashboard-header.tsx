'use client'

import { UserMenu } from './user-menu'
import Link from 'next/link'
import { Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex items-center justify-between h-16 px-6">
        <Link href="/" className="font-bold text-xl text-primary">
          FIGHTER'S RISING
        </Link>
        <div className="flex items-center gap-4">
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
