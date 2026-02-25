import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  VAT_RATE,
  convertHTToTTC,
  convertTTCToHT,
  getDefaultPayplan,
  calculateMarginSheet,
  type CalculateInputs,
  type Payplan,
} from '../margin-utils'

// ============================================
// HELPER: Factory pour inputs de base
// ============================================

function createBaseInputs(overrides: Partial<CalculateInputs> = {}): CalculateInputs {
  return {
    vehicleType: 'VO',
    isOtherStockCession: false,
    purchasePriceTTC: 12000,
    sellingPriceTTC: 15000,
    tradeInValueHT: 0,
    warranty12Months: 0,
    workshopTransfer: 0,
    preparationHT: 0,
    purchaseDate: '2024-01-01',
    orderDate: '2024-02-15',
    listedPriceTTC: 15000,
    isElectricVehicle: false,
    hasFinancing: false,
    financedAmountHT: 0,
    numberOfServicesSold: 0,
    financingType: 'principal',
    isCreditBailVN: false,
    isLOAVO: false,
    isIDFord25Months: false,
    isLLDProFordLease: false,
    deliveryPackSold: 'none',
    isHighPenetrationRate: false,
    cldFordDuration: 'none',
    hasMaintenanceContract: false,
    hasCoyote: false,
    coyoteDuration: 'none',
    hasAccessories: false,
    accessoryAmountHT: 0,
    accessoryAmountTTC: 0,
    vpSalesType: '',
    vpModel: '',
    margeFixeVehiculeOptions: 0,
    margeFordPro: 0,
    margeRepresentationMarque: 0,
    margeAccessoiresAmenagesVU: 0,
    assistanceConstructeur: 0,
    remiseConsentie: 0,
    ...overrides,
  }
}

// ============================================
// Conversions HT/TTC
// ============================================

describe('Conversions HT/TTC', () => {
  it('convertHTToTTC applique la TVA 20%', () => {
    expect(convertHTToTTC(1000)).toBe(1200)
  })

  it('convertTTCToHT retire la TVA 20%', () => {
    expect(convertTTCToHT(1200)).toBe(1000)
  })

  it('round-trip HT → TTC → HT', () => {
    const original = 5000
    const ttc = convertHTToTTC(original)
    const backToHT = convertTTCToHT(ttc)
    expect(backToHT).toBeCloseTo(original, 10)
  })

  it('gère le zéro', () => {
    expect(convertHTToTTC(0)).toBe(0)
    expect(convertTTCToHT(0)).toBe(0)
  })
})

// ============================================
// getDefaultPayplan
// ============================================

describe('getDefaultPayplan', () => {
  it('retourne un payplan avec la structure complète', () => {
    const payplan = getDefaultPayplan()
    expect(payplan).toHaveProperty('fixedSalary')
    expect(payplan).toHaveProperty('vpCommissions')
    expect(payplan).toHaveProperty('financingRates')
    expect(payplan).toHaveProperty('accessoryTiers')
    expect(payplan).toHaveProperty('coyoteCommissions')
  })

  it('a les valeurs clés correctes', () => {
    const payplan = getDefaultPayplan()
    expect(payplan.fixedSalary).toBe(1200)
    expect(payplan.baseCommissionVO).toBe(80)
    expect(payplan.bonus60DaysVO).toBe(30)
    expect(payplan.electricVehicleMultiplierVO).toBe(1.5)
    expect(payplan.vuCommissionRate).toBe(0.13)
    expect(payplan.vnMarginPercentage).toBe(0.05)
  })

  it('calcule financingMinAmount à partir du TTC 6001€', () => {
    const payplan = getDefaultPayplan()
    const expectedHT = 6001 / (1 + VAT_RATE)
    expect(payplan.financingMinAmount).toBeCloseTo(expectedHT, 2)
  })
})

// ============================================
// VO — Marge de base
// ============================================

