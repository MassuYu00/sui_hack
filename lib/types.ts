// ============================================
// Fighter Object (Dynamic NFT) - Sui上で発行される選手を表すNFT
// ============================================
// 選手の動的な状態をオンチェーンで保持するデータベースとして機能
// プロパティ（静）: 選手名、所属、ISA契約内容
// プロパティ（動）: 現在の調達額、現在のステータス、現在の戦績
export interface Fighter {
  id: string; // Sui Object ID
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
  
  // ISA契約情報（所得分配契約）
  isaContract?: {
    percentage: number; // 例: 30（賞金の30%をDAOに分配）
    duration: number; // 例: 5（5年間）
  };
  
  // 資金調達情報
  funding: {
    targetAmount: number; // 目標額（USDsui ステーブルコイン）
    currentAmount: number; // 現在の調達額（Dynamic NFTで自動更新）
    investorCount: number; // 投資家数
  };
  
  // メディア
  image: string;
  videoUrl?: string;
  documentaryUrl?: string; // 海外修行ドキュメンタリー
  
  // タイムスタンプ
  listedAt: string;
  lastUpdated: string;
}

// ============================================
// Investment Share NFT (Composable NFT)
// ============================================
// 投資額と紐づく選手IDが記録されたNFT
// リターン分配を受け取る「権利証」そのもの
export interface InvestmentShare {
  id: string; // Sui Object ID
  fighterId: string; // 紐づく選手のFighter Object ID
  fighterName: string;
  investorAddress: string; // zkLoginで生成されたSuiウォレットアドレス
  amount: number; // 投資額（USDsui）
  percentage: number; // 選手への全投資額に占める割合
  investedAt: string;
  
  // ユーティリティ（このNFT保有者に付与される権利）
  benefits: {
    documentaryAccess: boolean; // 限定ドキュメンタリー視聴権
    ticketPresale: boolean; // 試合チケット先行販売
    votingRight: boolean; // 入場曲などの意思決定投票権
  };
}

// ============================================
// Soul Bound Token (SBT) - 譲渡不可能な名誉の証明
// ============================================
export interface SoulBoundToken {
  id: string; // Sui Object ID
  type: 'winning_second' | 'scout_master';
  fighterId: string;
  fighterName: string;
  ownerAddress: string; // zkLoginで生成されたSuiウォレットアドレス
  metadata: {
    // Winning Second SBT用
    eventName?: string; // 試合名
    eventDate?: string; // 試合日
    opponentName?: string; // 対戦相手
    
    // Scout Master SBT用
    scoutedAt?: string; // スカウト日
    totalFundingRaised?: number; // その選手が最終的に調達した総額
    scoutReward?: number; // スカウト報酬（調達額の3%）
  };
  issuedAt: string;
  isSoulBound: true; // 常にtrue（譲渡不可）
}

// ============================================
// User Profile - zkLoginで生成されたウォレットのプロファイル
// ============================================
export interface UserProfile {
  address: string; // zkLoginで生成されたSuiウォレットアドレス
  snsProvider?: 'google' | 'twitter' | 'twitch'; // zkLoginで使用したSNS
  displayName?: string;
  
  // 保有アセット
  investmentShares: InvestmentShare[]; // 投資持分NFT
  soulBoundTokens: SoulBoundToken[]; // SBT
  
  // 統計
  totalInvested: number; // 総投資額（USDsui）
  totalReturns: number; // 総リターン（USDsui）
  scoutProposalCount: number; // 推薦した選手数
  scoutSuccessCount: number; // 推薦が採用された選手数
}

// ============================================
// Return History - リターン分配履歴
// ============================================
export interface ReturnHistory {
  id: string;
  fighterId: string;
  fighterName: string;
  eventName: string; // 試合名
  eventDate: string; // 試合日
  amount: number; // 分配額（USDsui）
  investmentShareId: string; // どの投資持分NFTに対する分配か
  distributedAt: string; // 分配実行日時
  transactionHash: string; // Suiトランザクションハッシュ
}

// ============================================
// Scout Proposal - DAOメンバーによる選手推薦
// ============================================
export interface ScoutProposal {
  id: string;
  proposerAddress: string; // 推薦者のSuiウォレットアドレス
  proposerName?: string;
  
  // 推薦内容
  fighterName: string;
  fighterNameJa: string;
  nationality: string;
  weightClass: string;
  currentRecord?: string; // 現在の戦績
  reason: string; // 推薦理由
  videoUrl?: string; // 試合動画URL
  
  // ステーク（推薦の質を担保）
  stakeAmount: number; // ステーク額（USDsui）
  
  // ステータス
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewComment?: string; // 運営からのコメント
  
  // 承認された場合
  approvedFighterId?: string; // 発行されたFighter Object ID
}
