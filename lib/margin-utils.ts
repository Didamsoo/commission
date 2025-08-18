export interface CalculatedResults {
  purchasePriceHT: number
  sellingPriceHT: number
  initialMarginHT: number
  remainingMarginHT: number
  sellerCommission: number
  finalMargin: number
  commissionDetails: {
    voBaseCommission: number // 80€ for VO
    voBonus60Days: number // 30€ for VO
    voBonusListedPrice: number // 30€ for VO
    voBonusFinancing: number // NEW: 30€ bonus for VO financing
    voBonusElectricVehicle: number // Calculated for VO
    vpCommission: number // Calculated for VP
    vuCommission: number // Calculated for VU
    financingBonus: number // Sum of all financing bonuses
    deliveryPackBonus: number // Sum of all delivery pack bonuses
    cldBonus: number // Sum of all CLD bonuses
    maintenanceContractBonus: number // Sum of all maintenance contract bonuses
    coyoteBonus: number // Sum of all Coyote bonuses
    accessoryBonus: number // Sum of all accessory bonuses
  }
}

export interface MarginSheet extends CalculatedResults {
  id: string
  date: string
  vehicleNumber: string
  sellerName: string
  clientName: string
  vehicleSoldName: string
  purchasePriceTTC: number
  sellingPriceTTC: number
  tradeInValueHT: number
  warranty12Months: number
  workshopTransfer: number
  preparationHT: number
  purchaseDate: string // YYYY-MM-DD
  orderDate: string // YYYY-MM-DD
  listedPriceTTC: number
  hasFinancing: boolean
  financedAmountHT: number
  numberOfServicesSold: number // 0, 1, or 2
  deliveryPackSold: "none" | "pack1" | "pack2" | "pack3"
  isHighPenetrationRate: boolean
  isElectricVehicle: boolean
  hasAccessories: boolean
  accessoryAmountHT: number // Kept for compatibility, but accessoryAmountTTC is used for new rule
  accessoryAmountTTC: number // New for tiered accessory bonus
  isOtherStockCession: boolean

  // New fields for Payplan integration
  vehicleType: "VO" | "VP" | "VU"
  vpSalesType: "PART/VD/Prof Lib/Société" | "GC/Loueurs LLD ou LCD" | ""
  vpModel:
    | "Carline"
    | "Tourneo Courrier"
    | "Focus"
    | "Kuga"
    | "Explorer"
    | "Capri"
    | "Mach-E"
    | "Tourneo Connect"
    | "Mustang"
    | "Ranger"
    | ""
  margeFixeVehiculeOptions: number
  margeFordPro: number
  margeRepresentationMarque: number
  margeAccessoiresAmenagesVU: number
  assistanceConstructeur: number
  remiseConsentie: number
  financingType: "principal" | "specific"
  isCreditBailVN: boolean
  isLOAVO: boolean
  isIDFord25Months: boolean
  isLLDProFordLease: boolean
  cldFordDuration: "none" | "3-4" | "5+"
  hasMaintenanceContract: boolean
  hasCoyote: boolean
  coyoteDuration: "none" | "24" | "36" | "48"
}

interface CalculateInputs {
  purchasePriceTTC: number
  sellingPriceTTC: number
  tradeInValueHT: number
  warranty12Months: number
  workshopTransfer: number
  preparationHT: number
  purchaseDate: string
  orderDate: string
  listedPriceTTC: number
  hasFinancing: boolean
  financedAmountHT: number
  numberOfServicesSold: number
  deliveryPackSold: "none" | "pack1" | "pack2" | "pack3"
  isHighPenetrationRate: boolean
  isElectricVehicle: boolean
  hasAccessories: boolean
  accessoryAmountHT: number // Kept for compatibility, but accessoryAmountTTC is used for new rule
  accessoryAmountTTC: number // New for tiered accessory bonus
  isOtherStockCession: boolean

  // New fields for Payplan integration
  vehicleType: "VO" | "VP" | "VU"
  vpSalesType: "PART/VD/Prof Lib/Société" | "GC/Loueurs LLD ou LCD" | ""
  vpModel:
    | "Carline"
    | "Tourneo Courrier"
    | "Focus"
    | "Kuga"
    | "Explorer"
    | "Capri"
    | "Mach-E"
    | "Tourneo Connect"
    | "Mustang"
    | "Ranger"
    | ""
  margeFixeVehiculeOptions: number
  margeFordPro: number
  margeRepresentationMarque: number
  margeAccessoiresAmenagesVU: number
  assistanceConstructeur: number
  remiseConsentie: number
  financingType: "principal" | "specific"
  isCreditBailVN: boolean
  isLOAVO: boolean
  isIDFord25Months: boolean
  isLLDProFordLease: boolean
  cldFordDuration: "none" | "3-4" | "5+"
  hasMaintenanceContract: boolean
  hasCoyote: boolean
  coyoteDuration: "none" | "24" | "36" | "48"
}

