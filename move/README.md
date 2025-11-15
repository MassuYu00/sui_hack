# Fighter's Rising - Sui Move スマートコントラクト

## 📦 概要

Fighter's Risingプラットフォームのコアロジックを実装したMoveスマートコントラクトです。

## 🏗️ アーキテクチャ

### 主要な構造体

1. **Platform** - プラットフォーム全体の統計と設定
2. **Fighter** - 選手オブジェクト（資金調達、ステータス管理）
3. **InvestmentShare** - 応援持分NFT（譲渡可能）
4. **ScoutProposal** - スカウト提案（審査待ち、承認/却下）
5. **SoulBoundToken** - SBT（譲渡不可、実績証明）
6. **InvestorRegistry** - 投資家レジストリ（選手ごと）

### 主要な機能

#### ユーザー向け
- `submit_scout_proposal` - スカウト提案の送信
- `invest_in_fighter` - 選手への応援（投資）

#### 管理者向け
- `approve_scout_proposal` - 提案承認＋選手作成＋SBT発行
- `reject_scout_proposal` - 提案却下
- `distribute_returns` - リターンの分配
- `mint_winning_second_sbt` - Winning Second SBTの発行

## 🚀 セットアップ

### 前提条件

```bash
# Sui CLIのインストール
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# バージョン確認
sui --version
```

### ウォレット設定

```bash
# 新しいウォレットを作成
sui client new-address ed25519

# アクティブなアドレスを確認
sui client active-address

# テストネットに切り替え
sui client switch --env testnet

# Faucetからテスト用SUIを取得
sui client faucet
```

## 📝 ビルドとテスト

### ビルド

```bash
cd move
sui move build
```

### テスト

```bash
sui move test
```

### 依存関係の確認

```bash
sui move build --dump-bytecode-as-base64
```

## 🚢 デプロイ

### Testnetへのデプロイ

```bash
cd move
sui client publish --gas-budget 100000000
```

デプロイ成功後、以下の情報を記録してください：

1. **Package ID** - デプロイされたパッケージのID
2. **AdminCap Object ID** - 管理者権限オブジェクトのID
3. **Platform Object ID** - プラットフォーム共有オブジェクトのID

### 環境変数の設定

`.env.local` に以下を追加：

```env
NEXT_PUBLIC_PACKAGE_ID=0x... # デプロイしたPackage ID
NEXT_PUBLIC_ADMIN_CAP_ID=0x... # AdminCap Object ID
NEXT_PUBLIC_PLATFORM_ID=0x... # Platform Object ID
```

## 📖 使用例

### 1. スカウト提案を送信

```bash
sui client call \
  --package $PACKAGE_ID \
  --module fighters_rising \
  --function submit_scout_proposal \
  --args \
    "Scout Name" \
    "Fighter Name" \
    "選手名" \
    "Japan" \
    "Featherweight" \
    "10-2-0" \
    "This fighter has great potential..." \
    "https://youtube.com/..." \
    $STAKE_COIN_ID \
    $CLOCK_ID \
  --gas-budget 10000000
```

### 2. 提案を承認（管理者のみ）

```bash
sui client call \
  --package $PACKAGE_ID \
  --module fighters_rising \
  --function approve_scout_proposal \
  --args \
    $ADMIN_CAP_ID \
    $PLATFORM_ID \
    $PROPOSAL_ID \
    1000000000000 \
    "Fighter biography..." \
    "https://example.com/image.jpg" \
    $CLOCK_ID \
  --gas-budget 10000000
```

### 3. 選手に投資

```bash
sui client call \
  --package $PACKAGE_ID \
  --module fighters_rising \
  --function invest_in_fighter \
  --args \
    $PLATFORM_ID \
    $FIGHTER_ID \
    $REGISTRY_ID \
    $PAYMENT_COIN_ID \
    $CLOCK_ID \
  --gas-budget 10000000
```

### 4. リターンを分配（管理者のみ）

```bash
sui client call \
  --package $PACKAGE_ID \
  --module fighters_rising \
  --function distribute_returns \
  --args \
    $ADMIN_CAP_ID \
    $PLATFORM_ID \
    $FIGHTER_ID \
    $REGISTRY_ID \
    $PAYMENT_COIN_ID \
  --gas-budget 10000000
```

## 🔍 オブジェクトの確認

### 自分が所有するオブジェクトを表示

```bash
sui client objects
```

### 特定のオブジェクトの詳細を表示

```bash
sui client object $OBJECT_ID
```

### イベントを確認

```bash
sui client events --package $PACKAGE_ID
```

## 🧪 テストシナリオ

### シナリオ1: スカウト提案から選手作成まで

1. ユーザーAがスカウト提案を送信（100 SUIをステーク）
2. 管理者が提案を承認し、資金調達目標を10,000 SUIに設定
3. ユーザーAにScout Master SBTが発行される
4. ステークの100 SUIが返却される
5. 選手ページが作成される

### シナリオ2: 投資とリターン分配

1. ユーザーB、C、Dが選手に投資（各1,000 SUI）
2. 資金調達目標（10,000 SUI）が達成
3. 選手が試合で10,000 SUIの賞金を獲得
4. 管理者がリターンを分配：
   - プラットフォーム手数料: 500 SUI (5%)
   - 選手の取り分: 1,500 SUI (15%)
   - 投資家への分配: 8,000 SUI (80%)
5. 各投資家に持分に応じて分配される

## 📊 定数とパラメータ

```move
MINIMUM_INVESTMENT: 100 SUI
MAXIMUM_INVESTMENT: 10,000 SUI
MINIMUM_STAKE: 100 SUI
SCOUT_REWARD_PERCENTAGE: 3%
PLATFORM_FEE_PERCENTAGE: 5%
FIGHTER_SHARE_PERCENTAGE: 15%
INVESTOR_SHARE_PERCENTAGE: 80%
```

## 🔐 セキュリティ

### アクセス制御

- **AdminCap** - 管理者専用機能へのアクセス権限
  - 提案の承認/却下
  - リターンの分配
  - Winning Second SBTの発行

### バリデーション

- 最低/最高投資額のチェック
- 資金調達ステータスの確認
- 重複処理の防止

### イベント

すべての重要なアクションはイベントとして発行され、透明性を確保します。

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# 依存関係を更新
sui move build --force

# キャッシュをクリア
rm -rf build/
```

### ガス不足エラー

```bash
# より多くのガスを指定
--gas-budget 100000000
```

### オブジェクトが見つからない

```bash
# オブジェクトの存在を確認
sui client object $OBJECT_ID

# 最新のオブジェクトリストを取得
sui client objects --refresh
```

## 📚 参考資料

- [Sui Move Book](https://move-book.com/)
- [Sui Documentation](https://docs.sui.io/)
- [Move Language Tutorial](https://github.com/move-language/move/tree/main/language/documentation/tutorial)
- [Sui Examples](https://github.com/MystenLabs/sui/tree/main/examples)

## 🤝 貢献

プルリクエストを歓迎します！

## 📄 ライセンス

MIT License
