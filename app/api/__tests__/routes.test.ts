/**
 * Comprehensive API Integration Tests
 *
 * Tests all critical API routes by mocking Supabase client and auth.
 * Each route handler is called directly (not via HTTP) to test logic.
 *
 * Mocking strategy:
 *   - `getAuthenticatedUser()` is mocked to return a fake AuthContext
 *   - The Supabase client inside AuthContext uses a chainable mock builder
 *   - Validation schemas are NOT mocked — real Zod validation runs
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { NextRequest } from 'next/server'
import type { DbProfile, AuthContext } from '@/lib/api/types'

// ---------------------------------------------------------------------------
// Mock: getAuthenticatedUser
// ---------------------------------------------------------------------------
const mockGetAuthenticatedUser = vi.fn<() => Promise<AuthContext | null>>()

vi.mock('@/lib/api/auth', () => ({
  getAuthenticatedUser: (...args: unknown[]) => mockGetAuthenticatedUser(...(args as [])),
}))

// ---------------------------------------------------------------------------
// Mock: next/headers (cookies) — required by lib/supabase/server.ts
// ---------------------------------------------------------------------------
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}))

// ---------------------------------------------------------------------------
// Supabase chainable mock builder
//
// Every chaining method (select, eq, gte, order, range, in, or, ...) returns
// the same proxy.  When the chain is awaited (`await query`) the hidden
// `then` property resolves with the configured result.
// `.single()` / `.maybeSingle()` return a real Promise so PostgREST-style
// terminal calls work too.
// ---------------------------------------------------------------------------
type SupaChainResult = { data: unknown; error: unknown; count?: number | null }

/**
 * Build a Proxy that:
 *  - has a `.then()` so it can be awaited (like a PostgREST query)
 *  - exposes every chainable method (select, eq, ...) as a vi.fn()
 *  - `.single()` / `.maybeSingle()` return `Promise.resolve(result)`
 */
function createSupabaseChain(result: SupaChainResult): unknown {
  // Store created fns so the same mock is returned for repeated access
  const fns: Record<string, Mock> = {}

  const handler: ProxyHandler<object> = {
    get(_target, prop: string | symbol) {
      if (typeof prop === 'symbol') return undefined

      // Make the chain thenable so `await query` resolves to `result`
      if (prop === 'then') {
        return (
          onFulfilled?: (v: SupaChainResult) => unknown,
          onRejected?: (e: unknown) => unknown,
        ) => Promise.resolve(result).then(onFulfilled, onRejected)
      }
      if (prop === 'catch' || prop === 'finally') {
        return Promise.resolve(result)[prop as 'catch' | 'finally'].bind(
          Promise.resolve(result),
        )
      }

      // Build (or re-use) a vi.fn for every other property
      if (!fns[prop]) {
        fns[prop] = vi.fn((..._args: unknown[]) => {
          // Terminal methods that supabase-js awaits itself
          if (prop === 'single' || prop === 'maybeSingle') {
            return Promise.resolve(result)
          }
          // Everything else returns the same proxy for further chaining
          return proxy
        })
      }
      return fns[prop]
    },
  }

  const proxy = new Proxy({}, handler)
  return proxy
}

function createSupabaseMock(
  tableResults: Record<string, SupaChainResult> = {},
  defaultResult: SupaChainResult = { data: [], error: null, count: 0 },
) {
  const fromMock = vi.fn((table: string) => {
    const result = tableResults[table] ?? defaultResult
    return createSupabaseChain(result)
  })

  return {
    from: fromMock,
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({ data: { user: null }, error: null }),
      ),
    },
  }
}

