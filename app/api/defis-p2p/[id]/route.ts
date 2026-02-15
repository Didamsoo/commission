import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, notFound, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { updateDefiP2PSchema } from '@/lib/validations/defis-p2p'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { id } = await params

  // Vérifier que l'utilisateur est participant
  const { data: existing, error: fetchError } = await auth.supabase
    .from('defis_p2p')
    .select('challenger_id, challenged_id, status')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return notFound('Défi P2P')
    return serverError(fetchError.message)
  }

  const isChallenger = existing.challenger_id === auth.user.id
  const isChallenged = existing.challenged_id === auth.user.id

  if (!isChallenger && !isChallenged) return forbidden()

  const validation = await validateBody(request, updateDefiP2PSchema)
  if (validation.error) return validation.error

  // Si le challenged accepte, démarrer le défi
  const updateData: Record<string, unknown> = { ...validation.data }
  if (validation.data.status === 'active' && isChallenged && existing.status === 'pending') {
    updateData.start_date = new Date().toISOString()
  }

  const { data, error } = await auth.supabase
    .from('defis_p2p')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data })
}
