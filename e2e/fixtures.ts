// Constantes utilisateur test pour les E2E
// Ces credentials doivent correspondre à des utilisateurs seed dans Supabase

export const TEST_USERS = {
  commercial: {
    email: 'test.commercial@example.com',
    password: 'TestPassword123!',
    name: 'Commercial Test',
    role: 'commercial' as const,
  },
  chefVentes: {
    email: 'test.chefventes@example.com',
    password: 'TestPassword123!',
    name: 'Chef Ventes Test',
    role: 'chef_ventes' as const,
  },
  dirConcession: {
    email: 'test.dirconcession@example.com',
    password: 'TestPassword123!',
    name: 'Dir Concession Test',
    role: 'dir_concession' as const,
  },
} as const

export const AUTH_STATE_PATH = 'e2e/.auth/user.json'
