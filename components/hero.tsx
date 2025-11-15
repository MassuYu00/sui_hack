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
                <span className="text-primary font-semibold text-sm">Powered by ONE×Sui</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Transform Combat Sports<br />
                with <span className="text-primary">Web3</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl">
                The future of fighters starts here.
              </p>
              
              {/* Value Proposition */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700"><strong>Investment Share NFT:</strong> Auto-distributed prize money</p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700"><strong>Winning Second SBT:</strong> Badge of victory moments</p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700"><strong>Exclusive Documentary:</strong> Watch their training journey</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground" asChild>
                <Link href="/login?action=signup">Join Now with SNS</Link>
              </Button>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="aspect-square bg-linear-to-br from-primary/20 to-accent/10 rounded-2xl overflow-hidden border border-primary/10">
              <div className="relative w-full h-full">
                <Image
                  src="/Gemini_Generated_Image_xic5itxic5itxic5.png"
                  alt="Featured Fighter"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center space-y-4">
                  <div className="bg-black/70 backdrop-blur-md rounded-lg p-4">
                    <p className="text-sm text-white mb-2 font-medium">Featured Investment</p>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">UFC Challenger</h3>
                    <p className="text-red-500 font-bold mt-2 text-lg drop-shadow-lg">Goal: $50,000 USDsui</p>
                  </div>
                  <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
                    <div className="h-full w-3/4 bg-red-500 rounded-full shadow-lg" />
                  </div>
                  <p className="text-sm text-white font-semibold drop-shadow-lg bg-black/60 backdrop-blur-sm rounded-full py-2 px-4 inline-block">75% Funded • 48h Left</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
