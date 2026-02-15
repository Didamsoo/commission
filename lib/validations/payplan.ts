import { z } from 'zod'

export const payplanConfigSchema = z.object({
  fixedSalary: z.number().optional(),
  baseCommissionVO: z.number().optional(),
  bonus60DaysVO: z.number().optional(),
  bonusListedPriceVO: z.number().optional(),
  electricVehicleMultiplierVO: z.number().optional(),
  bonusFinancingVO: z.number().optional(),
  vpCommissions: z.record(z.record(z.number())).optional(),
  vuCommissionRate: z.number().optional(),
  vnMarginPercentage: z.number().optional(),
  financingMinAmount: z.number().optional(),
  financingRates: z.object({
    principal: z.object({
      service1: z.number(),
      service2: z.number(),
      service3: z.number(),
    }),
    specific: z.object({
      service1: z.number(),
      service2: z.number(),
      service3: z.number(),
    }),
  }).optional(),
  financingBonus: z.record(z.number()).optional(),
  packCommissions: z.record(z.number()).optional(),
  packCommissionsHighPenetration: z.record(z.number()).optional(),
  cldCommissions: z.record(z.number()).optional(),
  cldCommissionsHighPenetration: z.record(z.number()).optional(),
  maintenanceContractCommission: z.number().optional(),
  maintenanceContractCommissionHighPenetration: z.number().optional(),
  coyoteCommissions: z.record(z.number()).optional(),
  accessoryTiers: z.object({
    tier1: z.object({ min: z.number(), max: z.number(), bonus: z.number() }),
    tier2: z.object({ min: z.number(), max: z.number(), bonus: z.number() }),
    tier3: z.object({ min: z.number(), bonus: z.number() }),
  }).optional(),
  financialPenetrationBonuses: z.record(z.record(z.number())).optional(),
}).passthrough()

export const createPayplanSchema = z.object({
  concession_id: z.string().uuid(),
  name: z.string().min(1).max(100).default('Payplan principal'),
  config: payplanConfigSchema,
  is_active: z.boolean().default(true),
})

export const updatePayplanSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  config: payplanConfigSchema.optional(),
  is_active: z.boolean().optional(),
})

export type CreatePayplanInput = z.infer<typeof createPayplanSchema>
export type UpdatePayplanInput = z.infer<typeof updatePayplanSchema>
