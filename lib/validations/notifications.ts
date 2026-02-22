import { z } from 'zod'

export const markReadSchema = z.object({
  is_read: z.boolean(),
})

export type MarkReadInput = z.infer<typeof markReadSchema>

export const createNotificationSchema = z.object({
  user_id: z.string().uuid(),
  type: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  message: z.string().max(1000).optional(),
  data: z.record(z.unknown()).optional(),
})

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
