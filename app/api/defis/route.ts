import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { validateBody } from '@/lib/api/validation'
import { getPaginationParams, getFilterParam } from '@/lib/api/pagination'
import { createDefiSchema } from '@/lib/validations/defis'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { page, limit, offset } = getPaginationParams(request)
  const status = getFilterParam(request, 'status')

  let query = auth.supabase
    .from('defis_plateforme')
    .select(`
      *,
      creator:created_by(full_name, email, avatar_url),
      defis_plateforme_participants(id, user_id, current_score, target_score, progress_rate, is_completed, ranking)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)

  const { data, count, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'chef_ventes')) return forbidden()

  const validation = await validateBody(request, createDefiSchema)
  if (validation.error) return validation.error

  const { data, error } = await auth.supabase
    .from('defis_plateforme')
    .insert({
      ...validation.data,
      created_by: auth.user.id,
      creator_role: auth.profile.role,
      creator_level: auth.profile.level,
    })
    .select()
    .single()

  if (error) return serverError(error.message)

  // Ajouter les participants si des target_ids sont fournis
  const targetIds = validation.data.target_ids ?? []
  if (targetIds.length > 0) {
    const participants = targetIds.map((userId: string) => ({
      defi_id: data.id,
      user_id: userId,
      target_score: validation.data.target_value,
    }))

    await auth.supabase.from('defis_plateforme_participants').insert(participants)
  }

  return NextResponse.json({ data }, { status: 201 })
}