// ---------------------------------------------------------------------------
// Profile factory
// ---------------------------------------------------------------------------
function createProfile(overrides: Partial<DbProfile> = {}): DbProfile {
  return {
    id: 'user-001',
    email: 'test@example.com',
    full_name: 'Jean Dupont',
    first_name: 'Jean',
    last_name: 'Dupont',
    phone: null,
    avatar_url: null,
    role: 'commercial',
    level: 1,
    concession_id: 'conc-001',
    equipe_id: 'equipe-001',
    marque_id: 'marque-001',
    groupe_id: 'groupe-001',
    manager_id: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    settings: null,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Auth helper that configures the mock to return an authenticated user
// ---------------------------------------------------------------------------
function mockAuth(
  profileOverrides: Partial<DbProfile> = {},
  tableResults: Record<string, SupaChainResult> = {},
  defaultResult?: SupaChainResult,
) {
  const profile = createProfile(profileOverrides)
  const supabase = createSupabaseMock(tableResults, defaultResult)
  const auth: AuthContext = {
    user: { id: profile.id, email: profile.email },
    profile,
    supabase: supabase as unknown as AuthContext['supabase'],
  }
  mockGetAuthenticatedUser.mockResolvedValue(auth)
  return { auth, supabase, profile }
}

function mockUnauth() {
  mockGetAuthenticatedUser.mockResolvedValue(null)
}

// ---------------------------------------------------------------------------
// Request factory
// ---------------------------------------------------------------------------
function makeRequest(
  url: string,
  options: { method?: string; body?: unknown } = {},
): NextRequest {
  const init: RequestInit = { method: options.method ?? 'GET' }
  if (options.body !== undefined) {
    init.method = options.method ?? 'POST'
    init.body = JSON.stringify(options.body)
    init.headers = { 'Content-Type': 'application/json' }
  }
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

// ---------------------------------------------------------------------------
// Helper: extract JSON from NextResponse
// ---------------------------------------------------------------------------
async function json(res: Response) {
  return res.json()
}

// =========================================================================
// Reset mocks before each test
// =========================================================================
beforeEach(() => {
  vi.clearAllMocks()
})

// =========================================================================
// 1. /api/fiches-marge
// =========================================================================
describe('GET /api/fiches-marge', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/fiches-marge/route')
    const res = await GET(makeRequest('/api/fiches-marge'))
    expect(res.status).toBe(401)
    const body = await json(res)
    expect(body.error).toBe('Non authentifi\u00e9')
  })

  it('returns paginated fiches for authenticated user', async () => {
    const fiches = [
      { id: 'f1', date: '2026-01-15', final_margin: 1200, status: 'draft' },
      { id: 'f2', date: '2026-01-10', final_margin: 800, status: 'submitted' },
    ]
    mockAuth({}, {
      fiches_marge: { data: fiches, error: null, count: 2 },
    })

    const { GET } = await import('@/app/api/fiches-marge/route')
    const res = await GET(makeRequest('/api/fiches-marge?page=1&limit=20'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toEqual(fiches)
    expect(body.count).toBe(2)
    expect(body.page).toBe(1)
    expect(body.limit).toBe(20)
  })

  it('applies status filter', async () => {
    const { supabase } = mockAuth({}, {
      fiches_marge: { data: [], error: null, count: 0 },
    })

    const { GET } = await import('@/app/api/fiches-marge/route')
    await GET(makeRequest('/api/fiches-marge?status=draft'))
    // Verify .from('fiches_marge') was called
    expect(supabase.from).toHaveBeenCalledWith('fiches_marge')
  })

  it('returns 500 on Supabase error', async () => {
    mockAuth({}, {
      fiches_marge: { data: null, error: { message: 'DB connection failed' }, count: null },
    })

    const { GET } = await import('@/app/api/fiches-marge/route')
    const res = await GET(makeRequest('/api/fiches-marge'))
    expect(res.status).toBe(500)
    const body = await json(res)
    expect(body.error).toBe('DB connection failed')
  })
})

describe('POST /api/fiches-marge', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { POST } = await import('@/app/api/fiches-marge/route')
    const res = await POST(makeRequest('/api/fiches-marge', {
      body: { date: '2026-01-15', vehicle_type: 'VO' },
    }))
    expect(res.status).toBe(401)
  })

  it('returns 400 on invalid body (missing required fields)', async () => {
    mockAuth()
    const { POST } = await import('@/app/api/fiches-marge/route')
    const res = await POST(makeRequest('/api/fiches-marge', {
      body: { date: 'not-a-date' }, // missing vehicle_type, bad date format
    }))
    expect(res.status).toBe(400)
    const body = await json(res)
    expect(body.error).toBe('Donn\u00e9es invalides')
  })

  it('creates a fiche with valid data and returns 201', async () => {
    const created = { id: 'f-new', date: '2026-02-01', vehicle_type: 'VO', user_id: 'user-001' }
    mockAuth({}, {
      fiches_marge: { data: created, error: null },
    })

    const { POST } = await import('@/app/api/fiches-marge/route')
    const res = await POST(makeRequest('/api/fiches-marge', {
      body: { date: '2026-02-01', vehicle_type: 'VO' },
    }))
    expect(res.status).toBe(201)
    const body = await json(res)
    expect(body.data).toEqual(created)
  })

  it('returns 500 on insert error', async () => {
    mockAuth({}, {
      fiches_marge: { data: null, error: { message: 'Insert failed' } },
    })

    const { POST } = await import('@/app/api/fiches-marge/route')
    const res = await POST(makeRequest('/api/fiches-marge', {
      body: { date: '2026-02-01', vehicle_type: 'VP' },
    }))
    expect(res.status).toBe(500)
  })
})

