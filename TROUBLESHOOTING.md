# トラブルシューティングガイド

## 🔴 「認証時にアクセスをブロック: 認証エラー」

このエラーが表示される場合、Google Cloud Consoleの設定を確認してください。

### 解決方法 1: OAuth同意画面の設定確認

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 「APIとサービス」→「OAuth 同意画面」を開く
3. 以下を確認：

#### 必須設定:
- ✅ **アプリ名**: 入力済みか確認（例: Fighter's Rising）
- ✅ **ユーザーサポートメール**: あなたのメールアドレス
- ✅ **デベロッパーの連絡先情報**: あなたのメールアドレス

#### スコープの確認:
1. 「スコープ」セクションで「編集」をクリック
2. 以下のスコープが追加されているか確認:
   - `openid`
   - `email` 
   - `profile`

追加されていない場合:
1. 「スコープを追加または削除」をクリック
2. フィルタで「openid」「email」「profile」を検索
3. チェックボックスをONにして「更新」

#### テストユーザーの追加:
1. 「テストユーザー」セクションで「ユーザーを追加」
2. **あなたのGoogleアカウントのメールアドレス**を追加
3. 「保存」をクリック

### 解決方法 2: リダイレクトURIの確認

1. 「認証情報」タブを開く
2. 作成したOAuthクライアントIDをクリック
3. 「承認済みのリダイレクトURI」を確認

#### 必須:
```
http://localhost:3000/auth/callback
```

**重要**: 
- プロトコル: `http://` (本番環境では `https://`)
- ポート番号: `:3000`
- パス: `/auth/callback`
- 末尾にスラッシュ不要

間違っている場合:
1. 正しいURIを追加
2. 「保存」をクリック
3. 数分待つ（変更が反映されるまで時間がかかる場合があります）

### 解決方法 3: アプリケーションのタイプ確認

1. 「認証情報」→ OAuthクライアントIDを開く
2. 「アプリケーションの種類」が**ウェブアプリケーション**になっているか確認

間違っている場合:
1. 新しいOAuthクライアントIDを作成
2. 種類: **ウェブアプリケーション**を選択
3. リダイレクトURIを設定
4. 新しいクライアントIDを`.env.local`に設定

### 解決方法 4: クライアントIDの確認

1. `.env.local`ファイルを開く
2. `NEXT_PUBLIC_GOOGLE_CLIENT_ID`が正しいか確認

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=あなたのクライアントID.apps.googleusercontent.com
```

**確認方法**:
1. Google Cloud Console → 認証情報
2. クライアントIDをコピー
3. `.env.local`の値と完全に一致するか確認

### 解決方法 5: 開発サーバーの再起動

設定を変更した後は必ず再起動:

```bash
# 開発サーバーを停止 (Ctrl+C)
# 再起動
cd /Users/masuyamayuusuke/Desktop/Sui_Hack/sui_hack
npm run dev
```

### 解決方法 6: ブラウザのキャッシュクリア

1. ブラウザのキャッシュをクリア
2. localStorage/sessionStorageをクリア:
   - ブラウザの開発者ツールを開く (F12)
   - Application タブ → Storage → Clear site data
3. ページを再読み込み

## 🔴 「redirect_uri_mismatch」エラー

### 原因:
リダイレクトURIが一致していません。

### 解決方法:

1. エラーメッセージに表示されている2つのURIを確認:
   - **Received**: アプリから送信されたURI
   - **Registered**: Google Cloud Consoleに登録されているURI

2. Google Cloud Console で修正:
   - 認証情報 → OAuthクライアントID
   - 「承認済みのリダイレクトURI」を編集
   - **Received**に表示されているURIを正確に追加
   - 保存

3. `.env.local`を確認:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. 開発サーバーを再起動

## 🔴 「This app is blocked」エラー

### 原因:
アプリが公開されておらず、テストユーザーに登録されていません。

### 解決方法:

1. OAuth同意画面 → テストユーザー
2. 「ユーザーを追加」をクリック
3. ログインに使用するGoogleアカウントのメールアドレスを追加
4. 保存

**または**:

1. OAuth同意画面 → 「アプリを公開」
2. 確認画面で「確認」
3. ⚠️ 注意: Googleの審査が必要になる場合があります

## 🔴 「invalid_client」エラー

### 原因:
クライアントIDが無効または間違っています。

### 解決方法:

1. Google Cloud Console → 認証情報
2. OAuthクライアントIDを確認
3. クライアントIDをコピー（正確に）
4. `.env.local`を更新:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=正しいクライアントID
```
5. 開発サーバーを再起動

## 🔴 ZKLogin関連エラー

### エラー: "Failed to generate ZK proof"

**原因**: Mysten Prover サービスに接続できない

**解決方法**:
1. インターネット接続を確認
2. `.env.local`のProver URLを確認:
```env
NEXT_PUBLIC_PROVER_URL=https://prover-dev.mystenlabs.com/v1
```
3. Sui Devnetが稼働中か確認: https://sui.io/networkinfo

### エラー: "Nonce mismatch"

**原因**: セッションが期限切れまたは破損

**解決方法**:
1. ブラウザのlocalStorage/sessionStorageをクリア
2. ログアウト
3. 再度ログイン

### エラー: "Invalid JWT"

**原因**: JWTトークンが無効または期限切れ

**解決方法**:
1. ログアウト
2. ブラウザのキャッシュをクリア
3. 再度ログイン
4. JWT取得後すぐにエラーが出る場合は、Google OAuthスコープを確認

## 🔴 ビルドエラー

### エラー: "Module not found"

**解決方法**:
```bash
cd /Users/masuyamayuusuke/Desktop/Sui_Hack/sui_hack
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### エラー: TypeScript compilation errors

**解決方法**:
```bash
# 型定義を再インストール
npm install --save-dev @types/node @types/react @types/react-dom
npm run build
```

## 📝 デバッグモード

詳細なログを確認する:

1. `.env.local`で有効化:
```env
NEXT_PUBLIC_DEBUG=true
```

2. ブラウザの開発者ツール（F12）→ Consoleタブを開く

3. ログイン処理中のメッセージを確認:
   - `🔑 Generating ZKLogin state...`
   - `🌐 Redirecting to OAuth provider...`
   - `✅ OAuth callback received`
   - `🔐 Generating ZK proof...`
   - `✅ Session created`

## 🆘 それでも解決しない場合

1. **ブラウザを変更**: Chrome/Safari/Firefoxで試す
2. **シークレットモード**: プライベートブラウジングで試す
3. **ポート変更**: 別のポート（3001など）で起動
   ```bash
   npm run dev -- -p 3001
   ```
   その場合、Google Cloud ConsoleのリダイレクトURIも変更:
   ```
   http://localhost:3001/auth/callback
   ```

4. **GitHub Issueで報告**: 詳細なエラーメッセージとスクリーンショットを添付

## ✅ 正常に動作している場合

ログイン後、以下が表示されれば成功:
- ダッシュボードページにリダイレクト
- 右上にユーザーアイコン表示
- ウォレットアドレスが表示される
- Sui残高が取得される

おめでとうございます！🎉
