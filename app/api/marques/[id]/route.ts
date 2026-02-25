import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, notFound, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()
  if (!hasMinRole(auth.profile, 'dir_marque')) return forbidden()

  const { id } = await params
  const { supabase } = auth

  // 1. Fetch the marque
  const { data: marque, error: marqueError } = await supabase
    .from('marques')
    .select('*')
    .eq('id', id)
    .single()

  if (marqueError || !marque) return notFound('Marque')

  // 2. Fetch concessions for this marque
  const { data: concessions } = await supabase
    .from('concessions')
    .select('*')
    .eq('marque_id', id)
    .order('name')

  // Date ranges for growth comparison
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().split('T')[0]
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString().split('T')[0]

  // 3. For each concession, compute stats
  const concessionsWithStats = await Promise.all(
    (concessions ?? []).map(async (concession) => {
      // Get director
      const { data: dirProfile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('concession_id', concession.id)
        .eq('role', 'dir_concession')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      // Get fiches_marge + equipes + prev month in parallel
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

      // Growth: current month vs previous month
      const growth = prevMonthSales > 0
        ? Math.round(((totalSales - prevMonthSales) / prevMonthSales) * 100)
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
        satisfaction: 0, // No data source
        stock_days: 0, // No data source
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

  // Aggregate marque-level stats
  const totalSales = concessionsWithStats.reduce((s, c) => s + c.total_sales, 0)
  const totalRevenue = concessionsWithStats.reduce((s, c) => s + c.total_revenue, 0)
  const totalMargin = concessionsWithStats.reduce((s, c) => s + c.total_margin, 0)
  const financedSum = concessionsWithStats.reduce((s, c) => s + Math.round(c.total_sales * c.financing_rate / 100), 0)
  const financingRate = totalSales > 0 ? Math.round((financedSum / totalSales) * 100) : 0

  // Sales target (aggregate from concessions)
  const salesTarget = concessionsWithStats.reduce((s, c) => s + c.sales_target, 0)

  // Quarterly growth
  const concessionIds = concessionsWithStats.map(c => c.id)
  let quarterlyGrowth = 0
  if (concessionIds.length > 0) {
    const [prevQ, currQ] = await Promise.all([
      supabase.from('fiches_marge').select('*', { count: 'exact', head: true })
        .in('concession_id', concessionIds).eq('status', 'approved')
        .gte('date', sixMonthsAgo).lt('date', threeMonthsAgo),
      supabase.from('fiches_marge').select('*', { count: 'exact', head: true })
        .in('concession_id', concessionIds).eq('status', 'approved')
        .gte('date', threeMonthsAgo),
    ])
    const prev = prevQ.count ?? 0
    const curr = currQ.count ?? 0
    quarterlyGrowth = prev > 0 ? Math.round(((curr - prev) / prev) * 100) : 0
  }

  // Employee count + Director in parallel
  const [empResult, dirResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .eq('marque_id', id).eq('is_active', true),
    supabase.from('profiles').select('id, full_name')
      .eq('marque_id', id).eq('role', 'dir_marque').eq('is_active', true)
      .limit(1).maybeSingle(),
  ])

  const employeeCount = empResult.count ?? 0
  const director = dirResult.data

  return NextResponse.json({
    data: {
      id: marque.id,
      name: marque.name,
      logo_url: marque.logo_url,
      settings: marque.settings || {},
      constructor_targets: marque.constructor_targets || [],
      director_id: director?.id ?? '',
      director_name: director?.full_name ?? '',
      dealership_count: concessionsWithStats.length,
      employee_count: employeeCount,
      total_sales: totalSales,
      sales_target: salesTarget,
      total_revenue: totalRevenue,
      total_margin: totalMargin,
      financing_rate: financingRate,
      satisfaction: 0, // No data source — displayed as N/A
      market_share: 0, // Single brand view — not applicable
      quarterly_growth: quarterlyGrowth,
      concessions: concessionsWithStats,
    },
  })
}