describe('VO — marge de base', () => {
  const payplan = getDefaultPayplan()

  it('calcule les prix HT depuis les prix TTC', () => {
    const inputs = createBaseInputs({ purchasePriceTTC: 12000, sellingPriceTTC: 15000 })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.purchasePriceHT).toBeCloseTo(10000, 0)
    expect(result.sellingPriceHT).toBeCloseTo(12500, 0)
  })

  it('calcule la marge initiale HT', () => {
    const inputs = createBaseInputs({ purchasePriceTTC: 12000, sellingPriceTTC: 15000 })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.initialMarginHT).toBeCloseTo(2500, 0)
  })

  it('déduit les frais de la marge restante', () => {
    const inputs = createBaseInputs({
      purchasePriceTTC: 12000,
      sellingPriceTTC: 15000,
      warranty12Months: 200,
      workshopTransfer: 100,
      preparationHT: 150,
      tradeInValueHT: 500,
    })
    const result = calculateMarginSheet(inputs, payplan)
    // marge initiale ~2500, - 200 - 100 - 150 - 500 = ~1550
    expect(result.remainingMarginHT).toBeCloseTo(1550, 0)
  })

  it('gère la cession autre stock (marge fixe 1800 TTC)', () => {
    const inputs = createBaseInputs({ isOtherStockCession: true })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.initialMarginHT).toBeCloseTo(1500, 0) // 1800 / 1.2
  })
})

// ============================================
// VO — Commissions
// ============================================

describe('VO — commissions', () => {
  const payplan = getDefaultPayplan()

  it('commission de base VO = 80€', () => {
    const inputs = createBaseInputs()
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.voBaseCommission).toBe(80)
  })

  it('bonus 60 jours si achat → commande < 60j', () => {
    const inputs = createBaseInputs({
      purchaseDate: '2024-01-01',
      orderDate: '2024-02-01', // 31 jours
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.voBonus60Days).toBe(30)
  })

  it('pas de bonus 60 jours si >= 60j', () => {
    const inputs = createBaseInputs({
      purchaseDate: '2024-01-01',
      orderDate: '2024-04-01', // >60 jours
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.voBonus60Days).toBe(0)
  })

  it('bonus prix affiché si vente >= prix affiché', () => {
    const inputs = createBaseInputs({
      sellingPriceTTC: 16000,
      listedPriceTTC: 15000,
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.voBonusListedPrice).toBe(30)
  })

  it('bonus financement VO si hasFinancing', () => {
    const inputs = createBaseInputs({ hasFinancing: true })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.voBonusFinancing).toBe(30)
  })

  it('multiplicateur EV appliqué à la commission totale VO', () => {
    const inputs = createBaseInputs({
      isElectricVehicle: true,
      hasFinancing: true,
      purchaseDate: '2024-01-01',
      orderDate: '2024-01-15', // <60j
      sellingPriceTTC: 16000,
      listedPriceTTC: 15000,
    })
    const result = calculateMarginSheet(inputs, payplan)
    // base(80) + 60j(30) + listedPrice(30) + financing(30) = 170
    // EV bonus = 170 * (1.5 - 1) = 85
    expect(result.commissionDetails.voBonusElectricVehicle).toBe(85)
  })
})

// ============================================
// VP — Commissions
// ============================================

describe('VP — commissions', () => {
  const payplan = getDefaultPayplan()

  it('lookup VP par type de vente et modèle', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vpSalesType: 'PART/VD/Prof Lib/Société',
      vpModel: 'Kuga',
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.vpCommission).toBe(180)
  })

  it('commission Puma PART = 80€', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vpSalesType: 'PART/VD/Prof Lib/Société',
      vpModel: 'Puma',
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.vpCommission).toBe(80)
  })

  it('commission Mustang GC/Loueurs = 80€', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vpSalesType: 'GC/Loueurs LLD ou LCD',
      vpModel: 'Mustang',
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.vpCommission).toBe(80)
  })

  it('modèle inconnu → commission 0', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vpSalesType: 'PART/VD/Prof Lib/Société',
      vpModel: 'ModelInexistant',
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.vpCommission).toBe(0)
  })
})

// ============================================
// VU — Commissions
// ============================================

describe('VU — commissions', () => {
  const payplan = getDefaultPayplan()

  it('commission VU = taux * composants marge', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VU',
      margeFixeVehiculeOptions: 1000,
      margeFordPro: 500,
      margeRepresentationMarque: 200,
      margeAccessoiresAmenagesVU: 300,
      assistanceConstructeur: 100,
      remiseConsentie: 0,
    })
    const result = calculateMarginSheet(inputs, payplan)
    // marge = 1000+500+200+300+100-0 = 2100, * 0.13 = 273
    expect(result.commissionDetails.vuCommission).toBeCloseTo(273, 0)
  })

  it('commission VU avec remise consentie', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VU',
      margeFixeVehiculeOptions: 1000,
      margeFordPro: 500,
      margeRepresentationMarque: 200,
      margeAccessoiresAmenagesVU: 300,
      assistanceConstructeur: 100,
      remiseConsentie: 600,
    })
    const result = calculateMarginSheet(inputs, payplan)
    // marge = 2100 - 600 = 1500, * 0.13 = 195
    expect(result.commissionDetails.vuCommission).toBeCloseTo(195, 0)
  })

  it('pas de commission VO/VP pour véhicule VU', () => {
    const inputs = createBaseInputs({ vehicleType: 'VU' })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.voBaseCommission).toBe(0)
    expect(result.commissionDetails.vpCommission).toBe(0)
  })
})

