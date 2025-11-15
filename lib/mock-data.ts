import { Fighter, InvestmentShare, SoulBoundToken, ReturnHistory } from './types';

// モック選手データ - 各競技で1-2名ずつ
export const mockFighters: Fighter[] = [
  // MMA（総合格闘技）
  {
    id: 'fighter-001',
    name: 'Takeshi "Thunder" Yamada',
    nameJa: '山田 剛',
    age: 24,
    nationality: 'Japan',
    weightClass: 'Lightweight (70kg)',
    record: {
      wins: 8,
      losses: 2,
      draws: 0,
    },
    backstory: '地方の小さなジムで才能を開花させた若き獅子。家族を支えるため建設現場で働きながら、早朝と深夜に練習を重ねてきた。地元の試合では無敗を誇るが、海外での経験はゼロ。「世界で通用する技術を学びたい」という夢を持ち、タイのトップジムでの修行を目指している。',
    goal: 'タイ・バンコクの名門ジムで6ヶ月間の修行後、ONE Championshipデビュー',
    currentStatus: 'fundraising',
    isaContract: {
      percentage: 30,
      duration: 5,
    },
    funding: {
      targetAmount: 15000,
      currentAmount: 8500,
      investorCount: 127,
    },
    image: '/Gemini_Generated_Image_3j4iq63j4iq63j4i.png',
    listedAt: '2025-01-10T00:00:00Z',
    lastUpdated: '2025-01-15T12:30:00Z',
  },
  {
    id: 'fighter-002',
    name: 'Maria "La Rosa" Rodriguez',
    nameJa: 'マリア・ロドリゲス',
    age: 22,
    nationality: 'Brazil',
    weightClass: 'Strawweight (52kg)',
    record: {
      wins: 6,
      losses: 1,
      draws: 0,
    },
    backstory: 'ファベーラ（スラム街）出身の女性格闘家。兄が組織犯罪に巻き込まれたことをきっかけに、「強くなって家族を守る」と決意。地元の無料道場で頭角を現し、ブラジル国内アマチュア大会で優勝。しかし資金難でプロのキャリアが停滞していた。',
    goal: 'アメリカ・ラスベガスのトップジムで女子MMAのエリート技術を習得し、UFCへ',
    currentStatus: 'training',
    isaContract: {
      percentage: 25,
      duration: 4,
    },
    funding: {
      targetAmount: 20000,
      currentAmount: 20000,
      investorCount: 284,
    },
    image: '/Gemini_Generated_Image_7ztmku7ztmku7ztm.png',
    listedAt: '2024-11-01T00:00:00Z',
    lastUpdated: '2025-01-14T08:15:00Z',
  },

  // ボクシング
  {
    id: 'fighter-003',
    name: 'Carlos "El Martillo" Mendez',
    nameJa: 'カルロス・メンデス',
    age: 23,
    nationality: 'Mexico',
    weightClass: 'Super Featherweight (59kg)',
    record: {
      wins: 15,
      losses: 1,
      draws: 0,
    },
    backstory: 'メキシコシティの貧困地区出身。9歳でボクシングを始め、地元では「若き破壊者」として知られる。アマチュア時代は国内無敗だったが、家族を養うために早期プロデビュー。世界チャンピオンを目指すため、アメリカでトップトレーナーの指導を受けたいと願っている。',
    goal: 'ラスベガスのトップジムで世界レベルのテクニックを習得し、WBC世界王座挑戦',
    currentStatus: 'fundraising',
    isaContract: {
      percentage: 32,
      duration: 5,
    },
    funding: {
      targetAmount: 18000,
      currentAmount: 11200,
      investorCount: 203,
    },
    image: '/Gemini_Generated_Image_4fla5q4fla5q4fla.png',
    listedAt: '2025-01-05T00:00:00Z',
    lastUpdated: '2025-01-15T10:00:00Z',
  },

  // キックボクシング
  {
    id: 'fighter-004',
    name: 'Nong "Golden Knee" Saenchai',
    nameJa: 'ノン・サエンチャイ',
    age: 20,
    nationality: 'Thailand',
    weightClass: 'Lightweight (70kg)',
    record: {
      wins: 42,
      losses: 8,
      draws: 2,
    },
    backstory: 'タイ北部の農村出身。8歳からムエタイを始め、地方スタジアムで200試合以上を経験。しかし賞金は少なく、家族の農業を手伝いながら細々と戦ってきた。「世界のリングで戦いたい」という夢を実現するため、バンコクの名門ジムへの移籍を目指している。',
    goal: 'バンコクの名門ペッチヤインディージムで修行し、ONE Championship参戦',
    currentStatus: 'active',
    isaContract: {
      percentage: 28,
      duration: 4,
    },
    funding: {
      targetAmount: 12000,
      currentAmount: 12000,
      investorCount: 176,
    },
    image: '/Gemini_Generated_Image_nyykjmnyykjmnyyk.png',
    listedAt: '2024-10-15T00:00:00Z',
    lastUpdated: '2025-01-12T14:20:00Z',
  },
  {
    id: 'fighter-005',
    name: 'Yuki "Ice Queen" Tanaka',
    nameJa: '田中 雪',
    age: 21,
    nationality: 'Japan',
    weightClass: 'Atomweight (48kg)',
    record: {
      wins: 18,
      losses: 3,
      draws: 1,
    },
    backstory: '北海道出身の女性キックボクサー。厳格な家庭で育ち、父親の反対を押し切って格闘技の道へ。日本国内では女子の試合機会が限られているため、タイやオランダで経験を積みたいと考えている。「女性でも世界で戦える」ことを証明したい。',
    goal: 'オランダとタイで修行を積み、RISEとONE Championshipで世界王座獲得',
    currentStatus: 'fundraising',
    isaContract: {
      percentage: 30,
      duration: 4,
    },
    funding: {
      targetAmount: 16000,
      currentAmount: 5800,
      investorCount: 92,
    },
    image: '/Gemini_Generated_Image_saiuy1saiuy1saiu.png',
    listedAt: '2025-01-12T00:00:00Z',
    lastUpdated: '2025-01-15T16:45:00Z',
  },

  // レスリング
  {
    id: 'fighter-006',
    name: 'Batu "The Eagle" Khabibov',
    nameJa: 'バトゥ・ハビボフ',
    age: 22,
    nationality: 'Kazakhstan',
    weightClass: 'Welterweight (74kg)',
    record: {
      wins: 34,
      losses: 2,
      draws: 0,
    },
    backstory: 'カザフスタンの遊牧民家族出身。幼少期から伝統レスリングで鍛えられ、国内ジュニア大会では無敗。しかし国際大会への遠征費用がなく、才能を活かせずにいた。オリンピック出場とMMA転向の両方を視野に、ロシアの名門レスリングクラブでの訓練を希望している。',
    goal: 'ロシアの名門クラブで国際レベルの技術を習得し、2028年オリンピック出場',
    currentStatus: 'fundraising',
    isaContract: {
      percentage: 25,
      duration: 6,
    },
    funding: {
      targetAmount: 14000,
      currentAmount: 7300,
      investorCount: 115,
    },
    image: '/Gemini_Generated_Image_8s0mvq8s0mvq8s0m.png',
    listedAt: '2025-01-08T00:00:00Z',
    lastUpdated: '2025-01-15T09:20:00Z',
  },
];

