import webpush from 'web-push'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:contact@autoperf.fr'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

export interface PushPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  url?: string
  tag?: string
}

export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload
) {
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  }

  try {
    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    )
    return { success: true }
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err.statusCode === 410 || err.statusCode === 404) {
      // Subscription expired or invalid
      return { success: false, expired: true }
    }
    return { success: false, error: err.message }
  }
}
