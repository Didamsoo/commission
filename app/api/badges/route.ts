import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, serverError } from '@/lib/api/errors'

export async function GET() {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  try {
    // Fetch all badge definitions
    const { data: badges, error: badgesError } = await auth.supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: true })

    if (badgesError) throw badgesError

    // Fetch user's earned badges
    const { data: userBadges, error: userBadgesError } = await auth.supabase
      .from('badges_utilisateur')
      .select('badge_id, obtained_at')
      .eq('user_id', auth.user.id)

    if (userBadgesError) throw userBadgesError

    const earnedMap = new Map(
      (userBadges || []).map(ub => [ub.badge_id, ub.obtained_at])
    )

    const result = (badges || []).map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: badge.category,
      criteria: badge.criteria,
      earned: earnedMap.has(badge.id),
      earnedAt: earnedMap.get(badge.id) || null,
    }))

    return NextResponse.json({ data: result })
  } catch {
    return serverError('Erreur lors du chargement des badges')
  }
}
