import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { validateBody } from '@/lib/api/validation'
import { getFilterParam } from '@/lib/api/pagination'
import { createPayplanSchema } from '@/lib/validations/payplan'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const concessionId = getFilterParam(request, 'concession_id')

  // RLS gère le scope : seuls les payplans de la concession de l'utilisateur sont visibles
  let query = auth.supabase
    .from('payplans')
    .select('*')
    .order('created_at', { ascending: false })

  if (concessionId) {
    query = query.eq('concession_id', concessionId)
  }

  const { data, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'dir_concession')) return forbidden()

  const validation = await validateBody(request, createPayplanSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('payplans')
    .insert({
      ...validation.data,
      created_by: auth.user.id,
    })
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data }, { status: 201 })
}
