// Static stock data — requires DMS integration for live data

export interface StockTransfer {
  id: string
  vehicleModel: string
  vehicleVin: string
  fromDealership: string
  fromDealershipName: string
  toDealership: string
  toDealershipName: string
  requestedBy: string
  requestedAt: string
  status: "pending" | "approved" | "in_transit" | "completed" | "rejected"
  reason: string
}

export interface StockItem {
  id: string
  model: string
  variant: string
  vin: string
  dealershipId: string
  dealershipName: string
  category: "VN" | "VO" | "VU"
  daysInStock: number
  price: number
  status: "available" | "reserved" | "in_transit"
  arrivalDate: string
}

export const stockTransfers: StockTransfer[] = [
  {
    id: "st-1",
    vehicleModel: "Ford Puma ST-Line",
    vehicleVin: "WF0XXXGCDXLA12345",
    fromDealership: "dealership-creteil",
    fromDealershipName: "Ford Créteil",
    toDealership: "dealership-paris-est",
    toDealershipName: "Ford Paris Est",
    requestedBy: "Marie Dubois",
    requestedAt: "2024-02-19T14:30:00Z",
    status: "pending",
    reason: "Client en attente à Paris Est, stock disponible à Créteil"
  },
  {
    id: "st-2",
    vehicleModel: "Ford Mustang Mach-E",
    vehicleVin: "3FMTK3SU1NMA98765",
    fromDealership: "dealership-versailles",
    fromDealershipName: "Ford Versailles",
    toDealership: "dealership-saint-denis",
    toDealershipName: "Ford Saint-Denis",
    requestedBy: "Emma Leroy",
    requestedAt: "2024-02-18T09:15:00Z",
    status: "in_transit",
    reason: "Demande client urgent"
  },
  {
    id: "st-3",
    vehicleModel: "Ford Kuga PHEV",
    vehicleVin: "WF0XXXGCDXLA67890",
    fromDealership: "dealership-paris-ouest",
    fromDealershipName: "Ford Paris Ouest",
    toDealership: "dealership-evry",
    toDealershipName: "Ford Évry",
    requestedBy: "Thomas Garcia",
    requestedAt: "2024-02-17T11:00:00Z",
    status: "completed",
    reason: "Rééquilibrage stock"
  }
]

export const stockItems: StockItem[] = [
  { id: "s1", model: "Ford Puma", variant: "ST-Line 1.0 EcoBoost", vin: "WF0XXX...12345", dealershipId: "dealership-paris-est", dealershipName: "Ford Paris Est", category: "VN", daysInStock: 15, price: 32500, status: "available", arrivalDate: "2024-02-05" },
  { id: "s2", model: "Ford Kuga", variant: "PHEV Titanium", vin: "WF0XXX...23456", dealershipId: "dealership-paris-est", dealershipName: "Ford Paris Est", category: "VN", daysInStock: 45, price: 45900, status: "available", arrivalDate: "2024-01-05" },
  { id: "s3", model: "Ford Mustang Mach-E", variant: "Extended Range AWD", vin: "3FMTK3...34567", dealershipId: "dealership-versailles", dealershipName: "Ford Versailles", category: "VN", daysInStock: 8, price: 68500, status: "reserved", arrivalDate: "2024-02-12" },
  { id: "s4", model: "Ford Focus", variant: "Active 1.0 EcoBoost", vin: "WF0XXX...45678", dealershipId: "dealership-creteil", dealershipName: "Ford Créteil", category: "VN", daysInStock: 62, price: 29900, status: "available", arrivalDate: "2023-12-20" },
  { id: "s5", model: "Ford Fiesta", variant: "ST-Line X", vin: "WF0XXX...56789", dealershipId: "dealership-creteil", dealershipName: "Ford Créteil", category: "VO", daysInStock: 28, price: 18500, status: "available", arrivalDate: "2024-01-23" },
  { id: "s6", model: "Ford Transit Custom", variant: "Limited L2H1", vin: "WF0XXX...67890", dealershipId: "dealership-saint-denis", dealershipName: "Ford Saint-Denis", category: "VU", daysInStock: 35, price: 42000, status: "available", arrivalDate: "2024-01-15" },
  { id: "s7", model: "Ford Ranger", variant: "Wildtrak 2.0 EcoBlue", vin: "WF0XXX...78901", dealershipId: "dealership-evry", dealershipName: "Ford Évry", category: "VU", daysInStock: 12, price: 52500, status: "reserved", arrivalDate: "2024-02-08" },
  { id: "s8", model: "Ford Explorer", variant: "PHEV ST-Line", vin: "WF0XXX...89012", dealershipId: "dealership-paris-ouest", dealershipName: "Ford Paris Ouest", category: "VN", daysInStock: 55, price: 72000, status: "available", arrivalDate: "2023-12-27" },
  { id: "s9", model: "Ford Bronco Sport", variant: "Big Bend", vin: "3FMCR9...90123", dealershipId: "dealership-versailles", dealershipName: "Ford Versailles", category: "VN", daysInStock: 22, price: 38900, status: "available", arrivalDate: "2024-01-28" },
  { id: "s10", model: "Ford Tourneo Connect", variant: "Titanium", vin: "WF0XXX...01234", dealershipId: "dealership-paris-est", dealershipName: "Ford Paris Est", category: "VU", daysInStock: 18, price: 35500, status: "in_transit", arrivalDate: "2024-02-02" }
]
