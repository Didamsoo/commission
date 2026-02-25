-- Migration 007: Add city column to concessions
ALTER TABLE public.concessions ADD COLUMN IF NOT EXISTS city text;
CREATE INDEX IF NOT EXISTS idx_concessions_city ON public.concessions(city);
