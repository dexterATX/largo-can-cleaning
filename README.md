# Largo Can Cleaning

Professional trash can cleaning service website with integrated CMS for Pinellas County, Florida.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + CSS custom properties
- **Database**: Supabase (PostgreSQL)
- **Auth**: Custom session-based (bcrypt + secure cookies)
- **Deployment**: Docker + Nginx reverse proxy

## Prerequisites

- Node.js 18.17+
- npm 9+
- Supabase project (for database)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Yes |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password | Yes |
| `SESSION_SECRET` | Random 32+ char secret for sessions | Yes |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g., https://largocancleaning.com) | Yes |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID (optional) | No |
| `BUILD_TIMESTAMP` | ISO date for sitemap (set at build time) | No |

### Generating Secrets

```bash
# Generate SESSION_SECRET
openssl rand -base64 32

# Generate ADMIN_PASSWORD_HASH (replace 'your-password')
node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (pages)/            # Public pages (home, services, pricing, etc.)
│   ├── admin/              # Admin CMS pages
│   ├── api/                # API routes
│   ├── blog/               # Blog pages (SSR)
│   └── layout.tsx          # Root layout
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # Homepage sections
│   ├── pages/              # Page-specific components
│   ├── admin/              # Admin UI components
│   └── ui/                 # Reusable UI primitives
├── lib/
│   ├── supabase/           # Database clients
│   ├── auth/               # Authentication utilities
│   ├── schema.ts           # JSON-LD SEO schemas
│   └── validation.ts       # Input validation
└── types/                  # TypeScript definitions
```

## Database Setup

Run these SQL commands in Supabase SQL Editor:

```sql
-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category_id UUID REFERENCES categories(id),
  featured_image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMPTZ,
  read_time INTEGER DEFAULT 5,
  author TEXT DEFAULT 'Largo Can Cleaning',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#FF6B00',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin sessions table
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Page views table (analytics)
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  browser TEXT,
  session_id TEXT,
  read_time INTEGER,
  scroll_depth INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

-- Public can insert analytics (rate limited at app level)
CREATE POLICY "Public can insert page views"
  ON page_views FOR INSERT
  WITH CHECK (true);

-- Only service role can read analytics
CREATE POLICY "Service role can read page views"
  ON page_views FOR SELECT
  USING (auth.role() = 'service_role');
```

## Build & Deploy

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

The Docker setup includes:
- Next.js app on port 3000 (internal)
- Nginx reverse proxy on ports 80/443

### Environment for Docker

Create a `.env` file in the project root with production values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD_HASH=$2a$12$...
SESSION_SECRET=your-32-char-secret
```

## Admin CMS

Access the admin panel at `/admin`. Features:

- **Dashboard**: Site statistics overview
- **Posts**: Create/edit/delete blog articles
- **Categories**: Manage blog categories
- **Media**: Upload and manage images
- **Analytics**: View page traffic data
- **Settings**: Site configuration

### Default Admin Login

Set `ADMIN_PASSWORD_HASH` in your environment to the bcrypt hash of your desired password.

## Key Features

- **SEO Optimized**: JSON-LD schemas, meta tags, sitemap, robots.txt
- **Performance**: CSS animations (no JS animation library in header/footer)
- **Accessibility**: WCAG 2.1 compliant, keyboard navigation, focus management
- **Mobile First**: Responsive design, touch-optimized interactions
- **Security**: CSRF protection, rate limiting, input sanitization, CSP headers

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## License

Private - All rights reserved.
