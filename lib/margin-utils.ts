// src/lib/margin-utils.ts

export const VAT_RATE = 0.2
const PAYPLAN_STORAGE_KEY = "payplanSettings"
const MARGIN_SHEETS_STORAGE_KEY = "marginSheets"

export interface VNOption {
  id: string
  name: string
  priceHT: number
  priceTTC: number
}

export interface VNDiscount {
  id: string
  name: string
  amountHT: number
  amountTTC: number
}

export interface VNFordRecovery {
  attaque: number
  renforcementStock: number
  aideReprise: number
  plusValueTarif: number
}

export interface CommissionDetails {
  voBaseCommission: number
  voBonus60Days: number
  voBonusListedPrice: number
  voBonusFinancing: number
  voBonusElectricVehicle: number
  vpCommission: number
  vuCommission: number
  financingBonus: number
  deliveryPackBonus: number
  packPenetrationBonus: number
  cldBonus: number
  maintenanceContractBonus: number
  coyoteBonus: number
  accessoryBonus: number
}

export interface CalculatedResults {
  purchasePriceHT: number
  sellingPriceHT: number
  initialMarginHT: number
  remainingMarginHT: number
  sellerCommission: number
  finalMargin: number
  commissionDetails: CommissionDetails
  
  // Nouveaux champs pour VN
  vnMarginPercentage?: number
  vnCalculatedMargin?: number
  vnTotalOptionsHT?: number
  vnTotalOptionsTTC?: number
  vnTotalDiscountsHT?: number
  vnTotalDiscountsTTC?: number
  vnFordRecoveryTotal?: number
}

export interface MarginSheet extends CalculatedResults {
  id: string
  date: string
  vehicleNumber: string
  sellerName: string
  clientName: string
  vehicleSoldName: string
  vehicleType: "VO" | "VP" | "VU"
  
  // Prix de base
  purchasePriceTTC: number
  sellingPriceTTC: number
  tradeInValueHT: number
  
  // Frais
  warranty12Months: number
  workshopTransfer: number
  preparationHT: number
  
  // Dates VO
  purchaseDate: string
  orderDate: string
  listedPriceTTC: number
  
  // Flags généraux
  isElectricVehicle: boolean
  hasFinancing: boolean
  financedAmountHT: number
  numberOfServicesSold: number
  financingType: "principal" | "specific"
  isOtherStockCession: boolean
  
  // Flags financement spécifiques
  isCreditBailVN: boolean
  isLOAVO: boolean
  isIDFord25Months: boolean
  isLLDProFordLease: boolean
  
  // Packs et services
  deliveryPackSold: "none" | "pack1" | "pack2" | "pack3"
  isHighPenetrationRate: boolean
  cldFordDuration: "none" | "3-4" | "5+"
  hasMaintenanceContract: boolean
  
  // Coyote
  hasCoyote: boolean
  coyoteDuration: "none" | "24" | "36" | "48"
  
  // Accessoires
  hasAccessories: boolean
  accessoryAmountHT: number
  accessoryAmountTTC: number
  
  // VP (VN) spécifiques
  vpSalesType: "PART/VD/Prof Lib/Société" | "Vente Captive Ford Lease" | "GC/Loueurs LLD ou LCD" | ""
  vpModel: string
  
  // VU spécifiques
  margeFixeVehiculeOptions: number
  margeFordPro: number
  margeRepresentationMarque: number
  margeAccessoiresAmenagesVU: number
  assistanceConstructeur: number
  remiseConsentie: number
  
  // Nouveaux champs pour VN
  vnClientKeyInHandPriceHT?: number
  vnClientDeparturePriceHT?: number
  vnOptions?: VNOption[]
  vnDiscounts?: VNDiscount[]
  vnFordRecovery?: VNFordRecovery
}

export interface CalculateInputs {
  // Type véhicule
  vehicleType: "VO" | "VP" | "VU"
  isOtherStockCession: boolean
  
  // Prix de base
  purchasePriceTTC: number
  sellingPriceTTC: number
  tradeInValueHT: number
  
