import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { ROLE_LEVELS } from '@/lib/api/types'
import type { UserRole } from '@/types/hierarchy'

// Helper: build performance history grouped by month from fiches
function buildPerformanceHistory(
  fiches: { date?: string; final_margin?: number; selling_price_ht?: number; has_financing?: boolean }[]
) {
  const months: Record<string, { sales: number; margin: number; financingCount: number; revenue: number }> = {}

  for (const f of fiches) {
    if (!f.date) continue
    const d = new Date(f.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!months[key]) months[key] = { sales: 0, margin: 0, financingCount: 0, revenue: 0 }
    months[key].sales += 1
    months[key].margin += Number(f.final_margin) || 0
    months[key].revenue += Number(f.selling_price_ht) || 0
    if (f.has_financing) months[key].financingCount += 1
  }

  const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // last 6 months
    .map(([period, data]) => {
      const [, m] = period.split('-')
      return {
        period,
        label: MONTH_LABELS[parseInt(m, 10) - 1],
        sales: data.sales,
        target: 0, // Target will be enriched by the caller if available
        margin: Math.round(data.margin),
        financingRate: data.sales > 0 ? Math.round((data.financingCount / data.sales) * 100) : 0,
      }
    })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ role: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { role } = await params

  // Vérifier que le rôle demandé est valide
  if (!(role in ROLE_LEVELS)) return forbidden()

  // L'utilisateur doit avoir un niveau >= au rôle demandé
  const requestedLevel = ROLE_LEVELS[role as UserRole]
  const userLevel = ROLE_LEVELS[auth.profile.role]
  if (userLevel < requestedLevel && auth.profile.role !== 'admin') return forbidden()

  const period = request.nextUrl.searchParams.get('period')
  const startDate = request.nextUrl.searchParams.get('startDate')
  const endDate = request.nextUrl.searchParams.get('endDate')
  let dateFrom: string | undefined
  let dateTo: string | undefined

  if (startDate && endDate) {
    dateFrom = startDate
    dateTo = endDate
  } else if (period) {
    const [year, month] = period.split('-')
    dateFrom = `${year}-${month}-01`
    const nextMonth = parseInt(month, 10) + 1
    dateTo = nextMonth > 12
      ? `${parseInt(year, 10) + 1}-01-01`
      : `${year}-${String(nextMonth).padStart(2, '0')}-01`
  }

  switch (role as UserRole) {
    case 'commercial':
      return getCommercialDashboard(auth, dateFrom, dateTo)
    case 'chef_ventes':
      return getChefVentesDashboard(auth, dateFrom, dateTo)
    case 'dir_concession':
      return getDirConcessionDashboard(auth, dateFrom, dateTo)
    case 'dir_marque':
      return getDirMarqueDashboard(auth, dateFrom, dateTo)
    case 'dir_plaque':
      return getDirPlaqueDashboard(auth, dateFrom, dateTo)
    default:
      return forbidden()
  }
}

