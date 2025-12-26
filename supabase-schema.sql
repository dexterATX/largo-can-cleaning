-- ============================================
-- CleanCan Pro Admin Panel - Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#FF6B00',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEDIA LIBRARY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(500) NOT NULL,
  original_filename VARCHAR(500) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  file_url VARCHAR(2000) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  alt_text VARCHAR(255),
  caption TEXT,
  folder VARCHAR(255) DEFAULT 'uploads',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  read_time INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords TEXT[],
  og_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  author VARCHAR(255) DEFAULT 'CleanCan Pro',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS TABLE (Key-Value)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAGE VIEWS / ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  referrer VARCHAR(2000),
  referrer_domain VARCHAR(255),
  user_agent TEXT,
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(2),
  city VARCHAR(100),
  session_id VARCHAR(100),
  visitor_id VARCHAR(100),
  read_time INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEO KEYWORD TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword VARCHAR(255) NOT NULL,
  page_path VARCHAR(500),
  position INTEGER,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,2),
  source VARCHAR(50) DEFAULT 'manual',
  tracked_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_page ON seo_keywords(page_path);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- ============================================
-- SEED DATA: Default Categories
-- ============================================
INSERT INTO categories (slug, name, description, sort_order, color) VALUES
  ('tips', 'Tips & How-To', 'Practical tips and tutorials for keeping your bins clean', 1, '#22C55E'),
  ('health', 'Health & Safety', 'Health-related articles about bin hygiene', 2, '#EF4444'),
  ('news', 'Company News', 'CleanCan Pro updates and announcements', 3, '#3B82F6'),
  ('sustainability', 'Eco-Friendly', 'Environmental and sustainability topics', 4, '#10B981')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA: Default Site Settings
-- ============================================
INSERT INTO site_settings (key, value, category) VALUES
  ('business_name', '"CleanCan Pro"', 'general'),
  ('business_tagline', '"Professional Trash Can Cleaning"', 'general'),
  ('business_phone', '"(727) 555-0123"', 'contact'),
  ('business_email', '"info@cleancanpro.com"', 'contact'),
  ('default_meta_title', '"CleanCan Pro | Professional Trash Can Cleaning in Seminole, FL"', 'seo'),
  ('default_meta_description', '"Professional trash can cleaning and sanitization services in Pinellas County. We eliminate 99.9% of bacteria, odors, and grime."', 'seo'),
  ('social_facebook', '""', 'social'),
  ('social_instagram', '""', 'social'),
  ('social_twitter', '""', 'social')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

-- Public read access for categories
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

-- Public can insert page views (for analytics tracking)
CREATE POLICY "Public can insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

-- Service role has full access (bypasses RLS)
-- Note: The service role key automatically bypasses RLS

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
