import { z } from 'zod'

const rewardSchema = z.object({
  type: z.enum(['bonus', 'badge', 'points', 'recognition']),
  value: z.number(),
  description: z.string(),
  badgeName: z.string().optional(),
  badgeIcon: z.string().optional(),
})

export const createDefiSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  scope_type: z.enum(['individual', 'team', 'site', 'brand', 'group']),
  target_level: z.number().int().min(1).max(5),
  target_ids: z.array(z.string().uuid()).default([]),
  challenge_type: z.string().min(1),
  target_value: z.number().positive(),
  target_unit: z.string().optional(),
  target_model_name: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  reward: rewardSchema,
  status: z.enum(['draft', 'upcoming', 'active']).default('draft'),
})

export const updateDefiSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  target_value: z.number().positive().optional(),
  target_unit: z.string().optional(),
  target_model_name: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  reward: rewardSchema.optional(),
  status: z.enum(['draft', 'upcoming', 'active', 'completed', 'cancelled']).optional(),
})

export type CreateDefiInput = z.infer<typeof createDefiSchema>
export type UpdateDefiInput = z.infer<typeof updateDefiSchema>
