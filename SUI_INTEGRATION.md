# FIGHTER'S RISING - Sui Blockchain Integration

## 🚀 実装完了機能

### 1. ✅ 実際のSuiブロックチェーン統合

#### 実装内容
- **Sui SDK統合** (`@mysten/sui v1.45.0`)
- **ウォレット管理システム**
  - Ed25519キーペアによるウォレット生成
  - ローカルストレージでの秘密鍵保存
  - SUI残高のリアルタイム表示
  - テストネットFaucet統合

#### ファイル
- `lib/sui-client.ts` - Suiクライアント、トランザクション関数
- `lib/wallet-context.tsx` - ウォレット状態管理
- `components/wallet-button.tsx` - ウォレットUI

#### 主要関数
```typescript
// 選手オブジェクトを作成
createFighter(signer, fighterData)

// 投資を実行してNFT発行
investInFighter(signer, fighterId, amount)

// スカウト提案を送信
submitScoutProposal(signer, proposalData)

// Scout Master SBTを発行
mintScoutMasterSBT(signer, proposalId, recipient, fighterName, rewardAmount)

// リターンを分配
distributeReturns(signer, fighterId, totalAmount)

// スカウト提案を承認
approveScoutProposal(signer, proposalId, fundingGoal)

// スカウト提案を却下
rejectScoutProposal(signer, proposalId, reason)
```

---

### 2. ✅ 運営チーム向けの審査ダッシュボード

#### 実装内容
- **提案審査システム**
  - 審査待ち提案の一覧表示
  - 詳細情報表示（選手情報、推薦理由、動画URL、ステーク額）
  - 承認/却下機能
  - 資金調達目標の設定

#### ページ
- `/admin` - 運営ダッシュボード

#### 機能
- 📊 **統計ダッシュボード**
  - 審査待ち数
  - 承認済み数
  - 却下数
  
- ✅ **承認プロセス**
  1. 提案詳細の確認
  2. 資金調達目標の設定
  3. ブロックチェーンに選手オブジェクトを作成
  4. Scout Master SBTを自動発行
  
- ❌ **却下プロセス**
  1. 却下理由の入力
  2. ブロックチェーンに記録
  3. ステークの没収

---

### 3. ✅ Scout Master SBTの自動発行

#### 実装内容
- **SBT (Soul Bound Token) 自動発行システム**
  - 提案承認時に自動でSBT発行
  - 報酬額は資金調達目標の3%
  - 転送不可トークンとして実装

#### フロー
```
提案承認 → 選手ページ作成 → SBT自動発行 → 推薦者に付与
```

#### 報酬計算
```typescript
rewardAmount = fundingGoal * 0.03  // 3%
```

#### 実装箇所
- `app/admin/page.tsx` - handleApprove関数内
- `lib/sui-client.ts` - mintScoutMasterSBT関数

---

### 4. ✅ 報酬の自動分配機能

#### 実装内容
- **報酬分配管理システム**
  - 選手ごとの投資情報表示
  - 分配シミュレーション
  - 自動比例配分

#### ページ
- `/admin/rewards` - 報酬分配管理

#### 分配ロジック
```
賞金総額: $10,000 とする場合

1. プラットフォーム手数料 (5%): $500
2. 選手取り分 (ISA 15%): $1,500
3. 投資家への分配額 (80%): $8,000
   → 各投資家に投資持分に応じて比例配分
```

#### 機能
- 📊 **統計表示**
  - 総投資額
  - 総投資家数
  - アクティブ選手数
  - 予想総リターン

- 💰 **分配機能**
  - 賞金額の入力
  - 分配内訳のプレビュー
  - ワンクリックで自動分配
  - ブロックチェーン上で実行

---

## 🔧 技術スタック

### ブロックチェーン
- **Sui Blockchain** - レイヤー1ブロックチェーン
- **@mysten/sui** v1.45.0 - Sui TypeScript SDK
- **Move言語** - スマートコントラクト（実装予定）

