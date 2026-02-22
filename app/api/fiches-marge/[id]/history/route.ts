import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, notFound, serverError } from '@/lib/api/errors'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { id } = await params

  // Verify the fiche exists and user has access
  const { data: fiche, error: ficheError } = await auth.supabase
    .from('fiches_marge')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (ficheError) {
    if (ficheError.code === 'PGRST116') return notFound('Fiche de marge')
    return serverError(ficheError.message)
  }

  // Fetch history with user profiles
  const { data, error } = await auth.supabase
    .from('fiche_marge_history')
    .select('*, profiles:user_id(full_name, email, avatar_url)')
    .eq('fiche_marge_id', id)
    .order('created_at', { ascending: false })

  if (error) return serverError(error.message)

  return NextResponse.json({ data })
}
