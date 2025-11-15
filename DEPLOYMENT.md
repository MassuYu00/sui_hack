# 🚀 Fighters Rising - Deployment Information

## Testnet Deployment - January 2025

### Contract Information

**Package ID**: `0x906506c06bfb9a087b81b96660ada2cc7c2bc7a2fda04fa6aae1fa09716959d0`

**Admin Capability**: `0x1df790a89728922fc7b9577fc486988c230ec7a0709a5e34213cfb5ea4f3519a`

**Platform Object**: `0xe14a57c59c61ceb28d42575e245debb69646ab683eb245a6141f543c90fac201` (Shared)

**Deployer Address**: `0xa025f80d41f67c786727cf0b78dcd17634de49981692818986f12e8600eac0ae`

**Transaction**: `13x6bCg4wmvuoiT4x4PTz6vJdkXvKKW8ibBBX9PpcTuW`

**Explorer**: https://testnet.suivision.xyz/txblock/13x6bCg4wmvuoiT4x4PTz6vJdkXvKKW8ibBBX9PpcTuW

### Gas Usage

- **Computation**: 1,000,000 MIST
- **Storage**: 44,072,400 MIST
- **Total**: ~44.09 MIST (0.044 SUI)

### Network Configuration

- **Network**: Sui Testnet
- **RPC Endpoint**: https://fullnode.testnet.sui.io:443
- **Faucet**: https://faucet.sui.io

### Module Functions

✅ All functions successfully published:

1. `submit_scout_proposal` - Submit new fighter proposals
2. `approve_scout_proposal` - Admin approval with SBT minting
3. `reject_scout_proposal` - Admin rejection with stake collection
4. `invest_in_fighter` - Support fighters, receive NFT shares
5. `distribute_returns` - Distribute rewards (80% investors, 15% fighter, 5% platform)
6. `mint_winning_second_sbt` - Award achievement tokens

### Features Implemented

✅ **Scout Proposals**
- Users submit proposals with 1 SUI stake
- Admin review and approval system
- Automatic Scout Master SBT minting on approval

✅ **Investment System**
- Support fighters with SUI
- Receive tradable InvestmentShare NFTs
- Track ownership percentage

✅ **Soul Bound Tokens (SBT)**
- Non-transferable achievement badges
- Scout Master SBT for approved proposals
- Winning Second SBT for victories

✅ **Reward Distribution**
- 80% to investors (proportional to shares)
- 15% to fighter
- 5% to platform treasury
- Transparent on-chain distribution

### Frontend Integration

Environment variables configured in `.env.local`:
- ✅ Package ID
- ✅ Admin Capability ID
- ✅ Platform Object ID
- ✅ Network set to testnet

### Next Steps

1. Test contract on Sui Explorer
2. Integrate frontend with deployed contract
3. Test scout proposal submission
4. Test admin approval flow
5. Test investment and reward distribution

### Important Notes

⚠️ **Admin Capability**: Keep the AdminCap object secure - it controls all admin functions.

⚠️ **Testnet**: This deployment is on testnet. For mainnet, redeploy with production wallet.

⚠️ **Upgradability**: UpgradeCap saved for future contract upgrades.

### Useful Commands

```bash
# Check platform state
sui client object 0xe14a57c59c61ceb28d42575e245debb69646ab683eb245a6141f543c90fac201

# View admin capability
sui client object 0x1df790a89728922fc7b9577fc486988c230ec7a0709a5e34213cfb5ea4f3519a

# View package
sui client object 0x906506c06bfb9a087b81b96660ada2cc7c2bc7a2fda04fa6aae1fa09716959d0
```

---

**Deployed**: January 14, 2025  
**Sui CLI**: v1.60.1  
**Move Compiler**: Latest (testnet branch)
