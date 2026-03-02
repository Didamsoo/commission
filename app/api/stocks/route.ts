import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, badRequest, serverError } from '@/lib/api/errors'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()
  if (auth.profile.level < 3) return forbidden()

  try {
    const { searchParams } = new URL(request.url)
    const concessionId = searchParams.get('concession_id')
    const category = searchParams.get('category')

    let query = auth.supabase
      .from('stocks')
      .select('*, concessions(name)')
      .neq('status', 'sold')
      .order('created_at', { ascending: false })

    if (concessionId) query = query.eq('concession_id', concessionId)
    if (category) query = query.eq('category', category)

    const { data, error } = await query

    if (error) return serverError(error.message)

    const stocks = (data || []).map(s => ({
      ...s,
      dealershipName: (s.concessions as { name: string } | null)?.name || '',
      daysInStock: Math.max(0, Math.floor((Date.now() - new Date(s.arrival_date).getTime()) / 86400000)),
    }))

    return NextResponse.json({ data: stocks })
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
    const { model, variant, vin, concession_id, category, price, arrival_date } = body

    if (!model || !vin || !concession_id || !category) {
      return badRequest('model, vin, concession_id et category sont requis')
    }

    const { data, error } = await auth.supabase
      .from('stocks')
      .insert({
        model,
        variant: variant || null,
        vin,
        concession_id,
        category,
        price: price || 0,
        arrival_date: arrival_date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single()

    if (error) return serverError(error.message)
    return NextResponse.json({ data })
  } catch (err) {
    return serverError(String(err))
  }
}
