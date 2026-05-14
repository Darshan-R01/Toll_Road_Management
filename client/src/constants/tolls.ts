/**
 * Professional Transit Database for Bangalore Cluster
 * Expanded to 8 Plazas covering major corridors
 */
export const TOLL_PLAZAS = [
  { id: 'kial_01', name: 'KIAL Airport Toll', basePrice: 110 },
  { id: 'ecity_01', name: 'Electronic City Phase 1', basePrice: 55 },
  { id: 'nice_01', name: 'NICE Road (PESIT)', basePrice: 45 },
  { id: 'nice_02', name: 'NICE Road (ECity Entry)', basePrice: 50 },
  { id: 'nela_01', name: 'Nelamangala Toll', basePrice: 30 },
  { id: 'hosur_01', name: 'Attibele Toll Plaza', basePrice: 75 },
  { id: 'hoskote_01', name: 'Hoskote Toll Plaza', basePrice: 25 },
  { id: 'peenya_01', name: 'Peenya Elevated Expressway', basePrice: 25 },
];

// Define Vehicle Classes and their Fare Multipliers
export const VEHICLE_CLASSES = {
  car: { id: 'car', label: 'Car / Jeep', multiplier: 1 },
  lcv: { id: 'lcv', label: 'LCV / Minibus', multiplier: 1.5 },
  truck: { id: 'truck', label: 'Bus / Truck', multiplier: 3 },
  heavy: { id: 'heavy', label: 'Multi-Axle', multiplier: 4 },
};

export type VehicleType = keyof typeof VEHICLE_CLASSES;

export const VEHICLE_CONFIG = {
  CAR: { label: 'Car / Jeep', multiplier: 1.0, icon: 'Car' },
  LCV: { label: 'Mini Bus / LCV', multiplier: 1.5, icon: 'Truck' },
  TRUCK: { label: 'Truck / Bus', multiplier: 3.0, icon: 'Bus' },
  HEAVY: { label: 'Multi-Axle', multiplier: 4.5, icon: 'Heavy' },
};

export const VEHICLE_MULTIPLIERS = {
  CAR: 1.0,
  LCV: 1.5,
  BUS: 3.0,
  TRUCK: 3.0,
  HEAVY: 4.5
};

export const calculateProfessionalFare = (basePrice: number, vehicleType: string) => {
  const multiplier = VEHICLE_CONFIG[vehicleType as keyof typeof VEHICLE_CONFIG]?.multiplier || 1;
  return Math.round(basePrice * multiplier);
};

export const getProfessionalFare = (base: number, type: string) => {
  const multiplier = VEHICLE_MULTIPLIERS[type as keyof typeof VEHICLE_MULTIPLIERS] || 1;
  return base * multiplier;
};

// The dynamic fare calculation function
export const calculateFare = (entry: string, exit: string, vehicleType: VehicleType) => {
  // Guard Clause: Professional error handling for same-point transit
  if (entry === exit) {
    return 0;
  }

  const entryPlaza = TOLL_PLAZAS.find((p) => p.name === entry);
  const exitPlaza = TOLL_PLAZAS.find((p) => p.name === exit);

  if (!entryPlaza || !exitPlaza) return 0;

  // Algorithmic Pricing: Base + Premium for point-to-point distance
  const baseCost = Math.round(((entryPlaza.basePrice + exitPlaza.basePrice) / 2) * 1.25);

  // Apply vehicle weight multiplier
  const multiplier = VEHICLE_CLASSES[vehicleType].multiplier;
  return Math.round(baseCost * multiplier);
};