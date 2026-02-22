-- ============================================
-- Multi-concession support
-- ============================================

-- Junction table: users can belong to multiple concessions
CREATE TABLE IF NOT EXISTS public.user_concessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concession_id uuid NOT NULL REFERENCES public.concessions(id) ON DELETE CASCADE,
  is_active boolean DEFAULT false,
  role text DEFAULT 'member', -- member, manager, admin
  granted_at timestamptz DEFAULT now(),
  granted_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, concession_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_concessions_user ON public.user_concessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_concessions_concession ON public.user_concessions(concession_id);
CREATE INDEX IF NOT EXISTS idx_user_concessions_active ON public.user_concessions(user_id, is_active) WHERE is_active = true;

-- Migrate existing data: each user's current concession_id becomes their first entry
INSERT INTO public.user_concessions (user_id, concession_id, is_active, role)
SELECT id, concession_id, true,
  CASE
    WHEN role = 'dir_concession' THEN 'admin'
    WHEN role = 'chef_ventes' THEN 'manager'
    ELSE 'member'
  END
FROM public.profiles
WHERE concession_id IS NOT NULL
ON CONFLICT (user_id, concession_id) DO NOTHING;

-- RLS policies
ALTER TABLE public.user_concessions ENABLE ROW LEVEL SECURITY;

-- Users can see their own concession assignments
CREATE POLICY "Users can view their own concession assignments"
  ON public.user_concessions FOR SELECT
  USING (auth.uid() = user_id);

-- Dir_concession+ can see all assignments in their concessions
CREATE POLICY "Managers can view concession members"
  ON public.user_concessions FOR SELECT
  USING (
    concession_id IN (
      SELECT uc.concession_id FROM public.user_concessions uc
      WHERE uc.user_id = auth.uid() AND uc.role IN ('admin', 'manager')
    )
  );

-- Only admin-role users in a concession can insert/update/delete
CREATE POLICY "Admins can manage concession assignments"
  ON public.user_concessions FOR ALL
  USING (
    concession_id IN (
      SELECT uc.concession_id FROM public.user_concessions uc
      WHERE uc.user_id = auth.uid() AND uc.role = 'admin'
    )
  );

-- Helper function to get the current active concession for a user
CREATE OR REPLACE FUNCTION public.get_active_concession_id(p_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT concession_id
  FROM public.user_concessions
  WHERE user_id = p_user_id AND is_active = true
  LIMIT 1;
$$;

-- Function to switch active concession
CREATE OR REPLACE FUNCTION public.switch_active_concession(p_user_id uuid, p_concession_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify user has access to this concession
  IF NOT EXISTS (
    SELECT 1 FROM public.user_concessions
    WHERE user_id = p_user_id AND concession_id = p_concession_id
  ) THEN
    RETURN false;
  END IF;

  -- Deactivate all
  UPDATE public.user_concessions
  SET is_active = false
  WHERE user_id = p_user_id;

  -- Activate the selected one
  UPDATE public.user_concessions
  SET is_active = true
  WHERE user_id = p_user_id AND concession_id = p_concession_id;

  -- Update the profile's concession_id for backward compatibility
  UPDATE public.profiles
  SET concession_id = p_concession_id
  WHERE id = p_user_id;

  RETURN true;
END;
$$;
