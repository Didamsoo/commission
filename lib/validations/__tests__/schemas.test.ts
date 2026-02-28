import { describe, it, expect } from 'vitest'
import {
  createFicheMargeSchema,
  updateFicheMargeSchema,
} from '../fiches-marge'
import { createDefiSchema, updateDefiSchema } from '../defis'
import { createDefiP2PSchema, updateDefiP2PSchema } from '../defis-p2p'
import { updateProfilSchema } from '../profil'
import { addMemberSchema, updateMemberSchema } from '../equipe'
import { submitApprovalSchema, decideApprovalSchema } from '../approbations'
import { createNoteSchema, updateNoteSchema } from '../coaching'
import {
  markReadSchema,
  createNotificationSchema,
} from '../notifications'

const UUID = '550e8400-e29b-41d4-a716-446655440000'
const UUID2 = '660e8400-e29b-41d4-a716-446655440001'

// ---------------------------------------------------------------------------
// 1. fiches-marge.ts
// ---------------------------------------------------------------------------
describe('createFicheMargeSchema', () => {
  const validBase = {
    date: '2024-06-15',
    vehicle_type: 'VO' as const,
  }

  it('should accept a valid VO creation with minimal fields', () => {
    const result = createFicheMargeSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })

  it('should accept a valid VP creation with optional fields', () => {
    const result = createFicheMargeSchema.safeParse({
      ...validBase,
      vehicle_type: 'VP',
      seller_name: 'Jean Dupont',
      client_name: 'Marie Curie',
      purchase_price_ht: 15000,
      selling_price_ht: 18000,
      vp_sales_type: 'particulier',
      vp_model: 'Puma',
    })
    expect(result.success).toBe(true)
  })

  it('should accept a valid VU creation with vu_details', () => {
    const result = createFicheMargeSchema.safeParse({
      ...validBase,
      vehicle_type: 'VU',
      vu_details: {
        margeFixeVehiculeOptions: 500,
        margeFordPro: 200,
      },
    })
    expect(result.success).toBe(true)
  })

  it('should reject an invalid date format', () => {
    const result = createFicheMargeSchema.safeParse({
      ...validBase,
      date: '15/06/2024',
    })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid date format (missing day)', () => {
    const result = createFicheMargeSchema.safeParse({
      ...validBase,
      date: '2024-06',
    })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid vehicle_type', () => {
    const result = createFicheMargeSchema.safeParse({
      ...validBase,
      vehicle_type: 'CAMION',
    })
    expect(result.success).toBe(false)
  })

  it('should apply default warranty_12months = 0', () => {
    const result = createFicheMargeSchema.safeParse(validBase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.warranty_12months).toBe(0)
    }
  })

  it('should apply default workshop_transfer = 0', () => {
    const result = createFicheMargeSchema.safeParse(validBase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.workshop_transfer).toBe(0)
    }
  })

  it('should apply default preparation_ht = 0', () => {
    const result = createFicheMargeSchema.safeParse(validBase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.preparation_ht).toBe(0)
    }
  })

  it('should apply default status = "draft"', () => {
    const result = createFicheMargeSchema.safeParse(validBase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('draft')
    }
  })

  it('should apply default is_electric_vehicle = false', () => {
    const result = createFicheMargeSchema.safeParse(validBase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.is_electric_vehicle).toBe(false)
    }
  })

  it('should apply default delivery_pack_sold = "none"', () => {
    const result = createFicheMargeSchema.safeParse(validBase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.delivery_pack_sold).toBe('none')
    }
  })

  it('should accept null for nullable price fields', () => {
    const result = createFicheMargeSchema.safeParse({
      ...validBase,
      purchase_price_ht: null,
      selling_price_ht: null,
      trade_in_value_ht: null,
    })
    expect(result.success).toBe(true)
  })

  it('should accept vn_options array', () => {
    const result = createFicheMargeSchema.safeParse({
      ...validBase,
      vehicle_type: 'VP',
      vn_options: [{ label: 'Toit ouvrant', amountHT: 800, amountTTC: 960 }],
    })
    expect(result.success).toBe(true)
  })

  it('should reject missing required date field', () => {
    const result = createFicheMargeSchema.safeParse({
      vehicle_type: 'VO',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing required vehicle_type field', () => {
    const result = createFicheMargeSchema.safeParse({
      date: '2024-06-15',
    })
    expect(result.success).toBe(false)
  })

  it('should accept status "submitted"', () => {
    const result = createFicheMargeSchema.safeParse({
      ...validBase,
      status: 'submitted',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('submitted')
    }
  })
})

describe('updateFicheMargeSchema', () => {
  it('should accept a partial update (only status)', () => {
    const result = updateFicheMargeSchema.safeParse({ status: 'submitted' })
    expect(result.success).toBe(true)
  })

  it('should accept an empty object (all fields optional)', () => {
    const result = updateFicheMargeSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should still reject an invalid vehicle_type on update', () => {
    const result = updateFicheMargeSchema.safeParse({
      vehicle_type: 'INVALID',
    })
    expect(result.success).toBe(false)
  })

  it('should still reject an invalid date format on update', () => {
    const result = updateFicheMargeSchema.safeParse({
      date: 'not-a-date',
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 2. defis.ts
// ---------------------------------------------------------------------------
describe('createDefiSchema', () => {
  const validDefi = {
    title: 'Vendre 10 Puma ce mois',
    scope_type: 'individual' as const,
    target_level: 3,
    challenge_type: 'sales_count',
    target_value: 10,
    start_date: '2024-07-01',
    end_date: '2024-07-31',
    reward: { type: 'bonus' as const, value: 500, description: 'Prime 500 EUR' },
  }

  it('should accept valid creation with all required fields', () => {
    const result = createDefiSchema.safeParse(validDefi)
    expect(result.success).toBe(true)
  })

  it('should apply default status = "draft"', () => {
    const result = createDefiSchema.safeParse(validDefi)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('draft')
    }
  })

  it('should apply default target_ids = []', () => {
    const result = createDefiSchema.safeParse(validDefi)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.target_ids).toEqual([])
    }
  })

  it('should accept target_ids with valid UUIDs', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      target_ids: [UUID, UUID2],
    })
    expect(result.success).toBe(true)
  })

  it('should reject target_ids with invalid UUIDs', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      target_ids: ['not-a-uuid'],
    })
    expect(result.success).toBe(false)
  })

  it('should reject title shorter than 3 characters', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      title: 'AB',
    })
    expect(result.success).toBe(false)
  })

  it('should reject title longer than 200 characters', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      title: 'X'.repeat(201),
    })
    expect(result.success).toBe(false)
  })

  it('should accept title exactly 3 characters', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      title: 'ABC',
    })
    expect(result.success).toBe(true)
  })

  it('should accept title exactly 200 characters', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      title: 'X'.repeat(200),
    })
    expect(result.success).toBe(true)
  })

  it('should reject an invalid scope_type', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      scope_type: 'department',
    })
    expect(result.success).toBe(false)
  })

  it('should accept all valid scope_types', () => {
    for (const scope of ['individual', 'team', 'site', 'brand', 'group']) {
      const result = createDefiSchema.safeParse({
        ...validDefi,
        scope_type: scope,
      })
      expect(result.success).toBe(true)
    }
  })

  it('should reject target_value = 0 (must be positive)', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      target_value: 0,
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative target_value', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      target_value: -5,
    })
    expect(result.success).toBe(false)
  })

  it('should reject target_level < 1', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      target_level: 0,
    })
    expect(result.success).toBe(false)
  })

  it('should reject target_level > 5', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      target_level: 6,
    })
    expect(result.success).toBe(false)
  })

  it('should reject non-integer target_level', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      target_level: 2.5,
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty challenge_type', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      challenge_type: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid reward type', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      reward: { type: 'trophy', value: 100, description: 'Trophy' },
    })
    expect(result.success).toBe(false)
  })

  it('should accept all reward types', () => {
    for (const type of ['bonus', 'badge', 'points', 'recognition']) {
      const result = createDefiSchema.safeParse({
        ...validDefi,
        reward: { type, value: 100, description: 'Reward' },
      })
      expect(result.success).toBe(true)
    }
  })

  it('should accept optional description field', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      description: 'Un challenge sur les Puma',
    })
    expect(result.success).toBe(true)
  })

  it('should accept optional reward badgeName and badgeIcon', () => {
    const result = createDefiSchema.safeParse({
      ...validDefi,
      reward: {
        ...validDefi.reward,
        badgeName: 'Top Seller',
        badgeIcon: 'trophy',
      },
    })
    expect(result.success).toBe(true)
  })
})

