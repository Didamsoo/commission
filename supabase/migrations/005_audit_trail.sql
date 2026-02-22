-- ============================================================
-- AutoPerf — Phase 2 : Audit trail pour les fiches de marge
-- Historique automatique des modifications via trigger PostgreSQL
-- ============================================================

-- ============================================================
-- 1. TABLE HISTORIQUE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.fiche_marge_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fiche_marge_id uuid NOT NULL REFERENCES public.fiches_marge(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  before_data jsonb,
  after_data jsonb,
  changed_fields text[],
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 2. INDEX pour les requêtes fréquentes
-- ============================================================

CREATE INDEX idx_fiche_marge_history_fiche ON public.fiche_marge_history(fiche_marge_id);
CREATE INDEX idx_fiche_marge_history_user ON public.fiche_marge_history(user_id);
CREATE INDEX idx_fiche_marge_history_created ON public.fiche_marge_history(created_at DESC);

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.fiche_marge_history ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs authentifiés peuvent voir l'historique de leurs propres fiches
-- et les managers (level >= 2) peuvent voir tout
CREATE POLICY "Users can view history of own fiches" ON public.fiche_marge_history
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.fiches_marge fm
      WHERE fm.id = fiche_marge_id AND fm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.level >= 2
    )
  );

-- ============================================================
-- 4. TRIGGER FUNCTION — Log automatique des modifications
-- ============================================================

CREATE OR REPLACE FUNCTION log_fiche_marge_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.fiche_marge_history (fiche_marge_id, user_id, action, after_data, changed_fields)
    VALUES (NEW.id, NEW.user_id, 'INSERT', to_jsonb(NEW), ARRAY[]::text[]);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.fiche_marge_history (fiche_marge_id, user_id, action, before_data, after_data, changed_fields)
    VALUES (
      NEW.id,
      COALESCE(auth.uid(), NEW.user_id),
      'UPDATE',
      to_jsonb(OLD),
      to_jsonb(NEW),
      (SELECT array_agg(key) FROM jsonb_each(to_jsonb(NEW)) WHERE to_jsonb(NEW) -> key IS DISTINCT FROM to_jsonb(OLD) -> key)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.fiche_marge_history (fiche_marge_id, user_id, action, before_data, changed_fields)
    VALUES (OLD.id, COALESCE(auth.uid(), OLD.user_id), 'DELETE', to_jsonb(OLD), ARRAY[]::text[]);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 5. ATTACH TRIGGER sur fiches_marge
-- ============================================================

DROP TRIGGER IF EXISTS trigger_fiche_marge_audit ON public.fiches_marge;
CREATE TRIGGER trigger_fiche_marge_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.fiches_marge
  FOR EACH ROW EXECUTE FUNCTION log_fiche_marge_changes();

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
