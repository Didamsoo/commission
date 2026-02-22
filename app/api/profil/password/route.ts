import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, badRequest, serverError } from '@/lib/api/errors'
import { z } from 'zod'

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export async function PUT(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()

  try {
    const body = await request.json()
    const result = passwordSchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.issues.map(i => i.message).join(', ')
      return badRequest(errors)
    }

    const { error } = await auth.supabase.auth.updateUser({
      password: result.data.newPassword,
    })

    if (error) {
      return badRequest(error.message)
    }

    return NextResponse.json({ data: { success: true } })
  } catch {
    return serverError('Erreur lors du changement de mot de passe')
  }
}
