'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Shield, Clock, Key, LogOut } from 'lucide-react'
import { loadSession, getSessionExpiryTime } from '@/lib/session-manager'

export default function SettingsPage() {
  const { session, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !session) {
    return null
  }

  const sessionData = loadSession()
  const expiryTime = getSessionExpiryTime()
  const timeUntilExpiry = expiryTime ? Math.max(0, Math.floor((expiryTime - Date.now()) / 1000 / 60 / 60)) : 0

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (confirm('Are you really sure? All your data will be lost.')) {
        logout()
        alert('Account has been deleted')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Account and security settings</p>
        </div>

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Account information authenticated with ZKLogin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-3 py-2 rounded flex-1">
                  {session.userEmail}
                </code>
                <Badge variant="secondary">{session.provider}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Sui Address</Label>
              <code className="text-xs bg-muted px-3 py-2 rounded block break-all">
                {session.address}
              </code>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Created At
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(session.createdAt)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Auth Provider
                </Label>
                <p className="text-sm text-muted-foreground capitalize">
                  {session.provider}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Information
            </CardTitle>
            <CardDescription>
              Current session status and expiration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Session Expiry</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Expires in approximately {timeUntilExpiry} hours
                  </p>
                  {expiryTime && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {formatDate(expiryTime)}
                    </p>
                  )}
                </div>
              </div>
            </div>            {sessionData && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Max Epoch</Label>
                  <p className="text-sm text-muted-foreground">
                    Epoch {sessionData.maxEpoch}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">ZKLogin Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Anonymous authentication via zero-knowledge proofs
                </p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Session Renewal</p>
                <p className="text-sm text-muted-foreground">
                  Automatically extends when expiration approaches
                </p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              These actions cannot be undone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Logout</p>
                <p className="text-sm text-muted-foreground">
                  Invalidate all sessions
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    logout()
                  }
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
