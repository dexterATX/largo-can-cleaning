# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a Next.js 16 (App Router) + React 19 + TypeScript 5 website for a trash can cleaning service. It includes a custom CMS admin panel for blog management.

### Tech Stack
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **Database**: Supabase (PostgreSQL with RLS policies)
- **Auth**: Custom session-based authentication (bcrypt + secure HTTP-only cookies)
- **Animations**: Motion (framer-motion successor), GSAP for complex animations

### Key Directories

- `src/app/` - Next.js App Router pages and API routes
  - `src/app/api/admin/` - Protected admin API endpoints (posts, categories, media, auth)
  - `src/app/api/blog/` - Public blog API endpoints
  - `src/app/admin/` - Admin CMS pages (protected by AuthGuard)
- `src/components/` - React components
  - `sections/` - Homepage sections (Hero, Services, Process, Testimonials, etc.)
  - `pages/` - Page-specific content components
  - `admin/` - Admin panel components (PostEditor uses TipTap rich text editor)
  - `ui/` - Reusable UI primitives
- `src/lib/` - Utilities and shared logic
  - `supabase/client.ts` - Browser Supabase client
  - `supabase/server.ts` - Server-side Supabase client (uses cookies)
  - `supabase/admin.ts` - Service role client for admin operations
  - `auth/session.ts` - Session management (create, verify, destroy)
  - `schema.ts` - JSON-LD structured data generators for SEO
- `src/types/admin.ts` - TypeScript interfaces for blog posts, categories, media, analytics

### Authentication Flow

1. Admin login at `/admin/login` validates against `ADMIN_PASSWORD_HASH` env var
2. Successful login creates session in `admin_sessions` table and sets HTTP-only cookie
3. `AuthGuard` component wraps admin pages, verifies session via `/api/admin/auth/verify`
4. All admin API routes call `verifySession()` from `src/lib/auth/session.ts`

### Database Tables

- `blog_posts` - Blog articles with status (draft/published/scheduled)
- `categories` - Blog categories with colors
- `media` - Uploaded images stored in Supabase Storage
- `admin_sessions` - Active admin sessions
- `page_views` - Analytics data

### Supabase Client Pattern

```typescript
// Browser components
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server components/API routes (reads cookies)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Admin operations (service role, bypasses RLS)
import { createAdminClient } from '@/lib/supabase/admin'
const supabase = createAdminClient()
```

### Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`

### SEO

Business info and JSON-LD schema generators are centralized in `src/lib/schema.ts`. The `BUSINESS_INFO` constant contains all location/contact data used throughout the site.
