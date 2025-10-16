# Session Refresh Pattern

## Problem
When users update their profile (name, email, verification status), the changes aren't reflected in the session until they log out and back in.

## Solution
Use the `useRefreshSession` hook to fetch fresh user data from the backend and update the NextAuth session without requiring a full logout/login cycle.

## Usage

### Basic Usage

```tsx
import { useRefreshSession } from "@/hooks/useRefreshSession";

function ProfileUpdateComponent() {
  const refreshSession = useRefreshSession();

  const handleUpdateProfile = async (data) => {
    // 1. Update user data via API
    await updateUserProfile(data);
    
    // 2. Refresh the session to reflect changes
    await refreshSession();
    
    // 3. UI updates automatically via NextAuth's session provider
  };
}
```

### Use Cases

#### Email Verification
```tsx
// In VerifyEmailModal.tsx
const refreshSession = useRefreshSession();

const handleVerify = async () => {
  await verifyEmail(code);
  await refreshSession(); // Updates is_verified in session
  // Alert disappears automatically
};
```

#### Profile Updates
```tsx
// In EditProfileModal.tsx
const refreshSession = useRefreshSession();

const handleSave = async (formData) => {
  await updateProfile(formData);
  await refreshSession(); // Updates firstName, lastName, email
  // Navbar shows new name immediately
};
```

#### Role Changes (Admin)
```tsx
// In AdminUserManagement.tsx
const refreshSession = useRefreshSession();

const handleRoleChange = async (userId, newRole) => {
  await updateUserRole(userId, newRole);
  if (userId === currentUserId) {
    await refreshSession(); // Updates role in session
    // Access control updates automatically
  }
};
```

## How It Works

1. **Hook calls** `update()` from NextAuth's `useSession()`
2. **NextAuth triggers** the JWT callback with `trigger: "update"`
3. **JWT callback** merges the new data into the token
4. **Session callback** receives updated token and updates session
5. **All components** using `useSession()` get fresh data reactively

## What Gets Updated

The hook fetches and updates:
- ✅ `firstName`
- ✅ `lastName`
- ✅ `email`
- ✅ `role`
- ✅ `isVerified`

## Notes

- No page reload required
- Works with all NextAuth session consumers
- Handles errors gracefully
- Returns the fresh user data or null on error
- Requires valid `accessToken` in session

## Alternative: Full Page Reload

If you prefer the simpler (but less smooth) approach:

```tsx
const handleUpdate = async () => {
  await updateUserProfile(data);
  window.location.reload(); // ❌ Less ideal - full page refresh
};
```

**Why `useRefreshSession` is better:**
- ✅ No loading screen flicker
- ✅ Preserves component state
- ✅ Faster user experience
- ✅ Better UX for modal workflows
