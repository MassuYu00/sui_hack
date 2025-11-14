export default function Features() {
  const features = [
    {
      title: 'zkLogin Integration',
      description: 'Sign in with Google or X. No wallet creation needed. Web3 is seamless.',
      icon: '🔐',
    },
    {
      title: 'Dual Returns',
      description: 'Earn financial returns from athlete ISA contracts + exclusive NFT badges.',
      icon: '💰',
    },
    {
      title: 'Transparent Investment',
      description: 'All contracts on Sui blockchain. Real-time funding tracking and fighter stats.',
      icon: '📊',
    },
    {
      title: 'Community Governance',
      description: 'Vote on fighter selection, events, and platform decisions with your NFT.',
      icon: '🗳️',
    },
    {
      title: 'Exclusive Content',
      description: 'Access behind-the-scenes documentaries and training footage.',
      icon: '🎬',
    },
    {
      title: 'Scout Rewards',
      description: 'Discover athletes before the platform. Earn Scout SBT for recommendations.',
      icon: '⭐',
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why FIGHTER'S RISING
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The first platform that makes athlete investment accessible, transparent, and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
