import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'

export async function GET() {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { data, error } = await auth.supabase
    .from('user_concessions')
    .select(`
      id,
      concession_id,
      is_active,
      role,
      concessions (
        name,
        city
      )
    `)
    .eq('user_id', auth.user.id)
    .order('granted_at', { ascending: true })

  if (error) return serverError(error.message)

  // Flatten the join for the frontend
  const concessions = (data || []).map((uc: Record<string, unknown>) => {
    const c = uc.concessions as { name: string; city?: string } | null
    return {
      id: uc.id,
      concession_id: uc.concession_id,
      concession_name: c?.name || 'Concession',
      concession_city: c?.city || null,
      is_active: uc.is_active,
      role: uc.role,
    }
  })

  return NextResponse.json({ data: concessions })
}
