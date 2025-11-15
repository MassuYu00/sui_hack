# 🚀 Sui Blockchain統合 - クイックスタート

Sui Blockchainとの統合を**最短で**開始するためのガイドです。

## ⚡ 5分でデプロイ

### Step 1: Sui CLIをインストール

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

⏱️ **所要時間**: 10-15分（初回のみ）

### Step 2: ウォレットを作成してSUIを取得

```bash
# ウォレット作成
sui client new-address ed25519

# Testnetに切り替え
sui client switch --env testnet

# テスト用SUIを取得
sui client faucet
```

⏱️ **所要時間**: 1分

**重要**: 表示される**ニーモニックフレーズ（12単語）**をメモしてください！

### Step 3: デプロイ

```bash
cd /Users/masuyamayuusuke/Desktop/Sui_Hack/sui_hack/move
./deploy.sh
```

⏱️ **所要時間**: 2-3分

スクリプトが自動的に：
- ✅ ビルド
- ✅ テスト
- ✅ デプロイ
- ✅ 環境変数の設定

を実行します。

### Step 4: 開発サーバーを再起動

```bash
cd ..
npm run dev
```

⏱️ **所要時間**: 10秒

---

## ✅ 完了！

これでSui Blockchainに接続されました！

### 次にできること：

1. **スカウト提案を送信** (`/scout`)
   - ブロックチェーンに提案オブジェクトが作成されます
   
2. **提案を承認** (`/admin`)
   - 選手オブジェクトが作成されます
   - Scout Master SBTが発行されます
   
3. **選手に応援** (選手ページ)
   - 応援持分NFTが発行されます
   - 持分がブロックチェーンに記録されます

### 確認方法：

Sui Explorerでトランザクションを確認：
```
https://suiscan.xyz/testnet/object/{PACKAGE_ID}
```

Package IDは `.env.local` に保存されています。

---

## 🐛 問題が発生した場合

### ❌ Sui CLIがない

```bash
# Rustがインストールされているか確認
rustc --version

# なければRustをインストール
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### ❌ ガス不足

```bash
# 追加のSUIを取得
sui client faucet
```

### ❌ デプロイ失敗

```bash
# キャッシュをクリアして再試行
cd move
rm -rf build/
./deploy.sh
```

---

## 📚 詳細ドキュメント

より詳しい情報は [BLOCKCHAIN_SETUP.md](./BLOCKCHAIN_SETUP.md) を参照してください。

---

Happy Building! 🎉
