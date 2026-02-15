import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { validateBody } from '@/lib/api/validation'
import { getPaginationParams, getFilterParam } from '@/lib/api/pagination'
import { createNoteSchema } from '@/lib/validations/coaching'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { page, limit, offset } = getPaginationParams(request)
  const commercialId = getFilterParam(request, 'commercial_id')
  const type = getFilterParam(request, 'type')

  // RLS gère : manager voit ses notes, commercial voit les non-privées
  let query = auth.supabase
    .from('notes_coaching')
    .select(`
      *,
      manager:manager_id(full_name, avatar_url),
      commercial:commercial_id(full_name, avatar_url)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (commercialId) query = query.eq('commercial_id', commercialId)
  if (type) query = query.eq('type', type)

  const { data, count, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'chef_ventes')) return forbidden()

  const validation = await validateBody(request, createNoteSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('notes_coaching')
    .insert({
      ...validation.data,
      manager_id: auth.user.id,
    })
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data }, { status: 201 })
}
