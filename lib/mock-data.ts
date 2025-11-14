import { Fighter, InvestmentShare, SoulBoundToken, ReturnHistory } from './types';

// モック選手データ - 応援したくなるストーリー重視
export const mockFighters: Fighter[] = [
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
      investorCount: 127, // 投資家数
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
      investorCount: 284, // 投資家数
    },
    image: '/Gemini_Generated_Image_7ztmku7ztmku7ztm.png',
    listedAt: '2024-11-01T00:00:00Z',
    lastUpdated: '2025-01-14T08:15:00Z',
  },
  {
    id: 'fighter-004',
    name: 'Viktor "The Bear" Volkov',
    nameJa: 'ヴィクトル・ヴォルコフ',
    age: 26,
    nationality: 'Russia',
    weightClass: 'Heavyweight (120kg)',
    record: {
      wins: 10,
      losses: 2,
      draws: 0,
    },
    backstory: 'シベリアの極寒の村で育った巨漢ファイター。元レスリング選手だったが、経済的理由で競技を断念。しかしMMAの才能をスカウトに見出され、総合格闘技に転向。「村の人々に希望を与えたい」と、ロシアのトップジムでの修行を志す。',
    goal: 'サンクトペテルブルクの名門ジムで寝技とストライキングを統合し、Bellator参戦',
    currentStatus: 'active',
    isaContract: {
      percentage: 30,
      duration: 5,
    },
    funding: {
      targetAmount: 22000,
      currentAmount: 22000,
      investorCount: 156, // 投資家数
    },
    image: '/Gemini_Generated_Image_o4m0txo4m0txo4m0.png',
    listedAt: '2024-10-15T00:00:00Z',
    lastUpdated: '2025-01-12T14:20:00Z',
  },
  {
    id: 'fighter-003',
    name: 'Alex "The Striker" Johnson',
    nameJa: 'アレックス・ジョンソン',
    age: 27,
    nationality: 'USA',
    weightClass: 'Welterweight (77kg)',
    record: {
      wins: 12,
      losses: 3,
      draws: 1,
    },
    backstory: '元軍人。除隊後、「真の強さ」を求めて格闘技の道へ。国内では実績を積んだが、世界レベルの打撃技術を学ぶ資金がなかった。家族をアメリカに残し、単身でオランダへ修行に行く覚悟を決めた。',
    goal: 'オランダでキックボクシングの最高峰技術を学び、UFCチャンピオンへ',
    currentStatus: 'fundraising',
    isaContract: {
      percentage: 35,
      duration: 5,
    },
    funding: {
      targetAmount: 18000,
      currentAmount: 12300,
      investorCount: 193, // 投資家数
    },
    image: '/Gemini_Generated_Image_esuxdcesuxdcesux.png',
    listedAt: '2025-01-05T00:00:00Z',
    lastUpdated: '2025-01-15T10:00:00Z',
  },
  {
    id: 'fighter-005',
    name: 'Sophie "The Phoenix" Dubois',
    nameJa: 'ソフィー・デュボア',
    age: 21,
    nationality: 'France',
    weightClass: 'Atomweight (48kg)',
    record: {
      wins: 5,
      losses: 0,
      draws: 0,
    },
    backstory: 'パリ出身の大学生ファイター。学費を稼ぐためアルバイトを掛け持ちしながら、フランスの格闘技サークルで無敗記録を樹立。「女性が格闘技で生きていける世界を作りたい」という信念を持つ。卒業後のプロデビューに向け、アメリカでの経験が必要だと考えている。',
    goal: 'アメリカ・カリフォルニアのジムで女子MMAの最先端技術を学び、UFCデビュー',
    currentStatus: 'fundraising',
    isaContract: {
      percentage: 28,
      duration: 4,
    },
    funding: {
      targetAmount: 16000,
      currentAmount: 4200,
      investorCount: 68, // 投資家数
    },
    image: '/Gemini_Generated_Image_op39cwop39cwop39.png',
    listedAt: '2025-01-12T00:00:00Z',
    lastUpdated: '2025-01-15T16:45:00Z',
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
  },
  {
    id: 'share-002',
    fighterId: 'fighter-002',
    fighterName: 'Maria "La Rosa" Rodriguez',
    investorAddress: '0x123...abc',
    amount: 1000,
    percentage: 5.0,
    investedAt: '2024-12-15T14:20:00Z',
  },
];

// モックSBTデータ
export const mockSoulBoundTokens: SoulBoundToken[] = [
  {
    id: 'sbt-001',
    type: 'winning_second',
    fighterId: 'fighter-002',
    fighterName: 'Maria "La Rosa" Rodriguez',
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
    fighterName: 'Viktor "The Bear" Volkov',
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
    amount: 150,
    distributedAt: '2025-01-05T00:00:00Z',
    eventName: 'Brazil Fight Night 2024 - Victory Bonus',
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