async function getCommercialDashboard(
  auth: Awaited<ReturnType<typeof getAuthenticatedUser>> & object,
  dateFrom?: string,
  dateTo?: string
) {
  const nonNullAuth = auth!

  let fichesQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('*')
    .eq('user_id', nonNullAuth.user.id)

  if (dateFrom) fichesQuery = fichesQuery.gte('date', dateFrom)
  if (dateTo) fichesQuery = fichesQuery.lt('date', dateTo)

  // Fetch last 6 months of data for charts (independent of period filter)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const historyQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('date, final_margin, selling_price_ht, has_financing')
    .eq('user_id', nonNullAuth.user.id)
    .gte('date', sixMonthsAgo.toISOString().split('T')[0])

  const [fichesResult, defisP2PResult, notificationsResult, historyResult, equipeResult] = await Promise.all([
    fichesQuery,
    nonNullAuth.supabase.from('defis_p2p').select('*', { count: 'exact' })
      .or(`challenger_id.eq.${nonNullAuth.user.id},challenged_id.eq.${nonNullAuth.user.id}`)
      .eq('status', 'active'),
    nonNullAuth.supabase.from('notifications').select('*', { count: 'exact' })
      .eq('user_id', nonNullAuth.user.id).eq('is_read', false),
    historyQuery,
    nonNullAuth.supabase.from('equipes').select('objective')
      .eq('concession_id', nonNullAuth.profile.concession_id || ''),
  ])

  const fiches = fichesResult.data || []
  const totalSales = fiches.length
  const totalMargin = fiches.reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0)
  const totalCommission = fiches.reduce((sum, f) => sum + (Number(f.seller_commission) || 0), 0)
  const totalRevenue = fiches.reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0)
  const financingCount = fiches.filter(f => f.has_financing).length
  const financingRate = totalSales > 0 ? (financingCount / totalSales) * 100 : 0

  // Sales target from team objectives
  const salesTarget = (equipeResult.data || []).reduce((sum, eq) => {
    const obj = eq.objective as Record<string, number> | null
    return sum + (obj?.monthly_target ?? 0)
  }, 0)

  return NextResponse.json({
    data: {
      kpis: {
        totalSales,
        salesTarget,
        totalMargin,
        totalCommission,
        totalRevenue,
        financingRate: Math.round(financingRate * 10) / 10,
        avgGPU: totalSales > 0 ? Math.round(totalMargin / totalSales) : 0,
        pendingApprovals: fiches.filter(f => f.status === 'submitted').length,
      },
      activeP2PChallenges: defisP2PResult.count || 0,
      unreadNotifications: notificationsResult.count || 0,
      performanceHistory: buildPerformanceHistory(historyResult.data || []),
    }
  })
}

async function getChefVentesDashboard(
  auth: Awaited<ReturnType<typeof getAuthenticatedUser>> & object,
  dateFrom?: string,
  dateTo?: string
) {
  const nonNullAuth = auth!

  // Récupérer les équipes managées
  const { data: equipes } = await nonNullAuth.supabase
    .from('equipes')
    .select('id, name, type, objective, concession_id')
    .eq('chef_ventes_id', nonNullAuth.user.id)

  const concessionId = nonNullAuth.profile.concession_id

  // Fiches de marge (RLS filtre automatiquement)
  let fichesQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('user_id, final_margin, seller_commission, selling_price_ht, has_financing, status, vehicle_type')

  if (dateFrom) fichesQuery = fichesQuery.gte('date', dateFrom)
  if (dateTo) fichesQuery = fichesQuery.lt('date', dateTo)

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const historyQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('date, final_margin, selling_price_ht, has_financing')
    .gte('date', sixMonthsAgo.toISOString().split('T')[0])

  // Also fetch all sibling teams in the same concession
  const siblingTeamsQuery = concessionId
    ? nonNullAuth.supabase
        .from('equipes')
        .select('id, name, type, objective, chef_ventes_id')
        .eq('concession_id', concessionId)
    : null

  const [fichesResult, pendingResult, historyResult, siblingResult] = await Promise.all([
    fichesQuery,
    nonNullAuth.supabase.from('approbations').select('*', { count: 'exact' }).eq('status', 'pending'),
    historyQuery,
    siblingTeamsQuery ?? Promise.resolve({ data: null }),
  ])

  const fiches = fichesResult.data || []
  const allSiblingTeams = siblingResult.data || []

  // Build siblingTeams: for each team in the concession, compute sales/target/rate
  const myTeamIds = new Set((equipes || []).map(e => e.id))
  const siblingTeams = await Promise.all(
    allSiblingTeams
      .filter(t => !myTeamIds.has(t.id)) // exclude own teams
      .map(async (team) => {
        // Get members of this team
        const { data: members } = await nonNullAuth.supabase
          .from('profiles')
          .select('id')
          .eq('equipe_id', team.id)
          .eq('is_active', true)

        const memberIds = (members || []).map(m => m.id)
        let teamSales = 0

        if (memberIds.length > 0) {
          let q = nonNullAuth.supabase
            .from('fiches_marge')
            .select('*', { count: 'exact', head: true })
            .in('user_id', memberIds)
            .eq('status', 'approved')
          if (dateFrom) q = q.gte('date', dateFrom)
          if (dateTo) q = q.lt('date', dateTo)
          const { count } = await q
          teamSales = count ?? 0
        }

        const obj = team.objective as Record<string, number> | null
        const target = obj?.monthly_target ?? 0

        return {
          type: team.type,
          name: team.name,
          sales: teamSales,
          target,
          rate: target > 0 ? Math.round((teamSales / target) * 100) : 0,
        }
      })
  )

  return NextResponse.json({
    data: {
      equipes: equipes || [],
      kpis: {
        teamSales: fiches.length,
        teamMargin: fiches.reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0),
        teamRevenue: fiches.reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0),
        teamFinancingRate: fiches.length > 0
          ? Math.round((fiches.filter(f => f.has_financing).length / fiches.length) * 1000) / 10
          : 0,
        pendingApprovals: pendingResult.count || 0,
      },
      siblingTeams,
      performanceHistory: buildPerformanceHistory(historyResult.data || []),
    }
  })
}