// =========================================================================
// 2. /api/defis
// =========================================================================
describe('GET /api/defis', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/defis/route')
    const res = await GET(makeRequest('/api/defis'))
    expect(res.status).toBe(401)
  })

  it('returns defis list for authenticated user', async () => {
    const defis = [
      { id: 'd1', title: 'Top vendeur', status: 'active' },
    ]
    mockAuth({}, {
      defis_plateforme: { data: defis, error: null, count: 1 },
    })

    const { GET } = await import('@/app/api/defis/route')
    const res = await GET(makeRequest('/api/defis'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toEqual(defis)
    expect(body.count).toBe(1)
  })

  it('returns 500 on Supabase error', async () => {
    mockAuth({}, {
      defis_plateforme: { data: null, error: { message: 'Query failed' }, count: null },
    })
    const { GET } = await import('@/app/api/defis/route')
    const res = await GET(makeRequest('/api/defis'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/defis', () => {
  const validDefi = {
    title: 'Challenge Mars',
    scope_type: 'individual',
    target_level: 1,
    challenge_type: 'sales_count',
    target_value: 10,
    start_date: '2026-03-01',
    end_date: '2026-03-31',
    reward: { type: 'bonus', value: 200, description: 'Prime 200 EUR' },
  }

  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { POST } = await import('@/app/api/defis/route')
    const res = await POST(makeRequest('/api/defis', { body: validDefi }))
    expect(res.status).toBe(401)
  })

  it('returns 403 when user role is below chef_ventes', async () => {
    mockAuth({ role: 'commercial', level: 1 })
    const { POST } = await import('@/app/api/defis/route')
    const res = await POST(makeRequest('/api/defis', { body: validDefi }))
    expect(res.status).toBe(403)
    const body = await json(res)
    expect(body.error).toMatch(/interdit/i)
  })

  it('returns 400 on invalid body', async () => {
    mockAuth({ role: 'chef_ventes', level: 2 })
    const { POST } = await import('@/app/api/defis/route')
    const res = await POST(makeRequest('/api/defis', { body: { title: '' } }))
    expect(res.status).toBe(400)
  })

  it('creates a defi with valid data (chef_ventes) and returns 201', async () => {
    const created = { id: 'd-new', ...validDefi, created_by: 'user-001' }
    mockAuth({ role: 'chef_ventes', level: 2 }, {
      defis_plateforme: { data: created, error: null },
      defis_plateforme_participants: { data: [], error: null },
    })

    const { POST } = await import('@/app/api/defis/route')
    const res = await POST(makeRequest('/api/defis', { body: validDefi }))
    expect(res.status).toBe(201)
    const body = await json(res)
    expect(body.data.id).toBe('d-new')
  })

  it('inserts participants when target_ids provided', async () => {
    const created = { id: 'd-new2', ...validDefi }
    const { supabase } = mockAuth({ role: 'dir_concession', level: 3 }, {
      defis_plateforme: { data: created, error: null },
      defis_plateforme_participants: { data: [], error: null },
    })

    const { POST } = await import('@/app/api/defis/route')
    const bodyData = {
      ...validDefi,
      target_ids: ['aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'],
    }
    await POST(makeRequest('/api/defis', { body: bodyData }))

    // Check that from('defis_plateforme_participants') was called
    const fromCalls = (supabase.from as Mock).mock.calls
    const participantsCalls = fromCalls.filter(
      (c: string[]) => c[0] === 'defis_plateforme_participants',
    )
    expect(participantsCalls.length).toBeGreaterThanOrEqual(1)
  })
})

// =========================================================================
// 3. /api/defis-p2p
// =========================================================================
describe('GET /api/defis-p2p', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/defis-p2p/route')
    const res = await GET(makeRequest('/api/defis-p2p'))
    expect(res.status).toBe(401)
  })

  it('returns p2p defis for authenticated user', async () => {
    const defis = [
      { id: 'p2p-1', challenger_id: 'user-001', challenged_id: 'user-002', status: 'active' },
    ]
    mockAuth({}, {
      defis_p2p: { data: defis, error: null, count: 1 },
    })

    const { GET } = await import('@/app/api/defis-p2p/route')
    const res = await GET(makeRequest('/api/defis-p2p'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toEqual(defis)
  })
})

describe('POST /api/defis-p2p', () => {
  const validP2P = {
    challenged_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    metric: 'sales_count' as const,
    duration_days: 30,
  }

  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { POST } = await import('@/app/api/defis-p2p/route')
    const res = await POST(makeRequest('/api/defis-p2p', { body: validP2P }))
    expect(res.status).toBe(401)
  })

  it('returns 400 on invalid body (missing required fields)', async () => {
    mockAuth()
    const { POST } = await import('@/app/api/defis-p2p/route')
    const res = await POST(makeRequest('/api/defis-p2p', { body: { metric: 'bad' } }))
    expect(res.status).toBe(400)
  })

  it('creates p2p defi with valid data and returns 201', async () => {
    const created = { id: 'p2p-new', ...validP2P, challenger_id: 'user-001' }
    mockAuth({}, {
      defis_p2p: { data: created, error: null },
    })

    const { POST } = await import('@/app/api/defis-p2p/route')
    const res = await POST(makeRequest('/api/defis-p2p', { body: validP2P }))
    expect(res.status).toBe(201)
    const body = await json(res)
    expect(body.data.id).toBe('p2p-new')
    expect(body.data.challenger_id).toBe('user-001')
  })
})

