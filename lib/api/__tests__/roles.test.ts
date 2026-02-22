import { describe, it, expect } from 'vitest'
import { hasMinRole, hasRole, getScopeFilter } from '../roles'
import type { DbProfile } from '../types'

function createProfile(overrides: Partial<DbProfile> = {}): DbProfile {
  return {
    id: 'user-1',
    email: 'test@example.com',
    full_name: 'Test User',
    first_name: 'Test',
    last_name: 'User',
    phone: null,
    avatar_url: null,
    role: 'commercial',
    level: 1,
    concession_id: null,
    equipe_id: null,
    marque_id: null,
    groupe_id: null,
    manager_id: null,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    settings: null,
    ...overrides,
  }
}

describe('hasMinRole', () => {
  it('commercial a au moins le rôle commercial', () => {
    const profile = createProfile({ role: 'commercial' })
    expect(hasMinRole(profile, 'commercial')).toBe(true)
  })

  it('commercial n\'a pas le rôle minimum chef_ventes', () => {
    const profile = createProfile({ role: 'commercial' })
    expect(hasMinRole(profile, 'chef_ventes')).toBe(false)
  })

  it('dir_concession a au moins le rôle chef_ventes', () => {
    const profile = createProfile({ role: 'dir_concession' })
    expect(hasMinRole(profile, 'chef_ventes')).toBe(true)
  })

  it('dir_plaque a au moins le rôle dir_marque', () => {
    const profile = createProfile({ role: 'dir_plaque' })
    expect(hasMinRole(profile, 'dir_marque')).toBe(true)
  })

  it('admin a accès à tout (bypass)', () => {
    const profile = createProfile({ role: 'admin' })
    expect(hasMinRole(profile, 'dir_plaque')).toBe(true)
    expect(hasMinRole(profile, 'commercial')).toBe(true)
  })

  it('hiérarchie complète : 1 < 2 < 3 < 4 < 5 < 6', () => {
    const roles = ['commercial', 'chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque'] as const
    for (let i = 0; i < roles.length; i++) {
      for (let j = i; j < roles.length; j++) {
        const profile = createProfile({ role: roles[j] })
        expect(hasMinRole(profile, roles[i])).toBe(true)
      }
    }
  })
})

describe('hasRole', () => {
  it('correspondance exacte retourne true', () => {
    const profile = createProfile({ role: 'chef_ventes' })
    expect(hasRole(profile, 'chef_ventes')).toBe(true)
  })

  it('rôle différent retourne false', () => {
    const profile = createProfile({ role: 'chef_ventes' })
    expect(hasRole(profile, 'commercial')).toBe(false)
  })

  it('admin n\'a pas le rôle commercial (pas de bypass)', () => {
    const profile = createProfile({ role: 'admin' })
    expect(hasRole(profile, 'commercial')).toBe(false)
  })
})

describe('getScopeFilter', () => {
  it('commercial → filtre par user_id', () => {
    const profile = createProfile({ role: 'commercial', id: 'abc-123' })
    expect(getScopeFilter(profile)).toEqual({ column: 'user_id', value: 'abc-123' })
  })

  it('dir_concession avec concession_id → filtre par concession_id', () => {
    const profile = createProfile({ role: 'dir_concession', concession_id: 'conc-1' })
    expect(getScopeFilter(profile)).toEqual({ column: 'concession_id', value: 'conc-1' })
  })

  it('dir_concession sans concession_id → null', () => {
    const profile = createProfile({ role: 'dir_concession', concession_id: null })
    expect(getScopeFilter(profile)).toBeNull()
  })

  it('admin → null (pas de filtre)', () => {
    const profile = createProfile({ role: 'admin' })
    expect(getScopeFilter(profile)).toBeNull()
  })
})
