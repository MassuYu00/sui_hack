'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { Chrome, Loader2 } from 'lucide-react'

interface LoginButtonProps {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export function LoginButton({ variant = 'default', size = 'default' }: LoginButtonProps) {
  const { login, isLoading } = useAuth()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (provider: 'google' | 'facebook') => {
    try {
      console.log('🖱️ Login button clicked:', provider)
      setSelectedProvider(provider)
      setError(null)
      await login(provider)
      console.log('✅ Login completed successfully')
    } catch (err) {
      console.error('❌ Login error in button handler:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      setSelectedProvider(null)
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          onClick={() => handleLogin('google')}
          disabled={isLoading}
          variant={variant}
          size={size}
          className="gap-2"
        >
          {isLoading && selectedProvider === 'google' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="h-4 w-4" />
          )}
          {isLoading && selectedProvider === 'google' ? 'Signing in...' : 'Google'}
        </Button>
        <Button
          onClick={() => handleLogin('facebook')}
          disabled={isLoading}
          variant={variant}
          size={size}
          className="gap-2"
        >
          {isLoading && selectedProvider === 'facebook' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="h-4 w-4" />
          )}
          {isLoading && selectedProvider === 'facebook' ? 'Signing in...' : 'Facebook'}
        </Button>
      </div>
    </div>
  )
}
