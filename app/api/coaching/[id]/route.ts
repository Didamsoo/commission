import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, notFound, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { updateNoteSchema } from '@/lib/validations/coaching'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { id } = await params

  const { data: existing, error: fetchError } = await auth.supabase
    .from('notes_coaching')
    .select('manager_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return notFound('Note de coaching')
    return serverError(fetchError.message)
  }

  if (existing.manager_id !== auth.user.id) return forbidden()

  const validation = await validateBody(request, updateNoteSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('notes_coaching')
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

  const { data: existing, error: fetchError } = await auth.supabase
    .from('notes_coaching')
    .select('manager_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return notFound('Note de coaching')
    return serverError(fetchError.message)
  }

  if (existing.manager_id !== auth.user.id) return forbidden()

  const { error } = await auth.supabase
    .from('notes_coaching')
    .delete()
    .eq('id', id)

  if (error) return serverError(error.message)

  return NextResponse.json({ data: { success: true } })
}
