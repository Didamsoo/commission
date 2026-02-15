import { z } from 'zod'

export const updateProfilSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  first_name: z.string().max(50).nullable().optional(),
  last_name: z.string().max(50).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
})

export type UpdateProfilInput = z.infer<typeof updateProfilSchema>
