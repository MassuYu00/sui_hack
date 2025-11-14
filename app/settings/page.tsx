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
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteAccount = () => {
    if (confirm('アカウントを削除してもよろしいですか？この操作は取り消せません。')) {
      if (confirm('本当に削除しますか？すべてのデータが失われます。')) {
        logout()
        alert('アカウントが削除されました')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">設定</h1>
          <p className="text-muted-foreground">アカウントとセキュリティの設定</p>
        </div>

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              アカウント情報
            </CardTitle>
            <CardDescription>
              ZKLogin で認証されたアカウント情報
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>メールアドレス</Label>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-3 py-2 rounded flex-1">
                  {session.userEmail}
                </code>
                <Badge variant="secondary">{session.provider}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Sui アドレス</Label>
              <code className="text-xs bg-muted px-3 py-2 rounded block break-all">
                {session.address}
              </code>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  作成日時
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(session.createdAt)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  認証プロバイダー
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
              セッション情報
            </CardTitle>
            <CardDescription>
              現在のセッションの状態と有効期限
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">セッション有効期限</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    あと約 {timeUntilExpiry} 時間で期限切れになります
                  </p>
                  {expiryTime && (
                    <p className="text-xs text-muted-foreground">
                      期限: {formatDate(expiryTime)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {sessionData && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>最大エポック</Label>
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
              セキュリティ
            </CardTitle>
            <CardDescription>
              アカウントのセキュリティ設定
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">ZKLogin 認証</p>
                <p className="text-sm text-muted-foreground">
                  ゼロ知識証明による匿名認証
                </p>
              </div>
              <Badge variant="default">有効</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">セッション自動更新</p>
                <p className="text-sm text-muted-foreground">
                  有効期限が近づくと自動的に延長されます
                </p>
              </div>
              <Badge variant="secondary">有効</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">危険な操作</CardTitle>
            <CardDescription>
              これらの操作は取り消すことができません
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">ログアウト</p>
                <p className="text-sm text-muted-foreground">
                  すべてのセッションを無効化します
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('ログアウトしてもよろしいですか?')) {
                    logout()
                  }
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">アカウント削除</p>
                <p className="text-sm text-muted-foreground">
                  アカウントとすべてのデータを完全に削除します
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
              >
                アカウント削除
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