### フロントエンド
- **Next.js** 16.0.3 - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UIコンポーネント

### 状態管理
- **React Context API** - グローバル状態管理
  - `AuthContext` - 認証状態
  - `WalletContext` - ウォレット状態
  - `InvestmentContext` - 投資データ
  - `ScoutContext` - スカウト提案

---

## 📦 セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local` ファイルを作成:
```env
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.devnet.sui.io:443
NEXT_PUBLIC_SUI_NETWORK=devnet
NEXT_PUBLIC_PACKAGE_ID=0x... # スマートコントラクトデプロイ後に設定
NEXT_PUBLIC_MOCK_AUTH=true
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

---

## 🎯 使用方法

### ユーザー向け

#### 1. ウォレット接続
1. ナビゲーションの「ウォレット接続」ボタンをクリック
2. 新しいウォレットが自動生成される
3. テストネットSUIを取得（Faucetメニューから）

#### 2. 投資する
1. 選手ページから「投資する」をクリック
2. 投資額を入力（100-10,000 USDsui）
3. トランザクションを承認
4. 投資持分NFTを受け取る

#### 3. スカウト提案を送信
1. `/scout` ページにアクセス
2. 「選手を推薦する」ボタンをクリック
3. 選手情報と推薦理由を入力
4. ステーク額を設定（100-1,000 USDsui）
5. 提案を送信

### 運営チーム向け

#### 1. 提案を審査 (`/admin`)
1. 審査待ち提案を確認
2. 選手情報と推薦理由を評価
3. 承認の場合：
   - 資金調達目標を設定
   - 「承認する」をクリック
   - Scout Master SBTが自動発行される
4. 却下の場合：
   - 却下理由を入力
   - 「却下する」をクリック

#### 2. 報酬を分配 (`/admin/rewards`)
1. 選手を選択
2. 賞金額を入力
3. 分配内訳を確認
4. 「リターンを分配する」をクリック
5. 投資家に自動配分される

---

## 🔐 セキュリティ

### 現在の実装（開発用）
- ローカルストレージに秘密鍵を保存
- ⚠️ 本番環境では使用しないでください

### 本番環境での推奨
1. **Suiウォレットブラウザ拡張機能との統合**
   - Sui Wallet
   - Ethos Wallet
   - Martian Wallet

2. **ZKLogin統合**
   - Google/Apple/Twitterでログイン
   - 秘密鍵を保持しないセキュアな方法

3. **マルチシグ管理**
   - 運営チームの承認機能
   - 重要なトランザクションに複数の署名を要求

---

## 🚧 今後の実装予定

### スマートコントラクト (Move言語)
```move
module fighters_rising::fighters_rising {
    // 構造体定義
    struct Fighter has key, store {}
    struct InvestmentShare has key, store {}
    struct ScoutProposal has key, store {}
    struct SoulBoundToken has key {}
    
    // 公開関数
    public fun create_fighter(...) {}
    public fun invest(...) {}
    public fun create_scout_proposal(...) {}
    public fun approve_scout_proposal(...) {}
    public fun reject_scout_proposal(...) {}
    public fun distribute_returns(...) {}
    public fun mint_scout_master_sbt(...) {}
}
```

### フロントエンド追加機能
- [ ] 選手詳細ページのリアルタイムデータ
- [ ] 投資履歴の表示
- [ ] リターン受取履歴
- [ ] SBTギャラリー
- [ ] 通知システム
- [ ] 多言語対応

### バックエンド
- [ ] GraphQL API for indexing
- [ ] イベントリスナー
- [ ] データアグリゲーション
- [ ] 分析ダッシュボード

---

## 📚 参考資料

- [Sui Documentation](https://docs.sui.io/)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [Move Programming Language](https://move-language.github.io/move/)
- [Sui Explorer](https://suiscan.xyz/)

---

## 🤝 貢献

プルリクエストを歓迎します！

---

## 📄 ライセンス

MIT License
