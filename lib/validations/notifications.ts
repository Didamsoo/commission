import { z } from 'zod'

export const markReadSchema = z.object({
  is_read: z.boolean(),
})

export type MarkReadInput = z.infer<typeof markReadSchema>
