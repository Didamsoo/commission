import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { validateBody } from '@/lib/api/validation'
import { addMemberSchema } from '@/lib/validations/equipe'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'chef_ventes')) return forbidden()

  const equipeId = request.nextUrl.searchParams.get('equipe_id')
  const concessionId = request.nextUrl.searchParams.get('concession_id')

  // Récupérer les membres de l'équipe avec scope hiérarchique
  let query = auth.supabase
    .from('profiles')
    .select(`
      id, full_name, first_name, last_name, email, phone, avatar_url,
      role, level, concession_id, equipe_id, marque_id, groupe_id, manager_id, is_active,
      equipes:equipe_id(id, name, type)
    `)
    .order('full_name')

  if (equipeId) {
    query = query.eq('equipe_id', equipeId)
  } else if (concessionId) {
    query = query.eq('concession_id', concessionId)
  } else if (auth.profile.role === 'chef_ventes') {
    // Chef des ventes : membres de ses équipes
    const { data: equipes } = await auth.supabase
      .from('equipes')
      .select('id')
      .eq('chef_ventes_id', auth.user.id)

    if (equipes && equipes.length > 0) {
      query = query.in('equipe_id', equipes.map(e => e.id))
    }
  } else if (auth.profile.role === 'dir_concession' && auth.profile.concession_id) {
    query = query.eq('concession_id', auth.profile.concession_id)
  }

  const { data, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  if (!hasMinRole(auth.profile, 'dir_concession')) return forbidden()

  const validation = await validateBody(request, addMemberSchema)
  if (validation.error) return validation.error

  // Ajouter le membre à l'équipe (mettre à jour son equipe_id)
  const { data, error } = await auth.supabase
    .from('profiles')
    .update({ equipe_id: validation.data.equipe_id })
    .eq('id', validation.data.user_id)
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data }, { status: 201 })
}
