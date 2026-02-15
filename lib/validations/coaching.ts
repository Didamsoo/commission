import { z } from 'zod'

export const createNoteSchema = z.object({
  commercial_id: z.string().uuid(),
  type: z.enum(['feedback', 'objective', 'action', 'meeting']),
  content: z.string().min(1).max(5000),
  is_private: z.boolean().default(false),
})

export const updateNoteSchema = z.object({
  type: z.enum(['feedback', 'objective', 'action', 'meeting']).optional(),
  content: z.string().min(1).max(5000).optional(),
  is_private: z.boolean().optional(),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
