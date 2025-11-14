export default function Features() {
  const features = [
    {
      title: 'zkLoginでシームレス参加',
      description: 'Web3の知識不要。GoogleやX(Twitter)アカウントだけで、ウォレット作成なしにDAOに参加できます。',
      icon: '🔐',
    },
    {
      title: '投資持分NFT',
      description: '投資額と選手IDが記録されたComposable NFT。賞金の一部を自動分配する「権利証」そのもの。',
      icon: '💎',
    },
    {
      title: 'Winning Second SBT',
      description: '支援選手が勝利した瞬間を記録する譲渡不可能なバッジ。「俺が育てた」という究極の当事者意識の証明。',
      icon: '🏆',
    },
    {
      title: 'ISA契約による透明な分配',
      description: '所得分配契約（ISA）に基づき、選手の賞金の一部（例: 30%）を5年間、投資家に自動分配。',
      icon: '📊',
    },
    {
      title: '限定ドキュメンタリー',
      description: 'メディア企業としての本命ビジネス。投資家限定で、選手の海外修行ドキュメンタリーを視聴可能。',
      icon: '🎬',
    },
    {
      title: 'スカウト報酬',
      description: '才能ある選手を推薦し、資金調達成功時に総額の3%を報酬として受領。Scout Master SBTも発行。',
      icon: '⭐',
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            FIGHTER'S RISING の特徴
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            選手・ファン・メディア繋ぐ、新しいコミュニティ
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
