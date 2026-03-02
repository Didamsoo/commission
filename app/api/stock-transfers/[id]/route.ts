import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, badRequest, notFound, serverError } from '@/lib/api/errors'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()
  if (auth.profile.level < 4) return forbidden()

  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['approved', 'rejected', 'in_transit', 'completed'].includes(status)) {
      return badRequest('status doit être approved, rejected, in_transit ou completed')
    }

    const { data: existing, error: fetchError } = await auth.supabase
      .from('stock_transfers')
      .select('id, status')
      .eq('id', id)
      .single()

    if (fetchError || !existing) return notFound()

    const { data, error } = await auth.supabase
      .from('stock_transfers')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) return serverError(error.message)
    return NextResponse.json({ data })
  } catch (err) {
    return serverError(String(err))
  }
}
