import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'

export async function GET() {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()
  if (!hasMinRole(auth.profile, 'dir_plaque')) return forbidden()

  const { supabase } = auth

  // 1. Fetch all marques for the user's groupe
  const { data: marques, error: marquesError } = await supabase
    .from('marques')
    .select('*')
    .order('name')

  if (marquesError) return serverError(marquesError.message)
  if (!marques || marques.length === 0) {
    return NextResponse.json({ data: [] })
  }

  // Date ranges for quarterly growth comparison
  const now = new Date()
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
  const currentPeriodStart = threeMonthsAgo.toISOString().split('T')[0]
  const previousPeriodStart = sixMonthsAgo.toISOString().split('T')[0]

  // 2. For each marque, get concession count, employee count, and director
  const enriched = await Promise.all(
    marques.map(async (marque) => {
      // Concession count
      const { count: dealershipCount } = await supabase
        .from('concessions')
        .select('*', { count: 'exact', head: true })
        .eq('marque_id', marque.id)

      // Employee count + find director
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('marque_id', marque.id)
        .eq('is_active', true)

      const director = profiles?.find(p => p.role === 'dir_marque')
      const employeeCount = profiles?.length ?? 0

      // Get concession IDs for this marque
      const { data: concessions } = await supabase
        .from('concessions')
        .select('id')
        .eq('marque_id', marque.id)

      const concessionIds = concessions?.map(c => c.id) ?? []

      // Stats from fiches_marge for these concessions
      let totalSales = 0
      let totalRevenue = 0
      let totalMargin = 0
      let financedCount = 0
      let quarterlyGrowth = 0

      if (concessionIds.length > 0) {
        // Current fiches (approved)
        const { data: fiches } = await supabase
          .from('fiches_marge')
          .select('selling_price_ht, final_margin, has_financing')
          .in('concession_id', concessionIds)
          .eq('status', 'approved')

        if (fiches) {
          totalSales = fiches.length
          totalRevenue = fiches.reduce((sum, f) => sum + (Number(f.selling_price_ht) || 0), 0)
          totalMargin = fiches.reduce((sum, f) => sum + (Number(f.final_margin) || 0), 0)
          financedCount = fiches.filter(f => f.has_financing).length
        }

        // Previous quarter fiches for growth calculation
        const { count: prevCount } = await supabase
          .from('fiches_marge')
          .select('*', { count: 'exact', head: true })
          .in('concession_id', concessionIds)
          .eq('status', 'approved')
          .gte('date', previousPeriodStart)
          .lt('date', currentPeriodStart)

        const prevPeriodSales = prevCount ?? 0

        // Current quarter fiches for growth
        const { count: currCount } = await supabase
          .from('fiches_marge')
          .select('*', { count: 'exact', head: true })
          .in('concession_id', concessionIds)
          .eq('status', 'approved')
          .gte('date', currentPeriodStart)

        const currPeriodSales = currCount ?? 0

        // Quarterly growth: ((current - previous) / previous) * 100
        quarterlyGrowth = prevPeriodSales > 0
          ? Math.round(((currPeriodSales - prevPeriodSales) / prevPeriodSales) * 100)
          : 0
      }

      // Sales target: derive from equipes objectives
      let salesTarget = 0
      if (concessionIds.length > 0) {
        const { data: equipes } = await supabase
          .from('equipes')
          .select('objective, type')
          .in('concession_id', concessionIds)

        if (equipes && equipes.length > 0) {
          salesTarget = equipes.reduce((sum, eq) => {
            const obj = eq.objective as Record<string, number> | null
            return sum + (obj?.monthly_target ?? 0)
          }, 0)
        }
      }
      // Fallback: if no equipe objectives, estimate from sales
      if (salesTarget === 0 && totalSales > 0) {
        salesTarget = Math.round(totalSales * 1.1)
      }

      const financingRate = totalSales > 0 ? Math.round((financedCount / totalSales) * 100) : 0
      const avgGPU = totalSales > 0 ? Math.round(totalMargin / totalSales) : 0
      const settings = marque.settings || {}

      return {
        id: marque.id,
        name: marque.name,
        logo_url: marque.logo_url,
        settings,
        director_id: director?.id ?? '',
        director_name: director?.full_name ?? '',
        dealership_count: dealershipCount ?? 0,
        employee_count: employeeCount,
        total_sales: totalSales,
        sales_target: salesTarget,
        total_revenue: totalRevenue,
        total_margin: totalMargin,
        financing_rate: financingRate,
        avgGPU,
        satisfaction: 0, // No data source — displayed as N/A
        market_share: 0, // Computed in second pass below
        quarterly_growth: quarterlyGrowth,
      }
    })
  )

  // 3. Second pass: compute market_share as relative share within the group
  const groupTotalSales = enriched.reduce((sum, b) => sum + b.total_sales, 0)
  if (groupTotalSales > 0) {
    for (const brand of enriched) {
      brand.market_share = Math.round((brand.total_sales / groupTotalSales) * 1000) / 10
    }
  }

  return NextResponse.json({ data: enriched })
}
