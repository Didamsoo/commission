import { z } from 'zod'

export const addMemberSchema = z.object({
  user_id: z.string().uuid(),
  equipe_id: z.string().uuid(),
})

export const updateMemberSchema = z.object({
  equipe_id: z.string().uuid().nullable().optional(),
  role: z.enum(['commercial', 'chef_ventes', 'dir_concession', 'dir_marque', 'dir_plaque', 'admin']).optional(),
  manager_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean().optional(),
})

export type AddMemberInput = z.infer<typeof addMemberSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>
