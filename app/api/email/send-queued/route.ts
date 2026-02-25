import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/client'
import { SaleValidatedEmail } from '@/lib/email/templates/sale-validated'
import { NewChallengeEmail } from '@/lib/email/templates/new-challenge'
import { BadgeEarnedEmail } from '@/lib/email/templates/badge-earned'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  // Verify cron secret — mandatory in production
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = await createClient()

  // Fetch unsent email notifications
  const { data: pendingEmails, error } = await supabase
    .from('notifications')
    .select('*, profiles!notifications_user_id_fkey(email, full_name)')
    .eq('should_send_email', true)
    .eq('email_sent', false)
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!pendingEmails || pendingEmails.length === 0) {
    return NextResponse.json({ data: { sent: 0, message: 'Aucun email en attente' } })
  }

  let sentCount = 0
  const errors: string[] = []

  for (const notif of pendingEmails) {
    const profile = notif.profiles as { email: string; full_name: string } | null
    if (!profile?.email) {
      errors.push(`Notification ${notif.id}: pas d'email pour l'utilisateur`)
      continue
    }

    let emailResult: { success: boolean; error?: string }
    const recipientName = profile.full_name || 'Utilisateur'

    try {
      switch (notif.type) {
        case 'sale_validated':
        case 'approbation': {
          const meta = (notif.metadata || {}) as Record<string, unknown>
          emailResult = await sendEmail({
            to: profile.email,
            subject: 'Votre vente a été validée — AutoPerf',
            react: SaleValidatedEmail({
              commercialName: recipientName,
              vehicleName: (meta.vehicle_name as string) || 'Véhicule',
              clientName: (meta.client_name as string) || '',
              margin: (meta.margin as number) || 0,
              commission: (meta.commission as number) || 0,
              appUrl: APP_URL,
            }),
          })
          break
        }
        case 'new_challenge':
        case 'defi': {
          const meta = (notif.metadata || {}) as Record<string, unknown>
          emailResult = await sendEmail({
            to: profile.email,
            subject: 'Nouveau challenge — AutoPerf',
            react: NewChallengeEmail({
              recipientName,
              challengeTitle: (meta.challenge_title as string) || notif.title || 'Challenge',
              challengeDescription: (meta.challenge_description as string) || notif.message || '',
              endDate: (meta.end_date as string) || '',
              reward: (meta.reward as string) || '',
              appUrl: APP_URL,
            }),
          })
          break
        }
        case 'badge_earned':
        case 'badge': {
          const meta = (notif.metadata || {}) as Record<string, unknown>
          emailResult = await sendEmail({
            to: profile.email,
            subject: 'Nouveau badge obtenu — AutoPerf',
            react: BadgeEarnedEmail({
              recipientName,
              badgeName: (meta.badge_name as string) || notif.title || 'Badge',
              badgeDescription: (meta.badge_description as string) || notif.message || '',
              appUrl: APP_URL,
            }),
          })
          break
        }
        default: {
          // Generic notification — skip email for unknown types
          emailResult = { success: false, error: `Type inconnu: ${notif.type}` }
        }
      }

      if (emailResult.success) {
        await supabase
          .from('notifications')
          .update({ email_sent: true, email_sent_at: new Date().toISOString() })
          .eq('id', notif.id)
        sentCount++
      } else {
        errors.push(`Notification ${notif.id}: ${emailResult.error}`)
      }
    } catch (err) {
      errors.push(`Notification ${notif.id}: ${String(err)}`)
    }
  }

  return NextResponse.json({
    data: {
      total: pendingEmails.length,
      sent: sentCount,
      errors: errors.length > 0 ? errors : undefined,
    },
  })
}
