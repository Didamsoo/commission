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

  // 1. Fetch the concession
  const { data: concession, error: concError } = await supabase
    .from('concessions')
    .select('*')
    .eq('id', id)
    .single()

  if (concError || !concession) return notFound('Concession')

  // 2. Director
  const { data: dirProfile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('concession_id', id)
    .eq('role', 'dir_concession')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  // 3. Employee count
  const { count: employeeCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('concession_id', id)
    .eq('is_active', true)

  // 4. Fiches marge
  const { data: fiches } = await supabase
    .from('fiches_marge')
    .select('vehicle_type, selling_price_ht, final_margin, has_financing')
    .eq('concession_id', id)
    .eq('status', 'approved')

  const allFiches = fiches ?? []
  const totalSales = allFiches.length
  const totalMargin = allFiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0)
  const totalRevenue = allFiches.reduce((s, f) => s + (Number(f.selling_price_ht) || 0), 0)
  const financedCount = allFiches.filter(f => f.has_financing).length
  const financingRate = totalSales > 0 ? Math.round((financedCount / totalSales) * 100) : 0
  const avgGPU = totalSales > 0 ? Math.round(totalMargin / totalSales) : 0

  // Department breakdown
  const vpFiches = allFiches.filter(f => f.vehicle_type === 'VP')
  const voFiches = allFiches.filter(f => f.vehicle_type === 'VO')
  const vuFiches = allFiches.filter(f => f.vehicle_type === 'VU')

  // 5. Ranking among sibling concessions
  let ranking = 1
  if (concession.marque_id) {
    const { data: siblings } = await supabase
      .from('concessions')
      .select('id')
      .eq('marque_id', concession.marque_id)

    if (siblings && siblings.length > 1) {
      const siblingStats = await Promise.all(
        siblings.map(async (sib) => {
          const { data: sibFiches } = await supabase
            .from('fiches_marge')
            .select('final_margin')
            .eq('concession_id', sib.id)
            .eq('status', 'approved')

          const sibMargin = (sibFiches ?? []).reduce((s, f) => s + (Number(f.final_margin) || 0), 0)
          return { id: sib.id, margin: sibMargin }
        })
      )

      siblingStats.sort((a, b) => b.margin - a.margin)
      ranking = siblingStats.findIndex(s => s.id === id) + 1
    }
  }

  return NextResponse.json({
    data: {
      id: concession.id,
      name: concession.name,
      code: concession.code || '',
      city: concession.city || '',
      address: concession.address || '',
      settings: concession.settings || {},
      marque_id: concession.marque_id,
      director_id: dirProfile?.id ?? '',
      director_name: dirProfile?.full_name ?? '',
      director_avatar: dirProfile?.avatar_url,
      employee_count: employeeCount ?? 0,
      total_sales: totalSales,
      sales_target: 0,
      total_revenue: totalRevenue,
      total_margin: totalMargin,
      financing_rate: financingRate,
      avgGPU,
      satisfaction: 0,
      stock_days: 0,
      departments: {
        vn: {
          sales: vpFiches.length,
          target: 0,
          margin: vpFiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0),
        },
        vo: {
          sales: voFiches.length,
          target: 0,
          margin: voFiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0),
        },
        vu: {
          sales: vuFiches.length,
          target: 0,
          margin: vuFiches.reduce((s, f) => s + (Number(f.final_margin) || 0), 0),
        },
      },
      ranking,
      growth: 0,
    },
  })
}
