# App Layout Structure

## Overview

The application uses Next.js 14+ App Router with route groups to organize pages by authentication state and purpose.

## Route Groups

### `(public)` - Unauthenticated Public Pages
**Purpose:** All public-facing pages accessible without authentication.

**Layout:** `src/app/(public)/layout.tsx`
- Snowfall effect for festive ambiance
- SiteHeader with navigation and auth buttons
- SiteFooter with links and social media
- Full-width, overflow-hidden container

**Pages:**
- `/` - Landing page (Hero, Features, How It Works, Testimonials, FAQ, CTA)
- `/login` - User login page
- `/register` - New user registration page
- Additional public routes...

### `(pages)` - Authenticated Protected Pages
**Purpose:** Dashboard and app features requiring authentication.

**Layout:** `src/app/(pages)/layout.tsx` (if exists, or will be created)
- Protected by middleware
- Different header (user menu, notifications, etc.)
- App-specific navigation

**Pages:**
- `/dashboard` - User dashboard
- `/groups` - Secret Santa groups management
- `/profile` - User profile settings
- Additional protected routes...

## Layout Hierarchy

```
src/app/
├── layout.tsx                 # Root layout (fonts, metadata, providers)
├── globals.css                # Global styles
├── (public)/                  # Public pages route group
│   ├── layout.tsx            # Snowfall + SiteHeader + SiteFooter
│   ├── page.tsx              # Landing page
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── register/
│       └── page.tsx          # Register page
├── (pages)/                   # Protected pages route group
│   ├── layout.tsx            # App layout (different from public)
│   ├── dashboard/
│   │   └── page.tsx
│   └── groups/
│       └── page.tsx
└── api/                       # API routes
    └── auth/
        └── [...nextauth]/
            └── route.ts
```

## Current Implementation Details

### Public Layout Styling
```tsx
<div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
  <Snowfall />
  <SiteHeader />
  <main style={{ width: "100%", overflow: "hidden" }}>{children}</main>
  <SiteFooter />
</div>
```

**Why these styles?**
- `position: relative` - Allows absolute positioning of Snowfall effect
- `width: 100%` - Prevents unexpected width calculations
- `overflow: hidden` - Prevents horizontal scrolling issues on mobile
- Applied to both container and main for defense in depth

### Mobile Responsiveness
All layouts use:
- `overflow-x: hidden` to prevent horizontal scroll
- `max-width: 100vw` to constrain width
- `box-sizing: border-box` for predictable sizing
- Mobile-first responsive breakpoints: 640px, 768px, 1024px
