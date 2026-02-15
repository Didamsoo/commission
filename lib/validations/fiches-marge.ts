import { z } from 'zod'

const vnOptionSchema = z.object({
  label: z.string(),
  amountHT: z.number(),
  amountTTC: z.number(),
})

const vnDiscountSchema = z.object({
  label: z.string(),
  amountHT: z.number(),
  amountTTC: z.number(),
})

const vnFordRecoverySchema = z.object({
  primeConstructeur: z.number().optional(),
  aideReprise: z.number().optional(),
  bonusEcologique: z.number().optional(),
}).passthrough()

const vuDetailsSchema = z.object({
  margeFixeVehiculeOptions: z.number().optional(),
  margeFordPro: z.number().optional(),
  margeRepresentationMarque: z.number().optional(),
  margeAccessoiresAmenagesVU: z.number().optional(),
  assistanceConstructeur: z.number().optional(),
  remiseConsentie: z.number().optional(),
}).passthrough()

export const createFicheMargeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  vehicle_number: z.string().optional(),
  seller_name: z.string().optional(),
  client_name: z.string().optional(),
  vehicle_sold_name: z.string().optional(),
  vehicle_type: z.enum(['VO', 'VP', 'VU']),

  // Prix
  purchase_price_ht: z.number().nullable().optional(),
  purchase_price_ttc: z.number().nullable().optional(),
  selling_price_ht: z.number().nullable().optional(),
  selling_price_ttc: z.number().nullable().optional(),
  trade_in_value_ht: z.number().nullable().optional(),
  listed_price_ttc: z.number().nullable().optional(),

  // Coûts
  warranty_12months: z.number().default(0),
  workshop_transfer: z.number().default(0),
  preparation_ht: z.number().default(0),

  // Résultats calculés
  initial_margin_ht: z.number().nullable().optional(),
  remaining_margin_ht: z.number().nullable().optional(),
  seller_commission: z.number().nullable().optional(),
  final_margin: z.number().nullable().optional(),
  commission_details: z.record(z.unknown()).default({}),

  // Flags
  is_electric_vehicle: z.boolean().default(false),
  has_financing: z.boolean().default(false),
  financed_amount_ht: z.number().nullable().optional(),
  financing_type: z.enum(['principal', 'specific']).nullable().optional(),
  number_of_services_sold: z.number().int().default(0),

  // VO
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  is_other_stock_cession: z.boolean().default(false),

  // VP/VN
  vp_sales_type: z.string().nullable().optional(),
  vp_model: z.string().nullable().optional(),
  vn_options: z.array(vnOptionSchema).default([]),
  vn_discounts: z.array(vnDiscountSchema).default([]),
  vn_ford_recovery: vnFordRecoverySchema.default({}),

  // VU
  vu_details: vuDetailsSchema.default({}),

  // Packs
  delivery_pack_sold: z.enum(['none', 'pack1', 'pack2', 'pack3']).default('none'),
  is_high_penetration_rate: z.boolean().default(false),
  cld_ford_duration: z.enum(['none', '3-4', '5+']).default('none'),
  has_maintenance_contract: z.boolean().default(false),
  has_coyote: z.boolean().default(false),
  coyote_duration: z.enum(['none', '24', '36', '48']).default('none'),

  // Accessoires
  has_accessories: z.boolean().default(false),
  accessory_amount_ht: z.number().default(0),
  accessory_amount_ttc: z.number().default(0),

  // Statut
  status: z.enum(['draft', 'submitted']).default('draft'),
})

export const updateFicheMargeSchema = createFicheMargeSchema.partial()

export type CreateFicheMargeInput = z.infer<typeof createFicheMargeSchema>
export type UpdateFicheMargeInput = z.infer<typeof updateFicheMargeSchema>
