ALTER TABLE public.updates ADD COLUMN IF NOT EXISTS deadline date, ADD COLUMN IF NOT EXISTS urgent boolean NOT NULL DEFAULT false;
-- Seed a couple of demo deadlines/urgency for the first few rows so the UI shows badges
UPDATE public.updates SET urgent = true, deadline = (CURRENT_DATE + INTERVAL '3 days')::date WHERE id IN (SELECT id FROM public.updates ORDER BY sort_order, created_at LIMIT 2);
UPDATE public.updates SET deadline = (CURRENT_DATE + INTERVAL '15 days')::date WHERE deadline IS NULL AND id IN (SELECT id FROM public.updates ORDER BY sort_order, created_at OFFSET 2 LIMIT 6);