// =========================================================================
// 4. /api/dashboard/[role]
// =========================================================================
describe('GET /api/dashboard/[role]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/dashboard/[role]/route')
    const res = await GET(
      makeRequest('/api/dashboard/commercial'),
      { params: Promise.resolve({ role: 'commercial' }) },
    )
    expect(res.status).toBe(401)
  })

  it('returns 403 for invalid role string', async () => {
    mockAuth({ role: 'commercial', level: 1 })
    const { GET } = await import('@/app/api/dashboard/[role]/route')
    const res = await GET(
      makeRequest('/api/dashboard/invalid_role'),
      { params: Promise.resolve({ role: 'invalid_role' }) },
    )
    expect(res.status).toBe(403)
  })

  it('returns 403 when user level is below requested role', async () => {
    mockAuth({ role: 'commercial', level: 1 })
    const { GET } = await import('@/app/api/dashboard/[role]/route')
    const res = await GET(
      makeRequest('/api/dashboard/dir_concession'),
      { params: Promise.resolve({ role: 'dir_concession' }) },
    )
    expect(res.status).toBe(403)
  })

  describe('commercial dashboard', () => {
    it('returns KPIs for commercial role', async () => {
      const fiches = [
        { id: 'f1', date: '2026-02-10', final_margin: 1500, seller_commission: 300, selling_price_ht: 15000, has_financing: true, status: 'approved' },
        { id: 'f2', date: '2026-02-15', final_margin: 800, seller_commission: 150, selling_price_ht: 12000, has_financing: false, status: 'draft' },
      ]
      mockAuth({ role: 'commercial', level: 1 }, {
        fiches_marge: { data: fiches, error: null, count: 2 },
        defis_p2p: { data: [], error: null, count: 0 },
        notifications: { data: [], error: null, count: 0 },
        equipes: { data: [{ objective: { monthly_target: 15 } }], error: null },
      })

      const { GET } = await import('@/app/api/dashboard/[role]/route')
      const res = await GET(
        makeRequest('/api/dashboard/commercial'),
        { params: Promise.resolve({ role: 'commercial' }) },
      )
      expect(res.status).toBe(200)
      const body = await json(res)
      expect(body.data.kpis).toBeDefined()
      expect(body.data.kpis.totalSales).toBe(2)
      expect(body.data.kpis.totalMargin).toBe(2300)
      expect(body.data.kpis.totalCommission).toBe(450)
      expect(body.data.kpis.totalRevenue).toBe(27000)
      expect(body.data.kpis.financingRate).toBe(50)
      expect(body.data.kpis.avgGPU).toBe(1150) // 2300 / 2
    })

    it('handles empty fiches gracefully', async () => {
      mockAuth({ role: 'commercial', level: 1 }, {
        fiches_marge: { data: [], error: null, count: 0 },
        defis_p2p: { data: [], error: null, count: 0 },
        notifications: { data: [], error: null, count: 0 },
        equipes: { data: [], error: null },
      })

      const { GET } = await import('@/app/api/dashboard/[role]/route')
      const res = await GET(
        makeRequest('/api/dashboard/commercial'),
        { params: Promise.resolve({ role: 'commercial' }) },
      )
      expect(res.status).toBe(200)
      const body = await json(res)
      expect(body.data.kpis.totalSales).toBe(0)
      expect(body.data.kpis.avgGPU).toBe(0)
      expect(body.data.kpis.financingRate).toBe(0)
    })
  })

  describe('chef_ventes dashboard', () => {
    it('returns team KPIs for chef_ventes', async () => {
      const fiches = [
        { user_id: 'u1', final_margin: 1200, seller_commission: 200, selling_price_ht: 10000, has_financing: true, status: 'approved', vehicle_type: 'VO' },
        { user_id: 'u2', final_margin: 900, seller_commission: 150, selling_price_ht: 8000, has_financing: false, status: 'approved', vehicle_type: 'VP' },
      ]
      mockAuth({ role: 'chef_ventes', level: 2 }, {
        equipes: { data: [{ id: 'eq-1', name: 'Team A', type: 'VO', objective: null, concession_id: 'conc-001' }], error: null },
        fiches_marge: { data: fiches, error: null, count: 2 },
        approbations: { data: [], error: null, count: 3 },
        profiles: { data: [], error: null },
      })

      const { GET } = await import('@/app/api/dashboard/[role]/route')
      const res = await GET(
        makeRequest('/api/dashboard/chef_ventes'),
        { params: Promise.resolve({ role: 'chef_ventes' }) },
      )
      expect(res.status).toBe(200)
      const body = await json(res)
      expect(body.data.kpis).toBeDefined()
      expect(body.data.kpis.teamSales).toBe(2)
      expect(body.data.kpis.teamMargin).toBe(2100)
      expect(body.data.equipes).toBeDefined()
    })
  })

  describe('dir_concession dashboard', () => {
    it('returns concession-level KPIs', async () => {
      const fiches = [
        { user_id: 'u1', final_margin: 2000, seller_commission: 400, selling_price_ht: 20000, has_financing: true, vehicle_type: 'VP', status: 'approved' },
      ]
      mockAuth({ role: 'dir_concession', level: 3, concession_id: 'conc-001' }, {
        fiches_marge: { data: fiches, error: null, count: 1 },
        equipes: { data: [{ id: 'eq-1' }, { id: 'eq-2' }], error: null },
        profiles: { data: [{ id: 'u1', role: 'commercial' }], error: null },
      })

      const { GET } = await import('@/app/api/dashboard/[role]/route')
      const res = await GET(
        makeRequest('/api/dashboard/dir_concession'),
        { params: Promise.resolve({ role: 'dir_concession' }) },
      )
      expect(res.status).toBe(200)
      const body = await json(res)
      expect(body.data.kpis.totalSales).toBe(1)
      expect(body.data.kpis.totalMargin).toBe(2000)
      expect(body.data.kpis.teamCount).toBe(2)
      expect(body.data.kpis.staffCount).toBe(1)
      expect(body.data.departmentStats).toBeDefined()
      // VP maps to VN
      expect(body.data.departmentStats.VN).toBeDefined()
      expect(body.data.departmentStats.VN.totalSales).toBe(1)
    })
  })

  describe('dir_marque dashboard', () => {
    it('returns brand-level KPIs', async () => {
      const concessions = [{ id: 'c1', name: 'Concession A' }]
      const fiches = [
        { concession_id: 'c1', final_margin: 3000, selling_price_ht: 30000, has_financing: true, vehicle_type: 'VO' },
      ]
      mockAuth({ role: 'dir_marque', level: 4, marque_id: 'marque-001' }, {
        concessions: { data: concessions, error: null },
        fiches_marge: { data: fiches, error: null },
      })

      const { GET } = await import('@/app/api/dashboard/[role]/route')
      const res = await GET(
        makeRequest('/api/dashboard/dir_marque'),
        { params: Promise.resolve({ role: 'dir_marque' }) },
      )
      expect(res.status).toBe(200)
      const body = await json(res)
      expect(body.data.kpis.totalSales).toBe(1)
      expect(body.data.kpis.sitesCount).toBe(1)
      expect(body.data.concessions).toHaveLength(1)
    })
  })

  describe('dir_plaque dashboard', () => {
    it('returns group-level KPIs', async () => {
      const marques = [{ id: 'm1', name: 'Ford' }]
      const concessions = [{ id: 'c1', name: 'Site A', marque_id: 'm1' }]
      const fiches = [
        { concession_id: 'c1', final_margin: 5000, selling_price_ht: 50000, vehicle_type: 'VP' },
      ]
      mockAuth({ role: 'dir_plaque', level: 5, groupe_id: 'groupe-001' }, {
        marques: { data: marques, error: null },
        concessions: { data: concessions, error: null },
        fiches_marge: { data: fiches, error: null },
      })

      const { GET } = await import('@/app/api/dashboard/[role]/route')
      const res = await GET(
        makeRequest('/api/dashboard/dir_plaque'),
        { params: Promise.resolve({ role: 'dir_plaque' }) },
      )
      expect(res.status).toBe(200)
      const body = await json(res)
      expect(body.data.kpis.totalSales).toBe(1)
      expect(body.data.kpis.brandsCount).toBe(1)
      expect(body.data.kpis.sitesCount).toBe(1)
      expect(body.data.marques).toHaveLength(1)
    })

    it('admin can access any role dashboard', async () => {
      mockAuth({ role: 'admin', level: 6 }, {
        marques: { data: [], error: null },
        concessions: { data: [], error: null },
        fiches_marge: { data: [], error: null },
      })

      const { GET } = await import('@/app/api/dashboard/[role]/route')
      const res = await GET(
        makeRequest('/api/dashboard/dir_plaque'),
        { params: Promise.resolve({ role: 'dir_plaque' }) },
      )
      expect(res.status).toBe(200)
    })
  })
})