describe('updateDefiSchema', () => {
  it('should accept a partial update (title only)', () => {
    const result = updateDefiSchema.safeParse({ title: 'New Title' })
    expect(result.success).toBe(true)
  })

  it('should accept an empty object', () => {
    const result = updateDefiSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should reject title too short on update', () => {
    const result = updateDefiSchema.safeParse({ title: 'AB' })
    expect(result.success).toBe(false)
  })

  it('should accept status "completed" (allowed in update but not create)', () => {
    const result = updateDefiSchema.safeParse({ status: 'completed' })
    expect(result.success).toBe(true)
  })

  it('should accept status "cancelled" (allowed in update but not create)', () => {
    const result = updateDefiSchema.safeParse({ status: 'cancelled' })
    expect(result.success).toBe(true)
  })

  it('should reject invalid status on update', () => {
    const result = updateDefiSchema.safeParse({ status: 'archived' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 3. defis-p2p.ts
// ---------------------------------------------------------------------------
describe('createDefiP2PSchema', () => {
  const validP2P = {
    challenged_id: UUID,
    metric: 'sales_count' as const,
    duration_days: 30,
  }

  it('should accept valid creation with minimal fields', () => {
    const result = createDefiP2PSchema.safeParse(validP2P)
    expect(result.success).toBe(true)
  })

  it('should apply default challenger_stake', () => {
    const result = createDefiP2PSchema.safeParse(validP2P)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.challenger_stake).toEqual({
        points: 0,
        customReward: '',
      })
    }
  })

  it('should apply default challenged_stake', () => {
    const result = createDefiP2PSchema.safeParse(validP2P)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.challenged_stake).toEqual({
        points: 0,
        customReward: '',
      })
    }
  })

  it('should accept custom stakes', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      challenger_stake: { points: 100, customReward: 'Cafe offert' },
      challenged_stake: { points: 100, customReward: 'Croissants' },
    })
    expect(result.success).toBe(true)
  })

  it('should accept all valid metrics', () => {
    for (const metric of ['sales_count', 'revenue', 'margin', 'financing_count']) {
      const result = createDefiP2PSchema.safeParse({
        ...validP2P,
        metric,
      })
      expect(result.success).toBe(true)
    }
  })

  it('should reject an invalid metric', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      metric: 'satisfaction',
    })
    expect(result.success).toBe(false)
  })

  it('should reject duration_days < 1', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      duration_days: 0,
    })
    expect(result.success).toBe(false)
  })

  it('should reject duration_days > 90', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      duration_days: 91,
    })
    expect(result.success).toBe(false)
  })

  it('should accept duration_days = 1 (min boundary)', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      duration_days: 1,
    })
    expect(result.success).toBe(true)
  })

  it('should accept duration_days = 90 (max boundary)', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      duration_days: 90,
    })
    expect(result.success).toBe(true)
  })

  it('should reject non-integer duration_days', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      duration_days: 15.5,
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid UUID for challenged_id', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      challenged_id: 'not-a-uuid',
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative stake points', () => {
    const result = createDefiP2PSchema.safeParse({
      ...validP2P,
      challenger_stake: { points: -10, customReward: '' },
    })
    expect(result.success).toBe(false)
  })
})

