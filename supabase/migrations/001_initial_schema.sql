-- ============================================================
-- AutoPerf — Phase 2 : Schéma initial de la base de données
-- À exécuter dans le SQL Editor de Supabase Dashboard
-- ============================================================

-- ============================================================
-- 1. TABLES ORGANISATIONNELLES (hiérarchie)
-- ============================================================

-- 1.1 Groupes automobiles (plaque)
CREATE TABLE public.groupes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 1.2 Marques (constructeurs)
CREATE TABLE public.marques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  groupe_id uuid REFERENCES public.groupes(id) ON DELETE SET NULL,
  constructor_targets jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- 1.3 Concessions (sites physiques)
CREATE TABLE public.concessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text,
  address text,
  marque_id uuid REFERENCES public.marques(id) ON DELETE SET NULL,
  groupe_id uuid REFERENCES public.groupes(id) ON DELETE SET NULL,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 2. TABLE UTILISATEURS (profiles)
-- ============================================================

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  role text NOT NULL DEFAULT 'commercial'
    CHECK (role IN ('commercial','chef_ventes','dir_concession','dir_marque','dir_plaque','admin')),
  level int NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  concession_id uuid REFERENCES public.concessions(id) ON DELETE SET NULL,
  equipe_id uuid,  -- FK ajoutée après création de la table equipes
  marque_id uuid REFERENCES public.marques(id) ON DELETE SET NULL,
  groupe_id uuid REFERENCES public.groupes(id) ON DELETE SET NULL,
  manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. EQUIPES (dépend de profiles pour chef_ventes_id)
-- ============================================================

CREATE TABLE public.equipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('VN', 'VO', 'VU', 'APV', 'ADMIN')),
  concession_id uuid REFERENCES public.concessions(id) ON DELETE CASCADE,
  chef_ventes_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  objective jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Ajout de la FK equipe_id sur profiles maintenant que equipes existe
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_equipe_id_fkey
  FOREIGN KEY (equipe_id) REFERENCES public.equipes(id) ON DELETE SET NULL;

-- ============================================================
-- 4. TABLES MÉTIER
-- ============================================================

-- 4.1 Fiches de marge (calculateur)
CREATE TABLE public.fiches_marge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  concession_id uuid REFERENCES public.concessions(id) ON DELETE SET NULL,

  -- Infos générales
  date date NOT NULL DEFAULT CURRENT_DATE,
  vehicle_number text,
  seller_name text,
  client_name text,
  vehicle_sold_name text,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('VO','VP','VU')),

  -- Prix
  purchase_price_ht numeric(12,2),
  purchase_price_ttc numeric(12,2),
  selling_price_ht numeric(12,2),
  selling_price_ttc numeric(12,2),
  trade_in_value_ht numeric(12,2),
  listed_price_ttc numeric(12,2),

  -- Coûts
  warranty_12months numeric(12,2) DEFAULT 0,
  workshop_transfer numeric(12,2) DEFAULT 0,
  preparation_ht numeric(12,2) DEFAULT 0,

  -- Résultats calculés
  initial_margin_ht numeric(12,2),
  remaining_margin_ht numeric(12,2),
  seller_commission numeric(12,2),
  final_margin numeric(12,2),

  -- Détails commission (JSONB pour flexibilité)
  commission_details jsonb DEFAULT '{}',

  -- Flags véhicule
  is_electric_vehicle boolean DEFAULT false,
  has_financing boolean DEFAULT false,
  financed_amount_ht numeric(12,2),
  financing_type text CHECK (financing_type IN ('principal','specific')),
  number_of_services_sold int DEFAULT 0,

  -- VO-spécifique
  purchase_date date,
  order_date date,
  is_other_stock_cession boolean DEFAULT false,

  -- VP/VN-spécifique
  vp_sales_type text,
  vp_model text,
  vn_options jsonb DEFAULT '[]',
  vn_discounts jsonb DEFAULT '[]',
  vn_ford_recovery jsonb DEFAULT '{}',

  -- VU-spécifique
  vu_details jsonb DEFAULT '{}',

  -- Packs et services
  delivery_pack_sold text DEFAULT 'none',
  is_high_penetration_rate boolean DEFAULT false,
  cld_ford_duration text DEFAULT 'none',
  has_maintenance_contract boolean DEFAULT false,
  has_coyote boolean DEFAULT false,
  coyote_duration text DEFAULT 'none',

  -- Accessoires
  has_accessories boolean DEFAULT false,
  accessory_amount_ht numeric(12,2) DEFAULT 0,
  accessory_amount_ttc numeric(12,2) DEFAULT 0,

  -- Statut validation
  status text DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected')),
  approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4.2 Payplans (configuration commissions par concession)
