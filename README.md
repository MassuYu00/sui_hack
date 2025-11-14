# FIGHTER'S RISING - Athlete Investment DAO

Fan-backed athlete investment platform powered by Sui blockchain. Support rising fighters, earn returns, and build community.

## 🚀 Features

- **ZKLogin Authentication**: Seamless login with Google/Facebook using Sui's ZKLogin technology
- **Zero Gas Fees**: Gasless transactions for users through sponsored transactions
- **Athlete Investment**: Discover and invest in promising fighters
- **Portfolio Management**: Track your investments and returns
- **NFT Rewards**: Exclusive NFTs for investors and supporters
- **Real-time Updates**: Live funding progress and fighter statistics

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Blockchain**: Sui Network
- **Authentication**: ZKLogin (OAuth + Zero-Knowledge Proofs)
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials (for Google login)
- Facebook App credentials (for Facebook login)
- Sui wallet (for blockchain interactions)

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/MassuYu00/sui_hack.git
cd sui_hack
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with OAuth credentials:

```bash
# See ZKLOGIN_SETUP.md for detailed instructions
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your-facebook-app-id
NEXT_PUBLIC_USER_SALT=your-secure-random-salt
```

See [ZKLOGIN_SETUP.md](./ZKLOGIN_SETUP.md) for complete setup instructions.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 ZKLogin Setup

For detailed instructions on setting up Google and Facebook OAuth for ZKLogin, see:

**[ZKLOGIN_SETUP.md](./ZKLOGIN_SETUP.md)**

This guide covers:
- Google Cloud Platform setup
- Facebook Developer setup
- OAuth credential configuration
- Sui network configuration
- Troubleshooting common issues

## 📁 Project Structure

```
sui_hack/
├── app/                      # Next.js app directory
│   ├── auth/
│   │   └── callback/        # OAuth callback handler
│   ├── dashboard/           # User dashboard
│   ├── fighter/[name]/      # Fighter profile pages
│   ├── invest/              # Investment marketplace
│   ├── login/               # Login page
│   └── wallet/              # Wallet management
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── ...                  # Feature components
├── lib/                     # Utility libraries
│   ├── zklogin.ts          # ZKLogin integration
│   ├── session-manager.ts  # Session management
│   └── auth-context.tsx    # Authentication context
├── public/                  # Static assets
└── ...
```

## 🔑 Key Features

### ZKLogin Authentication

- **Seamless OAuth**: Login with Google or Facebook
- **Zero-Knowledge Proofs**: Privacy-preserving authentication
- **Sui Address Generation**: Automatic wallet creation
- **Session Management**: Secure 24-hour sessions with auto-refresh

### Session Management

- **Encrypted Storage**: Secure session data storage
- **Auto-Refresh**: Sessions auto-refresh within 2 hours of expiry
- **Event Listeners**: React to session changes in real-time
- **CSRF Protection**: State parameter verification

### Investment Platform

- **Fighter Discovery**: Browse and search athletes
- **Advanced Filtering**: Filter by sport, rating, funding
- **Investment Tracking**: Monitor your portfolio performance
- **Real-time Stats**: Live funding progress and statistics

## 🔒 Security Features

- ✅ ZKLogin for privacy-preserving authentication
- ✅ CSRF protection with state parameters
- ✅ Session expiry and auto-refresh
- ✅ Secure storage with encryption
- ✅ Environment variable management
- ✅ OAuth 2.0 best practices

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Sui Documentation](https://docs.sui.io/)
- [ZKLogin Guide](https://docs.sui.io/concepts/cryptography/zklogin)
- [shadcn/ui](https://ui.shadcn.com/)

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables in Vercel dashboard
4. Update OAuth redirect URIs to your production domain
5. Deploy!

Remember to:
- Switch to Sui mainnet for production
- Use production OAuth credentials
- Update all redirect URIs to production URLs
- Enable proper security headers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Sui Foundation](https://sui.io/) for blockchain infrastructure
- [Vercel](https://vercel.com/) for hosting
- [shadcn/ui](https://ui.shadcn.com/) for UI components

---

Built with ❤️ for the Sui Hackathon