// モック投資持分データ
export const mockInvestmentShares: InvestmentShare[] = [
  {
    id: 'share-001',
    fighterId: 'fighter-001',
    fighterName: 'Takeshi "Thunder" Yamada',
    investorAddress: '0x123...abc',
    amount: 500,
    percentage: 5.88,
    investedAt: '2025-01-11T10:30:00Z',
    benefits: {
      documentaryAccess: true,
      ticketPresale: true,
      votingRight: true,
    },
  },
  {
    id: 'share-002',
    fighterId: 'fighter-002',
    fighterName: 'Maria "La Rosa" Rodriguez',
    investorAddress: '0x123...abc',
    amount: 1000,
    percentage: 5.0,
    investedAt: '2024-12-15T14:20:00Z',
    benefits: {
      documentaryAccess: true,
      ticketPresale: true,
      votingRight: true,
    },
  },
];

// モックSBTデータ
export const mockSoulBoundTokens: SoulBoundToken[] = [
  {
    id: 'sbt-001',
    type: 'winning_second',
    fighterId: 'fighter-002',
    fighterName: 'Maria "La Rosa" Rodriguez',
    ownerAddress: '0x123...abc',
    isSoulBound: true,
    metadata: {
      eventName: 'Brazil Fight Night 2024',
      eventDate: '2024-12-28T00:00:00Z',
    },
    issuedAt: '2024-12-29T00:00:00Z',
  },
  {
    id: 'sbt-002',
    type: 'scout_master',
    fighterId: 'fighter-004',
    fighterName: 'Nong "Golden Knee" Saenchai',
    ownerAddress: '0x123...abc',
    isSoulBound: true,
    metadata: {
      scoutedAt: '2024-09-20T00:00:00Z',
    },
    issuedAt: '2024-10-15T00:00:00Z',
  },
];

// モック配当履歴データ
export const mockReturnHistory: ReturnHistory[] = [
  {
    id: 'return-001',
    fighterId: 'fighter-002',
    fighterName: 'Maria "La Rosa" Rodriguez',
    investmentShareId: 'share-002',
    amount: 150,
    eventName: 'Brazil Fight Night 2024 - Victory Bonus',
    eventDate: '2024-12-28T00:00:00Z',
    distributedAt: '2025-01-05T00:00:00Z',
    transactionHash: '0xabc123...',
  },
];

// ヘルパー関数
export function getFighterById(id: string): Fighter | undefined {
  return mockFighters.find(f => f.id === id);
}

export function getFighterByName(name: string): Fighter | undefined {
  return mockFighters.find(f => 
    f.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === name.toLowerCase()
  );
}

export function calculateFundingProgress(fighter: Fighter): number {
  return Math.min(100, (fighter.funding.currentAmount / fighter.funding.targetAmount) * 100);
}

export function getFightersByStatus(status: Fighter['currentStatus']): Fighter[] {
  return mockFighters.filter(f => f.currentStatus === status);
}
