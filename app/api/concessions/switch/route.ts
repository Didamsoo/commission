import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, badRequest, serverError } from '@/lib/api/errors'
import { z } from 'zod'

const switchSchema = z.object({
  concession_id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  try {
    const body = await request.json()
    const result = switchSchema.safeParse(body)

    if (!result.success) {
      return badRequest('concession_id invalide')
    }

    const { data, error } = await auth.supabase
      .rpc('switch_active_concession', {
        p_user_id: auth.user.id,
        p_concession_id: result.data.concession_id,
      })

    if (error) return serverError(error.message)

    if (data === false) {
      return badRequest('Vous n\'avez pas accès à cette concession')
    }

    return NextResponse.json({ data: { success: true } })
  } catch {
    return serverError('Erreur lors du changement de concession')
  }
}