export interface Payplan {
  fixedSalary: number
  // VO Commissions
  baseCommissionVO: number
  bonus60DaysVO: number
  bonusListedPriceVO: number
  electricVehicleMultiplierVO: number
  bonusFinancingVO: number // Added: 30€ bonus for VO financing

  // VP Commissions
  vpCommissions: {
    "PART/VD/Prof Lib/Société": {
      Carline: number
      "Tourneo Courrier": number
      Focus: number
      Kuga: number
      Explorer: number
      Capri: number
      "Mach-E": number
      "Tourneo Connect": number
      Mustang: number
      Ranger: number
    }
    "GC/Loueurs LLD ou LCD": {
      Carline: number
      "Tourneo Courrier": number
      Focus: number
      Kuga: number
      Explorer: number
      Capri: number
      "Mach-E": number
      "Tourneo Connect": number
      Mustang: number
      Ranger: number
    }
  }

  // VU Commissions
  vuCommissionRate: number // 0.13 for 13%

  // Financing Commissions
  financingMinAmount: number // 6001
  financingRates: {
    principal: { service1: number; service2: number } // 0.0045, 0.0085
    specific: { service1: number; service2: number } // 0.0010, 0.0030
  }
  financingBonus: {
    creditBailVN: number
    loaVO: number
    idFord25Months: number
    lldProFordLease: number
  }

  // Packs & Peripherals Commissions
  packCommissions: { none: number; pack1: number; pack2: number; pack3: number }
  packCommissionsHighPenetration: { none: number; pack1: number; pack2: number; pack3: number }
  cldCommissions: { "3-4": number; "5+": number }
  cldCommissionsHighPenetration: { "3-4": number; "5+": number }
  maintenanceContractCommission: number
  maintenanceContractCommissionHighPenetration: number

  // Coyote Commissions
  coyoteCommissions: { "24": number; "36": number; "48": number }

  // Accessory Commissions (tiered)
  accessoryTiers: {
    tier1: { min: number; max: number; bonus: number } // 10-200 TTC, 15€
    tier2: { min: number; max: number; bonus: number } // 201-500 TTC, 30€
    tier3: { min: number; bonus: number } // 501+ TTC, 50€
  }
}

export const VAT_RATE = 0.2 // Assuming 20% VAT for TTC to HT conversion
const PAYPLAN_STORAGE_KEY = "payplanSettings"
const MARGIN_SHEETS_STORAGE_KEY = "marginSheets"

export function getDefaultPayplan(): Payplan {
  return {
    fixedSalary: 1200,
    // VO
    baseCommissionVO: 80,
    bonus60DaysVO: 30,
    bonusListedPriceVO: 30,
    electricVehicleMultiplierVO: 1.5,
    bonusFinancingVO: 30, // Added default value for VO financing bonus

    // VP
    vpCommissions: {
      "PART/VD/Prof Lib/Société": {
        Carline: 50,
        "Tourneo Courrier": 80,
        Focus: 100,
        Kuga: 180,
        Explorer: 150,
        Capri: 150,
        "Mach-E": 200,
        "Tourneo Connect": 150,
        Mustang: 250,
        Ranger: 180,
      },
      "GC/Loueurs LLD ou LCD": {
        Carline: 30,
        "Tourneo Courrier": 40,
        Focus: 50,
        Kuga: 100,
        Explorer: 80,
        Capri: 80,
        "Mach-E": 100,
        "Tourneo Connect": 80,
        Mustang: 150,
        Ranger: 100,
      },
    },

    // VU
    vuCommissionRate: 0.13, // 13%

    // Financing
    financingMinAmount: 6001,
    financingRates: {
      principal: { service1: 0.0045, service2: 0.0085 },
      specific: { service1: 0.001, service2: 0.003 },
    },
    financingBonus: {
      creditBailVN: 0.002, // 0.2%
      loaVO: 0.002, // 0.2%
      idFord25Months: 0.002, // 0.2%
      lldProFordLease: 30, // Fixed 30€
    },

    // Packs & Peripherals
    packCommissions: {
      none: 0,
      pack1: 10,
      pack2: 10,
      pack3: 30,
    },
    packCommissionsHighPenetration: {
      none: 0,
      pack1: 10,
      pack2: 30,
      pack3: 60,
    },
    cldCommissions: { "3-4": 10, "5+": 20 },
    cldCommissionsHighPenetration: { "3-4": 20, "5+": 50 },
    maintenanceContractCommission: 20,
    maintenanceContractCommissionHighPenetration: 50,

    // Coyote
    coyoteCommissions: { "24": 30, "36": 40, "48": 50 },

    // Accessory
    accessoryTiers: {
      tier1: { min: 10, max: 200, bonus: 15 },
      tier2: { min: 201, max: 500, bonus: 30 },
      tier3: { min: 501, bonus: 50 },
    },
  }
}

