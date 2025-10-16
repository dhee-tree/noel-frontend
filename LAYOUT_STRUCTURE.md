# Layout Structure Documentation

## Overview
This application uses a multi-layout architecture to separate public pages, authentication pages, and private authenticated pages.

## Layout Hierarchy

```
app/
├── layout.tsx                    → ROOT LAYOUT (Global)
│   - Auth providers (SessionProvider)
│   - Inactivity tracking
│   - Global fonts & styles
│   - Applies to: ALL pages
│
├── (main)/                       → PUBLIC PAGES
│   ├── layout.tsx
│   │   - Snowfall animation
│   │   - Public site header
│   │   - Footer
│   │   - Applies to: Landing page
│   └── page.tsx                  → Landing page (/)
│
├── (auth)/                       → AUTHENTICATION PAGES
│   ├── layout.tsx
│   │   - Snowfall animation
│   │   - Public site header
│   │   - Footer
│   │   - Applies to: Login, Register
│   ├── login/page.tsx            → Login page
│   └── register/page.tsx         → Register page
│
└── (pages)/                      → PRIVATE PAGES (Authenticated)
    ├── layout.tsx
    │   - AuthNavbar (with user menu, navigation, logout)
    │   - Applies to: Dashboard, Groups, etc.
    ├── dashboard/page.tsx        → Dashboard
    └── groups/page.tsx           → Groups
```

## Components

### AuthNavbar
**Location:** `src/components/navigation/AuthNavbar/`

**Features:**
- Christmas-themed red gradient navbar
- Navigation links (Dashboard, Groups)
- User dropdown menu with:
  - Display name
  - Email
  - Logout button
- Responsive mobile menu
- Active link highlighting
- Automatic callback URL handling on logout

**Usage:**
```tsx
import { AuthNavbar } from '@/components/navigation/AuthNavbar/AuthNavbar';

<AuthNavbar />
```

## Authentication Flow

### Login with Callback URL
1. User logs out from `/groups`
2. Redirects to `/login?callbackUrl=%2Fgroups`
3. User logs in (credentials or Google)
4. Redirects back to `/groups`

**Implementation:**
```tsx
// Logout handler
const handleSignOut = () => {
  const callbackUrl = encodeURIComponent(pathname);
  signOut({ callbackUrl: `/login?callbackUrl=${callbackUrl}` });
};

// Login page
const searchParams = useSearchParams();
const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
// Use callbackUrl after successful login
```

## Session Management

### Server-side Session
```tsx
// Root layout (app/layout.tsx)
const session = await auth(); // Get session on server
<AuthProvider session={session}>  // Pass to client
```

### Client-side Session
```tsx
// Any client component
const { data: session } = useSession();
// Access session.user, session.accessToken, etc.
```

## API Request Utilities

### For Client Components (Recommended)
```tsx
import { useApiRequest } from "@/hooks/useApiRequest";

const { apiRequest } = useApiRequest();
const res = await apiRequest('/api/endpoint', { method: 'POST' });
```

### For Server Components / API Routes
```tsx
import { apiRequest } from "@/lib/utils";

const res = await apiRequest('/api/endpoint', {
  method: 'POST',
  accessToken: session?.accessToken,
});
```

## Styling

- **Fonts:**
  - Sans-serif: Poppins (300, 400, 500, 600, 700)
  - Christmas: Mountains of Christmas (400, 700)
  
- **Theme:**
  - Primary color: Christmas red (#c62828 to #8b0000 gradient)
  - Bootstrap components
  - Custom CSS modules

## Route Protection

Protected by middleware in `src/middleware.ts`:
- Public routes: `/`, `/login`, `/register`, `/about`, `/faq`
- Private routes: `/dashboard`, `/groups` (requires authentication)
- Role-based access control available

## Best Practices

1. **Use route groups** `(name)` to organize layouts without affecting URLs
2. **Keep root layout minimal** - only app-wide providers
3. **Use specific layouts** for different page types (public vs. private)
4. **Pass session from server** to client providers for hydration
5. **Use hooks in client components** for convenience
6. **Use direct utils in server components** for flexibility
