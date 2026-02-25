import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'
import { validateBody } from '@/lib/api/validation'
import { updateProfilSchema } from '@/lib/validations/profil'

export async function GET() {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  // Resolve concession name if the user belongs to one
  let concession_name: string | null = null
  if (auth.profile.concession_id) {
    const { data: concession } = await auth.supabase
      .from('concessions')
      .select('name')
      .eq('id', auth.profile.concession_id)
      .single()
    concession_name = concession?.name ?? null
  }

  return NextResponse.json({ data: { ...auth.profile, concession_name } })
}

export async function PUT(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const validation = await validateBody(request, updateProfilSchema)
  if (validation.error) return validation.error

  const { data: updated, error } = await auth.supabase
    .from('profiles')
    .update(validation.data)
    .eq('id', auth.user.id)
    .select()
    .single()

  if (error) return serverError(error.message)

  return NextResponse.json({ data: updated })
}
