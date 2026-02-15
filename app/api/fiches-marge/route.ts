import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { getPaginationParams, getFilterParam, getDateFilterParam } from '@/lib/api/pagination'
import { createFicheMargeSchema } from '@/lib/validations/fiches-marge'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { page, limit, offset } = getPaginationParams(request)
  const status = getFilterParam(request, 'status')
  const vehicleType = getFilterParam(request, 'vehicle_type')
  const dateFrom = getDateFilterParam(request, 'date_from')
  const dateTo = getDateFilterParam(request, 'date_to')
  const userId = getFilterParam(request, 'user_id')

  // RLS gère le scope hiérarchique automatiquement
  let query = auth.supabase
    .from('fiches_marge')
    .select('*, profiles!fiches_marge_user_id_fkey(full_name, email)', { count: 'exact' })
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (vehicleType) query = query.eq('vehicle_type', vehicleType)
  if (dateFrom) query = query.gte('date', dateFrom)
  if (dateTo) query = query.lte('date', dateTo)
  if (userId) query = query.eq('user_id', userId)

  const { data, count, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const validation = await validateBody(request, createFicheMargeSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('fiches_marge')
    .insert({
      ...validation.data,
      user_id: auth.user.id,
      concession_id: auth.profile.concession_id,
    })
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data }, { status: 201 })
}
