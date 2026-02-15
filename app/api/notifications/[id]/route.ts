import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, notFound, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { markReadSchema } from '@/lib/validations/notifications'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { id } = await params

  const validation = await validateBody(request, markReadSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('notifications')
    .update({ is_read: validation.data.is_read })
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') return notFound('Notification')
    return serverError(error.message)
  }

  return NextResponse.json({ data })
}
