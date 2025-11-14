'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleOAuthCallback } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get JWT from URL fragment (for implicit flow)
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const idToken = params.get('id_token') || searchParams.get('id_token')

        if (!idToken) {
          throw new Error('No ID token received from OAuth provider')
        }

        // Verify state parameter to prevent CSRF
        const state = params.get('state') || searchParams.get('state')
        const storedState = sessionStorage.getItem('oauth_state')
        
        if (state !== storedState) {
          throw new Error('Invalid state parameter - possible CSRF attack')
        }

        // Clear stored state
        sessionStorage.removeItem('oauth_state')

        // Process the OAuth callback
        await handleOAuthCallback(idToken)

        setStatus('success')

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Authentication failed')
      }
    }

    processCallback()
  }, [handleOAuthCallback, router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Processing your login with ZKLogin'}
            {status === 'success' && 'Redirecting to your dashboard'}
            {status === 'error' && 'There was a problem signing you in'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="space-y-2 text-center text-sm text-muted-foreground">
                <p>🔐 Verifying your identity</p>
                <p>🔑 Generating ZK proof</p>
                <p>⛓️ Creating Sui address</p>
                <p className="text-xs mt-4">This may take a few moments...</p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600" />
              <div className="text-center space-y-2">
                <p className="text-green-600 font-medium">Authentication successful!</p>
                <p className="text-sm text-muted-foreground">
                  Your account is ready. Redirecting...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-600" />
              <div className="text-center space-y-4">
                <p className="text-red-600 font-medium">Authentication failed</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button asChild className="w-full">
                  <Link href="/login">Try Again</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-6 py-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
