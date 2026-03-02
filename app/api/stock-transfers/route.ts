import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, badRequest, serverError } from '@/lib/api/errors'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()
  if (auth.profile.level < 3) return forbidden()

  try {
    const { data, error } = await auth.supabase
      .from('stock_transfers')
      .select('*, from_concession:concessions!stock_transfers_from_concession_id_fkey(name), to_concession:concessions!stock_transfers_to_concession_id_fkey(name), requester:profiles!stock_transfers_requested_by_fkey(full_name)')
      .order('created_at', { ascending: false })

    if (error) return serverError(error.message)

    const transfers = (data || []).map(t => ({
      ...t,
      fromDealershipName: (t.from_concession as { name: string } | null)?.name || '',
      toDealershipName: (t.to_concession as { name: string } | null)?.name || '',
      requestedByName: (t.requester as { full_name: string } | null)?.full_name || '',
    }))

    return NextResponse.json({ data: transfers })
  } catch (err) {
    return serverError(String(err))
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()
  if (auth.profile.level < 3) return forbidden()

  try {
    const body = await request.json()
    const { stock_id, vehicle_model, vehicle_vin, from_concession_id, to_concession_id, reason } = body

    if (!vehicle_model || !vehicle_vin || !from_concession_id || !to_concession_id) {
      return badRequest('vehicle_model, vehicle_vin, from_concession_id et to_concession_id sont requis')
    }

    const { data, error } = await auth.supabase
      .from('stock_transfers')
      .insert({
        stock_id: stock_id || null,
        vehicle_model,
        vehicle_vin,
        from_concession_id,
        to_concession_id,
        requested_by: auth.user.id,
        reason: reason || null,
      })
      .select()
      .single()

    if (error) return serverError(error.message)
    return NextResponse.json({ data })
  } catch (err) {
    return serverError(String(err))
  }
}
