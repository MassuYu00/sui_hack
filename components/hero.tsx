import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-background via-white to-blue-50 py-20 sm:py-32">
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
                      <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          格闘技選手の<span className="text-primary">夢を応援</span>しよう
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl">
          才能ある選手を応援し、共に成長を見守る。メディア、ファン、選手が一体となる新しいコミュニティへようこそ。
        </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground" asChild>
                <Link href="/login?action=signup">選手を応援する</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#fighters">選手を見る</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">$2.5M</div>
                <div className="text-sm text-muted-foreground">支援総額</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">150+</div>
                <div className="text-sm text-muted-foreground">応援中の選手</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">12K</div>
                <div className="text-sm text-muted-foreground">コミュニティメンバー</div>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="aspect-square bg-linear-to-br from-primary/20 to-accent/10 rounded-2xl overflow-hidden border border-primary/10">
              <div className="relative w-full h-full">
                <Image
                  src="/Gemini_Generated_Image_xic5itxic5itxic5.png"
                  alt="注目の選手"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center space-y-4">
                  <div className="bg-black/70 backdrop-blur-md rounded-lg p-4">
                    <p className="text-sm text-white mb-2 font-medium">注目の選手</p>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">チャンピオンシリーズ</h3>
                    <p className="text-red-500 font-bold mt-2 text-lg drop-shadow-lg">目標支援金 $50,000</p>
                  </div>
                  <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
                    <div className="h-full w-3/4 bg-red-500 rounded-full shadow-lg" />
                  </div>
                  <p className="text-sm text-white font-semibold drop-shadow-lg bg-black/60 backdrop-blur-sm rounded-full py-2 px-4 inline-block">75%達成 ・ 残り48時間</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
