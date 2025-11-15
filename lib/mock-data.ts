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
    backstory: 'A young lion who discovered his talent at a small local gym. While supporting his family by working at a construction site, he trained in the early mornings and late nights. Undefeated in local competitions but with zero international experience. Dreams of learning world-class techniques at a top gym in Thailand.',
    goal: 'Train at a prestigious Bangkok gym for 6 months, then debut in ONE Championship',
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
    backstory: 'A female fighter from the favela (slum). After her brother was caught up in organized crime, she decided to "become strong to protect her family." Rose to prominence at a local free dojo and won the Brazilian national amateur championship. However, her professional career stalled due to financial difficulties.',
    goal: 'Master elite women\'s MMA techniques at a top Las Vegas gym and reach the UFC',
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
    backstory: 'From a rural village in northern Thailand. Started Muay Thai at age 8 and has over 200 fights at local stadiums. However, prize money was minimal, and he has been fighting modestly while helping with family farming. Aims to transfer to a prestigious Bangkok gym to realize his dream of "fighting on the world stage."',
    goal: 'Train at the prestigious Petchyindee gym in Bangkok and compete in ONE Championship',
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
    backstory: 'A female kickboxer from Hokkaido. Raised in a strict household, she pursued martial arts against her father\'s opposition. With limited opportunities for women\'s matches in Japan, she wants to gain experience in Thailand and the Netherlands. Wants to prove that "women can compete on the world stage too."',
    goal: 'Train in the Netherlands and Thailand, then win world titles in RISE and ONE Championship',
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
    backstory: 'From a nomadic family in Kazakhstan. Trained in traditional wrestling from childhood and undefeated in domestic junior competitions. However, lacked funds for international tournament travel and couldn\'t capitalize on his talent. With both Olympic participation and MMA transition in mind, he hopes to train at a prestigious Russian wrestling club.',
    goal: 'Master international-level techniques at a prestigious Russian club and compete in the 2028 Olympics',
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
