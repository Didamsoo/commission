import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, notFound, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { validateBody } from '@/lib/api/validation'
import { updateMemberSchema } from '@/lib/validations/equipe'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'chef_ventes')) return forbidden()

  const { id } = await params

  const validation = await validateBody(request, updateMemberSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('profiles')
    .update(validation.data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') return notFound('Membre')
    return serverError(error.message)
  }

  return NextResponse.json({ data })
}
