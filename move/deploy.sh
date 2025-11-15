#!/bin/bash

# Fighter's Rising - Sui Blockchain デプロイスクリプト

set -e

echo "🚀 Fighter's Rising スマートコントラクトをデプロイします"
echo ""

# 色の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Sui CLIがインストールされているか確認
if ! command -v sui &> /dev/null; then
    echo -e "${RED}❌ Sui CLIがインストールされていません${NC}"
    echo "以下のコマンドでインストールしてください："
    echo "cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui"
    exit 1
fi

echo -e "${GREEN}✅ Sui CLI が見つかりました${NC}"
sui --version
echo ""

# アクティブなアドレスを表示
echo "📍 アクティブなアドレス:"
ACTIVE_ADDRESS=$(sui client active-address)
echo -e "${YELLOW}$ACTIVE_ADDRESS${NC}"
echo ""

# 残高を確認
echo "💰 SUI残高を確認中..."
sui client gas
echo ""

# ネットワークを確認
echo "🌐 接続先ネットワーク:"
sui client active-env
echo ""

# ビルド
echo "🔨 スマートコントラクトをビルド中..."
cd "$(dirname "$0")"
sui move build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ ビルド成功${NC}"
else
    echo -e "${RED}❌ ビルド失敗${NC}"
    exit 1
fi
echo ""

# テスト
echo "🧪 テストを実行中..."
sui move test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ テスト成功${NC}"
else
    echo -e "${YELLOW}⚠️  テストに失敗しましたが、デプロイは続行できます${NC}"
fi
echo ""

# デプロイ確認
echo -e "${YELLOW}⚠️  これからTestnetにデプロイします${NC}"
echo "デプロイには約0.5 SUIのガス代がかかります"
read -p "続行しますか？ (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "デプロイをキャンセルしました"
    exit 0
fi

# デプロイ
echo ""
echo "🚢 Testnetへデプロイ中..."
DEPLOY_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ デプロイ成功！${NC}"
    echo ""
    
    # Package IDを抽出
    PACKAGE_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.type == "published") | .packageId')
    
    # AdminCap Object IDを抽出
    ADMIN_CAP_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.objectType | contains("AdminCap")) | .objectId')
    
    # Platform Object IDを抽出
    PLATFORM_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.objectType | contains("Platform")) | .objectId')
    
    echo "📦 デプロイ情報:"
    echo -e "${GREEN}Package ID:${NC} $PACKAGE_ID"
    echo -e "${GREEN}AdminCap ID:${NC} $ADMIN_CAP_ID"
    echo -e "${GREEN}Platform ID:${NC} $PLATFORM_ID"
    echo ""
    
    # .env.localファイルを作成/更新
    ENV_FILE="../.env.local"
    
    if [ -f "$ENV_FILE" ]; then
        # 既存のファイルから古いIDを削除
        sed -i.bak '/NEXT_PUBLIC_PACKAGE_ID=/d' "$ENV_FILE"
        sed -i.bak '/NEXT_PUBLIC_ADMIN_CAP_ID=/d' "$ENV_FILE"
        sed -i.bak '/NEXT_PUBLIC_PLATFORM_ID=/d' "$ENV_FILE"
        rm "${ENV_FILE}.bak"
    fi
    
    # 新しいIDを追加
    echo "" >> "$ENV_FILE"
    echo "# Sui Blockchain デプロイ情報" >> "$ENV_FILE"
    echo "NEXT_PUBLIC_PACKAGE_ID=$PACKAGE_ID" >> "$ENV_FILE"
    echo "NEXT_PUBLIC_ADMIN_CAP_ID=$ADMIN_CAP_ID" >> "$ENV_FILE"
    echo "NEXT_PUBLIC_PLATFORM_ID=$PLATFORM_ID" >> "$ENV_FILE"
    
    echo -e "${GREEN}✅ .env.local に環境変数を保存しました${NC}"
    echo ""
    
    # Sui Explorerのリンクを表示
    echo "🔍 Sui Explorer で確認:"
    echo "https://suiscan.xyz/testnet/object/$PACKAGE_ID"
    echo ""
    
    # 次のステップを表示
    echo "📋 次のステップ:"
    echo "1. 開発サーバーを再起動してください: npm run dev"
    echo "2. フロントエンドからブロックチェーンに接続できます"
    echo "3. /admin ページで提案を承認/却下できます"
    echo ""
    
else
    echo -e "${RED}❌ デプロイ失敗${NC}"
    echo "ガス不足の可能性があります。Faucetから SUI を取得してください:"
    echo "sui client faucet"
    exit 1
fi