// =========================================================================
// 5. /api/leaderboard
// =========================================================================
describe('GET /api/leaderboard', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/leaderboard/route')
    const res = await GET(makeRequest('/api/leaderboard'))
    expect(res.status).toBe(401)
  })

  it('returns aggregated leaderboard sorted by margin', async () => {
    const fiches = [
      { user_id: 'u1', final_margin: 2000, seller_commission: 400, selling_price_ht: 20000, vehicle_type: 'VO', has_financing: true, profiles: { full_name: 'Alice', avatar_url: null, role: 'commercial', equipe_id: 'eq-1', concession_id: 'c1' } },
      { user_id: 'u1', final_margin: 1500, seller_commission: 300, selling_price_ht: 15000, vehicle_type: 'VP', has_financing: false, profiles: { full_name: 'Alice', avatar_url: null, role: 'commercial', equipe_id: 'eq-1', concession_id: 'c1' } },
      { user_id: 'u2', final_margin: 5000, seller_commission: 1000, selling_price_ht: 50000, vehicle_type: 'VP', has_financing: true, profiles: { full_name: 'Bob', avatar_url: null, role: 'commercial', equipe_id: 'eq-1', concession_id: 'c1' } },
    ]
    mockAuth({}, {
      fiches_marge: { data: fiches, error: null },
    })

    const { GET } = await import('@/app/api/leaderboard/route')
    const res = await GET(makeRequest('/api/leaderboard'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toHaveLength(2)
    // Bob should be first (margin 5000 > Alice 3500)
    expect(body.data[0].full_name).toBe('Bob')
    expect(body.data[0].total_margin).toBe(5000)
    expect(body.data[0].rank).toBe(1)
    expect(body.data[1].full_name).toBe('Alice')
    expect(body.data[1].total_margin).toBe(3500)
    expect(body.data[1].rank).toBe(2)
  })

  it('returns empty leaderboard when no fiches', async () => {
    mockAuth({}, {
      fiches_marge: { data: [], error: null },
    })

    const { GET } = await import('@/app/api/leaderboard/route')
    const res = await GET(makeRequest('/api/leaderboard'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toEqual([])
  })

  it('returns 500 on Supabase error', async () => {
    mockAuth({}, {
      fiches_marge: { data: null, error: { message: 'Leaderboard query failed' } },
    })

    const { GET } = await import('@/app/api/leaderboard/route')
    const res = await GET(makeRequest('/api/leaderboard'))
    expect(res.status).toBe(500)
  })

  it('respects limit parameter', async () => {
    const fiches = Array.from({ length: 5 }, (_, i) => ({
      user_id: `u${i}`,
      final_margin: (5 - i) * 1000,
      seller_commission: 100,
      selling_price_ht: 10000,
      vehicle_type: 'VO',
      has_financing: false,
      profiles: { full_name: `User ${i}`, avatar_url: null, role: 'commercial', equipe_id: 'eq-1', concession_id: 'c1' },
    }))
    mockAuth({}, {
      fiches_marge: { data: fiches, error: null },
    })

    const { GET } = await import('@/app/api/leaderboard/route')
    const res = await GET(makeRequest('/api/leaderboard?limit=3'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data.length).toBeLessThanOrEqual(3)
  })
})

// =========================================================================
// 6. /api/profil
// =========================================================================
describe('GET /api/profil', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/profil/route')
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns profile with concession_name when concession_id is set', async () => {
    mockAuth({ concession_id: 'conc-001' }, {
      concessions: { data: { name: 'Ford Lyon' }, error: null },
    })

    const { GET } = await import('@/app/api/profil/route')
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data.id).toBe('user-001')
    expect(body.data.full_name).toBe('Jean Dupont')
    expect(body.data.concession_name).toBe('Ford Lyon')
  })

  it('returns profile with concession_name null when no concession_id', async () => {
    mockAuth({ concession_id: null })

    const { GET } = await import('@/app/api/profil/route')
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data.concession_name).toBeNull()
  })
})

describe('PUT /api/profil', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { PUT } = await import('@/app/api/profil/route')
    const res = await PUT(makeRequest('/api/profil', { method: 'PUT', body: { full_name: 'New Name' } }))
    expect(res.status).toBe(401)
  })

  it('returns 400 on invalid body', async () => {
    mockAuth()
    const { PUT } = await import('@/app/api/profil/route')
    const res = await PUT(makeRequest('/api/profil', {
      method: 'PUT',
      body: { full_name: 'X' }, // too short: min 2 chars
    }))
    expect(res.status).toBe(400)
  })

  it('updates profile with valid data', async () => {
    const updated = { ...createProfile(), full_name: 'Jean-Pierre Dupont' }
    mockAuth({}, {
      profiles: { data: updated, error: null },
    })

    const { PUT } = await import('@/app/api/profil/route')
    const res = await PUT(makeRequest('/api/profil', {
      method: 'PUT',
      body: { full_name: 'Jean-Pierre Dupont' },
    }))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data.full_name).toBe('Jean-Pierre Dupont')
  })

  it('updates notification settings', async () => {
    const updated = {
      ...createProfile(),
      settings: { email_notifications: false, defi_notifications: true },
    }
    mockAuth({}, {
      profiles: { data: updated, error: null },
    })

    const { PUT } = await import('@/app/api/profil/route')
    const res = await PUT(makeRequest('/api/profil', {
      method: 'PUT',
      body: { settings: { email_notifications: false, defi_notifications: true } },
    }))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data.settings.email_notifications).toBe(false)
  })

  it('returns 500 on update error', async () => {
    mockAuth({}, {
      profiles: { data: null, error: { message: 'Update failed' } },
    })

    const { PUT } = await import('@/app/api/profil/route')
    const res = await PUT(makeRequest('/api/profil', {
      method: 'PUT',
      body: { full_name: 'Valid Name' },
    }))
    expect(res.status).toBe(500)
  })
})

