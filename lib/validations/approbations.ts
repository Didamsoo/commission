import { z } from 'zod'

export const submitApprovalSchema = z.object({
  fiche_marge_id: z.string().uuid(),
})

export const decideApprovalSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  comment: z.string().max(1000).optional(),
})

export type SubmitApprovalInput = z.infer<typeof submitApprovalSchema>
export type DecideApprovalInput = z.infer<typeof decideApprovalSchema>