  // Frais
  warranty12Months: number
  workshopTransfer: number
  preparationHT: number
  
  // Dates VO
  purchaseDate: string
  orderDate: string
  listedPriceTTC: number
  
  // Flags généraux
  isElectricVehicle: boolean
  hasFinancing: boolean
  financedAmountHT: number
  numberOfServicesSold: number
  financingType: "principal" | "specific"
  
  // Flags financement spécifiques
  isCreditBailVN: boolean
  isLOAVO: boolean
  isIDFord25Months: boolean
  isLLDProFordLease: boolean
  
  // Packs et services
  deliveryPackSold: "none" | "pack1" | "pack2" | "pack3"
  isHighPenetrationRate: boolean
  cldFordDuration: "none" | "3-4" | "5+"
  hasMaintenanceContract: boolean
  
  // Coyote
  hasCoyote: boolean
  coyoteDuration: "none" | "24" | "36" | "48"
  
  // Accessoires
  hasAccessories: boolean
  accessoryAmountHT: number
  accessoryAmountTTC: number
  
  // VP (VN) spécifiques
  vpSalesType: "PART/VD/Prof Lib/Société" | "Vente Captive Ford Lease" | "GC/Loueurs LLD ou LCD" | ""
  vpModel: string
  
  // VU spécifiques
  margeFixeVehiculeOptions: number
  margeFordPro: number
  margeRepresentationMarque: number
  margeAccessoiresAmenagesVU: number
  assistanceConstructeur: number
  remiseConsentie: number
  
  // Nouveaux champs pour VN
  vnClientKeyInHandPriceHT?: number
  vnClientDeparturePriceHT?: number
  vnOptions?: VNOption[]
  vnDiscounts?: VNDiscount[]
  vnFordRecovery?: VNFordRecovery
}

export interface Payplan {
  fixedSalary: number
  baseCommissionVO: number
  bonus60DaysVO: number
  bonusListedPriceVO: number
  electricVehicleMultiplierVO: number
  bonusFinancingVO: number

  vpCommissions: {
    "PART/VD/Prof Lib/Société": Record<string, number>
    "Vente Captive Ford Lease": Record<string, number>
    "GC/Loueurs LLD ou LCD": Record<string, number>
  }

  vuCommissionRate: number
  vnMarginPercentage: number

  financingMinAmount: number
  financingRates: {
    principal: { service1: number; service2: number; service3: number }
    specific: { service1: number; service2: number; service3: number }
  }
  financingBonus: {
    creditBailVN: number
    loaVO: number
    idFord25Months: number
    lldProFordLease: number
  }

  packCommissions: { none: number; pack1: number; pack2: number; pack3: number }
  packCommissionsHighPenetration: { none: number; pack1: number; pack2: number; pack3: number }
  cldCommissions: { "3-4": number; "5+": number }
  cldCommissionsHighPenetration: { "3-4": number; "5+": number }
  maintenanceContractCommission: number
  maintenanceContractCommissionHighPenetration: number

  coyoteCommissions: { "24": number; "36": number; "48": number }

  accessoryTiers: {
    tier1: { min: number; max: number; bonus: number }
    tier2: { min: number; max: number; bonus: number }
    tier3: { min: number; bonus: number }
  }

  financialPenetrationBonuses: {
    realization100: Record<string, number>
    realization120: Record<string, number>
  }
}

// Fonction utilitaire pour conversion automatique HT/TTC
export function convertHTToTTC(amountHT: number): number {
  return amountHT * (1 + VAT_RATE)
}

export function convertTTCToHT(amountTTC: number): number {
  return amountTTC / (1 + VAT_RATE)
}

