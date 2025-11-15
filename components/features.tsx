export default function Features() {
  const features = [
    {
      title: 'Seamless zkLogin',
      description: 'No Web3 knowledge required. Join with just your Google or X (Twitter) account, no wallet needed.',
      icon: '🔐',
    },
    {
      title: 'Investment Share NFT',
      description: 'Composable NFT recording your investment and fighter ID. Automatically distributes prize money.',
      icon: '💎',
    },
    {
      title: 'Winning Second SBT',
      description: 'Non-transferable badge recording victory moments. Proof of "I was there" ultimate ownership.',
      icon: '🏆',
    },
    {
      title: 'Transparent ISA Distribution',
      description: 'Based on Income Share Agreement, automatically distributes a portion of fighter earnings (e.g., 30%) for 5 years.',
      icon: '📊',
    },
    {
      title: 'Exclusive Documentary',
      description: 'Core media business. Investor-exclusive access to fighter training documentaries abroad.',
      icon: '🎬',
    },
    {
      title: 'Scout Rewards',
      description: 'Recommend talented fighters and earn 3% of total funding upon success. Scout Master SBT issued.',
      icon: '⭐',
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            FIGHTER'S RISING Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A new community connecting fighters, fans, and media
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
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
