import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { InvestmentProvider } from '@/lib/investment-context'
import { ScoutProvider } from '@/lib/scout-context'
import { WalletProvider } from '@/lib/wallet-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'FIGHTER\'S RISING - Athlete Investment DAO',
  description: 'Fan-backed athlete investment platform powered by Sui blockchain. Support rising fighters, earn returns, and build community.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <WalletProvider>
            <InvestmentProvider>
              <ScoutProvider>
                {children}
              </ScoutProvider>
            </InvestmentProvider>
          </WalletProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
