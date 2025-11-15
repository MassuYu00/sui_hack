'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginButton } from '@/components/login-button'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && isAuthenticated) {
      // Check for redirect parameter
      const redirect = searchParams.get('redirect')
      if (redirect) {
        router.push(redirect)
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isClient, router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">FIGHTER'S RISING DAO</h1>
          <p className="text-muted-foreground">Powered by Sui ZKlogin</p>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Connect with your preferred OAuth provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground/80">
                <strong>ZKlogin Security:</strong> Your private key is generated securely without storing secrets. Login with your existing social account.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Select a provider:</p>
              <LoginButton variant="default" size="lg" />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New to Fighter's Rising?</span>
              </div>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Want to learn more?{' '}
            <Link href="/" className="text-primary hover:underline font-medium">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
