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
      title: '山田剛 - ブラジル修行編 第1話',
      fighter: '山田剛',
      thumbnail: '/Gemini_Generated_Image_3j4iq63j4iq63j4i.png',
      duration: '24:30',
      status: 'public',
      description: 'ブラジルの格闘技ジム「Nova União」での過酷な日々を記録。言葉の壁を越え、技術を磨く。',
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
      description: 'UFCオクタゴンへの挑戦権を手にするまでの、血と汗と涙のドキュメンタリー。',
      views: 8930,
      releaseDate: '2025-11-01',
    },
    {
      id: '3',
      title: 'Viktor Volkov - チャンピオンの素顔',
      fighter: 'Viktor Volkov',
      thumbnail: '/Gemini_Generated_Image_b2prmdb2prmdb2pr.png',
      duration: '28:45',
      status: 'locked',
      description: 'タイトルマッチ直前の緊張と集中。チャンピオンの日常に密着した限定コンテンツ。',
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
            本命ビジネスモデル
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            限定ドキュメンタリー
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            投資持分NFTを保有する応援者だけが視聴できる、選手の海外修行ドキュメンタリー。
            <br />
            メディア企業だからこそ実現できる、プロフェッショナルな映像体験。
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
                    <Badge className="bg-green-500 text-white">無料公開</Badge>
                  )}
                  {doc.status === 'premium' && (
                    <Badge className="bg-blue-500 text-white">応援者限定</Badge>
                  )}
                  {doc.status === 'locked' && (
                    <Badge className="bg-gray-500 text-white">未公開</Badge>
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
                    {doc.releaseDate} 公開予定
                  </Button>
                ) : doc.status === 'premium' ? (
                  <Button className="w-full" asChild>
                    <Link href={`/documentaries/${doc.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      視聴する（要投資NFT）
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={`/documentaries/${doc.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      視聴する
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
            <h3 className="text-2xl font-bold mb-4">全コンテンツを視聴するには</h3>
            <p className="text-muted-foreground mb-6">
              選手を応援して投資持分NFTを獲得すると、その選手の限定ドキュメンタリーへのアクセス権が付与されます。
            </p>
            <Button size="lg" asChild>
              <Link href="/login?action=signup">応援者として参加する</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
