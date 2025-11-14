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

  const handleLogin = async (provider: 'google' | 'facebook') => {
    setSelectedProvider(provider)
    await login(provider)
  }

  return (
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
  )
}
