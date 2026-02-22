import { z } from 'zod'

const notificationSettingsSchema = z.object({
  email_notifications: z.boolean().optional(),
  defi_notifications: z.boolean().optional(),
  vente_notifications: z.boolean().optional(),
  badge_notifications: z.boolean().optional(),
}).optional()

export const updateProfilSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  first_name: z.string().max(50).nullable().optional(),
  last_name: z.string().max(50).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  settings: notificationSettingsSchema,
})

export type UpdateProfilInput = z.infer<typeof updateProfilSchema>
