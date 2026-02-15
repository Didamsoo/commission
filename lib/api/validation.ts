import { NextRequest } from 'next/server'
import { ZodSchema, ZodError } from 'zod'
import { badRequest } from './errors'

export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: ReturnType<typeof badRequest> }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      const formatted = formatZodErrors(result.error)
      return { data: null, error: badRequest('Données invalides', formatted) }
    }

    return { data: result.data, error: null }
  } catch {
    return { data: null, error: badRequest('Body JSON invalide') }
  }
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_root'
    if (!formatted[path]) formatted[path] = []
    formatted[path].push(issue.message)
  }
  return formatted
}
