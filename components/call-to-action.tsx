import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-r from-primary to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
          本物のコアファンに
          <br />
          なりませんか？
        </h2>
        <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
          SNSアカウントだけで参加できる、新しい形の応援プラットフォーム。
          <br />
          選手の成長を間近で見守り、その軌跡をNFTとして永遠に記録します。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-secondary"
            asChild
          >
            <Link href="/login?action=signup">SNSで今すぐ参加</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            asChild
          >
            <Link href="/#features">詳しく見る</Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20">
          <p className="text-sm text-primary-foreground/80">
            ウォレット不要 • Sui zkLoginで実現 • 透明で安全な投資
          </p>
        </div>
      </div>
    </section>
  )
}
