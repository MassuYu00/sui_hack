import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-r from-primary to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
          Become a True
          <br />
          Core Fan
        </h2>
        <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
          A new support platform accessible with just your SNS account.
          <br />
          Witness fighter growth up close and record their journey as NFTs forever.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-secondary"
            asChild
          >
            <Link href="/login?action=signup">Join Now with SNS</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            asChild
          >
            <Link href="/#features">Learn More</Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20">
          <p className="text-sm text-primary-foreground/80">
            No Wallet Required • Powered by Sui zkLogin • Transparent & Safe Investment
          </p>
        </div>
      </div>
    </section>
  )
}
