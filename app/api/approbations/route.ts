import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { getPaginationParams, getFilterParam } from '@/lib/api/pagination'
import { submitApprovalSchema } from '@/lib/validations/approbations'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { page, limit, offset } = getPaginationParams(request)
  const status = getFilterParam(request, 'status')

  // RLS gère le scope : commercial voit ses propres, managers voient celles à approuver
  let query = auth.supabase
    .from('approbations')
    .select(`
      *,
      fiches_marge:fiche_marge_id(id, date, vehicle_type, vehicle_sold_name, seller_commission, final_margin, status),
      commercial:commercial_id(full_name, email),
      approver:approver_id(full_name, email)
    `, { count: 'exact' })
    .order('submitted_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)

  const { data, count, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const validation = await validateBody(request, submitApprovalSchema)
  if (validation.error) return validation.error

  // Mettre à jour le statut de la fiche en 'submitted'
  const { error: updateError } = await auth.supabase
    .from('fiches_marge')
    .update({ status: 'submitted' })
    .eq('id', validation.data.fiche_marge_id)
    .eq('user_id', auth.user.id)

  if (updateError) return serverError(updateError.message)

  // Créer la demande d'approbation
  const { data, error } = await auth.supabase
    .from('approbations')
    .insert({
      fiche_marge_id: validation.data.fiche_marge_id,
      commercial_id: auth.user.id,
    })
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data }, { status: 201 })
}
