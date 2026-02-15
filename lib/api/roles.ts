import type { UserRole } from '@/types/hierarchy'
import type { DbProfile } from './types'
import { ROLE_LEVELS } from './types'

/** Vérifie si le profil a au moins le rôle minimum requis */
export function hasMinRole(profile: DbProfile, minRole: UserRole): boolean {
  // admin a accès à tout
  if (profile.role === 'admin') return true
  return ROLE_LEVELS[profile.role] >= ROLE_LEVELS[minRole]
}

/** Vérifie si le profil a exactement ce rôle */
export function hasRole(profile: DbProfile, role: UserRole): boolean {
  return profile.role === role
}

/** Retourne le filtre de scope selon le rôle pour les requêtes hiérarchiques */
export function getScopeFilter(profile: DbProfile): {
  column: string
  value: string
} | null {
  switch (profile.role) {
    case 'commercial':
      return { column: 'user_id', value: profile.id }
    case 'chef_ventes':
      // Filtré par RLS via les équipes managées
      return null
    case 'dir_concession':
      return profile.concession_id
        ? { column: 'concession_id', value: profile.concession_id }
        : null
    case 'dir_marque':
      // Filtré par RLS via marque_id
      return null
    case 'dir_plaque':
    case 'admin':
      // Pas de filtre, voit tout
      return null
    default:
      return { column: 'user_id', value: profile.id }
  }
}
