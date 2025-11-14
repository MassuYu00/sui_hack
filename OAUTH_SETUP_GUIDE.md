# Google OAuth 設定ガイド

このガイドでは、Fighter's Rising で Google OAuth 認証を有効にする手順を説明します。

## 📋 前提条件

- Google アカウント
- Google Cloud Console へのアクセス

## 🔧 セットアップ手順

### 1. Google Cloud Console にアクセス

1. [Google Cloud Console](https://console.cloud.google.com/) を開く
2. Google アカウントでログイン

### 2. プロジェクトを作成

1. 画面上部の「プロジェクトを選択」をクリック
2. 「新しいプロジェクト」をクリック
3. プロジェクト名: `fighters-rising` または任意の名前
4. 「作成」をクリック

### 3. OAuth 同意画面を設定

1. 左側メニューから「APIとサービス」→「OAuth 同意画面」を選択
2. ユーザータイプ: **外部** を選択
3. 「作成」をクリック

#### アプリ情報を入力:

- **アプリ名**: `Fighter's Rising`
- **ユーザーサポートメール**: あなたのメールアドレス
- **アプリのロゴ**: (オプション)
- **アプリドメイン**:
  - アプリケーションのホームページ: `http://localhost:3000` (開発時)
  - アプリケーションのプライバシーポリシー: `http://localhost:3000/privacy` (オプション)
  - アプリケーションの利用規約: `http://localhost:3000/terms` (オプション)
- **承認済みドメイン**: (本番環境のドメインを追加)
- **デベロッパーの連絡先情報**: あなたのメールアドレス

4. 「保存して次へ」をクリック

#### スコープを追加:

1. 「スコープを追加または削除」をクリック
2. 以下のスコープを選択:
   - `openid`
   - `email`
   - `profile`
3. 「更新」→「保存して次へ」をクリック

#### テストユーザーを追加:

1. 「テストユーザーを追加」をクリック
2. あなたのGoogleアカウントのメールアドレスを追加
3. 「保存して次へ」をクリック

### 4. OAuth クライアント ID を作成

1. 左側メニューから「認証情報」を選択
2. 「+認証情報を作成」→「OAuth クライアント ID」をクリック
3. アプリケーションの種類: **ウェブアプリケーション**
4. 名前: `Fighter's Rising Web Client`

#### 承認済みのリダイレクト URI を追加:

開発環境:
```
http://localhost:3000/auth/callback
```

本番環境（デプロイ後）:
```
https://yourdomain.com/auth/callback
```

5. 「作成」をクリック

### 5. クライアント ID をコピー

1. 作成されたクライアント ID が表示されます
2. **クライアント ID** をコピー（例: `123456789-abc.apps.googleusercontent.com`）
3. クライアントシークレットは不要（ZKLogin では使用しません）

### 6. 環境変数を設定

`.env.local` ファイルに以下を追加:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=あなたのクライアントID
NEXT_PUBLIC_MOCK_AUTH=false
```

### 7. 開発サーバーを再起動

```bash
npm run dev
```

## 🧪 動作確認

1. `http://localhost:3000/login` にアクセス
2. 「Sign in with Google」をクリック
3. Google ログイン画面が表示される
4. アカウントを選択してログイン
5. 権限の承認画面で「許可」をクリック
6. ダッシュボードにリダイレクトされる

## ⚠️ トラブルシューティング

### エラー: redirect_uri_mismatch

**原因**: リダイレクト URI が一致していない

**解決方法**:
1. Google Cloud Console の「認証情報」を確認
2. リダイレクト URI が正確に `http://localhost:3000/auth/callback` になっているか確認
3. プロトコル（http/https）、ポート番号、パスが完全に一致しているか確認

### エラー: Access blocked: This app's request is invalid

**原因**: OAuth 同意画面の設定が不完全

**解決方法**:
1. OAuth 同意画面を再確認
2. すべての必須フィールドが入力されているか確認
3. スコープ（openid, email, profile）が追加されているか確認

### エラー: This app is blocked

**原因**: アプリが未承認状態（開発中）

**解決方法**:
1. OAuth 同意画面の「テストユーザー」にあなたのメールアドレスを追加
2. または「公開ステータス」を「本番環境」に変更（Google の審査が必要）

### ZKLogin エラー

**原因**: JWT の nonce が一致しない、または期限切れ

**解決方法**:
1. ブラウザのキャッシュをクリア
2. localStorage と sessionStorage をクリア
3. ログアウトして再度ログイン

## 📱 本番環境へのデプロイ

### 1. ドメインを追加

Google Cloud Console:
1. OAuth 同意画面 → 「承認済みドメイン」
2. あなたのドメイン（例: `yourdomain.com`）を追加

### 2. リダイレクト URI を追加

認証情報:
1. OAuth クライアント ID を編集
2. 承認済みのリダイレクト URI に本番環境の URL を追加:
   ```
   https://yourdomain.com/auth/callback
   ```

### 3. 環境変数を設定

Vercel / Netlify / その他のホスティング:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=あなたのクライアントID
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_MOCK_AUTH=false
NEXT_PUBLIC_SUI_NETWORK=mainnet  # 本番環境の場合
```

### 4. 公開ステータスを変更（オプション）

一般公開する場合:
1. OAuth 同意画面 → 「アプリを公開」
2. Google の審査プロセスを完了（数日かかる場合があります）

## 🔐 セキュリティのベストプラクティス

1. **クライアント ID の保護**
   - `.env.local` は `.gitignore` に含める（既に設定済み）
   - 公開リポジトリにクライアント ID を含めない

2. **HTTPS の使用**
   - 本番環境では必ず HTTPS を使用
   - HTTP は開発環境のみ

3. **リダイレクト URI の制限**
   - 必要な URI のみを登録
   - ワイルドカード（*）は使用しない

4. **定期的な監視**
   - Google Cloud Console でアクセスログを確認
   - 不審なアクティビティがないか監視

## 📚 参考資料

- [Google OAuth 2.0 ドキュメント](https://developers.google.com/identity/protocols/oauth2)
- [Sui ZKLogin ドキュメント](https://docs.sui.io/concepts/cryptography/zklogin)
- [Next.js 環境変数](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## 💡 よくある質問

**Q: クライアントシークレットは必要ですか？**
A: いいえ。ZKLogin はクライアントサイド認証なので、クライアント ID のみで動作します。

**Q: 複数のドメインで使用できますか？**
A: はい。各ドメインのリダイレクト URI を OAuth クライアント ID に追加してください。

**Q: テストユーザーは何人まで追加できますか？**
A: 開発中は最大 100 人のテストユーザーを追加できます。

**Q: Facebook OAuth も追加したいです**
A: `FACEBOOK_OAUTH_SETUP.md` を参照してください（別途作成予定）。

## 🆘 サポート

問題が解決しない場合:
1. GitHub Issues で報告
2. [Sui Discord](https://discord.gg/sui) で質問
3. プロジェクトのドキュメントを確認
