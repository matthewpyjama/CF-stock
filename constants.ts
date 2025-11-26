import { Location, LocationType, Product } from './types';

// REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
export const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

export const LOCATIONS: Location[] = [
  { id: 'bar2', name: 'Bar 2 (Main Hub)', type: LocationType.MAIN_HUB },
  { id: 'bar1a', name: 'Bar 1a (North)', type: LocationType.SECONDARY_HUB },
  { id: 'bar1b', name: 'Bar 1b (South)', type: LocationType.SECONDARY_HUB },
  { id: 'bar3', name: 'Bar 3 (Garden)', type: LocationType.SECONDARY_HUB },
  { id: 'vip', name: 'VIP Bar', type: LocationType.SATELLITE },
  { id: 'artist', name: 'Artist Lounge', type: LocationType.SATELLITE },
  { id: 'promoter', name: 'Promoter Bar', type: LocationType.SATELLITE },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Heineken Lager', category: 'Beer', caseSize: 24, parLevel: 240 },
  { id: 'p2', name: 'Amstel Light', category: 'Beer', caseSize: 24, parLevel: 120 },
  { id: 'p3', name: 'Grey Goose Vodka', category: 'Spirits', caseSize: 6, parLevel: 18 },
  { id: 'p4', name: 'Jack Daniels', category: 'Spirits', caseSize: 6, parLevel: 12 },
  { id: 'p5', name: 'House White Wine', category: 'Wine', caseSize: 6, parLevel: 24 },
  { id: 'p6', name: 'House Red Wine', category: 'Wine', caseSize: 6, parLevel: 24 },
  { id: 'p7', name: 'Coca Cola', category: 'Mixer', caseSize: 24, parLevel: 48 },
  { id: 'p8', name: 'Tonic Water', category: 'Mixer', caseSize: 24, parLevel: 48 },
];

// Mock User ID for this session
export const CURRENT_USER_ID = 'user_session_' + Math.floor(Math.random() * 10000);