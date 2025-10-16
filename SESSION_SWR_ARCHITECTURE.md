# Session + SWR Hybrid Architecture

## Overview

This app uses a **hybrid approach** combining NextAuth Session (JWT) with SWR for optimal performance and user experience.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  1. User Logs In                                │
│  ↓                                              │
│  2. Backend Returns Tokens + User Data          │
│  ↓                                              │
│  3. NextAuth Stores in Session (JWT)            │
│     - firstName, lastName, email                │
│     - role, isVerified                          │
│     - accessToken, refreshToken                 │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  4. Page Loads                                  │
│  ↓                                              │
│  5. useCurrentUser() Hook                       │
│     - Gets session data (instant)               │
│     - Uses as SWR fallbackData                  │
│     - NO API CALL on mount! ✅                  │
│  ↓                                              │
│  6. User Sees Data Immediately                  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  7. User Verifies Email                         │
│  ↓                                              │
│  8. Call mutateUser()                           │
│  ↓                                              │
│  9. SWR Fetches Fresh Data from API             │
│  ↓                                              │
│  10. UI Updates Automatically                   │
│  ↓                                              │
│  11. Session Updates via JWT Callback           │
└─────────────────────────────────────────────────┘
```

## How It Works

### Initial Load (No Extra API Call)

```tsx
// Session already has user data from login
const session = {
  user: { firstName: "John", lastName: "Doe", email: "john@example.com" },
  isVerified: false,
  accessToken: "..."
};

// useCurrentUser uses session as fallback
const { user } = useCurrentUser();
// user = { first_name: "John", last_name: "Doe", is_verified: false }
// ✅ Instant! No loading state! No API call!
```

### After Mutation (Fetch Fresh Data)

```tsx
// User verifies email
await verifyEmail(code);

// Manually trigger refetch
await mutateUser();
// ✅ NOW it calls /api/users/me/
// ✅ Gets fresh is_verified: true
// ✅ UI updates automatically
```

## Benefits

### ✅ Performance
- **No extra API call** on initial page load
- Session data is available immediately (from JWT)
- Only fetches when explicitly needed (mutations)

### ✅ Fresh Data When Needed
- Mutations trigger refetch automatically
- Always get latest data after updates
- No stale data issues

### ✅ Offline First
- Works even if backend is temporarily down
- Session data is always available
- Graceful degradation

### ✅ Simple Mental Model
- Session = Initial/Fallback data (fast)
- SWR = Fresh data after updates (accurate)

## Configuration

### Key SWR Options

```tsx
{
  fallbackData: initialData,      // Use session as initial data
  revalidateOnMount: false,        // Don't fetch on mount (we have fallback)
  revalidateOnFocus: false,        // Don't refetch on window focus
  revalidateOnReconnect: true,     // Refetch on network reconnect
}
```

## When to Use Each

### Use Session Data When:
- ✅ Displaying user info on initial load
- ✅ Checking authentication status
- ✅ Using access tokens for API calls
- ✅ Showing user name in navbar

### Trigger SWR Refetch When:
- ✅ User updates profile
- ✅ User verifies email
- ✅ Admin changes user role
- ✅ Any mutation to user data

## Code Examples

### Initial Render (Uses Session)

```tsx
function Dashboard() {
  const { user, isLoading } = useCurrentUser();
  
  // isLoading = false (session data available)
  // user = session data converted to User format
  // No API call made! ✅
  
  return <h1>Welcome, {user.first_name}!</h1>;
}
```

### After Update (Fetches Fresh)

```tsx
function VerifyEmailButton() {
  const { mutateUser } = useCurrentUser();
  
  const handleVerify = async () => {
    await verifyEmail(code);
    
    // NOW it calls the API
    await mutateUser();
    // Fresh data with is_verified: true
  };
}
```

## Session vs SWR Comparison

| Feature | Session Only | SWR Only | Hybrid (Our Approach) |
|---------|-------------|----------|----------------------|
| Initial Load Speed | ⚡ Instant | 🐌 Loading | ⚡ Instant |
| Fresh After Update | ❌ Need logout | ✅ Automatic | ✅ Automatic |
| Offline Support | ✅ Works | ❌ Fails | ✅ Works |
| Extra API Calls | ✅ None | ❌ Every mount | ✅ Only on mutate |
| Code Complexity | 😊 Simple | 😊 Simple | 😊 Simple |

## Alternative: SWR Only (Not Recommended)

If you removed session data storage:

```tsx
// ❌ Problem: Every page load fetches
const { user, isLoading } = useCurrentUser();
// isLoading = true on every mount
// User sees loading spinner every time
// Extra API call on every page
```

## Alternative: Session Only (Not Recommended)

If you removed SWR:

```tsx
// ❌ Problem: Stale data after updates
const session = useSession();
await verifyEmail();
// session.isVerified still false!
// Need to logout/login or reload page
```

## Migration Path

If you want to **remove session storage** and use **SWR only**:

1. Remove user data from JWT callback (keep only tokens)
2. Remove `fallbackData` from SWR config
3. Accept loading states on initial mount

**Trade-off:** Simpler auth code, but slower initial load.

## Recommendation

**Keep the hybrid approach!** It gives you:
- ⚡ Fast initial loads (session)
- 🔄 Fresh data when needed (SWR)
- 💾 Offline support (session fallback)
- 🎯 Best of both worlds

The only "redundancy" is storing ~100 bytes of user data in two places, which is negligible compared to the UX benefits.
