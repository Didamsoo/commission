import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'
import { getFilterParam } from '@/lib/api/pagination'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const period = getFilterParam(request, 'period') // ex: '2026-02'
  const metric = getFilterParam(request, 'metric') || 'final_margin'
  const vehicleType = getFilterParam(request, 'vehicle_type')
  const limitParam = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10)

  // Construire les filtres de date
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

  // Récupérer les fiches de marge (RLS appliqué)
  let query = auth.supabase
    .from('fiches_marge')
    .select(`
      user_id,
      final_margin,
      seller_commission,
      selling_price_ht,
      vehicle_type,
      has_financing,
      profiles!fiches_marge_user_id_fkey(full_name, avatar_url, role, equipe_id, concession_id)
    `)
    .in('status', ['approved', 'submitted'])

  if (dateFrom) query = query.gte('date', dateFrom)
  if (dateTo) query = query.lt('date', dateTo)
  if (vehicleType) query = query.eq('vehicle_type', vehicleType)

  const { data: fiches, error } = await query

  if (error) return serverError(error.message)

  // Agréger par utilisateur
  const userMap = new Map<string, {
    user_id: string
    full_name: string
    avatar_url: string | null
    role: string
    total_sales: number
    total_margin: number
    total_commission: number
    total_revenue: number
    financing_count: number
  }>()

  for (const fiche of fiches || []) {
    const profileRaw = fiche.profiles as unknown
    const profile = Array.isArray(profileRaw) ? profileRaw[0] : profileRaw
    if (!profile) continue

    const existing = userMap.get(fiche.user_id) || {
      user_id: fiche.user_id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      total_sales: 0,
      total_margin: 0,
      total_commission: 0,
      total_revenue: 0,
      financing_count: 0,
    }

    existing.total_sales += 1
    existing.total_margin += Number(fiche.final_margin) || 0
    existing.total_commission += Number(fiche.seller_commission) || 0
    existing.total_revenue += Number(fiche.selling_price_ht) || 0
    if (fiche.has_financing) existing.financing_count += 1

    userMap.set(fiche.user_id, existing)
  }

  // Trier par métrique demandée
  const sortKey = metric === 'seller_commission' ? 'total_commission'
    : metric === 'selling_price_ht' ? 'total_revenue'
    : metric === 'sales_count' ? 'total_sales'
    : 'total_margin'

  const leaderboard = Array.from(userMap.values())
    .sort((a, b) => (b[sortKey as keyof typeof b] as number) - (a[sortKey as keyof typeof a] as number))
    .slice(0, limitParam)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  return NextResponse.json({ data: leaderboard })
}
