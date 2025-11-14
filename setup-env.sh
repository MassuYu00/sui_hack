#!/bin/bash

# Fighter's Rising - Environment Setup Script
# This script helps you generate secure configuration values

echo "🔧 Fighter's Rising - Environment Setup"
echo "========================================"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists."
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborting setup."
        exit 1
    fi
fi

# Generate secure salt
echo "🔐 Generating secure user salt..."
USER_SALT=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Create .env.local
cat > .env.local << EOF
# Sui Network Configuration
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.devnet.sui.io:443
NEXT_PUBLIC_SUI_NETWORK=devnet
NEXT_PUBLIC_PROVER_URL=https://prover-dev.mystenlabs.com/v1

# ZKLogin Configuration
NEXT_PUBLIC_USER_SALT=$USER_SALT

# Google OAuth (configure at: https://console.cloud.google.com/)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Facebook OAuth (configure at: https://developers.facebook.com/)
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SESSION_EXPIRY_HOURS=24
NEXT_PUBLIC_DEBUG=true
EOF

echo "✅ Created .env.local with secure salt"
echo ""
echo "📝 Next steps:"
echo "1. Set up Google OAuth:"
echo "   - Visit: https://console.cloud.google.com/"
echo "   - Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local"
echo ""
echo "2. Set up Facebook OAuth:"
echo "   - Visit: https://developers.facebook.com/"
echo "   - Add NEXT_PUBLIC_FACEBOOK_CLIENT_ID to .env.local"
echo ""
echo "3. See ZKLOGIN_SETUP.md for detailed instructions"
echo ""
echo "Your secure user salt has been generated: ${USER_SALT:0:20}..."
echo "⚠️  Keep this salt secret and backed up!"
echo ""
echo "🚀 Run 'npm run dev' to start development"
