import * as Sentry from '@sentry/nextjs'
import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || 'missing')
  }
  return _resend
}

const FROM_EMAIL = 'AutoPerf <notifications@autoperf.fr>'

interface SendEmailOptions {
  to: string
  subject: string
  react: React.ReactElement
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    Sentry.captureMessage(`[Email] RESEND_API_KEY non configurée, email non envoyé: ${subject}`, 'warning')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
    })

    if (error) {
      Sentry.captureMessage(`[Email] Erreur Resend: ${error.message}`, 'error')
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    Sentry.captureException(err, { tags: { module: 'email' } })
    return { success: false, error: String(err) }
  }
}
