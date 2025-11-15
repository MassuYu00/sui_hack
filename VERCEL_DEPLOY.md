# Environment Variables for Vercel Deployment

Copy these environment variables to your Vercel project settings.

## Required Variables

### Sui Configuration
```
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_PACKAGE_ID=0xfa48cb306bdf22392da91831de6c0bf7596cc4d4f2a8a1fc5036438019af5702
NEXT_PUBLIC_ADMIN_CAP_ID=0x3e5fad570f634775a4dac45309ae3179c619ef0389d3138c7a1b11493bd759ab
NEXT_PUBLIC_PLATFORM_ID=0xd2fbce0d946bc0f16e08eeacdf7833c0c52b281875ac3284d2dc8760372cc9ce
NEXT_PUBLIC_PROVER_URL=https://prover-dev.mystenlabs.com/v1
```

### Wallet Private Key (for NFT minting)
```
SUI_PRIVATE_KEY=your_private_key_here
```

### ZKLogin
```
NEXT_PUBLIC_USER_SALT=129140163793103333
```

### Google OAuth
Get from https://console.cloud.google.com/
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Facebook OAuth (Optional)
Get from https://developers.facebook.com/
```
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your_facebook_client_id_here
```

### App Configuration
```
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SESSION_EXPIRY_HOURS=24
NEXT_PUBLIC_DEBUG=false
```

### Mock Mode (set to false for production)
```
NEXT_PUBLIC_MOCK_AUTH=false
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to https://vercel.com/
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Configure Environment Variables
1. Go to Project Settings → Environment Variables
2. Add all the variables listed above
3. **Important:** Update `NEXT_PUBLIC_BASE_URL` to your Vercel domain

### 4. Update OAuth Redirect URIs
After deployment, update your OAuth redirect URIs:

**Google Console:**
- Authorized JavaScript origins: `https://your-domain.vercel.app`
- Authorized redirect URIs: `https://your-domain.vercel.app/auth/callback`

**Facebook Developer:**
- Valid OAuth Redirect URIs: `https://your-domain.vercel.app/auth/callback`

### 5. Deploy
Click "Deploy" and Vercel will:
- Install dependencies
- Build the Next.js app
- Deploy to production

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] OAuth redirect URIs updated
- [ ] Base URL updated to production domain
- [ ] Mock auth disabled (NEXT_PUBLIC_MOCK_AUTH=false)
- [ ] Test login flow
- [ ] Test investment flow
- [ ] Test scout proposal submission
- [ ] Check admin dashboard access

## Troubleshooting

### Build Errors
- Check Node.js version (requires 18+)
- Verify all environment variables are set
- Check for TypeScript errors locally first

### OAuth Errors
- Verify redirect URIs match exactly (including https://)
- Check that client IDs are correct
- Ensure OAuth apps are published/live

### Blockchain Errors
- Verify contract addresses are correct
- Check Sui network is accessible
- Ensure private key has sufficient balance

## Production Recommendations

1. **Switch to Mainnet:**
   - Update `NEXT_PUBLIC_SUI_NETWORK=mainnet`
   - Deploy contracts to mainnet
   - Update contract addresses

2. **Security:**
   - Rotate private keys regularly
   - Use separate keys for production
   - Enable Vercel security features

3. **Performance:**
   - Enable Vercel Analytics
   - Monitor build times
   - Optimize images

4. **Monitoring:**
   - Set up error tracking
   - Monitor transaction success rates
   - Track user engagement

## Support

For issues:
- Check Vercel deployment logs
- Review Next.js build output
- Check browser console for errors
- Verify Sui network status

---

Ready to deploy? Follow the steps above and your app will be live in minutes!
