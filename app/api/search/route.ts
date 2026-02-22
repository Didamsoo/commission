import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, badRequest } from '@/lib/api/errors'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return badRequest('Le terme de recherche doit comporter au moins 2 caractères')
  }

  const pattern = `%${q}%`

  const [fichesResult, profilesResult, defisResult, concessionsResult] = await Promise.all([
    auth.supabase
      .from('fiches_marge')
      .select('id, vehicle_sold_name, client_name, date, status')
      .or(`vehicle_sold_name.ilike.${pattern},client_name.ilike.${pattern}`)
      .limit(5),
    auth.supabase
      .from('profiles')
      .select('id, full_name, email, role, avatar_url')
      .or(`full_name.ilike.${pattern},email.ilike.${pattern}`)
      .limit(5),
    auth.supabase
      .from('defis_plateforme')
      .select('id, title, status, start_date, end_date')
      .ilike('title', pattern)
      .limit(5),
    auth.supabase
      .from('concessions')
      .select('id, name, city')
      .ilike('name', pattern)
      .limit(5),
  ])

  return NextResponse.json({
    data: {
      fiches: (fichesResult.data || []).map(f => ({
        id: f.id,
        type: 'fiche' as const,
        title: f.vehicle_sold_name || 'Fiche de marge',
        subtitle: f.client_name || '',
        href: `/calculator?id=${f.id}`,
      })),
      profiles: (profilesResult.data || []).map(p => ({
        id: p.id,
        type: 'profile' as const,
        title: p.full_name || p.email,
        subtitle: p.role || '',
        href: `/chef-ventes/equipe/${p.id}`,
      })),
      defis: (defisResult.data || []).map(d => ({
        id: d.id,
        type: 'defi' as const,
        title: d.title,
        subtitle: d.status || '',
        href: `/challenges`,
      })),
      concessions: (concessionsResult.data || []).map(c => ({
        id: c.id,
        type: 'concession' as const,
        title: c.name,
        subtitle: c.city || '',
        href: `/marque/concessions/${c.id}`,
      })),
    },
  })
}
