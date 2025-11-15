# 🚀 Sui Blockchain統合 - セットアップガイド

このガイドでは、Fighter's RisingプラットフォームをSui Blockchainと統合する手順を説明します。

## 📋 目次

1. [前提条件](#前提条件)
2. [Sui CLIのインストール](#sui-cliのインストール)
3. [ウォレットのセットアップ](#ウォレットのセットアップ)
4. [スマートコントラクトのデプロイ](#スマートコントラクトのデプロイ)
5. [フロントエンドの設定](#フロントエンドの設定)
6. [動作確認](#動作確認)
7. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

以下がインストールされている必要があります：

- **Rust** (1.70.0以上)
- **Node.js** (18.0.0以上)
- **Git**

### Rustのインストール

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version
```

---

## Sui CLIのインストール

### 方法1: Cargoからインストール（推奨）

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

インストールには10-20分かかる場合があります。

### 方法2: プリビルドバイナリ

```bash
# macOS (Apple Silicon)
brew install sui

# Linux
# https://docs.sui.io/guides/developer/getting-started/sui-install
# からダウンロード
```

### インストール確認

```bash
sui --version
# 出力例: sui 1.15.0-homebrew
```

---

## ウォレットのセットアップ

### 1. 新しいウォレットを作成

```bash
sui client new-address ed25519
```

**重要**: 表示される**ニーモニックフレーズ（12単語）**を安全に保管してください！

### 2. testnetに切り替え

```bash
sui client switch --env testnet
```

### 3. アクティブなアドレスを確認

```bash
sui client active-address
```

出力例:
```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### 4. テスト用SUIを取得

```bash
sui client faucet
```

成功すると、約1 SUIが送金されます。

### 5. 残高を確認

```bash
sui client gas
```

---

## スマートコントラクトのデプロイ

### 1. プロジェクトルートに移動

```bash
cd /Users/masuyamayuusuke/Desktop/Sui_Hack/sui_hack
```

### 2. デプロイスクリプトを実行

```bash
cd move
./deploy.sh
```

スクリプトは以下を自動的に実行します：
- ビルド
- テスト
- Testnetへのデプロイ
- 環境変数の設定

### 3. デプロイ情報の確認

デプロイが成功すると、以下の情報が表示されます：

```
📦 デプロイ情報:
Package ID: 0xabcd1234...
AdminCap ID: 0xefgh5678...
Platform ID: 0xijkl9012...
```

これらの値は自動的に `.env.local` に保存されます。

### 手動デプロイ（オプション）

自動スクリプトを使わない場合：

```bash
cd move

# ビルド
sui move build

# テスト
sui move test

# デプロイ
sui client publish --gas-budget 100000000
```

---

## フロントエンドの設定

### 1. 環境変数を確認

`.env.local` ファイルが以下の内容を含んでいることを確認：

```env
# Sui RPC URL
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEXT_PUBLIC_SUI_NETWORK=testnet

# デプロイ情報（deploy.shで自動設定）
NEXT_PUBLIC_PACKAGE_ID=0x...
NEXT_PUBLIC_ADMIN_CAP_ID=0x...
NEXT_PUBLIC_PLATFORM_ID=0x...

# 認証設定
NEXT_PUBLIC_MOCK_AUTH=true
```

### 2. 開発サーバーを再起動

```bash
npm run dev
```

---

## 動作確認

### 1. ウォレット接続

1. ブラウザで http://localhost:3000 を開く
2. ログイン（Mock認証）
3. ダッシュボードに移動

### 2. スカウト提案を送信

1. `/scout` ページにアクセス
2. 「選手を推薦する」ボタンをクリック
3. フォームに入力：
   - 選手名: Takeshi Yamada / 山田剛
   - 国籍: Japan
   - 階級: Featherweight
   - 戦績: 10-2-0
   - 推薦理由: 100文字以上
   - ステーク額: 100-1000 SUI
4. 「推薦を送信」をクリック

**ブロックチェーンで実行される内容:**
- スカウト提案オブジェクトが作成される
- ステーク額がロックされる
- イベントが発行される

### 3. 提案を承認（管理者）

1. `/admin` ページにアクセス
2. 審査待ち提案を確認
3. 「承認する」をクリック
4. 資金調達目標を設定（例: 10,000 SUI）
5. 承認を実行

**ブロックチェーンで実行される内容:**
- 選手オブジェクトが作成される
- Scout Master SBTが発行される
- ステークが返却される
- 投資家レジストリが作成される

### 4. 選手に応援（投資）

1. 選手ページにアクセス
2. 「応援する」ボタンをクリック
3. 応援額を入力（100-10,000 SUI）
4. トランザクションを実行

**ブロックチェーンで実行される内容:**
- 応援額が選手の財務に追加される
- 応援持分NFTが発行される
- 持分パーセンテージが計算される

### 5. Sui Explorerで確認

デプロイしたコントラクトをSui Explorerで確認できます：

```
https://suiscan.xyz/testnet/object/{PACKAGE_ID}
```

---

## トラブルシューティング

### ❌ Sui CLIがインストールできない

**問題**: `cargo install` でエラーが発生

**解決策**:
```bash
# Rustを最新版に更新
rustup update

# 再試行
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

### ❌ ガス不足エラー

**問題**: `InsufficientGas` エラー

**解決策**:
```bash
# Faucetから追加のSUIを取得
sui client faucet

# 残高を確認
sui client gas
```

1日に複数回Faucetから取得できます。

### ❌ デプロイが失敗する

**問題**: `sui client publish` でエラー

**解決策**:
```bash
# ビルドキャッシュをクリア
cd move
rm -rf build/

# 再ビルド
sui move build

# より多くのガスを指定
sui client publish --gas-budget 200000000
```

### ❌ Object not found エラー

**問題**: トランザクション実行時にオブジェクトが見つからない

**解決策**:
```bash
# オブジェクトの存在を確認
sui client object {OBJECT_ID}

# 自分が所有するオブジェクトを一覧表示
sui client objects
```

### ❌ フロントエンドで接続できない

**問題**: ブロックチェーンに接続できない

**チェックリスト**:
1. `.env.local` にPACKAGE_IDが設定されているか
2. 開発サーバーを再起動したか
3. RPC URLが正しいか（testnet）

**解決策**:
```bash
# .env.local を確認
cat .env.local

# 開発サーバーを再起動
npm run dev
```

---

## 📊 コスト見積もり

Testnetでの大まかなガス代：

| 操作 | ガス代 |
|------|--------|
| コントラクトデプロイ | ~0.5 SUI |
| スカウト提案送信 | ~0.01 SUI |
| 提案承認 | ~0.03 SUI |
| 応援（投資） | ~0.02 SUI |
| リターン分配 | ~0.03 SUI |

**注意**: これらは目安です。実際のガス代はトランザクションの複雑さによって変動します。

---

## 🔍 便利なコマンド

### オブジェクトを確認

```bash
# 自分が所有するすべてのオブジェクト
sui client objects

# 特定のオブジェクトの詳細
sui client object {OBJECT_ID}

# 特定のタイプのオブジェクトのみ
sui client objects --filter type={TYPE}
```

### トランザクション履歴

```bash
# 最近のトランザクション
sui client tx-history

# 特定のトランザクションの詳細
sui client tx {TX_DIGEST}
```

### イベントを確認

```bash
# パッケージの全イベント
sui client events --package {PACKAGE_ID}

# 特定のイベントタイプ
sui client events --type {EVENT_TYPE}
```

---

## 📚 次のステップ

1. **Mainnetへの移行準備**
   - セキュリティ監査
   - ガス最適化
   - エラーハンドリングの強化

2. **追加機能の実装**
   - バッチ処理
   - 自動リバランシング
   - ガバナンス機能

3. **モニタリングとアラート**
   - イベント監視
   - エラー通知
   - パフォーマンス分析

---

## 🆘 サポート

問題が解決しない場合：

1. **Sui Discord**: https://discord.gg/sui
2. **Sui Forum**: https://forums.sui.io/
3. **GitHub Issues**: このリポジトリのIssuesセクション

---

## 📖 参考資料

- [Sui Documentation](https://docs.sui.io/)
- [Move Book](https://move-book.com/)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [Sui Examples](https://github.com/MystenLabs/sui/tree/main/examples)

---

Happy Building! 🚀
