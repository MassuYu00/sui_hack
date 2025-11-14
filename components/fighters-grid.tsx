import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function FightersGrid() {
  const fighters = [
    {
      id: 1,
      name: 'Alex Chen',
      weight: 'Lightweight',
      record: '12-3-0',
      image: '🥊',
      goal: 50000,
      raised: 37500,
      daysLeft: 12,
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      weight: 'Featherweight',
      record: '8-1-0',
      image: '👊',
      goal: 35000,
      raised: 28000,
      daysLeft: 5,
    },
    {
      id: 3,
      name: 'James Walker',
      weight: 'Middleweight',
      record: '15-5-0',
      image: '🥋',
      goal: 60000,
      raised: 42000,
      daysLeft: 20,
    },
  ]

  return (
    <section id="fighters" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Active Fundraisers
          </h2>
          <p className="text-xl text-muted-foreground">
            Support rising fighters on their journey to championship glory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fighters.map((fighter) => {
            const progress = (fighter.raised / fighter.goal) * 100
            return (
              <Card key={fighter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                  <span className="text-6xl">{fighter.image}</span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{fighter.name}</h3>
                    <p className="text-sm text-muted-foreground">{fighter.weight}</p>
                    <p className="text-sm text-primary font-semibold mt-1">Record: {fighter.record}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Funding Progress</span>
                      <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ${fighter.raised.toLocaleString()} of ${fighter.goal.toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">{fighter.daysLeft} days left</p>
                    <Button className="w-full bg-primary hover:bg-accent text-primary-foreground">
                      Support Fighter
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
