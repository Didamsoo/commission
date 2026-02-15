import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { getPaginationParams, getFilterParam } from '@/lib/api/pagination'
import { createDefiP2PSchema } from '@/lib/validations/defis-p2p'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { page, limit, offset } = getPaginationParams(request)
  const status = getFilterParam(request, 'status')

  // RLS filtre : participant ou manager
  let query = auth.supabase
    .from('defis_p2p')
    .select(`
      *,
      challenger:challenger_id(id, full_name, email, avatar_url),
      challenged:challenged_id(id, full_name, email, avatar_url),
      winner:winner_id(id, full_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)

  const { data, count, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const validation = await validateBody(request, createDefiP2PSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('defis_p2p')
    .insert({
      ...validation.data,
      challenger_id: auth.user.id,
    })
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data }, { status: 201 })
}
