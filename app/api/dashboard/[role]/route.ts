import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { ROLE_LEVELS } from '@/lib/api/types'
import type { UserRole } from '@/types/hierarchy'

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
  let dateFrom: string | undefined
  let dateTo: string | undefined
  if (period) {
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

  const [fichesResult, defisP2PResult, notificationsResult] = await Promise.all([
    fichesQuery,
    nonNullAuth.supabase.from('defis_p2p').select('*', { count: 'exact' })
      .or(`challenger_id.eq.${nonNullAuth.user.id},challenged_id.eq.${nonNullAuth.user.id}`)
      .eq('status', 'active'),
    nonNullAuth.supabase.from('notifications').select('*', { count: 'exact' })
      .eq('user_id', nonNullAuth.user.id).eq('is_read', false),
  ])

  const fiches = fichesResult.data || []
  const totalSales = fiches.length
  const totalMargin = fiches.reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0)
  const totalCommission = fiches.reduce((sum, f) => sum + (Number(f.seller_commission) || 0), 0)
  const totalRevenue = fiches.reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0)
  const financingCount = fiches.filter(f => f.has_financing).length
  const financingRate = totalSales > 0 ? (financingCount / totalSales) * 100 : 0

  return NextResponse.json({
    data: {
      kpis: {
        totalSales,
        totalMargin,
        totalCommission,
        totalRevenue,
        financingRate: Math.round(financingRate * 10) / 10,
        avgGPU: totalSales > 0 ? Math.round(totalMargin / totalSales) : 0,
        pendingApprovals: fiches.filter(f => f.status === 'submitted').length,
      },
      activeP2PChallenges: defisP2PResult.count || 0,
      unreadNotifications: notificationsResult.count || 0,
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
    .select('id, name, type, objective')
    .eq('chef_ventes_id', nonNullAuth.user.id)

  // Fiches de marge (RLS filtre automatiquement)
  let fichesQuery = nonNullAuth.supabase
    .from('fiches_marge')
    .select('user_id, final_margin, seller_commission, selling_price_ht, has_financing, status, vehicle_type')

  if (dateFrom) fichesQuery = fichesQuery.gte('date', dateFrom)
  if (dateTo) fichesQuery = fichesQuery.lt('date', dateTo)

  const [fichesResult, pendingResult] = await Promise.all([
    fichesQuery,
    nonNullAuth.supabase.from('approbations').select('*', { count: 'exact' }).eq('status', 'pending'),
  ])

  const fiches = fichesResult.data || []

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

  const [fichesResult, equipesResult, membersResult] = await Promise.all([
    fichesQuery,
    nonNullAuth.supabase.from('equipes').select('*').eq('concession_id', concessionId || ''),
    nonNullAuth.supabase.from('profiles').select('id, role').eq('concession_id', concessionId || ''),
  ])

  const fiches = fichesResult.data || []

  return NextResponse.json({
    data: {
      kpis: {
        totalSales: fiches.length,
        totalMargin: fiches.reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0),
        totalRevenue: fiches.reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0),
        teamCount: equipesResult.data?.length || 0,
        staffCount: membersResult.data?.length || 0,
      },
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

  const { data: fiches } = await fichesQuery

  return NextResponse.json({
    data: {
      concessions: concessions || [],
      kpis: {
        totalSales: fiches?.length || 0,
        totalMargin: (fiches || []).reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0),
        totalRevenue: (fiches || []).reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0),
        sitesCount: concessionIds.length,
      },
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

  const { data: fiches, error } = await fichesQuery

  if (error) return serverError(error.message)

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
    }
  })
}
