import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, badRequest, serverError } from '@/lib/api/errors'

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const body = await request.json()
  const { endpoint, keys } = body

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return badRequest('Invalid subscription data')
  }

  const { error } = await auth.supabase
    .from('push_subscriptions')
    .upsert({
      user_id: auth.user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    }, { onConflict: 'user_id,endpoint' })

  if (error) return serverError(error.message)

  return NextResponse.json({ data: { success: true } })
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const body = await request.json()
  const { endpoint } = body

  if (!endpoint) return badRequest('Endpoint required')

  const { error } = await auth.supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', auth.user.id)
    .eq('endpoint', endpoint)

  if (error) return serverError(error.message)

  return NextResponse.json({ data: { success: true } })
}