// ============================================
// Commissions transversales
// ============================================

describe('Commissions transversales — Financement', () => {
  const payplan = getDefaultPayplan()

  it('pas de bonus financement si montant <= seuil', () => {
    const inputs = createBaseInputs({
      hasFinancing: true,
      financedAmountHT: 100, // en dessous du seuil
      numberOfServicesSold: 1,
      financingType: 'principal',
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.financingBonus).toBe(0)
  })

  it('bonus financement principal avec 2 services', () => {
    const inputs = createBaseInputs({
      hasFinancing: true,
      financedAmountHT: 10000,
      numberOfServicesSold: 2,
      financingType: 'principal',
    })
    const result = calculateMarginSheet(inputs, payplan)
    // 10000 * 0.0085 = 85
    expect(result.commissionDetails.financingBonus).toBeCloseTo(85, 0)
  })

  it('bonus financement specific avec 3 services', () => {
    const inputs = createBaseInputs({
      hasFinancing: true,
      financedAmountHT: 10000,
      numberOfServicesSold: 3,
      financingType: 'specific',
    })
    const result = calculateMarginSheet(inputs, payplan)
    // 10000 * 0.0045 = 45
    expect(result.commissionDetails.financingBonus).toBeCloseTo(45, 0)
  })

  it('bonus credit bail VN cumulatif', () => {
    const inputs = createBaseInputs({
      hasFinancing: true,
      financedAmountHT: 10000,
      numberOfServicesSold: 1,
      financingType: 'principal',
      isCreditBailVN: true,
    })
    const result = calculateMarginSheet(inputs, payplan)
    // (10000 * 0.0045) + (10000 * 0.002) = 45 + 20 = 65
    expect(result.commissionDetails.financingBonus).toBeCloseTo(65, 0)
  })

  it('bonus LLD Pro Ford Lease = montant fixe 30€', () => {
    const inputs = createBaseInputs({
      hasFinancing: true,
      financedAmountHT: 10000,
      numberOfServicesSold: 1,
      financingType: 'principal',
      isLLDProFordLease: true,
    })
    const result = calculateMarginSheet(inputs, payplan)
    // (10000 * 0.0045) + 30 = 45 + 30 = 75
    expect(result.commissionDetails.financingBonus).toBeCloseTo(75, 0)
  })
})

describe('Commissions transversales — Packs & Services', () => {
  const payplan = getDefaultPayplan()

  it('bonus pack2 = 20€', () => {
    const inputs = createBaseInputs({ deliveryPackSold: 'pack2' })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.deliveryPackBonus).toBe(20)
  })

  it('bonus pack3 = 35€', () => {
    const inputs = createBaseInputs({ deliveryPackSold: 'pack3' })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.deliveryPackBonus).toBe(35)
  })

  it('CLD 5+ = 20€ (normal), 50€ (high penetration)', () => {
    const normal = createBaseInputs({ cldFordDuration: '5+' })
    const highPen = createBaseInputs({ cldFordDuration: '5+', isHighPenetrationRate: true })
    expect(calculateMarginSheet(normal, payplan).commissionDetails.cldBonus).toBe(20)
    expect(calculateMarginSheet(highPen, payplan).commissionDetails.cldBonus).toBe(50)
  })

  it('contrat entretien = 20€ normal, 50€ high penetration', () => {
    const normal = createBaseInputs({ hasMaintenanceContract: true })
    const highPen = createBaseInputs({ hasMaintenanceContract: true, isHighPenetrationRate: true })
    expect(calculateMarginSheet(normal, payplan).commissionDetails.maintenanceContractBonus).toBe(20)
    expect(calculateMarginSheet(highPen, payplan).commissionDetails.maintenanceContractBonus).toBe(50)
  })

  it('Coyote 36 mois = 40€', () => {
    const inputs = createBaseInputs({ hasCoyote: true, coyoteDuration: '36' })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.coyoteBonus).toBe(40)
  })
})