export function getDefaultPayplan(): Payplan {
  return {
    fixedSalary: 1200,
    baseCommissionVO: 80,
    bonus60DaysVO: 30,
    bonusListedPriceVO: 30,
    electricVehicleMultiplierVO: 1.5,
    bonusFinancingVO: 30,

    vpCommissions: {
      "PART/VD/Prof Lib/Société": {
        Carline: 50,
        "Tourneo Courier": 50,
        Puma: 80,
        "Puma Gen-E": 150,
        Focus: 100,
        Kuga: 180,
        Explorer: 200,
        Capri: 200,
        "Mach-E": 200,
        "Tourneo Connect": 150,
        Mustang: 250,
        Ranger: 180,
      },
      "Vente Captive Ford Lease": {
        Carline: 30,
        "Tourneo Courier": 30,
        Puma: 40,
        "Puma Gen-E": 80,
        Focus: 50,
        Kuga: 100,
        Explorer: 80,
        Capri: 80,
        "Mach-E": 100,
        "Tourneo Connect": 120,
        Mustang: 150,
        Ranger: 100,
      },
      "GC/Loueurs LLD ou LCD": {
        Carline: 30,
        "Tourneo Courier": 40,
        Puma: 40,
        "Puma Gen-E": 50,
        Focus: 40,
        Kuga: 50,
        Explorer: 60,
        Capri: 60,
        "Mach-E": 80,
        "Tourneo Connect": 80,
        Mustang: 80,
        Ranger: 100,
      },
    },

    vuCommissionRate: 0.13,
    vnMarginPercentage: 0.05,

    financingMinAmount: 6001,
    financingRates: {
      principal: { service1: 0.0045, service2: 0.0085, service3: 0.0100 },
      specific: { service1: 0.001, service2: 0.003, service3: 0.0045 },
    },
    financingBonus: {
      creditBailVN: 0.002,
      loaVO: 0.003,
      idFord25Months: 0.002,
      lldProFordLease: 30,
    },

    packCommissions: { none: 0, pack1: 0, pack2: 20, pack3: 35 },
    packCommissionsHighPenetration: { none: 0, pack1: 0, pack2: 20, pack3: 35 },
    cldCommissions: { "3-4": 10, "5+": 20 },
    cldCommissionsHighPenetration: { "3-4": 20, "5+": 50 },
    maintenanceContractCommission: 20,
    maintenanceContractCommissionHighPenetration: 50,

    coyoteCommissions: { "24": 30, "36": 40, "48": 50 },

    accessoryTiers: {
      tier1: { min: 50, max: 250, bonus: 10 },
      tier2: { min: 251, max: 800, bonus: 50 },
      tier3: { min: 801, bonus: 75 },
    },

    financialPenetrationBonuses: {
      realization100: { "< 35%": 0, "35% à 40%": 0, "40% à 50%": 400, "> 50%": 800 },
      realization120: { "< 35%": 0, "35% à 40%": 200, "40% à 50%": 600, "> 50%": 1200 },
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
    return { ...getDefaultPayplan(), ...parsedPayplan }
  } catch (error) {
    console.error("Failed to load payplan from localStorage:", error)
    return getDefaultPayplan()
  }
}

export function savePayplan(payplan: Payplan): void {
  if (typeof window === "undefined") return
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
    vnClientKeyInHandPriceHT,
    vnClientDeparturePriceHT,
    vnOptions,
    vnDiscounts,
    vnFordRecovery,
  } = inputs

  let calculatedPurchasePriceHT: number
  let calculatedSellingPriceHT: number
  let calculatedInitialMarginHT: number
  let calculatedRemainingMarginHT: number
  let vnMarginPercentage: number | undefined
  let vnCalculatedMargin: number | undefined
  let vnTotalOptionsHT: number | undefined
  let vnTotalOptionsTTC: number | undefined
  let vnTotalDiscountsHT: number | undefined
  let vnTotalDiscountsTTC: number | undefined
  let vnFordRecoveryTotal: number | undefined

  // LOGIQUE VN (Véhicule Neuf)
  if (vehicleType === "VP" && vnClientKeyInHandPriceHT && vnClientDeparturePriceHT) {
    calculatedPurchasePriceHT = vnClientKeyInHandPriceHT
    calculatedSellingPriceHT = vnClientDeparturePriceHT
    
    // Calcul des totaux des options
    vnTotalOptionsHT = vnOptions?.reduce((sum, option) => sum + option.priceHT, 0) || 0
    vnTotalOptionsTTC = vnOptions?.reduce((sum, option) => sum + option.priceTTC, 0) || 0
    
    // Calcul des totaux des remises
    vnTotalDiscountsHT = vnDiscounts?.reduce((sum, discount) => sum + discount.amountHT, 0) || 0
    vnTotalDiscountsTTC = vnDiscounts?.reduce((sum, discount) => sum + discount.amountTTC, 0) || 0
    
    // Calcul récupération Ford (version simplifiée)
    vnFordRecoveryTotal = 0
    if (vnFordRecovery) {
      vnFordRecoveryTotal = vnFordRecovery.attaque + 
                          vnFordRecovery.renforcementStock + 
                          vnFordRecovery.aideReprise + 
                          vnFordRecovery.plusValueTarif
    }
    
    // Calcul de la marge à 5% du prix départ client HT
    vnMarginPercentage = payplan.vnMarginPercentage
    vnCalculatedMargin = vnClientDeparturePriceHT * vnMarginPercentage
    
    // Marge finale après options, remises et récupération Ford
    calculatedInitialMarginHT = vnCalculatedMargin + vnTotalOptionsHT - vnTotalDiscountsHT + vnFordRecoveryTotal
    calculatedRemainingMarginHT = calculatedInitialMarginHT - warranty12Months - workshopTransfer - preparationHT - tradeInValueHT
    
  } 
  // LOGIQUE CESSION AUTRE STOCK
  else if (isOtherStockCession) {
    const fixedCessionMarginTTC = 1800
    const fixedCessionMarginHT = fixedCessionMarginTTC / (1 + VAT_RATE)

    calculatedPurchasePriceHT = 0
    calculatedSellingPriceHT = fixedCessionMarginHT
    calculatedInitialMarginHT = fixedCessionMarginHT
    calculatedRemainingMarginHT = fixedCessionMarginHT
  } 
  // LOGIQUE STANDARD VO/VU
  else {
    calculatedPurchasePriceHT = purchasePriceTTC / (1 + VAT_RATE)
    calculatedSellingPriceHT = sellingPriceTTC / (1 + VAT_RATE)
    calculatedInitialMarginHT = calculatedSellingPriceHT - calculatedPurchasePriceHT
    calculatedRemainingMarginHT = calculatedInitialMarginHT - warranty12Months - workshopTransfer - preparationHT - tradeInValueHT
  }

  // CALCUL DES COMMISSIONS
  let sellerCommission = 0
  const commissionDetails: CommissionDetails = {
    voBaseCommission: 0,
    voBonus60Days: 0,
    voBonusListedPrice: 0,
    voBonusFinancing: 0,
    voBonusElectricVehicle: 0,
    vpCommission: 0,
    vuCommission: 0,
    financingBonus: 0,
    deliveryPackBonus: 0,
    packPenetrationBonus: 0,
    cldBonus: 0,
    maintenanceContractBonus: 0,
    coyoteBonus: 0,
    accessoryBonus: 0,
  }

  // 1. Commission de base selon type véhicule
  if (vehicleType === "VO") {
    // Commission de base VO
    commissionDetails.voBaseCommission = payplan.baseCommissionVO

    // Bonus -60 jours
    if (purchaseDate && orderDate) {
      const pDate = new Date(purchaseDate)
      const oDate = new Date(orderDate)
      const diffTime = Math.abs(oDate.getTime() - pDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays < 60) {
        commissionDetails.voBonus60Days = payplan.bonus60DaysVO
      }
    }

    // Bonus prix affiché
    if (sellingPriceTTC >= listedPriceTTC && listedPriceTTC > 0) {
      commissionDetails.voBonusListedPrice = payplan.bonusListedPriceVO
    }

    // Bonus financement VO
    if (hasFinancing) {
      commissionDetails.voBonusFinancing = payplan.bonusFinancingVO
    }

    // Calcul commission VO avant multiplicateur électrique
    const voCommissionBeforeEV = commissionDetails.voBaseCommission + 
                                 commissionDetails.voBonus60Days + 
                                 commissionDetails.voBonusListedPrice + 
                                 commissionDetails.voBonusFinancing

    // Bonus véhicule électrique (multiplicateur)
    if (isElectricVehicle) {
      commissionDetails.voBonusElectricVehicle = voCommissionBeforeEV * (payplan.electricVehicleMultiplierVO - 1)
      sellerCommission += voCommissionBeforeEV * payplan.electricVehicleMultiplierVO
    } else {
      sellerCommission += voCommissionBeforeEV
    }
    
  } else if (vehicleType === "VP") {
    // Commission VN selon payplan VP
    if (vpSalesType && vpModel) {
      commissionDetails.vpCommission = payplan.vpCommissions[vpSalesType][vpModel] || 0
      sellerCommission += commissionDetails.vpCommission
    }
    
  } else if (vehicleType === "VU") {
    // Commission VU basée sur marge restante
    const margeRestanteVU = margeFixeVehiculeOptions + margeFordPro + margeRepresentationMarque + 
                           margeAccessoiresAmenagesVU + assistanceConstructeur - remiseConsentie
    commissionDetails.vuCommission = margeRestanteVU * payplan.vuCommissionRate
    sellerCommission += commissionDetails.vuCommission
  }

  // 2. Bonus financement
  if (hasFinancing && financedAmountHT > payplan.financingMinAmount) {
    let currentFinancingRate = 0
    
    // Taux selon type et services
    if (financingType === "principal") {
      if (numberOfServicesSold === 1) currentFinancingRate = payplan.financingRates.principal.service1
      else if (numberOfServicesSold === 2) currentFinancingRate = payplan.financingRates.principal.service2
      else if (numberOfServicesSold === 3) currentFinancingRate = payplan.financingRates.principal.service3
    } else if (financingType === "specific") {
      if (numberOfServicesSold === 1) currentFinancingRate = payplan.financingRates.specific.service1
      else if (numberOfServicesSold === 2) currentFinancingRate = payplan.financingRates.specific.service2
      else if (numberOfServicesSold === 3) currentFinancingRate = payplan.financingRates.specific.service3
    }
    
    commissionDetails.financingBonus += financedAmountHT * currentFinancingRate

    // Bonus financement spécifiques
    if (isCreditBailVN) commissionDetails.financingBonus += financedAmountHT * payplan.financingBonus.creditBailVN
    if (isLOAVO) commissionDetails.financingBonus += financedAmountHT * payplan.financingBonus.loaVO
    if (isIDFord25Months) commissionDetails.financingBonus += financedAmountHT * payplan.financingBonus.idFord25Months
    if (isLLDProFordLease) commissionDetails.financingBonus += payplan.financingBonus.lldProFordLease
  }
  sellerCommission += commissionDetails.financingBonus

  // 3. Bonus packs livraison
  const currentPackCommissions = isHighPenetrationRate ? payplan.packCommissionsHighPenetration : payplan.packCommissions
  commissionDetails.deliveryPackBonus = currentPackCommissions[deliveryPackSold]
  sellerCommission += commissionDetails.deliveryPackBonus

  // 4. Bonus CLD Ford
  if (cldFordDuration !== "none") {
    const currentCldCommissions = isHighPenetrationRate ? payplan.cldCommissionsHighPenetration : payplan.cldCommissions
    commissionDetails.cldBonus = currentCldCommissions[cldFordDuration]
    sellerCommission += commissionDetails.cldBonus
  }

  // 5. Bonus contrat entretien
  if (hasMaintenanceContract) {
    commissionDetails.maintenanceContractBonus = isHighPenetrationRate ? 
      payplan.maintenanceContractCommissionHighPenetration : 
      payplan.maintenanceContractCommission
    sellerCommission += commissionDetails.maintenanceContractBonus
  }

  // 6. Bonus Coyote
  if (hasCoyote && coyoteDuration !== "none") {
    commissionDetails.coyoteBonus = payplan.coyoteCommissions[coyoteDuration]
    sellerCommission += commissionDetails.coyoteBonus
  }

  // 7. Bonus accessoires
  if (hasAccessories && accessoryAmountTTC > 0) {
    if (accessoryAmountTTC >= payplan.accessoryTiers.tier1.min && accessoryAmountTTC <= payplan.accessoryTiers.tier1.max) {
      commissionDetails.accessoryBonus = payplan.accessoryTiers.tier1.bonus
    } else if (accessoryAmountTTC >= payplan.accessoryTiers.tier2.min && accessoryAmountTTC <= payplan.accessoryTiers.tier2.max) {
      commissionDetails.accessoryBonus = payplan.accessoryTiers.tier2.bonus
    } else if (accessoryAmountTTC >= payplan.accessoryTiers.tier3.min) {
      commissionDetails.accessoryBonus = payplan.accessoryTiers.tier3.bonus
    }
  }
  sellerCommission += commissionDetails.accessoryBonus

  // Marge finale pour le concessionnaire
  const finalMargin = calculatedRemainingMarginHT - sellerCommission

  // Construction du résultat
  const result: CalculatedResults = {
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
      voBonusFinancing: Number.parseFloat(commissionDetails.voBonusFinancing.toFixed(2)),
      voBonusElectricVehicle: Number.parseFloat(commissionDetails.voBonusElectricVehicle.toFixed(2)),
      vpCommission: Number.parseFloat(commissionDetails.vpCommission.toFixed(2)),
      vuCommission: Number.parseFloat(commissionDetails.vuCommission.toFixed(2)),
      financingBonus: Number.parseFloat(commissionDetails.financingBonus.toFixed(2)),
      deliveryPackBonus: Number.parseFloat(commissionDetails.deliveryPackBonus.toFixed(2)),
      packPenetrationBonus: Number.parseFloat(commissionDetails.packPenetrationBonus.toFixed(2)),
      cldBonus: Number.parseFloat(commissionDetails.cldBonus.toFixed(2)),
      maintenanceContractBonus: Number.parseFloat(commissionDetails.maintenanceContractBonus.toFixed(2)),
      coyoteBonus: Number.parseFloat(commissionDetails.coyoteBonus.toFixed(2)),
      accessoryBonus: Number.parseFloat(commissionDetails.accessoryBonus.toFixed(2)),
    },
  }

  // Ajout des champs VN si applicables
  if (vnMarginPercentage !== undefined) result.vnMarginPercentage = vnMarginPercentage
  if (vnCalculatedMargin !== undefined) result.vnCalculatedMargin = Number.parseFloat(vnCalculatedMargin.toFixed(2))
  if (vnTotalOptionsHT !== undefined) result.vnTotalOptionsHT = Number.parseFloat(vnTotalOptionsHT.toFixed(2))
  if (vnTotalOptionsTTC !== undefined) result.vnTotalOptionsTTC = Number.parseFloat(vnTotalOptionsTTC.toFixed(2))
  if (vnTotalDiscountsHT !== undefined) result.vnTotalDiscountsHT = Number.parseFloat(vnTotalDiscountsHT.toFixed(2))
  if (vnTotalDiscountsTTC !== undefined) result.vnTotalDiscountsTTC = Number.parseFloat(vnTotalDiscountsTTC.toFixed(2))
  if (vnFordRecoveryTotal !== undefined) result.vnFordRecoveryTotal = Number.parseFloat(vnFordRecoveryTotal.toFixed(2))

  return result
}

export function getMarginSheets(): MarginSheet[] {
  if (typeof window === "undefined") return []
  try {
    const storedSheets = localStorage.getItem(MARGIN_SHEETS_STORAGE_KEY)
    return storedSheets ? JSON.parse(storedSheets) : []
  } catch (error) {
    console.error("Failed to load margin sheets from localStorage:", error)
    return []
  }
}

export function saveMarginSheets(sheets: MarginSheet[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(MARGIN_SHEETS_STORAGE_KEY, JSON.stringify(sheets))
  } catch (error) {
    console.error("Failed to save margin sheets to localStorage:", error)
  }
}