import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, notFound, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { validateBody } from '@/lib/api/validation'
import { decideApprovalSchema } from '@/lib/validations/approbations'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'chef_ventes')) return forbidden()

  const { id } = await params

  const validation = await validateBody(request, decideApprovalSchema)
  if (validation.error) return validation.error

  // Récupérer l'approbation
  const { data: existing, error: fetchError } = await auth.supabase
    .from('approbations')
    .select('fiche_marge_id, status')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return notFound('Approbation')
    return serverError(fetchError.message)
  }

  if (existing.status !== 'pending') {
    return serverError('Cette approbation a déjà été traitée')
  }

  // Mettre à jour l'approbation
  const { data, error } = await auth.supabase
    .from('approbations')
    .update({
      status: validation.data.status,
      comment: validation.data.comment,
      approver_id: auth.user.id,
      decided_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return serverError(error.message)

  // Mettre à jour la fiche de marge
  await auth.supabase
    .from('fiches_marge')
    .update({
      status: validation.data.status,
      approved_by: auth.user.id,
      approved_at: validation.data.status === 'approved' ? new Date().toISOString() : null,
    })
    .eq('id', existing.fiche_marge_id)

  return NextResponse.json({ data })
}