CREATE TABLE public.payplans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concession_id uuid NOT NULL REFERENCES public.concessions(id) ON DELETE CASCADE,
  name text DEFAULT 'Payplan principal',
  config jsonb NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4.3 Défis plateforme (direction → équipes)
CREATE TABLE public.defis_plateforme (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,

  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_role text NOT NULL,
  creator_level int NOT NULL,

  -- Portée
  scope_type text NOT NULL CHECK (scope_type IN ('individual','team','site','brand','group')),
  target_level int NOT NULL CHECK (target_level BETWEEN 1 AND 5),
  target_ids uuid[] DEFAULT '{}',

  -- Challenge
  challenge_type text NOT NULL,
  target_value numeric(12,2) NOT NULL,
  target_unit text,
  target_model_name text,

  -- Période
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,

  -- Récompense
  reward jsonb NOT NULL DEFAULT '{}',

  status text DEFAULT 'draft'
    CHECK (status IN ('draft','upcoming','active','completed','cancelled')),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4.4 Participants aux défis plateforme
CREATE TABLE public.defis_plateforme_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  defi_id uuid NOT NULL REFERENCES public.defis_plateforme(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_score numeric(12,2) DEFAULT 0,
  target_score numeric(12,2),
  progress_rate numeric(5,2) DEFAULT 0,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  ranking int
);

-- 4.5 Défis P2P (entre commerciaux)
CREATE TABLE public.defis_p2p (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  challenger_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenged_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  metric text NOT NULL CHECK (metric IN ('sales_count','revenue','margin','financing_count')),
  duration_days int NOT NULL,
  start_date timestamptz,
  end_date timestamptz,

  challenger_stake jsonb DEFAULT '{}',
  challenged_stake jsonb DEFAULT '{}',

  status text DEFAULT 'pending'
    CHECK (status IN ('pending','negotiating','active','completed','declined','cancelled','expired')),

  -- Négociation
  negotiation jsonb DEFAULT '{}',

  -- Résultat
  winner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  challenger_final_score numeric(12,2),
  challenged_final_score numeric(12,2),
  is_draw boolean DEFAULT false,
  completed_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4.6 Badges (définition)
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  category text,
  criteria jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 4.7 Badges utilisateur (obtenus)
CREATE TABLE public.badges_utilisateur (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  obtained_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- 4.8 Notes de coaching (chef → commercial)
CREATE TABLE public.notes_coaching (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  commercial_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('feedback','objective','action','meeting')),
  content text NOT NULL,
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 4.9 Approbations (ventes en attente de validation)
CREATE TABLE public.approbations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fiche_marge_id uuid NOT NULL REFERENCES public.fiches_marge(id) ON DELETE CASCADE,
  commercial_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  approver_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  comment text,
  submitted_at timestamptz DEFAULT now(),
  decided_at timestamptz
);

-- 4.10 Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 5. INDEX
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_concession ON public.profiles(concession_id);
CREATE INDEX idx_profiles_equipe ON public.profiles(equipe_id);
CREATE INDEX idx_profiles_marque ON public.profiles(marque_id);
CREATE INDEX idx_profiles_groupe ON public.profiles(groupe_id);
CREATE INDEX idx_profiles_manager ON public.profiles(manager_id);

-- Equipes
CREATE INDEX idx_equipes_concession ON public.equipes(concession_id);
CREATE INDEX idx_equipes_chef ON public.equipes(chef_ventes_id);
CREATE INDEX idx_equipes_type ON public.equipes(type);

-- Concessions
CREATE INDEX idx_concessions_marque ON public.concessions(marque_id);
CREATE INDEX idx_concessions_groupe ON public.concessions(groupe_id);

-- Marques
CREATE INDEX idx_marques_groupe ON public.marques(groupe_id);

-- Fiches de marge
CREATE INDEX idx_fiches_marge_user ON public.fiches_marge(user_id);
CREATE INDEX idx_fiches_marge_concession ON public.fiches_marge(concession_id);
CREATE INDEX idx_fiches_marge_date ON public.fiches_marge(date);
CREATE INDEX idx_fiches_marge_status ON public.fiches_marge(status);
CREATE INDEX idx_fiches_marge_vehicle_type ON public.fiches_marge(vehicle_type);

-- Payplans
CREATE INDEX idx_payplans_concession ON public.payplans(concession_id);
CREATE INDEX idx_payplans_active ON public.payplans(is_active) WHERE is_active = true;

-- Défis plateforme
CREATE INDEX idx_defis_plateforme_created_by ON public.defis_plateforme(created_by);
CREATE INDEX idx_defis_plateforme_status ON public.defis_plateforme(status);
CREATE INDEX idx_defis_plateforme_dates ON public.defis_plateforme(start_date, end_date);

-- Participants défis
CREATE INDEX idx_defis_participants_defi ON public.defis_plateforme_participants(defi_id);
CREATE INDEX idx_defis_participants_user ON public.defis_plateforme_participants(user_id);

-- Défis P2P
CREATE INDEX idx_defis_p2p_challenger ON public.defis_p2p(challenger_id);
CREATE INDEX idx_defis_p2p_challenged ON public.defis_p2p(challenged_id);
CREATE INDEX idx_defis_p2p_status ON public.defis_p2p(status);

-- Badges utilisateur
CREATE INDEX idx_badges_utilisateur_user ON public.badges_utilisateur(user_id);
CREATE INDEX idx_badges_utilisateur_badge ON public.badges_utilisateur(badge_id);

-- Notes coaching
CREATE INDEX idx_notes_coaching_manager ON public.notes_coaching(manager_id);
CREATE INDEX idx_notes_coaching_commercial ON public.notes_coaching(commercial_id);

-- Approbations
CREATE INDEX idx_approbations_fiche ON public.approbations(fiche_marge_id);
CREATE INDEX idx_approbations_commercial ON public.approbations(commercial_id);
CREATE INDEX idx_approbations_approver ON public.approbations(approver_id);
CREATE INDEX idx_approbations_status ON public.approbations(status);

-- Notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- ============================================================
-- 6. TRIGGER : création automatique du profil à l'inscription
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, first_name, last_name, phone, role, level, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'commercial'),
    CASE COALESCE(NEW.raw_user_meta_data->>'role', 'commercial')
      WHEN 'commercial' THEN 1
      WHEN 'chef_ventes' THEN 2
      WHEN 'dir_concession' THEN 3
      WHEN 'dir_marque' THEN 4
      WHEN 'dir_plaque' THEN 5
      WHEN 'admin' THEN 5
      ELSE 1
    END,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 7. TRIGGER : mise à jour automatique de updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.fiches_marge
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.payplans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.defis_plateforme
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.defis_p2p
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.groupes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiches_marge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defis_plateforme ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defis_plateforme_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defis_p2p ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges_utilisateur ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes_coaching ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approbations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- Fonction utilitaire : récupérer le profil de l'utilisateur courant
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_profile()
RETURNS public.profiles AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -------------------------------------------------------
-- GROUPES : lecture pour tous les authentifiés
-- -------------------------------------------------------
CREATE POLICY "groupes_select_authenticated"
  ON public.groupes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "groupes_insert_admin"
  ON public.groupes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('dir_plaque', 'admin')
    )
  );

