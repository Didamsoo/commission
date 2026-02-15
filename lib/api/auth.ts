import { createClient } from '@/lib/supabase/server'
import type { AuthContext, DbProfile } from './types'

export async function getAuthenticatedUser(): Promise<AuthContext | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return null

  return {
    user: { id: user.id, email: user.email! },
    profile: profile as DbProfile,
    supabase,
  }
}
