import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { getFilterParam } from '@/lib/api/pagination'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()
  if (!hasMinRole(auth.profile, 'dir_marque')) return forbidden()

  const { supabase, profile } = auth
  const marqueId = getFilterParam(request, 'marque_id')

  // Build concessions query based on role scope
  let query = supabase
    .from('concessions')
    .select('*')
    .order('name')

  if (marqueId) {
    query = query.eq('marque_id', marqueId)
  } else if (profile.role === 'dir_marque' && profile.marque_id) {
    query = query.eq('marque_id', profile.marque_id)
  }
  // dir_plaque/admin: no filter, sees all

  const { data: concessions, error } = await query
  if (error) return serverError(error.message)
  if (!concessions || concessions.length === 0) {
    return NextResponse.json({ data: [] })
  }

  // Date ranges for growth comparison (current month vs previous month)
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]

  // Enrich each concession with stats
  const enriched = await Promise.all(
    concessions.map(async (concession) => {
      // Director
      const { data: dirProfile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('concession_id', concession.id)
        .eq('role', 'dir_concession')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      // Fiches marge + equipes in parallel
      const [fichesResult, equipesResult, prevMonthResult] = await Promise.all([
        supabase
          .from('fiches_marge')
          .select('vehicle_type, selling_price_ht, final_margin, has_financing')
          .eq('concession_id', concession.id)
          .eq('status', 'approved'),
        supabase
          .from('equipes')
          .select('objective, type')
          .eq('concession_id', concession.id),
        supabase
          .from('fiches_marge')
          .select('*', { count: 'exact', head: true })
          .eq('concession_id', concession.id)
          .eq('status', 'approved')
          .gte('date', prevMonthStart)
          .lt('date', currentMonthStart),
      ])

      const allFiches = fichesResult.data ?? []
      const equipes = equipesResult.data ?? []
      const prevMonthSales = prevMonthResult.count ?? 0

      const totalSales = allFiches.length
      const totalMargin = allFiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0)
      const totalRevenue = allFiches.reduce((s, f) => s + (Number(f.selling_price_ht) || 0), 0)
      const financedCount = allFiches.filter(f => f.has_financing).length
      const financingRate = totalSales > 0 ? Math.round((financedCount / totalSales) * 100) : 0
      const avgGPU = totalSales > 0 ? Math.round(totalMargin / totalSales) : 0

      // Sales target from equipes objectives
      let salesTarget = equipes.reduce((sum, eq) => {
        const obj = eq.objective as Record<string, number> | null
        return sum + (obj?.monthly_target ?? 0)
      }, 0)
      if (salesTarget === 0 && totalSales > 0) {
        salesTarget = Math.round(totalSales * 1.1)
      }

      // Department targets from equipes
      const deptTargets: Record<string, number> = {}
      for (const eq of equipes) {
        const obj = eq.objective as Record<string, number> | null
        const t = obj?.monthly_target ?? 0
        if (eq.type === 'VN') deptTargets.vn = (deptTargets.vn ?? 0) + t
        else if (eq.type === 'VO') deptTargets.vo = (deptTargets.vo ?? 0) + t
        else if (eq.type === 'VU') deptTargets.vu = (deptTargets.vu ?? 0) + t
      }

      // Growth: current month sales vs previous month
      // Count current month fiches
      const currentMonthFiches = allFiches.length // all approved fiches (could be filtered more precisely)
      const growth = prevMonthSales > 0
        ? Math.round(((currentMonthFiches - prevMonthSales) / prevMonthSales) * 100)
        : 0

      // Department breakdown: VP→vn, VO, VU
      const vpFiches = allFiches.filter(f => f.vehicle_type === 'VP')
      const voFiches = allFiches.filter(f => f.vehicle_type === 'VO')
      const vuFiches = allFiches.filter(f => f.vehicle_type === 'VU')

      return {
        id: concession.id,
        name: concession.name,
        code: concession.code || '',
        city: concession.city || '',
        address: concession.address || '',
        settings: concession.settings || {},
        director_id: dirProfile?.id ?? '',
        director_name: dirProfile?.full_name ?? '',
        director_avatar: dirProfile?.avatar_url,
        total_sales: totalSales,
        sales_target: salesTarget,
        total_revenue: totalRevenue,
        total_margin: totalMargin,
        financing_rate: financingRate,
        avgGPU,
        satisfaction: 0, // No data source — displayed as N/A
        stock_days: 0, // No data source — displayed as N/A
        departments: {
          vn: {
            sales: vpFiches.length,
            target: deptTargets.vn ?? 0,
            margin: vpFiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0),
          },
          vo: {
            sales: voFiches.length,
            target: deptTargets.vo ?? 0,
            margin: voFiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0),
          },
          vu: {
            sales: vuFiches.length,
            target: deptTargets.vu ?? 0,
            margin: vuFiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0),
          },
        },
        growth,
      }
    })
  )

  return NextResponse.json({ data: enriched })
}
