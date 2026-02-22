import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, badRequest, serverError } from '@/lib/api/errors'
import { hasMinRole } from '@/lib/api/roles'
import { validateBody } from '@/lib/api/validation'
import { getPaginationParams, getFilterParam } from '@/lib/api/pagination'
import { createNotificationSchema } from '@/lib/validations/notifications'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const { page, limit, offset } = getPaginationParams(request)
  const isRead = getFilterParam(request, 'is_read')

  let query = auth.supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (isRead !== null) {
    query = query.eq('is_read', isRead === 'true')
  }

  const { data, count, error } = await query

  if (error) return serverError(error.message)

  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  const validation = await validateBody(request, createNotificationSchema)
  if (validation.error) return validation.error

  const { user_id, type, title, message, data: notifData } = validation.data

  // Un utilisateur peut se créer une notification à lui-même,
  // mais pour notifier un autre utilisateur il faut au minimum le rôle chef_ventes
  const isSelfNotification = user_id === auth.user.id
  if (!isSelfNotification && !hasMinRole(auth.profile, 'chef_ventes')) {
    return badRequest('Rôle insuffisant pour créer une notification pour un autre utilisateur')
  }

  // Récupérer le profil du destinataire pour vérifier ses préférences email
  const { data: targetProfile, error: profileError } = await auth.supabase
    .from('profiles')
    .select('id, settings')
    .eq('id', user_id)
    .single()

  if (profileError || !targetProfile) {
    return badRequest('Utilisateur destinataire introuvable')
  }

  // Déterminer si on doit marquer la notification pour envoi email
  const settings = targetProfile.settings as {
    email_notifications?: boolean
    defi_notifications?: boolean
    vente_notifications?: boolean
    badge_notifications?: boolean
  } | null

  let shouldSendEmail = false

  if (settings?.email_notifications) {
    // Vérifier aussi la préférence spécifique au type de notification
    switch (type) {
      case 'defi':
        shouldSendEmail = settings.defi_notifications !== false
        break
      case 'vente':
        shouldSendEmail = settings.vente_notifications !== false
        break
      case 'badge':
        shouldSendEmail = settings.badge_notifications !== false
        break
      default:
        // Pour les autres types, on se base uniquement sur email_notifications global
        shouldSendEmail = true
        break
    }
  }

  // Insérer la notification avec le flag email
  const { data: notification, error: insertError } = await auth.supabase
    .from('notifications')
    .insert({
      user_id,
      type,
      title,
      message: message ?? null,
      data: notifData ?? {},
      should_send_email: shouldSendEmail,
    })
    .select()
    .single()

  if (insertError) return serverError(insertError.message)

  return NextResponse.json({ data: notification }, { status: 201 })
}
