import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, notFound, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { validateBody } from '@/lib/api/validation'
import { updatePayplanSchema } from '@/lib/validations/payplan'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'dir_concession')) return forbidden()

  const { id } = await params

  const validation = await validateBody(request, updatePayplanSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('payplans')
    .update(validation.data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') return notFound('Payplan')
    return serverError(error.message)
  }

  return NextResponse.json({ data })
}
