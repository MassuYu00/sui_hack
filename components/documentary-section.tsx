import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function DocumentarySection() {
  const documentaries = [
    {
      id: '1',
      title: 'Takeshi Yamada - Brazil Training Arc Episode 1',
      fighter: 'Takeshi Yamada',
      thumbnail: '/Gemini_Generated_Image_3j4iq63j4iq63j4i.png',
      duration: '24:30',
      status: 'public',
      description: 'Documenting the grueling days at Brazil\'s Nova União gym. Overcoming language barriers and honing skills.',
      views: 15420,
      releaseDate: '2025-10-15',
    },
    {
      id: '2',
      title: 'Maria Rodriguez - UFC挑戦への道',
      fighter: 'Maria Rodriguez',
      thumbnail: '/Gemini_Generated_Image_7ztmku7ztmku7ztm.png',
      duration: '32:15',
      status: 'premium',
      description: 'A documentary of blood, sweat, and tears leading to earning the challenge right to the UFC Octagon.',
      views: 8930,
      releaseDate: '2025-11-01',
    },
    {
      id: '3',
      title: 'Viktor Volkov - The Champion\'s True Face',
      fighter: 'Viktor Volkov',
      thumbnail: '/Gemini_Generated_Image_b2prmdb2prmdb2pr.png',
      duration: '28:45',
      status: 'locked',
      description: 'Tension and focus right before the title match. Exclusive content following the champion\'s daily life.',
      views: 0,
      releaseDate: '2025-12-01',
    },
  ]

  return (
    <section className="py-20 bg-background" id="documentaries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            Core Business Model
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Exclusive Documentaries
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fighter training documentaries abroad, viewable only by supporters holding Investment Share NFTs.
            <br />
            Professional video experiences made possible by our media expertise.
          </p>
        </div>

        {/* Documentary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {documentaries.map((doc) => (
            <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-gray-900">
                <Image
                  src={doc.thumbnail}
                  alt={doc.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {doc.status === 'public' && (
                    <Badge className="bg-green-500 text-white">Free</Badge>
                  )}
                  {doc.status === 'premium' && (
                    <Badge className="bg-blue-500 text-white">Supporters Only</Badge>
                  )}
                  {doc.status === 'locked' && (
                    <Badge className="bg-gray-500 text-white">Unreleased</Badge>
                  )}
                </div>

                {/* Play Button / Lock Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {doc.status === 'locked' ? (
                    <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-primary transition-colors cursor-pointer">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-black/60 text-white backdrop-blur-sm">
                    {doc.duration}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{doc.fighter}</Badge>
                  {doc.status !== 'locked' && (
                    <span className="text-sm text-muted-foreground">
                      {doc.views.toLocaleString()} views
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{doc.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {doc.description}
                </p>
                
                {doc.status === 'locked' ? (
                  <Button variant="outline" className="w-full" disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    Releasing {doc.releaseDate}
                  </Button>
                ) : doc.status === 'premium' ? (
                  <Button className="w-full" asChild>
                    <Link href={`/documentaries/${doc.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Watch (NFT Required)
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={`/documentaries/${doc.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Watch
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Access All Content</h3>
            <p className="text-muted-foreground mb-6">
              Support fighters and earn Investment Share NFTs to gain access to their exclusive documentaries.
            </p>
            <Button size="lg" asChild>
              <Link href="/login?action=signup">Join as Supporter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
