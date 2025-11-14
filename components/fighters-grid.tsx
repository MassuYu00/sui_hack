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
            夢を追う選手たち
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            才能はあるが、資金や人脈で壁にぶつかっている選手を応援しよう。<br/>
            あなたの応援が、彼らの人生を変える。
          </p>
        </div>

        <Tabs defaultValue="fundraising" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="fundraising">
              資金調達中 ({fundraisingFighters.length})
            </TabsTrigger>
            <TabsTrigger value="training">
              修行中 ({trainingFighters.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              活動中 ({activeFighters.length})
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
                現在、資金調達中の選手はいません
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
                現在、修行中の選手はいません
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
                現在、活動中の選手はいません
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
