# ZKLogin Setup Guide

This guide will help you set up OAuth providers (Google and Facebook) for ZKLogin authentication in Fighter's Rising.

## Prerequisites

- A Google Cloud Platform account
- A Facebook Developer account
- Your application deployed or running locally

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable Google+ API

1. In the left sidebar, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External** (for development)
   - App name: **Fighter's Rising**
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `openid`, `email`, `profile`
   - Add test users (for development)

4. After configuring consent screen, create OAuth client ID:
   - Application type: **Web application**
   - Name: **Fighter's Rising Web Client**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

5. Click **Create**
6. Copy your **Client ID** and **Client Secret**

### 4. Update Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Facebook OAuth Setup

### 1. Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Choose **Consumer** as the app type
4. Fill in:
   - App name: **Fighter's Rising**
   - Contact email: Your email
5. Click **Create App**

### 2. Add Facebook Login Product

1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** as the platform
4. Enter your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

### 3. Configure OAuth Settings

1. In the left sidebar, go to **Facebook Login** > **Settings**
2. Add OAuth Redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
3. Enable **Use Strict Mode for Redirect URIs**
4. Save changes

### 4. Get App Credentials

1. Go to **Settings** > **Basic**
2. Copy your **App ID** and **App Secret**

### 5. Update Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

## Sui Network Configuration

### 1. Choose Your Network

For development, use **devnet**:

```bash
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.devnet.sui.io:443
NEXT_PUBLIC_SUI_NETWORK=devnet
NEXT_PUBLIC_PROVER_URL=https://prover-dev.mystenlabs.com/v1
```

For production, use **mainnet**:

```bash
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
NEXT_PUBLIC_SUI_NETWORK=mainnet
NEXT_PUBLIC_PROVER_URL=https://prover.mystenlabs.com/v1
```

### 2. Generate User Salt

Generate a secure random salt for your application:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

Add to `.env.local`:

```bash
NEXT_PUBLIC_USER_SALT=your-generated-salt-here
```

⚠️ **Important**: Keep this salt secret and consistent. Changing it will invalidate all existing user addresses.

## Complete .env.local Example

```bash
# Sui Network
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.devnet.sui.io:443
NEXT_PUBLIC_SUI_NETWORK=devnet
NEXT_PUBLIC_PROVER_URL=https://prover-dev.mystenlabs.com/v1

# ZKLogin
NEXT_PUBLIC_USER_SALT=your-secure-random-salt-here

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123

# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=1234567890123456
FACEBOOK_CLIENT_SECRET=abcdef1234567890

# App Config
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SESSION_EXPIRY_HOURS=24
NEXT_PUBLIC_DEBUG=true
```

## Testing Your Setup

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Google Login

1. Go to `http://localhost:3000/login`
2. Click the **Google** button
3. You should be redirected to Google's consent screen
4. After authorizing, you should be redirected back to `/auth/callback`
5. The ZKLogin process will generate your Sui address
6. You should be redirected to the dashboard

### 3. Test Facebook Login

Follow the same steps with the **Facebook** button.

## Troubleshooting

### "redirect_uri_mismatch" Error

- Ensure your redirect URI in OAuth settings exactly matches:
  - Development: `http://localhost:3000/auth/callback`
  - Production: `https://yourdomain.com/auth/callback`
- No trailing slashes
- Use exact protocol (http vs https)

### "Invalid state parameter" Error

- This indicates a potential CSRF attack or session issue
- Clear your browser's localStorage and sessionStorage
- Try the login flow again

### ZK Proof Generation Failed

- Check that your Sui network is accessible
- Verify `NEXT_PUBLIC_PROVER_URL` is correct
- For devnet: `https://prover-dev.mystenlabs.com/v1`
- Check the browser console for detailed error messages

### OAuth Consent Screen Issues

For Google:
- Add test users in the OAuth consent screen settings
- Your app must be in "Testing" mode for non-verified apps

For Facebook:
- Your app must be in "Development" mode or "Live" mode
- Add test users in **Roles** > **Test Users**

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Rotate** OAuth secrets regularly
3. **Use different** credentials for development and production
4. **Enable** rate limiting in production
5. **Monitor** authentication logs for suspicious activity
6. **Keep** the user salt secret and backed up securely

## Production Deployment

Before going to production:

1. ✅ Switch to Sui mainnet
2. ✅ Use production OAuth credentials
3. ✅ Update redirect URIs to production domain
4. ✅ Enable HTTPS
5. ✅ Set secure session configuration
6. ✅ Verify Google app and complete OAuth verification
7. ✅ Move Facebook app to "Live" mode
8. ✅ Test thoroughly with real users

## Support

For issues with:
- **Sui ZKLogin**: [Sui Documentation](https://docs.sui.io/concepts/cryptography/zklogin)
- **Google OAuth**: [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- **Facebook Login**: [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)

## Additional Resources

- [Sui ZKLogin Guide](https://docs.sui.io/concepts/cryptography/zklogin)
- [OAuth 2.0 Best Practices](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect Specification](https://openid.net/connect/)
