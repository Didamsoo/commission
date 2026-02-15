import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole } from '@/types/hierarchy'

// Profil DB tel que retourné par Supabase
export interface DbProfile {
  id: string
  email: string
  full_name: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  level: number
  concession_id: string | null
  equipe_id: string | null
  marque_id: string | null
  groupe_id: string | null
  manager_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Résultat de getAuthenticatedUser()
export interface AuthContext {
  user: { id: string; email: string }
  profile: DbProfile
  supabase: SupabaseClient
}

// Réponse API standardisée
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  details?: unknown
  count?: number
  page?: number
  limit?: number
}

// Niveaux de rôle pour comparaison
export const ROLE_LEVELS: Record<UserRole, number> = {
  commercial: 1,
  chef_ventes: 2,
  dir_concession: 3,
  dir_marque: 4,
  dir_plaque: 5,
  admin: 6,
}
