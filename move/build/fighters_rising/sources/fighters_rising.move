/// Fighter's Rising - MMA選手への応援プラットフォーム
/// 
/// このモジュールは以下の機能を提供します：
/// - 選手オブジェクトの作成と管理
/// - 応援（投資）持分NFTの発行
/// - スカウト提案の管理
/// - Soul Bound Token (SBT) の発行
/// - リターンの自動分配
module fighters_rising::fighters_rising {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};

    // ==================== エラーコード ====================
    
    const EInsufficientFunds: u64 = 1;
    const EInvalidAmount: u64 = 2;
    const ENotAuthorized: u64 = 3;
    const EAlreadyProcessed: u64 = 4;
    const EInvalidFundingGoal: u64 = 5;
    const EFundraisingNotComplete: u64 = 6;
    const EMinimumInvestmentNotMet: u64 = 7;
    const EMaximumInvestmentExceeded: u64 = 8;

    // ==================== 定数 ====================
    
    const MINIMUM_INVESTMENT: u64 = 100_000_000_000; // 100 SUI
    const MAXIMUM_INVESTMENT: u64 = 10_000_000_000_000; // 10,000 SUI
    const MINIMUM_STAKE: u64 = 100_000_000_000; // 100 SUI
    const SCOUT_REWARD_PERCENTAGE: u64 = 3; // 3%
    const PLATFORM_FEE_PERCENTAGE: u64 = 5; // 5%
    const FIGHTER_SHARE_PERCENTAGE: u64 = 15; // 15%
    const INVESTOR_SHARE_PERCENTAGE: u64 = 80; // 80%

    // ==================== 構造体 ====================

    /// プラットフォームの管理者権限
    public struct AdminCap has key, store {
        id: UID,
    }

    /// プラットフォーム全体の設定と統計
    public struct Platform has key {
        id: UID,
        total_fighters: u64,
        total_investments: u64,
        total_volume: u64,
        platform_treasury: Balance<SUI>,
        admin: address,
    }

    /// 選手オブジェクト
    public struct Fighter has key, store {
        id: UID,
        name: String,
        name_ja: String,
        nationality: String,
        weight_class: String,
        record: String,
        bio: String,
        image_url: String,
        funding_goal: u64,
        current_funding: u64,
        investor_count: u64,
        status: u8, // 0: fundraising, 1: training, 2: active
        treasury: Balance<SUI>,
        created_at: u64,
        scout_proposal_id: ID,
    }

    /// 応援持分NFT
    public struct InvestmentShare has key, store {
        id: UID,
        fighter_id: ID,
        fighter_name: String,
        investor: address,
        amount: u64,
        percentage: u64, // basis points (1% = 100)
        invested_at: u64,
        total_returns_received: u64,
    }

    /// スカウト提案
    public struct ScoutProposal has key, store {
        id: UID,
        proposer: address,
        proposer_name: String,
        fighter_name: String,
        fighter_name_ja: String,
        nationality: String,
        weight_class: String,
        record: String,
        reason: String,
        video_url: String,
        stake_amount: u64,
        stake: Balance<SUI>,
        status: u8, // 0: pending, 1: approved, 2: rejected
        review_comment: String,
        submitted_at: u64,
        reviewed_at: u64,
    }

    /// Soul Bound Token (譲渡不可)
    public struct SoulBoundToken has key {
        id: UID,
        token_type: u8, // 0: Scout Master, 1: Winning Second
        recipient: address,
        fighter_name: String,
        reward_amount: u64,
        metadata: String,
        issued_at: u64,
    }

    /// 投資家レジストリ（選手ごと）
    public struct InvestorRegistry has key, store {
        id: UID,
        fighter_id: ID,
        investors: Table<address, u64>, // address -> amount
        total_invested: u64,
    }

    // ==================== イベント ====================

    public struct FighterCreated has copy, drop {
        fighter_id: ID,
        name: String,
        funding_goal: u64,
        scout_proposal_id: ID,
    }

    public struct InvestmentMade has copy, drop {
        fighter_id: ID,
        investor: address,
        amount: u64,
        share_id: ID,
    }

    public struct ScoutProposalSubmitted has copy, drop {
        proposal_id: ID,
        proposer: address,
        fighter_name: String,
        stake_amount: u64,
    }

    public struct ScoutProposalApproved has copy, drop {
        proposal_id: ID,
        fighter_id: ID,
        funding_goal: u64,
    }

    public struct ScoutProposalRejected has copy, drop {
        proposal_id: ID,
        reason: String,
    }

    public struct SBTMinted has copy, drop {
        token_id: ID,
        token_type: u8,
        recipient: address,
        fighter_name: String,
    }

    public struct ReturnsDistributed has copy, drop {
        fighter_id: ID,
        total_amount: u64,
        investor_count: u64,
    }

    // ==================== 初期化 ====================

    /// モジュール初期化時に1度だけ実行
    fun init(ctx: &mut TxContext) {
        // 管理者権限を作成
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        
        // プラットフォームオブジェクトを作成
        let platform = Platform {
            id: object::new(ctx),
            total_fighters: 0,
            total_investments: 0,
            total_volume: 0,
            platform_treasury: balance::zero(),
            admin: tx_context::sender(ctx),
        };

        // 管理者にAdminCapを転送
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        
        // Platformオブジェクトを共有
        transfer::share_object(platform);
    }

    // ==================== 公開関数 ====================

    /// スカウト提案を送信
    public entry fun submit_scout_proposal(
        proposer_name: vector<u8>,
        fighter_name: vector<u8>,
        fighter_name_ja: vector<u8>,
        nationality: vector<u8>,
        weight_class: vector<u8>,
        record: vector<u8>,
        reason: vector<u8>,
        video_url: vector<u8>,
        stake: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let stake_amount = coin::value(&stake);
        
        // 最低ステーク額のチェック
        assert!(stake_amount >= MINIMUM_STAKE, EMinimumInvestmentNotMet);

        let proposal = ScoutProposal {
            id: object::new(ctx),
            proposer: tx_context::sender(ctx),
            proposer_name: string::utf8(proposer_name),
            fighter_name: string::utf8(fighter_name),
            fighter_name_ja: string::utf8(fighter_name_ja),
            nationality: string::utf8(nationality),
            weight_class: string::utf8(weight_class),
            record: string::utf8(record),
            reason: string::utf8(reason),
            video_url: string::utf8(video_url),
            stake_amount,
            stake: coin::into_balance(stake),
            status: 0, // pending
            review_comment: string::utf8(b""),
            submitted_at: clock::timestamp_ms(clock),
            reviewed_at: 0,
        };

        let proposal_id = object::id(&proposal);

        // イベント発行
        event::emit(ScoutProposalSubmitted {
            proposal_id,
            proposer: tx_context::sender(ctx),
            fighter_name: string::utf8(fighter_name),
            stake_amount,
        });

        // 提案を共有オブジェクトに
        transfer::share_object(proposal);
    }

    /// スカウト提案を承認し、選手オブジェクトを作成
    public entry fun approve_scout_proposal(
        _admin_cap: &AdminCap,
        platform: &mut Platform,
        proposal: &mut ScoutProposal,
        funding_goal: u64,
        bio: vector<u8>,
        image_url: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // 承認済みでないことを確認
        assert!(proposal.status == 0, EAlreadyProcessed);
        
        // 資金調達目標の妥当性チェック
        assert!(funding_goal > 0, EInvalidFundingGoal);

        // 選手オブジェクトを作成
        let fighter = Fighter {
            id: object::new(ctx),
            name: proposal.fighter_name,
            name_ja: proposal.fighter_name_ja,
            nationality: proposal.nationality,
            weight_class: proposal.weight_class,
            record: proposal.record,
            bio: string::utf8(bio),
            image_url: string::utf8(image_url),
            funding_goal,
            current_funding: 0,
            investor_count: 0,
            status: 0, // fundraising
            treasury: balance::zero(),
            created_at: clock::timestamp_ms(clock),
            scout_proposal_id: object::id(proposal),
        };

        let fighter_id = object::id(&fighter);

        // 投資家レジストリを作成
        let registry = InvestorRegistry {
            id: object::new(ctx),
            fighter_id,
            investors: table::new(ctx),
            total_invested: 0,
        };

        // 提案のステータスを更新
        proposal.status = 1; // approved
        proposal.reviewed_at = clock::timestamp_ms(clock);

        // プラットフォーム統計を更新
        platform.total_fighters = platform.total_fighters + 1;

        // Scout Master SBTを発行
        let reward_amount = (funding_goal * SCOUT_REWARD_PERCENTAGE) / 100;
        mint_scout_master_sbt(
            proposal.proposer,
            proposal.fighter_name,
            reward_amount,
            clock,
            ctx
        );

        // ステークを返却
        let stake_coin = coin::from_balance(
            balance::withdraw_all(&mut proposal.stake),
            ctx
        );
        transfer::public_transfer(stake_coin, proposal.proposer);

        // イベント発行
        event::emit(ScoutProposalApproved {
            proposal_id: object::id(proposal),
            fighter_id,
            funding_goal,
        });

        event::emit(FighterCreated {
            fighter_id,
            name: fighter.name,
            funding_goal,
            scout_proposal_id: object::id(proposal),
        });

        // オブジェクトを共有
        transfer::share_object(fighter);
        transfer::share_object(registry);
    }

    /// スカウト提案を却下
    public entry fun reject_scout_proposal(
        _admin_cap: &AdminCap,
        platform: &mut Platform,
        proposal: &mut ScoutProposal,
        reason: vector<u8>,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        // 処理済みでないことを確認
        assert!(proposal.status == 0, EAlreadyProcessed);

        // 提案のステータスを更新
        proposal.status = 2; // rejected
        proposal.review_comment = string::utf8(reason);
        proposal.reviewed_at = clock::timestamp_ms(clock);

        // ステークをプラットフォームの資金に
        let stake_balance = balance::withdraw_all(&mut proposal.stake);
        balance::join(&mut platform.platform_treasury, stake_balance);

        // イベント発行
        event::emit(ScoutProposalRejected {
            proposal_id: object::id(proposal),
            reason: string::utf8(reason),
        });
    }

    /// 選手に応援（投資）する
    public entry fun invest_in_fighter(
        platform: &mut Platform,
        fighter: &mut Fighter,
        registry: &mut InvestorRegistry,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        let investor = tx_context::sender(ctx);

        // 投資額のチェック
        assert!(amount >= MINIMUM_INVESTMENT, EMinimumInvestmentNotMet);
        assert!(amount <= MAXIMUM_INVESTMENT, EMaximumInvestmentExceeded);

        // 資金調達中であることを確認
        assert!(fighter.status == 0, EInvalidAmount);

        // 資金をファイターの財務に追加
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut fighter.treasury, payment_balance);

        // 投資情報を更新
        fighter.current_funding = fighter.current_funding + amount;
        fighter.investor_count = fighter.investor_count + 1;

        // レジストリに投資家を追加
        if (table::contains(&registry.investors, investor)) {
            let current = table::remove(&mut registry.investors, investor);
            table::add(&mut registry.investors, investor, current + amount);
        } else {
            table::add(&mut registry.investors, investor, amount);
        };
        registry.total_invested = registry.total_invested + amount;

        // 持分パーセンテージを計算（basis points）
        let percentage = (amount * 10000) / fighter.funding_goal;

        // 応援持分NFTを発行
        let share = InvestmentShare {
            id: object::new(ctx),
            fighter_id: object::id(fighter),
            fighter_name: fighter.name,
            investor,
            amount,
            percentage,
            invested_at: clock::timestamp_ms(clock),
            total_returns_received: 0,
        };

        let share_id = object::id(&share);

        // プラットフォーム統計を更新
        platform.total_investments = platform.total_investments + 1;
        platform.total_volume = platform.total_volume + amount;

        // 資金調達目標達成チェック
        if (fighter.current_funding >= fighter.funding_goal) {
            fighter.status = 1; // training
        };

        // イベント発行
        event::emit(InvestmentMade {
            fighter_id: object::id(fighter),
            investor,
            amount,
            share_id,
        });

        // NFTを投資家に転送
        transfer::public_transfer(share, investor);
    }

    /// リターンを分配
    public entry fun distribute_returns(
        _admin_cap: &AdminCap,
        platform: &mut Platform,
        fighter: &mut Fighter,
        registry: &InvestorRegistry,
        payment: Coin<SUI>,
        _ctx: &mut TxContext
    ) {
        let total_amount = coin::value(&payment);
        let mut payment_balance = coin::into_balance(payment);

        // プラットフォーム手数料 (5%)
        let platform_fee = (total_amount * PLATFORM_FEE_PERCENTAGE) / 100;
        let platform_fee_balance = balance::split(&mut payment_balance, platform_fee);
        balance::join(&mut platform.platform_treasury, platform_fee_balance);

        // 選手の取り分 (15%)
        let fighter_share = (total_amount * FIGHTER_SHARE_PERCENTAGE) / 100;
        let fighter_share_balance = balance::split(&mut payment_balance, fighter_share);
        balance::join(&mut fighter.treasury, fighter_share_balance);

        // 残り（80%）を投資家に分配
        // 注: 実際の分配は各投資家のInvestmentShareを使って個別に行う必要があります
        // ここでは簡略化のため、ファイターの財務に一時保管
        balance::join(&mut fighter.treasury, payment_balance);

        // イベント発行
        event::emit(ReturnsDistributed {
            fighter_id: object::id(fighter),
            total_amount,
            investor_count: registry.total_invested,
        });
    }

    /// Scout Master SBTを発行（内部関数）
    fun mint_scout_master_sbt(
        recipient: address,
        fighter_name: String,
        reward_amount: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sbt = SoulBoundToken {
            id: object::new(ctx),
            token_type: 0, // Scout Master
            recipient,
            fighter_name,
            reward_amount,
            metadata: string::utf8(b"Scout Master Badge - Talent Scout Achievement"),
            issued_at: clock::timestamp_ms(clock),
        };

        let token_id = object::id(&sbt);

        // イベント発行
        event::emit(SBTMinted {
            token_id,
            token_type: 0,
            recipient,
            fighter_name,
        });

        // SBTを受取人に転送（譲渡不可）
        transfer::transfer(sbt, recipient);
    }

    /// Winning Second SBTを発行
    public entry fun mint_winning_second_sbt(
        _admin_cap: &AdminCap,
        recipient: address,
        fighter_name: vector<u8>,
        metadata: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sbt = SoulBoundToken {
            id: object::new(ctx),
            token_type: 1, // Winning Second
            recipient,
            fighter_name: string::utf8(fighter_name),
            reward_amount: 0,
            metadata: string::utf8(metadata),
            issued_at: clock::timestamp_ms(clock),
        };

        let token_id = object::id(&sbt);

        // イベント発行
        event::emit(SBTMinted {
            token_id,
            token_type: 1,
            recipient,
            fighter_name: string::utf8(fighter_name),
        });

        // SBTを受取人に転送
        transfer::transfer(sbt, recipient);
    }

    // ==================== ビュー関数 ====================

    /// 選手の現在の資金調達状況を取得
    public fun get_fighter_funding_status(fighter: &Fighter): (u64, u64, u64, u8) {
        (
            fighter.funding_goal,
            fighter.current_funding,
            fighter.investor_count,
            fighter.status
        )
    }

    /// 投資家の合計投資額を取得
    public fun get_investor_total(registry: &InvestorRegistry, investor: address): u64 {
        if (table::contains(&registry.investors, investor)) {
            *table::borrow(&registry.investors, investor)
        } else {
            0
        }
    }

    /// プラットフォーム統計を取得
    public fun get_platform_stats(platform: &Platform): (u64, u64, u64) {
        (
            platform.total_fighters,
            platform.total_investments,
            platform.total_volume
        )
    }

    // ==================== テスト用関数 ====================

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