async function getDirConcessionDashboard(
  auth: Awaited<ReturnType<typeof getAuthenticatedUser>> & object,
  dateFrom?: string,
  dateTo?: string
) {
  const nonNullAuth = auth!
  const concessionId = nonNullAuth.profile.concession_id

  let fichesQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('user_id, final_margin, seller_commission, selling_price_ht, has_financing, vehicle_type, status')

  if (concessionId) fichesQuery = fichesQuery.eq('concession_id', concessionId)
  if (dateFrom) fichesQuery = fichesQuery.gte('date', dateFrom)
  if (dateTo) fichesQuery = fichesQuery.lt('date', dateTo)

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  let historyQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('date, final_margin, selling_price_ht, has_financing, vehicle_type')
    .gte('date', sixMonthsAgo.toISOString().split('T')[0])
  if (concessionId) historyQuery = historyQuery.eq('concession_id', concessionId)

  const [fichesResult, equipesResult, membersResult, historyResult] = await Promise.all([
    fichesQuery,
    nonNullAuth.supabase.from('equipes').select('*').eq('concession_id', concessionId || ''),
    nonNullAuth.supabase.from('profiles').select('id, role').eq('concession_id', concessionId || ''),
    historyQuery,
  ])

  const fiches = fichesResult.data || []

  // Department stats breakdown by vehicle_type
  const deptMap: Record<string, { sales: number; revenue: number; margin: number; financingCount: number }> = {}
  for (const f of fiches) {
    const vt = f.vehicle_type || 'OTHER'
    // Map VP → VN for display
    const dept = vt === 'VP' ? 'VN' : vt
    if (!deptMap[dept]) deptMap[dept] = { sales: 0, revenue: 0, margin: 0, financingCount: 0 }
    deptMap[dept].sales += 1
    deptMap[dept].revenue += Number(f.selling_price_ht) || 0
    deptMap[dept].margin += Number(f.final_margin) || 0
    if (f.has_financing) deptMap[dept].financingCount += 1
  }

  const departmentStats: Record<string, {
    totalSales: number
    totalRevenue: number
    totalMargin: number
    avgGPU: number
    financingRate: number
  }> = {}
  for (const [dept, data] of Object.entries(deptMap)) {
    departmentStats[dept] = {
      totalSales: data.sales,
      totalRevenue: data.revenue,
      totalMargin: Math.round(data.margin),
      avgGPU: data.sales > 0 ? Math.round(data.margin / data.sales) : 0,
      financingRate: data.sales > 0 ? Math.round((data.financingCount / data.sales) * 100) : 0,
    }
  }

  return NextResponse.json({
    data: {
      kpis: {
        totalSales: fiches.length,
        totalMargin: fiches.reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0),
        totalRevenue: fiches.reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0),
        teamCount: equipesResult.data?.length || 0,
        staffCount: membersResult.data?.length || 0,
      },
      departmentStats,
      performanceHistory: buildPerformanceHistory(historyResult.data || []),
    }
  })
}

