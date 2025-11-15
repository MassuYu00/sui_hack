'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingNavigation() {
  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              FIGHTER'S RISING DAO
            </span>
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src="/Gemini_Generated_Image_4fla5q4fla5q4fla.png" 
                alt="FIGHTER'S RISING DAO" 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* CTA Buttons only */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-primary hover:bg-accent text-primary-foreground" asChild>
              <Link href="/login?action=signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
