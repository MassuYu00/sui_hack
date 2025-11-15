'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { UserMenu } from '@/components/user-menu'

interface DashboardNavProps {
  title: string
  backUrl?: string
}

export default function DashboardNav({ title, backUrl = '/dashboard' }: DashboardNavProps) {
  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Back button and title */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={backUrl} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </Button>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