async function getDirMarqueDashboard(
  auth: Awaited<ReturnType<typeof getAuthenticatedUser>> & object,
  dateFrom?: string,
  dateTo?: string
) {
  const nonNullAuth = auth!

  // Concessions de la marque
  const { data: concessions } = await nonNullAuth.supabase
    .from('concessions')
    .select('id, name')
    .eq('marque_id', nonNullAuth.profile.marque_id || '')

  const concessionIds = concessions?.map(c => c.id) || []

  let fichesQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('concession_id, final_margin, selling_price_ht, has_financing, vehicle_type')

  if (concessionIds.length > 0) fichesQuery = fichesQuery.in('concession_id', concessionIds)
  if (dateFrom) fichesQuery = fichesQuery.gte('date', dateFrom)
  if (dateTo) fichesQuery = fichesQuery.lt('date', dateTo)

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  let historyQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('date, final_margin, selling_price_ht, has_financing')
    .gte('date', sixMonthsAgo.toISOString().split('T')[0])
  if (concessionIds.length > 0) historyQuery = historyQuery.in('concession_id', concessionIds)

  const [fichesResult, historyResult] = await Promise.all([
    fichesQuery,
    historyQuery,
  ])

  const fiches = fichesResult.data

  return NextResponse.json({
    data: {
      concessions: concessions || [],
      kpis: {
        totalSales: fiches?.length || 0,
        totalMargin: (fiches || []).reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0),
        totalRevenue: (fiches || []).reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0),
        sitesCount: concessionIds.length,
      },
      performanceHistory: buildPerformanceHistory(historyResult.data || []),
    }
  })
}

async function getDirPlaqueDashboard(
  auth: Awaited<ReturnType<typeof getAuthenticatedUser>> & object,
  dateFrom?: string,
  dateTo?: string
) {
  const nonNullAuth = auth!

  const [marquesResult, concessionsResult] = await Promise.all([
    nonNullAuth.supabase.from('marques').select('id, name').eq('groupe_id', nonNullAuth.profile.groupe_id || ''),
    nonNullAuth.supabase.from('concessions').select('id, name, marque_id').eq('groupe_id', nonNullAuth.profile.groupe_id || ''),
  ])

  let fichesQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('concession_id, final_margin, selling_price_ht, vehicle_type')

  if (dateFrom) fichesQuery = fichesQuery.gte('date', dateFrom)
  if (dateTo) fichesQuery = fichesQuery.lt('date', dateTo)

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const historyQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('date, final_margin, selling_price_ht, has_financing, concession_id')
    .gte('date', sixMonthsAgo.toISOString().split('T')[0])

  const [fichesQueryResult, historyResult] = await Promise.all([
    fichesQuery,
    historyQuery,
  ])

  const fiches = fichesQueryResult.data
  const fichesError = fichesQueryResult.error

  if (fichesError) return serverError(fichesError.message)

  // Build per-brand performance history
  const allConcessions = concessionsResult.data || []
  const allMarques = marquesResult.data || []
  const historyFiches = historyResult.data || []

  // Map concession_id -> marque_id
  const concessionToMarque: Record<string, string> = {}
  for (const c of allConcessions) {
    if (c.marque_id) concessionToMarque[c.id] = c.marque_id
  }

  // Group history fiches by marque
  const fichesPerMarque: Record<string, typeof historyFiches> = {}
  for (const f of historyFiches) {
    const marqueId = concessionToMarque[f.concession_id]
    if (!marqueId) continue
    if (!fichesPerMarque[marqueId]) fichesPerMarque[marqueId] = []
    fichesPerMarque[marqueId].push(f)
  }

  // Build perBrandHistory
  const perBrandHistory: Record<string, ReturnType<typeof buildPerformanceHistory>> = {}
  for (const marque of allMarques) {
    const brandFiches = fichesPerMarque[marque.id] || []
    perBrandHistory[marque.id] = buildPerformanceHistory(brandFiches)
  }

  return NextResponse.json({
    data: {
      marques: marquesResult.data || [],
      concessions: concessionsResult.data || [],
      kpis: {
        totalSales: fiches?.length || 0,
        totalMargin: (fiches || []).reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0),
        totalRevenue: (fiches || []).reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0),
        brandsCount: marquesResult.data?.length || 0,
        sitesCount: concessionsResult.data?.length || 0,
      },
      performanceHistory: buildPerformanceHistory(historyFiches),
      perBrandHistory,
    }
  })
}
