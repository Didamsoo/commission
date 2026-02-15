import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'

export async function PUT() {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { error } = await auth.supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', auth.user.id)
    .eq('is_read', false)

  if (error) return serverError(error.message)

  return NextResponse.json({ data: { success: true } })
}
