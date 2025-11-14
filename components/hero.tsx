import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-white to-blue-50 py-20 sm:py-32">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-primary font-semibold text-sm">Powered by Sui Blockchain</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Transform Your Passion Into <span className="text-primary">Investment Returns</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Support rising athletes with your belief. Earn financial returns and exclusive NFTs. Web3 with zero complexity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground" asChild>
                <Link href="/login?action=signup">Start Supporting Athletes</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#fighters">Explore Fighters</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">$2.5M</div>
                <div className="text-sm text-muted-foreground">Total Invested</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">150+</div>
                <div className="text-sm text-muted-foreground">Active Fighters</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">12K</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center border border-primary/10">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <span className="text-4xl">🥊</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Featured Fighter</p>
                  <h3 className="text-2xl font-bold text-foreground">Champion Series</h3>
                  <p className="text-primary font-semibold mt-2">$50,000 Funding Goal</p>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground">75% Funded • 48h Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
