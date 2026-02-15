import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, notFound, forbidden, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { hasMinRole } from '@/lib/api/roles'
import { updateFicheMargeSchema } from '@/lib/validations/fiches-marge'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { id } = await params

  const { data, error } = await auth.supabase
    .from('fiches_marge')
    .select('*, profiles!fiches_marge_user_id_fkey(full_name, email)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return notFound('Fiche de marge')
    return serverError(error.message)
  }

  return NextResponse.json({ data })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { id } = await params

  const validation = await validateBody(request, updateFicheMargeSchema)
  if (validation.error) return validation.error

  // Récupérer la fiche existante
  const { data: existing, error: fetchError } = await auth.supabase
    .from('fiches_marge')
    .select('user_id, status')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return notFound('Fiche de marge')
    return serverError(fetchError.message)
  }

  // Vérifier les droits : owner en draft, ou manager pour le statut
  const isOwner = existing.user_id === auth.user.id
  const isManager = hasMinRole(auth.profile, 'chef_ventes')

  if (!isOwner && !isManager) return forbidden()
  if (isOwner && !isManager && existing.status !== 'draft') {
    return forbidden()
  }

  const { data, error } = await auth.supabase
    .from('fiches_marge')
    .update(validation.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { id } = await params

  // Vérifier que c'est bien un brouillon de l'utilisateur
  const { data: existing, error: fetchError } = await auth.supabase
    .from('fiches_marge')
    .select('user_id, status')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return notFound('Fiche de marge')
    return serverError(fetchError.message)
  }

  if (existing.user_id !== auth.user.id || existing.status !== 'draft') {
    return forbidden()
  }

  const { error } = await auth.supabase
    .from('fiches_marge')
    .delete()
    .eq('id', id)

  if (error) return serverError(error.message)

  return NextResponse.json({ data: { success: true } })
}