describe('updateDefiP2PSchema', () => {
  it('should accept an empty object', () => {
    const result = updateDefiP2PSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should accept status update', () => {
    const result = updateDefiP2PSchema.safeParse({ status: 'active' })
    expect(result.success).toBe(true)
  })

  it('should accept all valid P2P statuses', () => {
    for (const status of [
      'pending',
      'negotiating',
      'active',
      'completed',
      'declined',
      'cancelled',
    ]) {
      const result = updateDefiP2PSchema.safeParse({ status })
      expect(result.success).toBe(true)
    }
  })

  it('should reject invalid P2P status', () => {
    const result = updateDefiP2PSchema.safeParse({ status: 'paused' })
    expect(result.success).toBe(false)
  })

  it('should accept winner_id as null', () => {
    const result = updateDefiP2PSchema.safeParse({ winner_id: null })
    expect(result.success).toBe(true)
  })

  it('should accept winner_id as valid UUID', () => {
    const result = updateDefiP2PSchema.safeParse({ winner_id: UUID })
    expect(result.success).toBe(true)
  })

  it('should accept is_draw boolean', () => {
    const result = updateDefiP2PSchema.safeParse({ is_draw: true })
    expect(result.success).toBe(true)
  })

  it('should accept scores update', () => {
    const result = updateDefiP2PSchema.safeParse({
      challenger_final_score: 15,
      challenged_final_score: 12,
      winner_id: UUID,
      is_draw: false,
    })
    expect(result.success).toBe(true)
  })

  it('should accept negotiation record', () => {
    const result = updateDefiP2PSchema.safeParse({
      negotiation: { proposed_stake: 50, message: 'Counter offer' },
    })
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// 4. profil.ts
// ---------------------------------------------------------------------------
describe('updateProfilSchema', () => {
  it('should accept a valid full update', () => {
    const result = updateProfilSchema.safeParse({
      full_name: 'Jean Dupont',
      first_name: 'Jean',
      last_name: 'Dupont',
      phone: '+33612345678',
      avatar_url: 'https://example.com/avatar.jpg',
      settings: {
        email_notifications: true,
        defi_notifications: false,
      },
    })
    expect(result.success).toBe(true)
  })

  it('should accept an empty object (all optional)', () => {
    const result = updateProfilSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should reject an invalid avatar_url (not a URL)', () => {
    const result = updateProfilSchema.safeParse({
      avatar_url: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })

  it('should accept null avatar_url', () => {
    const result = updateProfilSchema.safeParse({
      avatar_url: null,
    })
    expect(result.success).toBe(true)
  })

  it('should reject full_name shorter than 2 characters', () => {
    const result = updateProfilSchema.safeParse({
      full_name: 'A',
    })
    expect(result.success).toBe(false)
  })

  it('should reject full_name longer than 100 characters', () => {
    const result = updateProfilSchema.safeParse({
      full_name: 'X'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it('should accept null for first_name, last_name, phone', () => {
    const result = updateProfilSchema.safeParse({
      first_name: null,
      last_name: null,
      phone: null,
    })
    expect(result.success).toBe(true)
  })

  it('should accept settings with boolean toggles', () => {
    const result = updateProfilSchema.safeParse({
      settings: {
        email_notifications: true,
        defi_notifications: false,
        vente_notifications: true,
        badge_notifications: false,
      },
    })
    expect(result.success).toBe(true)
  })

  it('should accept settings as empty object', () => {
    const result = updateProfilSchema.safeParse({
      settings: {},
    })
    expect(result.success).toBe(true)
  })

  it('should reject phone longer than 20 characters', () => {
    const result = updateProfilSchema.safeParse({
      phone: '1'.repeat(21),
    })
    expect(result.success).toBe(false)
  })

  it('should reject first_name longer than 50 characters', () => {
    const result = updateProfilSchema.safeParse({
      first_name: 'X'.repeat(51),
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 5. equipe.ts
// ---------------------------------------------------------------------------
describe('addMemberSchema', () => {
  it('should accept valid UUIDs', () => {
    const result = addMemberSchema.safeParse({
      user_id: UUID,
      equipe_id: UUID2,
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid UUID for user_id', () => {
    const result = addMemberSchema.safeParse({
      user_id: 'not-a-uuid',
      equipe_id: UUID,
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid UUID for equipe_id', () => {
    const result = addMemberSchema.safeParse({
      user_id: UUID,
      equipe_id: '12345',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing user_id', () => {
    const result = addMemberSchema.safeParse({
      equipe_id: UUID,
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing equipe_id', () => {
    const result = addMemberSchema.safeParse({
      user_id: UUID,
    })
    expect(result.success).toBe(false)
  })
})

describe('updateMemberSchema', () => {
  it('should accept valid role values', () => {
    const roles = [
      'commercial',
      'chef_ventes',
      'dir_concession',
      'dir_marque',
      'dir_plaque',
      'admin',
    ] as const

    for (const role of roles) {
      const result = updateMemberSchema.safeParse({ role })
      expect(result.success).toBe(true)
    }
  })

  it('should reject an invalid role', () => {
    const result = updateMemberSchema.safeParse({ role: 'superadmin' })
    expect(result.success).toBe(false)
  })

  it('should accept an empty object (all optional)', () => {
    const result = updateMemberSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should accept is_active boolean', () => {
    const result = updateMemberSchema.safeParse({ is_active: false })
    expect(result.success).toBe(true)
  })

  it('should accept equipe_id as null', () => {
    const result = updateMemberSchema.safeParse({ equipe_id: null })
    expect(result.success).toBe(true)
  })

  it('should accept equipe_id as valid UUID', () => {
    const result = updateMemberSchema.safeParse({ equipe_id: UUID })
    expect(result.success).toBe(true)
  })

  it('should accept manager_id as null', () => {
    const result = updateMemberSchema.safeParse({ manager_id: null })
    expect(result.success).toBe(true)
  })

  it('should accept manager_id as valid UUID', () => {
    const result = updateMemberSchema.safeParse({ manager_id: UUID })
    expect(result.success).toBe(true)
  })

  it('should reject invalid UUID for manager_id', () => {
    const result = updateMemberSchema.safeParse({ manager_id: 'bad' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 6. approbations.ts
// ---------------------------------------------------------------------------
describe('submitApprovalSchema', () => {
  it('should accept a valid fiche_marge_id UUID', () => {
    const result = submitApprovalSchema.safeParse({
      fiche_marge_id: UUID,
    })
    expect(result.success).toBe(true)
  })

  it('should reject an invalid UUID', () => {
    const result = submitApprovalSchema.safeParse({
      fiche_marge_id: 'not-valid',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing fiche_marge_id', () => {
    const result = submitApprovalSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('decideApprovalSchema', () => {
  it('should accept status "approved"', () => {
    const result = decideApprovalSchema.safeParse({ status: 'approved' })
    expect(result.success).toBe(true)
  })

  it('should accept status "rejected"', () => {
    const result = decideApprovalSchema.safeParse({ status: 'rejected' })
    expect(result.success).toBe(true)
  })

  it('should reject an invalid status', () => {
    const result = decideApprovalSchema.safeParse({ status: 'pending' })
    expect(result.success).toBe(false)
  })

  it('should reject status "draft"', () => {
    const result = decideApprovalSchema.safeParse({ status: 'draft' })
    expect(result.success).toBe(false)
  })

  it('should accept an optional comment', () => {
    const result = decideApprovalSchema.safeParse({
      status: 'rejected',
      comment: 'Marge insuffisante',
    })
    expect(result.success).toBe(true)
  })

  it('should accept missing comment', () => {
    const result = decideApprovalSchema.safeParse({
      status: 'approved',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.comment).toBeUndefined()
    }
  })

  it('should reject comment exceeding 1000 characters', () => {
    const result = decideApprovalSchema.safeParse({
      status: 'rejected',
      comment: 'X'.repeat(1001),
    })
    expect(result.success).toBe(false)
  })

  it('should accept comment at exactly 1000 characters', () => {
    const result = decideApprovalSchema.safeParse({
      status: 'approved',
      comment: 'X'.repeat(1000),
    })
    expect(result.success).toBe(true)
  })

  it('should reject missing status', () => {
    const result = decideApprovalSchema.safeParse({
      comment: 'Some comment',
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 7. coaching.ts
// ---------------------------------------------------------------------------
describe('createNoteSchema', () => {
  const validNote = {
    commercial_id: UUID,
    type: 'feedback' as const,
    content: 'Bon travail sur les ventes de la semaine.',
  }

  it('should accept valid creation', () => {
    const result = createNoteSchema.safeParse(validNote)
    expect(result.success).toBe(true)
  })

  it('should accept all 4 note types', () => {
    for (const type of ['feedback', 'objective', 'action', 'meeting']) {
      const result = createNoteSchema.safeParse({ ...validNote, type })
      expect(result.success).toBe(true)
    }
  })

  it('should reject an invalid note type', () => {
    const result = createNoteSchema.safeParse({
      ...validNote,
      type: 'reminder',
    })
    expect(result.success).toBe(false)
  })

  it('should apply default is_private = false', () => {
    const result = createNoteSchema.safeParse(validNote)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.is_private).toBe(false)
    }
  })

  it('should accept is_private = true', () => {
    const result = createNoteSchema.safeParse({
      ...validNote,
      is_private: true,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.is_private).toBe(true)
    }
  })

  it('should reject empty content (min 1)', () => {
    const result = createNoteSchema.safeParse({
      ...validNote,
      content: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject content exceeding 5000 characters', () => {
    const result = createNoteSchema.safeParse({
      ...validNote,
      content: 'X'.repeat(5001),
    })
    expect(result.success).toBe(false)
  })

  it('should accept content at exactly 5000 characters', () => {
    const result = createNoteSchema.safeParse({
      ...validNote,
      content: 'X'.repeat(5000),
    })
    expect(result.success).toBe(true)
  })

  it('should accept content at exactly 1 character', () => {
    const result = createNoteSchema.safeParse({
      ...validNote,
      content: 'A',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid UUID for commercial_id', () => {
    const result = createNoteSchema.safeParse({
      ...validNote,
      commercial_id: 'abc123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing commercial_id', () => {
    const result = createNoteSchema.safeParse({
      type: 'feedback',
      content: 'Some content',
    })
    expect(result.success).toBe(false)
  })
})

describe('updateNoteSchema', () => {
  it('should accept an empty object (all optional)', () => {
    const result = updateNoteSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should accept partial update (content only)', () => {
    const result = updateNoteSchema.safeParse({
      content: 'Updated coaching note',
    })
    expect(result.success).toBe(true)
  })

  it('should accept partial update (type only)', () => {
    const result = updateNoteSchema.safeParse({ type: 'meeting' })
    expect(result.success).toBe(true)
  })

  it('should accept partial update (is_private only)', () => {
    const result = updateNoteSchema.safeParse({ is_private: true })
    expect(result.success).toBe(true)
  })

  it('should reject empty content on update', () => {
    const result = updateNoteSchema.safeParse({ content: '' })
    expect(result.success).toBe(false)
  })

  it('should reject content exceeding 5000 on update', () => {
    const result = updateNoteSchema.safeParse({
      content: 'X'.repeat(5001),
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid type on update', () => {
    const result = updateNoteSchema.safeParse({ type: 'note' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 8. notifications.ts
// ---------------------------------------------------------------------------
describe('markReadSchema', () => {
  it('should accept is_read = true', () => {
    const result = markReadSchema.safeParse({ is_read: true })
    expect(result.success).toBe(true)
  })

  it('should accept is_read = false', () => {
    const result = markReadSchema.safeParse({ is_read: false })
    expect(result.success).toBe(true)
  })

  it('should reject missing is_read', () => {
    const result = markReadSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('should reject non-boolean is_read', () => {
    const result = markReadSchema.safeParse({ is_read: 'yes' })
    expect(result.success).toBe(false)
  })
})

describe('createNotificationSchema', () => {
  const validNotification = {
    user_id: UUID,
    type: 'defi_completed',
    title: 'Challenge termine',
  }

  it('should accept valid creation with minimal fields', () => {
    const result = createNotificationSchema.safeParse(validNotification)
    expect(result.success).toBe(true)
  })

  it('should accept valid creation with all fields', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      message: 'Votre challenge a ete complete avec succes.',
      data: { defi_id: UUID, score: 15 },
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty type', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      type: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject type longer than 50 characters', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      type: 'X'.repeat(51),
    })
    expect(result.success).toBe(false)
  })

  it('should accept type at exactly 50 characters', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      type: 'X'.repeat(50),
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty title', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      title: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject title longer than 200 characters', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      title: 'X'.repeat(201),
    })
    expect(result.success).toBe(false)
  })

  it('should accept title at exactly 200 characters', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      title: 'X'.repeat(200),
    })
    expect(result.success).toBe(true)
  })

  it('should reject message longer than 1000 characters', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      message: 'X'.repeat(1001),
    })
    expect(result.success).toBe(false)
  })

  it('should accept message at exactly 1000 characters', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      message: 'X'.repeat(1000),
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid UUID for user_id', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      user_id: 'bad-id',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing user_id', () => {
    const result = createNotificationSchema.safeParse({
      type: 'info',
      title: 'Test',
    })
    expect(result.success).toBe(false)
  })

  it('should accept data as record of unknown', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      data: { key: 'value', nested: { a: 1 }, arr: [1, 2, 3] },
    })
    expect(result.success).toBe(true)
  })

  it('should accept data as empty record', () => {
    const result = createNotificationSchema.safeParse({
      ...validNotification,
      data: {},
    })
    expect(result.success).toBe(true)
  })
})
