import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'
import { getPaginationParams, getFilterParam } from '@/lib/api/pagination'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { page, limit, offset } = getPaginationParams(request)
  const isRead = getFilterParam(request, 'is_read')

  let query = auth.supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (isRead !== null) {
    query = query.eq('is_read', isRead === 'true')
  }

  const { data, count, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data, count, page, limit })
}
