import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import FightersGrid from '@/components/fighters-grid'
import Features from '@/components/features'
import CallToAction from '@/components/call-to-action'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Features />
      <FightersGrid />
      <CallToAction />
      <Footer />
    </div>
  )
}
