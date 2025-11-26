export enum LocationType {
  MAIN_HUB = 'MAIN_HUB',
  SECONDARY_HUB = 'SECONDARY_HUB',
  SATELLITE = 'SATELLITE',
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
}

export interface Product {
  id: string;
  name: string;
  category: 'Beer' | 'Spirits' | 'Wine' | 'Mixer';
  caseSize: number; // e.g., 24 for Beer, 6 for Spirits
  parLevel?: number; // Target stock level
}

export interface StockCountEntry {
  id: string;
  locationId: string;
  productId: string;
  timestamp: number;
  cases: number;
  loose: number;
  totalUnits: number; // Calculated: (cases * caseSize) + loose
  type: 'OPENING' | 'CLOSING';
  userId: string;
}

export interface TransferLog {
  id: string;
  sourceLocationId: string;
  targetLocationId: string;
  productId: string;
  quantityUnits: number; // Total units moved
  timestamp: number;
  userId: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface IncidentLog {
  id: string;
  locationId: string;
  productId: string;
  quantityUnits: number;
  reason: 'WASTAGE' | 'BREAKAGE' | 'THEFT' | 'COMP' | 'OTHER';
  note: string;
  timestamp: number;
}