CREATE POLICY "groupes_update_admin"
  ON public.groupes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- MARQUES : lecture pour tous les authentifiés
-- -------------------------------------------------------
CREATE POLICY "marques_select_authenticated"
  ON public.marques FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "marques_insert_admin"
  ON public.marques FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "marques_update_admin"
  ON public.marques FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('dir_marque', 'dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- CONCESSIONS : lecture pour tous les authentifiés
-- -------------------------------------------------------
CREATE POLICY "concessions_select_authenticated"
  ON public.concessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "concessions_insert_admin"
  ON public.concessions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "concessions_update_admin"
  ON public.concessions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- EQUIPES : lecture pour tous les authentifiés
-- -------------------------------------------------------
CREATE POLICY "equipes_select_authenticated"
  ON public.equipes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "equipes_insert_manager"
  ON public.equipes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "equipes_update_manager"
  ON public.equipes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- PROFILES : lecture pour tous, modification de son propre profil
-- -------------------------------------------------------
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Les admins et directeurs peuvent modifier d'autres profils
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- Insertion par le trigger (SECURITY DEFINER) — pas de policy INSERT nécessaire pour les users normaux
-- Les admins peuvent créer des profils manuellement
CREATE POLICY "profiles_insert_admin"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- FICHES DE MARGE : accès hiérarchique
-- -------------------------------------------------------

-- Un commercial voit ses propres fiches
-- Un chef_ventes voit celles de son équipe
-- Un dir_concession voit celles de sa concession
-- Un dir_marque voit celles de ses concessions
-- Un dir_plaque voit tout
CREATE POLICY "fiches_marge_select"
  ON public.fiches_marge FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND (
        -- Chef des ventes : voit les fiches de son équipe
        (p.role = 'chef_ventes' AND EXISTS (
          SELECT 1 FROM public.profiles commercial
          WHERE commercial.id = fiches_marge.user_id
          AND commercial.equipe_id IN (
            SELECT e.id FROM public.equipes e WHERE e.chef_ventes_id = p.id
          )
        ))
        -- Dir concession : voit toutes les fiches de sa concession
        OR (p.role = 'dir_concession' AND fiches_marge.concession_id = p.concession_id)
        -- Dir marque : voit les fiches des concessions de sa marque
        OR (p.role = 'dir_marque' AND fiches_marge.concession_id IN (
          SELECT c.id FROM public.concessions c WHERE c.marque_id = p.marque_id
        ))
        -- Dir plaque / admin : voit tout
        OR p.role IN ('dir_plaque', 'admin')
      )
    )
  );

