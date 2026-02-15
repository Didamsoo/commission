import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { getFilterParam, getDateFilterParam } from '@/lib/api/pagination'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'chef_ventes')) return forbidden()

  const type = getFilterParam(request, 'type') || 'ventes'
  const dateFrom = getDateFilterParam(request, 'date_from')
  const dateTo = getDateFilterParam(request, 'date_to')
  const vehicleType = getFilterParam(request, 'vehicle_type')
  const groupBy = getFilterParam(request, 'group_by') || 'user'

  // RLS filtre les données selon le scope hiérarchique
  let query = auth.supabase
    .from('fiches_marge')
    .select(`
      id, user_id, date, vehicle_type, vehicle_sold_name,
      selling_price_ht, purchase_price_ht, final_margin, seller_commission,
      has_financing, status,
      profiles!fiches_marge_user_id_fkey(full_name, equipe_id, concession_id)
    `)
    .in('status', ['approved', 'submitted'])

  if (dateFrom) query = query.gte('date', dateFrom)
  if (dateTo) query = query.lte('date', dateTo)
  if (vehicleType) query = query.eq('vehicle_type', vehicleType)

  const { data: fiches, error } = await query

  if (error) return serverError(error.message)

  if (type === 'ventes') {
    return NextResponse.json({ data: buildSalesReport(fiches || [], groupBy) })
  }

  if (type === 'marges') {
    return NextResponse.json({ data: buildMarginReport(fiches || []) })
  }

  if (type === 'financement') {
    return NextResponse.json({ data: buildFinancingReport(fiches || []) })
  }

  return NextResponse.json({ data: fiches })
}

interface FicheRow {
  id: string
  user_id: string
  date: string
  vehicle_type: string
  selling_price_ht: number | null
  purchase_price_ht: number | null
  final_margin: number | null
  seller_commission: number | null
  has_financing: boolean
  profiles: unknown
}

function buildSalesReport(fiches: FicheRow[], groupBy: string) {
  const groups = new Map<string, {
    key: string
    label: string
    totalSales: number
    totalRevenue: number
    totalMargin: number
    totalCommission: number
  }>()

  for (const fiche of fiches) {
    let key: string
    let label: string

    if (groupBy === 'vehicle_type') {
      key = fiche.vehicle_type
      label = fiche.vehicle_type
    } else if (groupBy === 'date') {
      key = fiche.date.substring(0, 7) // YYYY-MM
      label = key
    } else {
      key = fiche.user_id
      const profile = Array.isArray(fiche.profiles) ? fiche.profiles[0] : fiche.profiles
      label = (profile as { full_name?: string } | null)?.full_name || 'Inconnu'
    }

    const existing = groups.get(key) || { key, label, totalSales: 0, totalRevenue: 0, totalMargin: 0, totalCommission: 0 }
    existing.totalSales += 1
    existing.totalRevenue += Number(fiche.selling_price_ht) || 0
    existing.totalMargin += Number(fiche.final_margin) || 0
    existing.totalCommission += Number(fiche.seller_commission) || 0
    groups.set(key, existing)
  }

  return {
    type: 'ventes',
    summary: {
      totalSales: fiches.length,
      totalRevenue: fiches.reduce((s, f) => s + (Number(f.selling_price_ht) || 0), 0),
      totalMargin: fiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0),
    },
    breakdown: Array.from(groups.values()).sort((a, b) => b.totalMargin - a.totalMargin),
  }
}

function buildMarginReport(fiches: FicheRow[]) {
  const byType = new Map<string, { count: number; totalMargin: number; avgMargin: number }>()

  for (const fiche of fiches) {
    const existing = byType.get(fiche.vehicle_type) || { count: 0, totalMargin: 0, avgMargin: 0 }
    existing.count += 1
    existing.totalMargin += Number(fiche.final_margin) || 0
    byType.set(fiche.vehicle_type, existing)
  }

  for (const [, value] of byType) {
    value.avgMargin = value.count > 0 ? Math.round(value.totalMargin / value.count) : 0
  }

  return {
    type: 'marges',
    summary: {
      totalMargin: fiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0),
      avgMargin: fiches.length > 0
        ? Math.round(fiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0) / fiches.length)
        : 0,
    },
    byVehicleType: Object.fromEntries(byType),
  }
}

function buildFinancingReport(fiches: FicheRow[]) {
  const total = fiches.length
  const financed = fiches.filter(f => f.has_financing).length

  return {
    type: 'financement',
    summary: {
      totalSales: total,
      financedSales: financed,
      financingRate: total > 0 ? Math.round((financed / total) * 1000) / 10 : 0,
    },
  }
}
