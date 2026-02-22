import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, notFound, badRequest, serverError } from '@/lib/api/errors'
import { ROLE_LEVELS } from '@/lib/api/types'
import { z } from 'zod'

const updateConcessionSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  code: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  settings: z.object({
    phone: z.string().max(20).optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    hours: z.string().max(500).optional(),
  }).optional(),
})

export async function GET() {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  // Must be at least dir_concession
  if (ROLE_LEVELS[auth.profile.role] < ROLE_LEVELS.dir_concession && auth.profile.role !== 'admin') {
    return forbidden()
  }

  if (!auth.profile.concession_id) {
    return notFound('Concession')
  }

  const { data, error } = await auth.supabase
    .from('concessions')
    .select('*')
    .eq('id', auth.profile.concession_id)
    .single()

  if (error || !data) return notFound('Concession')

  return NextResponse.json({ data })
}

export async function PUT(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  // Must be at least dir_concession
  if (ROLE_LEVELS[auth.profile.role] < ROLE_LEVELS.dir_concession && auth.profile.role !== 'admin') {
    return forbidden()
  }

  if (!auth.profile.concession_id) {
    return notFound('Concession')
  }

  try {
    const body = await request.json()
    const result = updateConcessionSchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.issues.map(i => i.message).join(', ')
      return badRequest(errors)
    }

    // If settings are being updated, merge with existing settings
    let updateData: Record<string, unknown> = { ...result.data }
    if (result.data.settings) {
      const { data: existing } = await auth.supabase
        .from('concessions')
        .select('settings')
        .eq('id', auth.profile.concession_id)
        .single()

      updateData.settings = {
        ...(existing?.settings || {}),
        ...result.data.settings,
      }
    }

    const { data, error } = await auth.supabase
      .from('concessions')
      .update(updateData)
      .eq('id', auth.profile.concession_id)
      .select()
      .single()

    if (error) return serverError(error.message)

    return NextResponse.json({ data })
  } catch {
    return serverError('Erreur lors de la mise à jour')
  }
}
