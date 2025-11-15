import { FighterCard } from '@/components/fighter-card'
import { mockFighters } from '@/lib/mock-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function FightersGrid() {
  const fundraisingFighters = mockFighters.filter(f => f.currentStatus === 'fundraising')
  const trainingFighters = mockFighters.filter(f => f.currentStatus === 'training')
  const activeFighters = mockFighters.filter(f => f.currentStatus === 'active')

  return (
    <section id="fighters" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Fighters Chasing Dreams
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Support talented fighters held back by lack of funding or connections.<br/>
            Your support can change their lives.
          </p>
        </div>

        <Tabs defaultValue="fundraising" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="fundraising">
              Fundraising ({fundraisingFighters.length})
            </TabsTrigger>
            <TabsTrigger value="training">
              In Training ({trainingFighters.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeFighters.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fundraising" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundraisingFighters.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </div>
            {fundraisingFighters.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No fighters currently fundraising
              </p>
            )}
          </TabsContent>

          <TabsContent value="training" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingFighters.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </div>
            {trainingFighters.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No fighters currently in training
              </p>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeFighters.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </div>
            {activeFighters.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No active fighters currently
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
