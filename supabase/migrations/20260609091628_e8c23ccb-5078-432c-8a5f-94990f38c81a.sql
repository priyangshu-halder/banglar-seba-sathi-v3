
-- UPDATES & ALERTS
CREATE TABLE public.updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  bn TEXT NOT NULL DEFAULT '',
  tag TEXT NOT NULL DEFAULT 'Announcement',
  tone TEXT NOT NULL DEFAULT 'bg-gradient-hero',
  description TEXT NOT NULL DEFAULT '',
  youtube_url TEXT,
  has_video BOOLEAN NOT NULL DEFAULT false,
  online_label TEXT,
  online_url TEXT,
  offline_where TEXT,
  offline_steps TEXT[] NOT NULL DEFAULT '{}',
  offline_docs TEXT[] NOT NULL DEFAULT '{}',
  helpline TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.updates TO anon, authenticated;
GRANT ALL ON public.updates TO service_role;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read updates" ON public.updates FOR SELECT USING (true);

-- BENEFITS
CREATE TABLE public.benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bn TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'All',
  amount TEXT NOT NULL DEFAULT '',
  eligibility TEXT[] NOT NULL DEFAULT '{}',
  docs TEXT[] NOT NULL DEFAULT '{}',
  process TEXT NOT NULL DEFAULT '',
  apply_url TEXT,
  tone TEXT NOT NULL DEFAULT 'bg-rose-50 text-rose-600 border-rose-200',
  icon TEXT NOT NULL DEFAULT 'Gift',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.benefits TO anon, authenticated;
GRANT ALL ON public.benefits TO service_role;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read benefits" ON public.benefits FOR SELECT USING (true);

-- SERVICES (includes offices, documents, events for "near you")
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bn TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'office', -- office | document | event | emergency
  meta TEXT NOT NULL DEFAULT '',
  link TEXT,
  icon TEXT NOT NULL DEFAULT 'Building2',
  tone TEXT NOT NULL DEFAULT 'bg-primary',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read services" ON public.services FOR SELECT USING (true);

-- CITIZEN REPORTS
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL UNIQUE DEFAULT ('CMP-' || lpad(floor(random()*9000+1000)::int::text, 4, '0')),
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.reports TO anon, authenticated;
GRANT SELECT ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit report" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "tracker can read own by phone" ON public.reports FOR SELECT USING (false);
-- (admin reads via service_role bypass)

-- ADMIN CREDENTIALS (single-row table; server-side only)
CREATE TABLE public.admin_credentials (
  id INT PRIMARY KEY DEFAULT 1,
  admin_id TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  iterations INT NOT NULL DEFAULT 100000,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
GRANT ALL ON public.admin_credentials TO service_role;
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
-- no public policies; only service_role can touch
