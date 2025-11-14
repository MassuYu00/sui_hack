// Fighter Object (Dynamic NFT) - 選手の動的な状態を表す
export interface Fighter {
  id: string;
  name: string;
  nameJa: string;
  age: number;
  nationality: string;
  weightClass: string;
  record: {
    wins: number;
    losses: number;
    draws: number;
  };
  
  // ストーリー要素
  backstory: string;
  goal: string;
  currentStatus: 'fundraising' | 'training' | 'active'; // 資金調達中 | 修行中 | 活動中
  
  // ISA契約情報
  isaContract?: {
    percentage: number; // 例: 30（賞金の30%）
    duration: number; // 例: 5（5年間）
  };
  
  // 資金調達情報
  funding: {
    targetAmount: number; // 目標額（USDsui）
    currentAmount: number; // 現在の調達額
    supporterCount: number; // 応援者数
  };
  
  // メディア
  image: string;
  videoUrl?: string;
  
  // タイムスタンプ
  listedAt: string;
  lastUpdated: string;
}

// 投資持分NFT (Composable NFT) - 応援の証明と配当受取権
export interface InvestmentShare {
  id: string;
  fighterId: string;
  fighterName: string;
  investorAddress: string;
  amount: number; // 投資額（USDsui）
  percentage: number; // 全体に占める割合
  investedAt: string;
}

// SBT - 譲渡不可能な名誉の証明
export interface SoulBoundToken {
  id: string;
  type: 'winning_second' | 'scout_master'; // Winning Second | Scout Master
  fighterId: string;
  fighterName: string;
  metadata: {
    eventName?: string; // 試合名
    eventDate?: string; // 試合日
    scoutedAt?: string; // スカウト日
  };
  issuedAt: string;
}

// ユーザープロファイル
export interface UserProfile {
  address: string;
  displayName?: string;
  investmentShares: InvestmentShare[];
  soulBoundTokens: SoulBoundToken[];
  totalInvested: number;
  totalReturns: number;
}

// 配当履歴
export interface ReturnHistory {
  id: string;
  fighterId: string;
  fighterName: string;
  amount: number;
  distributedAt: string;
  eventName: string;
}

// スカウト推薦
export interface ScoutProposal {
  id: string;
  proposerAddress: string;
  fighterName: string;
  reason: string;
  stakeAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}