describe('Commissions transversales — Accessoires', () => {
  const payplan = getDefaultPayplan()

  it('tier 1 (50-250€) → bonus 10€', () => {
    const inputs = createBaseInputs({ hasAccessories: true, accessoryAmountTTC: 150 })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.accessoryBonus).toBe(10)
  })

  it('tier 2 (251-800€) → bonus 50€', () => {
    const inputs = createBaseInputs({ hasAccessories: true, accessoryAmountTTC: 500 })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.accessoryBonus).toBe(50)
  })

  it('tier 3 (801€+) → bonus 75€', () => {
    const inputs = createBaseInputs({ hasAccessories: true, accessoryAmountTTC: 1000 })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.commissionDetails.accessoryBonus).toBe(75)
  })
})

// ============================================
// VN spécifique (VP avec vnClient fields)
// ============================================

describe('VN spécifique', () => {
  const payplan = getDefaultPayplan()

  it('marge VN = 5% du prix départ client HT', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vnClientKeyInHandPriceHT: 20000,
      vnClientDeparturePriceHT: 25000,
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.vnMarginPercentage).toBe(0.05)
    expect(result.vnCalculatedMargin).toBeCloseTo(1250, 0) // 25000 * 0.05
  })

  it('ajoute les options HT à la marge', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vnClientKeyInHandPriceHT: 20000,
      vnClientDeparturePriceHT: 25000,
      vnOptions: [
        { id: '1', name: 'GPS', priceHT: 500, priceTTC: 600 },
        { id: '2', name: 'Toit ouvrant', priceHT: 800, priceTTC: 960 },
      ],
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.vnTotalOptionsHT).toBeCloseTo(1300, 0)
    expect(result.vnTotalOptionsTTC).toBeCloseTo(1560, 0)
  })

  it('soustrait les remises HT de la marge', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vnClientKeyInHandPriceHT: 20000,
      vnClientDeparturePriceHT: 25000,
      vnDiscounts: [{ id: '1', name: 'Remise fidélité', amountHT: 300, amountTTC: 360 }],
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.vnTotalDiscountsHT).toBeCloseTo(300, 0)
  })

  it('calcule la récupération Ford', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vnClientKeyInHandPriceHT: 20000,
      vnClientDeparturePriceHT: 25000,
      vnFordRecovery: { attaque: 100, renforcementStock: 200, aideReprise: 150, plusValueTarif: 50 },
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.vnFordRecoveryTotal).toBeCloseTo(500, 0)
  })

  it('marge finale VN = vnMargin + options - remises + ford recovery - frais', () => {
    const inputs = createBaseInputs({
      vehicleType: 'VP',
      vnClientKeyInHandPriceHT: 20000,
      vnClientDeparturePriceHT: 25000,
      vnOptions: [{ id: '1', name: 'GPS', priceHT: 500, priceTTC: 600 }],
      vnDiscounts: [{ id: '1', name: 'Remise', amountHT: 200, amountTTC: 240 }],
      vnFordRecovery: { attaque: 100, renforcementStock: 0, aideReprise: 0, plusValueTarif: 0 },
      warranty12Months: 100,
    })
    const result = calculateMarginSheet(inputs, payplan)
    // vnMargin = 25000 * 0.05 = 1250
    // initial = 1250 + 500 - 200 + 100 = 1650
    // remaining = 1650 - 100 (warranty) = 1550
    expect(result.initialMarginHT).toBeCloseTo(1650, 0)
    expect(result.remainingMarginHT).toBeCloseTo(1550, 0)
  })
})

// ============================================
// Marge finale
// ============================================

describe('Marge finale', () => {
  const payplan = getDefaultPayplan()

  it('finalMargin = remainingMarginHT - sellerCommission', () => {
    const inputs = createBaseInputs({
      purchasePriceTTC: 12000,
      sellingPriceTTC: 15000,
    })
    const result = calculateMarginSheet(inputs, payplan)
    expect(result.finalMargin).toBeCloseTo(result.remainingMarginHT - result.sellerCommission, 2)
  })

  it('finalMargin peut être négative', () => {
    const inputs = createBaseInputs({
      purchasePriceTTC: 14000,
      sellingPriceTTC: 14500,
      warranty12Months: 200,
      workshopTransfer: 100,
      preparationHT: 150,
      hasFinancing: true,
      financedAmountHT: 10000,
      numberOfServicesSold: 3,
      financingType: 'principal',
      hasAccessories: true,
      accessoryAmountTTC: 1000,
      hasCoyote: true,
      coyoteDuration: '48',
      hasMaintenanceContract: true,
      deliveryPackSold: 'pack3',
    })
    const result = calculateMarginSheet(inputs, payplan)
    // Marge petite (~416 - 450 frais) mais beaucoup de commissions → négatif
    expect(result.finalMargin).toBeLessThan(0)
  })
})
