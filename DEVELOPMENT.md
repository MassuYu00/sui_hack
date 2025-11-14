# Development Guide

## Project Architecture

### Authentication Flow

```
User clicks login → OAuth redirect → Provider authentication → 
JWT token received → ZK proof generation → Sui address creation → 
Session stored → Dashboard redirect
```

### Key Components

1. **ZKLogin Integration** (`lib/zklogin.ts`)
   - Nonce generation
   - OAuth URL creation
   - JWT parsing
   - ZK proof generation
   - Sui address derivation

2. **Session Management** (`lib/session-manager.ts`)
   - Session creation and storage
   - Auto-refresh mechanism
   - Event listeners
   - Expiry management

3. **Auth Context** (`lib/auth-context.tsx`)
   - Global authentication state
   - Login/logout handlers
   - OAuth callback processing
   - Session monitoring

### File Structure

```
lib/
├── zklogin.ts           # ZKLogin core functionality
├── session-manager.ts   # Session handling
├── auth-context.tsx     # React context for auth
└── utils.ts            # Utility functions

app/
├── auth/
│   └── callback/       # OAuth callback handler
├── login/              # Login page
├── dashboard/          # Protected dashboard
├── invest/             # Investment page
├── fighter/[name]/     # Dynamic fighter pages
└── wallet/             # Wallet management

components/
├── ui/                 # shadcn/ui components
├── login-button.tsx    # OAuth login buttons
├── dashboard-*.tsx     # Dashboard components
├── fighter-*.tsx       # Fighter components
└── wallet-*.tsx        # Wallet components
```

## Development Workflow

### 1. Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment template
cp .env.example .env.local

# Configure OAuth credentials (see ZKLOGIN_SETUP.md)
```

### 2. Development

```bash
# Start dev server
npm run dev

# Open browser at http://localhost:3000
```

### 3. Testing OAuth Flow

1. Go to `/login`
2. Click Google or Facebook button
3. Authorize the application
4. Verify redirect to `/auth/callback`
5. Check dashboard access at `/dashboard`

### 4. Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Common Development Tasks

### Adding a New Protected Page

1. Create page in `app/` directory
2. Import `useAuth` hook
3. Add authentication check:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function MyPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isClient, router])

  if (!isClient) return null

  return <div>Protected Content</div>
}
```

### Adding a New Component

```bash
# Create component file
touch components/my-component.tsx

# Import and use
import { MyComponent } from '@/components/my-component'
```

### Accessing Session Data

```typescript
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { session, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) return <div>Not logged in</div>
  
  return (
    <div>
      <p>Address: {session?.address}</p>
      <p>Email: {session?.userEmail}</p>
    </div>
  )
}
```

### Working with Sui Blockchain

```typescript
import { SuiClient } from '@mysten/sui/client'

// Create client
const client = new SuiClient({ 
  url: process.env.NEXT_PUBLIC_SUI_RPC_URL 
})

// Example: Get balance
async function getBalance(address: string) {
  const balance = await client.getBalance({
    owner: address,
  })
  return balance
}
```

## Debugging

### Enable Debug Mode

```bash
# In .env.local
NEXT_PUBLIC_DEBUG=true
```

### Check Session State

```typescript
import { loadSession } from '@/lib/session-manager'

// In browser console
console.log(loadSession())
```

### Common Issues

**Issue: OAuth redirect not working**
- Check redirect URI matches OAuth config exactly
- Verify environment variables are set
- Check browser console for errors

**Issue: Session expires immediately**
- Check system time is correct
- Verify `NEXT_PUBLIC_SESSION_EXPIRY_HOURS` is set
- Check browser localStorage

**Issue: ZK proof generation fails**
- Verify Sui network is accessible
- Check `NEXT_PUBLIC_PROVER_URL` is correct
- Ensure JWT is valid

## Testing Checklist

Before deployment:

- [ ] OAuth login works for Google
- [ ] OAuth login works for Facebook
- [ ] Session persists across page refreshes
- [ ] Protected pages redirect to login
- [ ] Logout clears session properly
- [ ] Session expires after configured time
- [ ] Auto-refresh works correctly
- [ ] Build completes without errors
- [ ] No console errors in production build

## Performance Optimization

### Code Splitting

Next.js automatically code splits by route. For manual splitting:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <p>Loading...</p>,
})
```

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src="/fighter-photo.jpg"
  alt="Fighter"
  width={500}
  height={300}
/>
```

### Caching

Use React Query for data fetching (future enhancement):

```bash
npm install @tanstack/react-query
```

## Security Best Practices

1. **Never expose secrets in client code**
   - Use `NEXT_PUBLIC_` prefix only for public data
   - Keep sensitive keys server-side

2. **Validate all user input**
   - Use Zod schemas for validation
   - Sanitize before displaying

3. **Use HTTPS in production**
   - Enforce secure connections
   - Set secure cookie flags

4. **Implement rate limiting**
   - Limit OAuth attempts
   - Protect API endpoints

5. **Regular dependency updates**
   ```bash
   npm audit
   npm update
   ```

## Contributing

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Add comments for complex logic
- Use meaningful variable names

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request
```

### Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [ZKLogin Documentation](https://docs.sui.io/concepts/cryptography/zklogin)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