-- Un commercial peut créer ses propres fiches
CREATE POLICY "fiches_marge_insert"
  ON public.fiches_marge FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Un commercial peut modifier ses propres fiches en draft
CREATE POLICY "fiches_marge_update_own"
  ON public.fiches_marge FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Les managers peuvent mettre à jour le statut (approbation)
CREATE POLICY "fiches_marge_update_manager"
  ON public.fiches_marge FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- Un commercial peut supprimer ses propres brouillons
CREATE POLICY "fiches_marge_delete_own_draft"
  ON public.fiches_marge FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'draft');

-- -------------------------------------------------------
-- PAYPLANS : lecture pour la concession, écriture pour dir+
-- -------------------------------------------------------
CREATE POLICY "payplans_select"
  ON public.payplans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND (
        p.concession_id = payplans.concession_id
        OR p.role IN ('dir_marque', 'dir_plaque', 'admin')
      )
    )
  );

CREATE POLICY "payplans_insert"
  ON public.payplans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "payplans_update"
  ON public.payplans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- DÉFIS PLATEFORME : accès hiérarchique
-- -------------------------------------------------------
CREATE POLICY "defis_plateforme_select"
  ON public.defis_plateforme FOR SELECT
  TO authenticated
  USING (true);  -- Tous les authentifiés peuvent voir les défis

CREATE POLICY "defis_plateforme_insert"
  ON public.defis_plateforme FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "defis_plateforme_update"
  ON public.defis_plateforme FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "defis_plateforme_delete"
  ON public.defis_plateforme FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- -------------------------------------------------------
-- PARTICIPANTS DÉFIS PLATEFORME
-- -------------------------------------------------------
CREATE POLICY "defis_participants_select"
  ON public.defis_plateforme_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "defis_participants_insert"
  ON public.defis_plateforme_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "defis_participants_update"
  ON public.defis_plateforme_participants FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- DÉFIS P2P
-- -------------------------------------------------------
CREATE POLICY "defis_p2p_select"
  ON public.defis_p2p FOR SELECT
  TO authenticated
  USING (
    challenger_id = auth.uid()
    OR challenged_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "defis_p2p_insert"
  ON public.defis_p2p FOR INSERT
  TO authenticated
  WITH CHECK (challenger_id = auth.uid());

CREATE POLICY "defis_p2p_update"
  ON public.defis_p2p FOR UPDATE
  TO authenticated
  USING (
    challenger_id = auth.uid()
    OR challenged_id = auth.uid()
  );

-- -------------------------------------------------------
-- BADGES : lecture pour tous
-- -------------------------------------------------------
CREATE POLICY "badges_select"
  ON public.badges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "badges_insert_admin"
  ON public.badges FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- -------------------------------------------------------
-- BADGES UTILISATEUR
-- -------------------------------------------------------
CREATE POLICY "badges_utilisateur_select"
  ON public.badges_utilisateur FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "badges_utilisateur_insert"
  ON public.badges_utilisateur FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- NOTES DE COACHING
-- -------------------------------------------------------
CREATE POLICY "notes_coaching_select"
  ON public.notes_coaching FOR SELECT
  TO authenticated
  USING (
    manager_id = auth.uid()
    OR (commercial_id = auth.uid() AND is_private = false)
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "notes_coaching_insert"
  ON public.notes_coaching FOR INSERT
  TO authenticated
  WITH CHECK (
    manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "notes_coaching_update"
  ON public.notes_coaching FOR UPDATE
  TO authenticated
  USING (manager_id = auth.uid());

CREATE POLICY "notes_coaching_delete"
  ON public.notes_coaching FOR DELETE
  TO authenticated
  USING (manager_id = auth.uid());

-- -------------------------------------------------------
-- APPROBATIONS
-- -------------------------------------------------------
CREATE POLICY "approbations_select"
  ON public.approbations FOR SELECT
  TO authenticated
  USING (
    commercial_id = auth.uid()
    OR approver_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "approbations_insert"
  ON public.approbations FOR INSERT
  TO authenticated
  WITH CHECK (commercial_id = auth.uid());

CREATE POLICY "approbations_update"
  ON public.approbations FOR UPDATE
  TO authenticated
  USING (
    approver_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

-- -------------------------------------------------------
-- NOTIFICATIONS : chaque user ne voit que les siennes
-- -------------------------------------------------------
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_insert"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin')
    )
  );

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