export function getPayplan(): Payplan {
  if (typeof window === "undefined") {
    return getDefaultPayplan()
  }
  try {
    const storedPayplan = localStorage.getItem(PAYPLAN_STORAGE_KEY)
    const parsedPayplan = storedPayplan ? JSON.parse(storedPayplan) : getDefaultPayplan()

    // Merge with default payplan to ensure new fields are present
    return { ...getDefaultPayplan(), ...parsedPayplan }
  } catch (error) {
    console.error("Failed to load payplan from localStorage:", error)
    return getDefaultPayplan()
  }
}

export function savePayplan(payplan: Payplan): void {
  if (typeof window === "undefined") {
    return
  }
  try {
    localStorage.setItem(PAYPLAN_STORAGE_KEY, JSON.stringify(payplan))
  } catch (error) {
    console.error("Failed to save payplan to localStorage:", error)
  }
}

export function calculateMarginSheet(inputs: CalculateInputs, payplan: Payplan): CalculatedResults {
  const {
    purchasePriceTTC,
    sellingPriceTTC,
    tradeInValueHT,
    warranty12Months,
    workshopTransfer,
    preparationHT,
    purchaseDate,
    orderDate,
    listedPriceTTC,
    hasFinancing,
    financedAmountHT,
    numberOfServicesSold,
    deliveryPackSold,
    isHighPenetrationRate,
    isElectricVehicle,
    hasAccessories,
    accessoryAmountTTC,
    isOtherStockCession,
    vehicleType,
    vpSalesType,
    vpModel,
    margeFixeVehiculeOptions,
    margeFordPro,
    margeRepresentationMarque,
    margeAccessoiresAmenagesVU,
    assistanceConstructeur,
    remiseConsentie,
    financingType,
    isCreditBailVN,
    isLOAVO,
    isIDFord25Months,
    isLLDProFordLease,
    cldFordDuration,
    hasMaintenanceContract,
    hasCoyote,
    coyoteDuration,
  } = inputs

  let calculatedPurchasePriceHT: number
  let calculatedSellingPriceHT: number
  let calculatedInitialMarginHT: number
  let calculatedRemainingMarginHT: number

  if (isOtherStockCession) {
    const fixedCessionMarginTTC = 1800
    const fixedCessionMarginHT = fixedCessionMarginTTC / (1 + VAT_RATE)

    calculatedPurchasePriceHT = 0 // Not relevant for fixed margin calculation
    calculatedSellingPriceHT = fixedCessionMarginHT // Selling price effectively becomes the margin
    calculatedInitialMarginHT = fixedCessionMarginHT
    calculatedRemainingMarginHT = fixedCessionMarginHT // No other costs apply
  } else {
    // Existing margin calculation logic
    calculatedPurchasePriceHT = purchasePriceTTC / (1 + VAT_RATE)
    calculatedSellingPriceHT = sellingPriceTTC / (1 + VAT_RATE)
    calculatedInitialMarginHT = calculatedSellingPriceHT - calculatedPurchasePriceHT
    calculatedRemainingMarginHT =
      calculatedInitialMarginHT - warranty12Months - workshopTransfer - preparationHT - tradeInValueHT
  }

  // --- Commission Vendeur Calculation ---
  let sellerCommission = 0
  const commissionDetails: CalculatedResults["commissionDetails"] = {
    voBaseCommission: 0,
    voBonus60Days: 0,
    voBonusListedPrice: 0,
    voBonusFinancing: 0, // Initialize new field
    voBonusElectricVehicle: 0,
    vpCommission: 0,
    vuCommission: 0,
    financingBonus: 0, // This will be for non-VO specific financing
    deliveryPackBonus: 0,
    cldBonus: 0,
    maintenanceContractBonus: 0,
    coyoteBonus: 0,
    accessoryBonus: 0,
  }

  // 1. Base Commission by Vehicle Type
  if (vehicleType === "VO") {
    commissionDetails.voBaseCommission = payplan.baseCommissionVO

    // Bonus -60 Jours (VO only)
    if (purchaseDate && orderDate) {
      const pDate = new Date(purchaseDate)
      const oDate = new Date(orderDate)
      const diffTime = Math.abs(oDate.getTime() - pDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays < 60) {
        commissionDetails.voBonus60Days = payplan.bonus60DaysVO
      }
    }

    // Bonus Prix Affiché (VO only)
    if (sellingPriceTTC >= listedPriceTTC && listedPriceTTC > 0) {
      commissionDetails.voBonusListedPrice = payplan.bonusListedPriceVO
    }

    // Bonus Financement VO (new: 30€ fixed bonus if VO and has financing)
    if (hasFinancing) {
      commissionDetails.voBonusFinancing = payplan.bonusFinancingVO
    }

    // Sum VO specific bonuses before EV multiplier
    const voCommissionBeforeEV =
      commissionDetails.voBaseCommission +
      commissionDetails.voBonus60Days +
      commissionDetails.voBonusListedPrice +
      commissionDetails.voBonusFinancing // Include new bonus here

    // Bonus Véhicule Électrique (VO only)
    if (isElectricVehicle) {
      commissionDetails.voBonusElectricVehicle = voCommissionBeforeEV * (payplan.electricVehicleMultiplierVO - 1)
      sellerCommission += voCommissionBeforeEV * payplan.electricVehicleMultiplierVO
    } else {
      sellerCommission += voCommissionBeforeEV
    }
  } else if (vehicleType === "VP") {
    if (vpSalesType && vpModel) {
      commissionDetails.vpCommission = payplan.vpCommissions[vpSalesType][vpModel] || 0
      sellerCommission += commissionDetails.vpCommission
    }
  } else if (vehicleType === "VU") {
    const margeRestanteVU =
      margeFixeVehiculeOptions +
      margeFordPro +
      margeRepresentationMarque +
      margeAccessoiresAmenagesVU +
      assistanceConstructeur -
      remiseConsentie
    commissionDetails.vuCommission = margeRestanteVU * payplan.vuCommissionRate
    sellerCommission += commissionDetails.vuCommission
  }

  // 2. Financing Commission (common for all types if applicable, this is for variable financing and other specific bonuses)
  // This block calculates the *variable* financing bonus and other specific financing bonuses (Credit-Bail, LOA, etc.)
  // It should NOT include the fixed 30€ VO financing bonus, as that's handled above in the VO section.
  if (hasFinancing && financedAmountHT > payplan.financingMinAmount) {
    let currentFinancingRate = 0
    if (financingType === "principal") {
      if (numberOfServicesSold === 1) currentFinancingRate = payplan.financingRates.principal.service1
      else if (numberOfServicesSold === 2) currentFinancingRate = payplan.financingRates.principal.service2
    } else if (financingType === "specific") {
      if (numberOfServicesSold === 1) currentFinancingRate = payplan.financingRates.specific.service1
      else if (numberOfServicesSold === 2) currentFinancingRate = payplan.financingRates.specific.service2
    }
    commissionDetails.financingBonus += financedAmountHT * currentFinancingRate

    // Additional financing bonuses (these are general, not the fixed 30€ VO bonus)
    if (isCreditBailVN) commissionDetails.financingBonus += financedAmountHT * payplan.financingBonus.creditBailVN
    if (isLOAVO) commissionDetails.financingBonus += financedAmountHT * payplan.financingBonus.loaVO
    if (isIDFord25Months) commissionDetails.financingBonus += financedAmountHT * payplan.financingBonus.idFord25Months
    if (isLLDProFordLease) commissionDetails.financingBonus += payplan.financingBonus.lldProFordLease // Fixed amount
  }
  sellerCommission += commissionDetails.financingBonus // Add the general financing bonus to total

  // 3. Packs & Peripherals Commission (common for all types)
  const currentPackCommissions = isHighPenetrationRate
    ? payplan.packCommissionsHighPenetration
    : payplan.packCommissions
  commissionDetails.deliveryPackBonus = currentPackCommissions[deliveryPackSold]
  sellerCommission += commissionDetails.deliveryPackBonus

  if (cldFordDuration !== "none") {
    const currentCldCommissions = isHighPenetrationRate ? payplan.cldCommissionsHighPenetration : payplan.cldCommissions
    commissionDetails.cldBonus = currentCldCommissions[cldFordDuration]
    sellerCommission += commissionDetails.cldBonus
  }

  if (hasMaintenanceContract) {
    commissionDetails.maintenanceContractBonus = isHighPenetrationRate
      ? payplan.maintenanceContractCommissionHighPenetration
      : payplan.maintenanceContractCommission
    sellerCommission += commissionDetails.maintenanceContractBonus
  }

  // 4. Coyote Commission (common for all types)
  if (hasCoyote && coyoteDuration !== "none") {
    commissionDetails.coyoteBonus = payplan.coyoteCommissions[coyoteDuration]
    sellerCommission += commissionDetails.coyoteBonus
  }

  // 5. Accessory Commission (common for all types - tiered fixed bonus)
  if (hasAccessories && accessoryAmountTTC > 0) {
    if (
      accessoryAmountTTC >= payplan.accessoryTiers.tier1.min &&
      accessoryAmountTTC <= payplan.accessoryTiers.tier1.max
    ) {
      commissionDetails.accessoryBonus = payplan.accessoryTiers.tier1.bonus
    } else if (
      accessoryAmountTTC >= payplan.accessoryTiers.tier2.min &&
      accessoryAmountTTC <= payplan.accessoryTiers.tier2.max
    ) {
      commissionDetails.accessoryBonus = payplan.accessoryTiers.tier2.bonus
    } else if (accessoryAmountTTC >= payplan.accessoryTiers.tier3.min) {
      commissionDetails.accessoryBonus = payplan.accessoryTiers.tier3.bonus
    }
  }
  sellerCommission += commissionDetails.accessoryBonus

  // Marge Finale (Concessionnaire) - Corrected formula
  const finalMargin = calculatedRemainingMarginHT - sellerCommission

  return {
    purchasePriceHT: Number.parseFloat(calculatedPurchasePriceHT.toFixed(2)),
    sellingPriceHT: Number.parseFloat(calculatedSellingPriceHT.toFixed(2)),
    initialMarginHT: Number.parseFloat(calculatedInitialMarginHT.toFixed(2)),
    remainingMarginHT: Number.parseFloat(calculatedRemainingMarginHT.toFixed(2)),
    sellerCommission: Number.parseFloat(sellerCommission.toFixed(2)),
    finalMargin: Number.parseFloat(finalMargin.toFixed(2)),
    commissionDetails: {
      voBaseCommission: Number.parseFloat(commissionDetails.voBaseCommission.toFixed(2)),
      voBonus60Days: Number.parseFloat(commissionDetails.voBonus60Days.toFixed(2)),
      voBonusListedPrice: Number.parseFloat(commissionDetails.voBonusListedPrice.toFixed(2)),
      voBonusFinancing: Number.parseFloat(commissionDetails.voBonusFinancing.toFixed(2)), // NEW
      voBonusElectricVehicle: Number.parseFloat(commissionDetails.voBonusElectricVehicle.toFixed(2)),
      vpCommission: Number.parseFloat(commissionDetails.vpCommission.toFixed(2)),
      vuCommission: Number.parseFloat(commissionDetails.vuCommission.toFixed(2)),
      financingBonus: Number.parseFloat(commissionDetails.financingBonus.toFixed(2)),
      deliveryPackBonus: Number.parseFloat(commissionDetails.deliveryPackBonus.toFixed(2)),
      cldBonus: Number.parseFloat(commissionDetails.cldBonus.toFixed(2)),
      maintenanceContractBonus: Number.parseFloat(commissionDetails.maintenanceContractBonus.toFixed(2)),
      coyoteBonus: Number.parseFloat(commissionDetails.coyoteBonus.toFixed(2)),
      accessoryBonus: Number.parseFloat(commissionDetails.accessoryBonus.toFixed(2)),
    },
  }
}

export function getMarginSheets(): MarginSheet[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const storedSheets = localStorage.getItem(MARGIN_SHEETS_STORAGE_KEY)
    return storedSheets ? JSON.parse(storedSheets) : []
  } catch (error) {
    console.error("Failed to load margin sheets from localStorage:", error)
    return []
  }
}

export function saveMarginSheets(sheets: MarginSheet[]): void {
  if (typeof window === "undefined") {
    return
  }
  try {
    localStorage.setItem(MARGIN_SHEETS_STORAGE_KEY, JSON.stringify(sheets))
  } catch (error) {
    console.error("Failed to save margin sheets to localStorage:", error)
  }
}
