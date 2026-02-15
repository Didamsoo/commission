import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, notFound, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { updateDefiSchema } from '@/lib/validations/defis'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { id } = await params

  // Vérifier que l'utilisateur est le créateur
  const { data: existing, error: fetchError } = await auth.supabase
    .from('defis_plateforme')
    .select('created_by')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return notFound('Défi')
    return serverError(fetchError.message)
  }

  if (existing.created_by !== auth.user.id) return forbidden()

  const validation = await validateBody(request, updateDefiSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('defis_plateforme')
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

  // Vérifier que l'utilisateur est le créateur et que le défi est en draft
  const { data: existing, error: fetchError } = await auth.supabase
    .from('defis_plateforme')
    .select('created_by, status')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return notFound('Défi')
    return serverError(fetchError.message)
  }

  if (existing.created_by !== auth.user.id) return forbidden()
  if (existing.status !== 'draft') return forbidden()

  const { error } = await auth.supabase
    .from('defis_plateforme')
    .delete()
    .eq('id', id)

  if (error) return serverError(error.message)

  return NextResponse.json({ data: { success: true } })
}
