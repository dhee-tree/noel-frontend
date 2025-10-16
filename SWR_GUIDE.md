# SWR Data Fetching Guide

## Overview
This project uses [SWR](https://swr.vercel.app/) for data fetching, caching, and revalidation. SWR is combined with NextAuth Session for optimal performance - session data provides instant initial load, while SWR ensures data stays fresh after mutations.

## Key Architecture Decision

**Session as Initial Data + SWR for Mutations = Best UX**

- ✅ **Initial Load:** Instant (uses session data, no API call)
- ✅ **After Updates:** Fresh (SWR refetches from API)
- ✅ **No Redundant Calls:** Only fetches when explicitly needed

See `SESSION_SWR_ARCHITECTURE.md` for detailed explanation.

## Benefits
- ✅ **No Loading States** - SWR manages loading/error states automatically
- ✅ **Automatic Caching** - Data is cached and shared across components
- ✅ **Revalidation** - Data stays fresh with automatic refetching
- ✅ **Mutation** - Easy updates after API calls (no manual state updates)
- ✅ **Optimistic UI** - Update UI before server responds
- ✅ **TypeScript** - Full type safety

## Available Hooks

### 1. `useCurrentUser()` - Fetch Current User Data

```tsx
import { useCurrentUser } from "@/hooks/useCurrentUser";

function MyComponent() {
  const { user, isLoading, error, mutateUser, isVerified } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div>
      <p>Welcome, {user.first_name}!</p>
      {isVerified && <Badge>Verified ✓</Badge>}
    </div>
  );
}
```

**Returns:**
- `user` - User object (`User | undefined`)
- `isLoading` - Loading state (`boolean`)
- `error` - Error object if request failed
- `mutateUser()` - Function to refetch user data
- `isVerified` - Shorthand for `user?.is_verified` (`boolean`)

### 2. `useUserGroups()` - Fetch User's Groups

```tsx
import { useUserGroups } from "@/hooks/useUserGroups";

function GroupsList() {
  const { groups, isLoading, error, mutateGroups } = useUserGroups();

  if (isLoading) return <div>Loading groups...</div>;
  if (error) return <div>Error loading groups</div>;

  return (
    <ul>
      {groups?.map(group => (
        <li key={group.id}>{group.name} - {group.members} members</li>
      ))}
    </ul>
  );
}
```

**Returns:**
- `groups` - Array of normalized group objects
- `isLoading` - Loading state
- `error` - Error object
- `mutateGroups()` - Function to refetch groups

## Mutation Patterns

### Pattern 1: Refetch After Update (Recommended)

```tsx
const { mutateUser } = useCurrentUser();

const handleUpdateProfile = async (data) => {
  // 1. Update via API
  await fetch('/api/users/me/', {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  
  // 2. Refetch fresh data from server
  await mutateUser();
  
  // 3. UI updates automatically!
};
```

### Pattern 2: Optimistic Update (Advanced)

```tsx
const { user, mutateUser } = useCurrentUser();

const handleVerify = async () => {
  // Update UI immediately (optimistic)
  mutateUser(
    { ...user, is_verified: true },
    false // Don't revalidate yet
  );
  
  // Send request in background
  await verifyEmail();
  
  // Refetch to confirm
  mutateUser();
};
```

### Pattern 3: Global Mutation (No Hook)

```tsx
import { mutateCurrentUser } from "@/hooks/useCurrentUser";

// Useful in callbacks, modals, etc.
const handleAction = async () => {
  await doSomething();
  await mutateCurrentUser(); // Refetches in all components using useCurrentUser
};
```

## Real-World Examples

### Email Verification Modal

```tsx
import { mutateCurrentUser } from "@/hooks/useCurrentUser";

const VerifyEmailModal = () => {
  const handleVerify = async (code) => {
    await apiRequest(`/api/auth/verify-email/${code}/`, { method: "POST" });
    
    // Refetch user data - verification alert disappears automatically
    await mutateCurrentUser();
  };
};
```

### Join Group Action

```tsx
import { useUserGroups } from "@/hooks/useUserGroups";

const JoinGroupButton = () => {
  const { mutateGroups } = useUserGroups();
  
  const handleJoin = async (code) => {
    await joinGroup(code);
    
    // Refetch groups - new group appears automatically
    await mutateGroups();
  };
};
```

### Dashboard with Multiple Data Sources

```tsx
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserGroups } from "@/hooks/useUserGroups";

const Dashboard = () => {
  const { user, isLoading: userLoading, isVerified } = useCurrentUser();
  const { groups, isLoading: groupsLoading } = useUserGroups();
  
  // No manual loading state management needed!
  // No useEffect needed!
  // No useState for data!
  
  return (
    <div>
      {!isVerified && <Alert>Please verify your email</Alert>}
      <h1>Welcome, {user?.first_name}</h1>
      <GroupsList groups={groups} loading={groupsLoading} />
    </div>
  );
};
```

## Configuration

### Global SWR Config (Optional)

Create `app/providers.tsx`:

```tsx
import { SWRConfig } from 'swr';

export function Providers({ children }) {
  return (
    <SWRConfig 
      value={{
        refreshInterval: 0, // Disable auto-refresh (default)
        revalidateOnFocus: false, // Don't refetch on window focus
        revalidateOnReconnect: true, // Refetch on reconnect
        dedupingInterval: 10000, // Dedupe requests within 10s
      }}
    >
      {children}
    </SWRConfig>
  );
}
```

### Custom Fetcher

See `src/lib/swr-fetcher.ts` for the authentication-aware fetcher implementation.

## Migration from useEffect/useState

### Before (Manual State Management)

```tsx
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchUser() {
    try {
      setLoading(true);
      const res = await fetch('/api/users/me/');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  fetchUser();
}, []);

// Need manual refetch function
const refetchUser = () => { /* repeat logic */ };
```

### After (SWR)

```tsx
const { user, isLoading, error } = useCurrentUser();

// Refetch is built-in!
const { mutateUser } = useCurrentUser();
```

**Lines of code:** ~20 → 1 line! 🎉

## Best Practices

1. **Use hooks at component level** - Don't call in loops or conditionals
2. **Mutate after updates** - Always call `mutate()` after API mutations
3. **Trust the cache** - SWR handles staleness automatically
4. **Don't over-refetch** - SWR dedupes requests within 10s by default
5. **Use TypeScript** - All hooks are fully typed

## Troubleshooting

### Data not updating after mutation?
```tsx
// Make sure to await the mutation
await mutateUser(); // ✅
mutateUser(); // ❌ Won't wait for refetch
```

### Seeing stale data?
```tsx
// Force immediate revalidation
mutateUser(undefined, true); // Revalidates immediately
```

### Multiple components using same data?
```tsx
// SWR automatically shares data across components!
// No prop drilling needed
function ComponentA() {
  const { user } = useCurrentUser(); // Fetches once
}

function ComponentB() {
  const { user } = useCurrentUser(); // Uses cached data
}
```

## Resources

- [SWR Documentation](https://swr.vercel.app/)
- [SWR Examples](https://swr.vercel.app/examples)
- [Mutation Guide](https://swr.vercel.app/docs/mutation)
