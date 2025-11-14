# 🚀 Quick Start Guide

Get Fighter's Rising running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Git installed
- A code editor (VS Code recommended)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MassuYu00/sui_hack.git
cd sui_hack
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Environment

**Option A: Quick Start with Mock Mode** ⚡ (Recommended for testing)

```bash
# Copy the environment template
cp .env.local .env.local

# Mock mode is already enabled by default!
# Just run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start testing!

**Option B: Full OAuth Setup** 🔐 (For production)

```bash
# Run the setup script
chmod +x setup-env.sh
./setup-env.sh

# Follow the prompts to configure OAuth
# See ZKLOGIN_SETUP.md for detailed instructions
```

## Usage

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Test the Application (Mock Mode)

1. Go to `/login`
2. Click **Google** or **Facebook** button
3. You'll be logged in instantly with mock credentials
4. Explore the dashboard, investment pages, and wallet

### Build for Production

```bash
npm run build
npm start
```

## What's Included

✅ **Complete Authentication System**
- ZKLogin integration with Sui blockchain
- OAuth 2.0 flow (Google & Facebook)
- Mock mode for instant testing

✅ **Fighter Investment Platform**
- Browse and discover athletes
- Investment tracking
- Portfolio management

✅ **Secure Session Management**
- 24-hour session validity
- Auto-refresh mechanism
- Encrypted storage

✅ **Modern UI**
- Responsive design
- Dark mode support
- Beautiful components (shadcn/ui)

## Project Structure

```
sui_hack/
├── app/                  # Next.js pages
│   ├── login/           # Authentication
│   ├── dashboard/       # User dashboard
│   ├── invest/          # Investment marketplace
│   └── wallet/          # Wallet management
├── components/          # React components
├── lib/                 # Core functionality
│   ├── zklogin.ts      # ZKLogin integration
│   ├── session-manager.ts # Session handling
│   └── auth-context.tsx # Auth state
└── ...
```

## Features

### Mock Authentication Mode

Perfect for development and testing:
- No OAuth setup required
- Instant login
- Full feature access
- Easy to toggle on/off

Set in `.env.local`:
```bash
NEXT_PUBLIC_MOCK_AUTH=true  # Enable mock mode
NEXT_PUBLIC_MOCK_AUTH=false # Use real OAuth
```

### ZKLogin Authentication

Production-ready security:
- Zero-knowledge proofs
- Privacy-preserving
- Gasless transactions
- Sui blockchain integration

## Common Tasks

### Change Network (Devnet/Mainnet)

Edit `.env.local`:
```bash
# For Devnet (testing)
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.devnet.sui.io:443
NEXT_PUBLIC_SUI_NETWORK=devnet

# For Mainnet (production)
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
NEXT_PUBLIC_SUI_NETWORK=mainnet
```

### Enable Debug Mode

```bash
NEXT_PUBLIC_DEBUG=true
```

### Check Build Status

```bash
npm run build
```

## Troubleshooting

### Port 3000 already in use

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Dependencies installation fails

```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Environment variables not loading

```bash
# Restart the dev server
# Make sure .env.local exists in the project root
# Check file format (no quotes needed)
```

## Next Steps

1. **For Development**
   - Read [DEVELOPMENT.md](./DEVELOPMENT.md)
   - Explore the codebase
   - Try modifying components

2. **For Production**
   - Set up OAuth credentials ([ZKLOGIN_SETUP.md](./ZKLOGIN_SETUP.md))
   - Configure mainnet
   - Deploy to Vercel

3. **Learn More**
   - [Sui Documentation](https://docs.sui.io/)
   - [ZKLogin Guide](https://docs.sui.io/concepts/cryptography/zklogin)
   - [Next.js Docs](https://nextjs.org/docs)

## Support

- **Issues**: [GitHub Issues](https://github.com/MassuYu00/sui_hack/issues)
- **Documentation**: See [README.md](./README.md)
- **Development Guide**: See [DEVELOPMENT.md](./DEVELOPMENT.md)

## License

MIT License - feel free to use this project for learning or your own applications!

---

**Ready to build? 🚀**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start exploring!
