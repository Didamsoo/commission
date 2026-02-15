import { z } from 'zod'

const stakeSchema = z.object({
  points: z.number().int().min(0).default(0),
  customReward: z.string().default(''),
  customRewardEmoji: z.string().optional(),
})

export const createDefiP2PSchema = z.object({
  challenged_id: z.string().uuid(),
  metric: z.enum(['sales_count', 'revenue', 'margin', 'financing_count']),
  duration_days: z.number().int().min(1).max(90),
  challenger_stake: stakeSchema.default({ points: 0, customReward: '' }),
  challenged_stake: stakeSchema.default({ points: 0, customReward: '' }),
})

export const updateDefiP2PSchema = z.object({
  status: z.enum(['pending', 'negotiating', 'active', 'completed', 'declined', 'cancelled']).optional(),
  challenged_stake: stakeSchema.optional(),
  negotiation: z.record(z.unknown()).optional(),
  challenger_final_score: z.number().optional(),
  challenged_final_score: z.number().optional(),
  winner_id: z.string().uuid().nullable().optional(),
  is_draw: z.boolean().optional(),
})

export type CreateDefiP2PInput = z.infer<typeof createDefiP2PSchema>
export type UpdateDefiP2PInput = z.infer<typeof updateDefiP2PSchema>