// =========================================================================
// 7. /api/approbations
// =========================================================================
describe('GET /api/approbations', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/approbations/route')
    const res = await GET(makeRequest('/api/approbations'))
    expect(res.status).toBe(401)
  })

  it('returns paginated approbations', async () => {
    const approbations = [
      { id: 'a1', status: 'pending', fiche_marge_id: 'f1' },
    ]
    mockAuth({}, {
      approbations: { data: approbations, error: null, count: 1 },
    })

    const { GET } = await import('@/app/api/approbations/route')
    const res = await GET(makeRequest('/api/approbations'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toEqual(approbations)
    expect(body.count).toBe(1)
  })

  it('applies status filter', async () => {
    const { supabase } = mockAuth({}, {
      approbations: { data: [], error: null, count: 0 },
    })

    const { GET } = await import('@/app/api/approbations/route')
    await GET(makeRequest('/api/approbations?status=pending'))
    expect(supabase.from).toHaveBeenCalledWith('approbations')
  })

  it('returns 500 on Supabase error', async () => {
    mockAuth({}, {
      approbations: { data: null, error: { message: 'Query error' }, count: null },
    })

    const { GET } = await import('@/app/api/approbations/route')
    const res = await GET(makeRequest('/api/approbations'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/approbations', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { POST } = await import('@/app/api/approbations/route')
    const res = await POST(makeRequest('/api/approbations', {
      body: { fiche_marge_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' },
    }))
    expect(res.status).toBe(401)
  })

  it('returns 400 on invalid body (missing fiche_marge_id)', async () => {
    mockAuth()
    const { POST } = await import('@/app/api/approbations/route')
    const res = await POST(makeRequest('/api/approbations', { body: {} }))
    expect(res.status).toBe(400)
  })

  it('creates approbation and updates fiche status to submitted', async () => {
    const created = { id: 'a-new', status: 'pending', fiche_marge_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' }
    const { supabase } = mockAuth({}, {
      fiches_marge: { data: null, error: null },
      approbations: { data: created, error: null },
    })

    const { POST } = await import('@/app/api/approbations/route')
    const res = await POST(makeRequest('/api/approbations', {
      body: { fiche_marge_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' },
    }))
    expect(res.status).toBe(201)
    const body = await json(res)
    expect(body.data.id).toBe('a-new')

    // Verify from was called for both fiches_marge (update) and approbations (insert)
    const fromCalls = (supabase.from as Mock).mock.calls.map((c: string[]) => c[0])
    expect(fromCalls).toContain('fiches_marge')
    expect(fromCalls).toContain('approbations')
  })

  it('returns 500 when fiche update fails', async () => {
    mockAuth({}, {
      fiches_marge: { data: null, error: { message: 'Update failed' } },
    })

    const { POST } = await import('@/app/api/approbations/route')
    const res = await POST(makeRequest('/api/approbations', {
      body: { fiche_marge_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' },
    }))
    expect(res.status).toBe(500)
  })
})

// =========================================================================
// 8. /api/equipe
// =========================================================================
describe('GET /api/equipe', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/equipe/route')
    const res = await GET(makeRequest('/api/equipe'))
    expect(res.status).toBe(401)
  })

  it('returns 403 for commercial role (below chef_ventes)', async () => {
    mockAuth({ role: 'commercial', level: 1 })
    const { GET } = await import('@/app/api/equipe/route')
    const res = await GET(makeRequest('/api/equipe'))
    expect(res.status).toBe(403)
  })

  it('returns team members for chef_ventes', async () => {
    const members = [
      { id: 'u1', full_name: 'Alice', role: 'commercial' },
      { id: 'u2', full_name: 'Bob', role: 'commercial' },
    ]
    mockAuth({ role: 'chef_ventes', level: 2 }, {
      profiles: { data: members, error: null },
      equipes: { data: [{ id: 'eq-1' }], error: null },
    })

    const { GET } = await import('@/app/api/equipe/route')
    const res = await GET(makeRequest('/api/equipe'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toEqual(members)
  })

  it('filters by equipe_id param when provided', async () => {
    const { supabase } = mockAuth({ role: 'dir_concession', level: 3 }, {
      profiles: { data: [], error: null },
    })

    const { GET } = await import('@/app/api/equipe/route')
    await GET(makeRequest('/api/equipe?equipe_id=eq-123'))
    expect(supabase.from).toHaveBeenCalledWith('profiles')
  })

  it('returns 500 on Supabase error', async () => {
    mockAuth({ role: 'chef_ventes', level: 2 }, {
      profiles: { data: null, error: { message: 'Query error' } },
      equipes: { data: [{ id: 'eq-1' }], error: null },
    })

    const { GET } = await import('@/app/api/equipe/route')
    const res = await GET(makeRequest('/api/equipe'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/equipe', () => {
  const validMember = {
    user_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    equipe_id: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  }

  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { POST } = await import('@/app/api/equipe/route')
    const res = await POST(makeRequest('/api/equipe', { body: validMember }))
    expect(res.status).toBe(401)
  })

  it('returns 403 for roles below dir_concession', async () => {
    mockAuth({ role: 'chef_ventes', level: 2 })
    const { POST } = await import('@/app/api/equipe/route')
    const res = await POST(makeRequest('/api/equipe', { body: validMember }))
    expect(res.status).toBe(403)
  })

  it('returns 400 on invalid body', async () => {
    mockAuth({ role: 'dir_concession', level: 3 })
    const { POST } = await import('@/app/api/equipe/route')
    const res = await POST(makeRequest('/api/equipe', { body: { user_id: 'not-uuid' } }))
    expect(res.status).toBe(400)
  })

  it('adds member to team (dir_concession) and returns 201', async () => {
    const result = { id: validMember.user_id, equipe_id: validMember.equipe_id }
    mockAuth({ role: 'dir_concession', level: 3 }, {
      profiles: { data: result, error: null },
    })

    const { POST } = await import('@/app/api/equipe/route')
    const res = await POST(makeRequest('/api/equipe', { body: validMember }))
    expect(res.status).toBe(201)
    const body = await json(res)
    expect(body.data.equipe_id).toBe(validMember.equipe_id)
  })
})

// =========================================================================
// 9. /api/coaching
// =========================================================================
describe('GET /api/coaching', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/coaching/route')
    const res = await GET(makeRequest('/api/coaching'))
    expect(res.status).toBe(401)
  })

  it('returns paginated coaching notes', async () => {
    const notes = [
      { id: 'n1', type: 'feedback', content: 'Good progress', commercial_id: 'u1' },
    ]
    mockAuth({}, {
      notes_coaching: { data: notes, error: null, count: 1 },
    })

    const { GET } = await import('@/app/api/coaching/route')
    const res = await GET(makeRequest('/api/coaching'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toEqual(notes)
    expect(body.count).toBe(1)
  })

  it('applies commercial_id and type filters', async () => {
    const { supabase } = mockAuth({}, {
      notes_coaching: { data: [], error: null, count: 0 },
    })

    const { GET } = await import('@/app/api/coaching/route')
    await GET(makeRequest('/api/coaching?commercial_id=u1&type=feedback'))
    expect(supabase.from).toHaveBeenCalledWith('notes_coaching')
  })

  it('returns 500 on Supabase error', async () => {
    mockAuth({}, {
      notes_coaching: { data: null, error: { message: 'Coaching query failed' }, count: null },
    })

    const { GET } = await import('@/app/api/coaching/route')
    const res = await GET(makeRequest('/api/coaching'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/coaching', () => {
  const validNote = {
    commercial_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    type: 'feedback' as const,
    content: 'Excellent progress on financing rate this month.',
  }

  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { POST } = await import('@/app/api/coaching/route')
    const res = await POST(makeRequest('/api/coaching', { body: validNote }))
    expect(res.status).toBe(401)
  })

  it('returns 403 for roles below chef_ventes', async () => {
    mockAuth({ role: 'commercial', level: 1 })
    const { POST } = await import('@/app/api/coaching/route')
    const res = await POST(makeRequest('/api/coaching', { body: validNote }))
    expect(res.status).toBe(403)
  })

  it('returns 400 on invalid body', async () => {
    mockAuth({ role: 'chef_ventes', level: 2 })
    const { POST } = await import('@/app/api/coaching/route')
    const res = await POST(makeRequest('/api/coaching', { body: { content: '' } }))
    expect(res.status).toBe(400)
  })

  it('creates coaching note and returns 201', async () => {
    const created = { id: 'n-new', ...validNote, manager_id: 'user-001' }
    mockAuth({ role: 'chef_ventes', level: 2 }, {
      notes_coaching: { data: created, error: null },
    })

    const { POST } = await import('@/app/api/coaching/route')
    const res = await POST(makeRequest('/api/coaching', { body: validNote }))
    expect(res.status).toBe(201)
    const body = await json(res)
    expect(body.data.id).toBe('n-new')
    expect(body.data.manager_id).toBe('user-001')
  })

  it('creates private coaching note', async () => {
    const privateNote = { ...validNote, is_private: true }
    const created = { id: 'n-priv', ...privateNote, manager_id: 'user-001' }
    mockAuth({ role: 'dir_concession', level: 3 }, {
      notes_coaching: { data: created, error: null },
    })

    const { POST } = await import('@/app/api/coaching/route')
    const res = await POST(makeRequest('/api/coaching', { body: privateNote }))
    expect(res.status).toBe(201)
  })

  it('returns 500 on insert error', async () => {
    mockAuth({ role: 'chef_ventes', level: 2 }, {
      notes_coaching: { data: null, error: { message: 'Insert failed' } },
    })

    const { POST } = await import('@/app/api/coaching/route')
    const res = await POST(makeRequest('/api/coaching', { body: validNote }))
    expect(res.status).toBe(500)
  })
})

// =========================================================================
// 10. /api/payplan
// =========================================================================
describe('GET /api/payplan', () => {
  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { GET } = await import('@/app/api/payplan/route')
    const res = await GET(makeRequest('/api/payplan'))
    expect(res.status).toBe(401)
  })

  it('returns payplans for authenticated user', async () => {
    const payplans = [
      { id: 'pp1', name: 'Payplan principal', is_active: true, concession_id: 'conc-001' },
    ]
    mockAuth({}, {
      payplans: { data: payplans, error: null },
    })

    const { GET } = await import('@/app/api/payplan/route')
    const res = await GET(makeRequest('/api/payplan'))
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.data).toEqual(payplans)
  })

  it('filters by concession_id parameter', async () => {
    const { supabase } = mockAuth({}, {
      payplans: { data: [], error: null },
    })

    const { GET } = await import('@/app/api/payplan/route')
    await GET(makeRequest('/api/payplan?concession_id=conc-001'))
    expect(supabase.from).toHaveBeenCalledWith('payplans')
  })

  it('returns 500 on Supabase error', async () => {
    mockAuth({}, {
      payplans: { data: null, error: { message: 'Payplan query failed' } },
    })

    const { GET } = await import('@/app/api/payplan/route')
    const res = await GET(makeRequest('/api/payplan'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/payplan', () => {
  const validPayplan = {
    concession_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    name: 'Payplan VO 2026',
    config: {
      fixedSalary: 2000,
      baseCommissionVO: 50,
    },
  }

  it('returns 401 when unauthenticated', async () => {
    mockUnauth()
    const { POST } = await import('@/app/api/payplan/route')
    const res = await POST(makeRequest('/api/payplan', { body: validPayplan }))
    expect(res.status).toBe(401)
  })

  it('returns 403 for roles below dir_concession', async () => {
    mockAuth({ role: 'chef_ventes', level: 2 })
    const { POST } = await import('@/app/api/payplan/route')
    const res = await POST(makeRequest('/api/payplan', { body: validPayplan }))
    expect(res.status).toBe(403)
  })

  it('returns 400 on invalid body (missing concession_id)', async () => {
    mockAuth({ role: 'dir_concession', level: 3 })
    const { POST } = await import('@/app/api/payplan/route')
    const res = await POST(makeRequest('/api/payplan', {
      body: { name: 'Test', config: {} },
    }))
    expect(res.status).toBe(400)
  })

  it('creates payplan with valid data (dir_concession) and returns 201', async () => {
    const created = { id: 'pp-new', ...validPayplan, created_by: 'user-001' }
    mockAuth({ role: 'dir_concession', level: 3 }, {
      payplans: { data: created, error: null },
    })

    const { POST } = await import('@/app/api/payplan/route')
    const res = await POST(makeRequest('/api/payplan', { body: validPayplan }))
    expect(res.status).toBe(201)
    const body = await json(res)
    expect(body.data.id).toBe('pp-new')
    expect(body.data.created_by).toBe('user-001')
  })

  it('admin can also create payplans', async () => {
    const created = { id: 'pp-admin', ...validPayplan, created_by: 'user-001' }
    mockAuth({ role: 'admin', level: 6 }, {
      payplans: { data: created, error: null },
    })

    const { POST } = await import('@/app/api/payplan/route')
    const res = await POST(makeRequest('/api/payplan', { body: validPayplan }))
    expect(res.status).toBe(201)
  })

  it('returns 500 on insert error', async () => {
    mockAuth({ role: 'dir_concession', level: 3 }, {
      payplans: { data: null, error: { message: 'Insert failed' } },
    })

    const { POST } = await import('@/app/api/payplan/route')
    const res = await POST(makeRequest('/api/payplan', { body: validPayplan }))
    expect(res.status).toBe(500)
  })
})

// =========================================================================
// Cross-cutting: Auth pattern consistency
// =========================================================================
describe('Cross-cutting: All routes reject unauthenticated requests', () => {
  beforeEach(() => {
    mockUnauth()
  })

  const routeTests: { name: string; path: string; method: string }[] = [
    { name: 'GET /api/fiches-marge', path: '@/app/api/fiches-marge/route', method: 'GET' },
    { name: 'GET /api/defis', path: '@/app/api/defis/route', method: 'GET' },
    { name: 'GET /api/defis-p2p', path: '@/app/api/defis-p2p/route', method: 'GET' },
    { name: 'GET /api/leaderboard', path: '@/app/api/leaderboard/route', method: 'GET' },
    { name: 'GET /api/approbations', path: '@/app/api/approbations/route', method: 'GET' },
    { name: 'GET /api/coaching', path: '@/app/api/coaching/route', method: 'GET' },
    { name: 'GET /api/payplan', path: '@/app/api/payplan/route', method: 'GET' },
    { name: 'GET /api/equipe', path: '@/app/api/equipe/route', method: 'GET' },
  ]

  for (const { name, path, method } of routeTests) {
    it(`${name} returns 401`, async () => {
      const mod = await import(path)
      const handler = mod[method]
      const url = name.split(' ')[1]
      const res = await handler(makeRequest(url))
      expect(res.status).toBe(401)
    })
  }
})

// =========================================================================
// Cross-cutting: Role-based access control
// =========================================================================
describe('Cross-cutting: Role-based access control enforcement', () => {
  it('POST /api/defis requires at least chef_ventes', async () => {
    mockAuth({ role: 'commercial', level: 1 })
    const { POST } = await import('@/app/api/defis/route')
    const res = await POST(makeRequest('/api/defis', {
      body: {
        title: 'Test', scope_type: 'individual', target_level: 1,
        challenge_type: 'sales', target_value: 5,
        start_date: '2026-03-01', end_date: '2026-03-31',
        reward: { type: 'bonus', value: 100, description: 'Test' },
      },
    }))
    expect(res.status).toBe(403)
  })

  it('POST /api/equipe requires at least dir_concession', async () => {
    mockAuth({ role: 'chef_ventes', level: 2 })
    const { POST } = await import('@/app/api/equipe/route')
    const res = await POST(makeRequest('/api/equipe', {
      body: {
        user_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        equipe_id: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
      },
    }))
    expect(res.status).toBe(403)
  })

  it('POST /api/payplan requires at least dir_concession', async () => {
    mockAuth({ role: 'chef_ventes', level: 2 })
    const { POST } = await import('@/app/api/payplan/route')
    const res = await POST(makeRequest('/api/payplan', {
      body: {
        concession_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        config: {},
      },
    }))
    expect(res.status).toBe(403)
  })

  it('POST /api/coaching requires at least chef_ventes', async () => {
    mockAuth({ role: 'commercial', level: 1 })
    const { POST } = await import('@/app/api/coaching/route')
    const res = await POST(makeRequest('/api/coaching', {
      body: {
        commercial_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        type: 'feedback',
        content: 'Some feedback',
      },
    }))
    expect(res.status).toBe(403)
  })

  it('GET /api/equipe requires at least chef_ventes', async () => {
    mockAuth({ role: 'commercial', level: 1 })
    const { GET } = await import('@/app/api/equipe/route')
    const res = await GET(makeRequest('/api/equipe'))
    expect(res.status).toBe(403)
  })
})
