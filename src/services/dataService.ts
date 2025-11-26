import { StockCountEntry, TransferLog, IncidentLog } from '../types';
import { GOOGLE_SHEETS_API_URL } from '../constants';

const STORAGE_KEYS = {
  STOCK: 'cf25_stock_logs',
  TRANSFERS: 'cf25_transfers',
  INCIDENTS: 'cf25_incidents',
};

// Helper to send data to Google Sheets
const sendToGoogleSheet = async (action: string, payload: any) => {
  if (GOOGLE_SHEETS_API_URL.includes('YOUR_SCRIPT_ID')) {
    console.warn('Google Sheets API URL not configured. Data saved locally only.');
    return;
  }

  try {
    // We use no-cors mode because Google Apps Script Web Apps are opaque.
    // This means we won't get a readable response, but the POST will succeed.
    await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        data: payload
      }),
    });
    console.log(`Successfully sent ${action} to Google Sheet`);
  } catch (error) {
    console.error('Failed to sync with Google Sheet:', error);
    // In a production app, you might want to queue these for retry
  }
};

export const DataService = {
  // --- Stock Counts ---
  getRecentStockCounts: (): StockCountEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STOCK);
    return data ? JSON.parse(data) : [];
  },

  logStockCount: async (entry: Omit<StockCountEntry, 'id'>): Promise<void> => {
    // 1. Save Locally (for UI immediate update)
    const logs = DataService.getRecentStockCounts();
    const newEntry: StockCountEntry = { ...entry, id: crypto.randomUUID() };
    logs.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(logs));

    // 2. Send to Google Sheet
    // According to PDF logic, we only send totalUnits (btls), but sending full breakdown helps auditing.
    await sendToGoogleSheet('LOG_STOCK', newEntry);
  },

  // --- Transfers ---
  getTransfers: (): TransferLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
    return data ? JSON.parse(data) : [];
  },

  logTransfer: async (transfer: Omit<TransferLog, 'id' | 'status'>): Promise<void> => {
    // 1. Save Locally
    const logs = DataService.getTransfers();
    const newTransfer: TransferLog = { ...transfer, id: crypto.randomUUID(), status: 'COMPLETED' };
    logs.push(newTransfer);
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(logs));

    // 2. Send to Google Sheet
    await sendToGoogleSheet('LOG_TRANSFER', newTransfer);
  },

  // --- Incidents (Wastage) ---
  getIncidents: (): IncidentLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return data ? JSON.parse(data) : [];
  },

  logIncident: async (incident: Omit<IncidentLog, 'id'>): Promise<void> => {
    // 1. Save Locally
    const logs = DataService.getIncidents();
    const newIncident: IncidentLog = { ...incident, id: crypto.randomUUID() };
    logs.push(newIncident);
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(logs));

    // 2. Send to Google Sheet
    await sendToGoogleSheet('LOG_INCIDENT', newIncident);
  },
  
  // --- Analysis Helpers (Local Only) ---
  getLocationStockLevel: (locationId: string, productId: string): number => {
    // This provides a local approximation for the UI. 
    // The "True" variance is calculated in the backend sheet.
    
    const counts = DataService.getRecentStockCounts()
      .filter(c => c.locationId === locationId && c.productId === productId)
      .sort((a, b) => b.timestamp - a.timestamp);
      
    const lastCount = counts[0] ? counts[0].totalUnits : 0;
    
    // Calculate net transfers since last count 
    const transfers = DataService.getTransfers();
    const incoming = transfers
      .filter(t => t.targetLocationId === locationId && t.productId === productId)
      .reduce((sum, t) => sum + t.quantityUnits, 0);
      
    const outgoing = transfers
      .filter(t => t.sourceLocationId === locationId && t.productId === productId)
      .reduce((sum, t) => sum + t.quantityUnits, 0);

    return lastCount + incoming - outgoing;
  }
};