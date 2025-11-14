import LandingNavigation from '@/components/landing-navigation'
import Hero from '@/components/hero'
import FightersGrid from '@/components/fighters-grid'
import DocumentarySection from '@/components/documentary-section'
import Features from '@/components/features'
import CallToAction from '@/components/call-to-action'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavigation />
      <Hero />
      <Features />
      <FightersGrid />
      <DocumentarySection />
      <CallToAction />
      <Footer />
    </div>
  )
}
