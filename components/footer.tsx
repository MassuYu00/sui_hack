import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#" className="hover:opacity-100 transition">Browse Fighters</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">How It Works</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#" className="hover:opacity-100 transition">Discord</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Twitter</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#" className="hover:opacity-100 transition">About</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Careers</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#" className="hover:opacity-100 transition">Terms</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Privacy</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p>&copy; 2025 FIGHTER'S RISING DAO. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Powered by <span className="font-bold text-primary">Sui Blockchain</span></p>
          </div>
        </div>
      </div>
    </footer>
  )
}
