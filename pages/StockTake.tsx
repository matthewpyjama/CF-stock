import React, { useState } from 'react';
import { PRODUCTS, LOCATIONS, CURRENT_USER_ID } from '../constants';
import { DataService } from '../services/dataService';
import { SmartCalculator } from '../components/SmartCalculator';

export const StockTake: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].id);
  const [countType, setCountType] = useState<'OPENING' | 'CLOSING'>('OPENING');
  const [submitted, setSubmitted] = useState(false);
  
  // Local state to track counts before submission
  // Map<ProductId, {cases, loose, total}>
  const [counts, setCounts] = useState<Record<string, { cases: number, loose: number, total: number }>>({});

  const handleCountChange = (productId: string, total: number, cases: number, loose: number) => {
    setCounts(prev => ({
      ...prev,
      [productId]: { cases, loose, total }
    }));
  };

  const handleSubmit = async () => {
    // Transform state to logs
    const entries = Object.entries(counts).map(([productId, data]: [string, { cases: number, loose: number, total: number }]) => ({
      locationId: selectedLocation,
      productId,
      timestamp: Date.now(),
      cases: data.cases,
      loose: data.loose,
      totalUnits: data.total,
      type: countType,
      userId: CURRENT_USER_ID
    }));

    for (const entry of entries) {
      if (entry.totalUnits > 0) {
        await DataService.logStockCount(entry);
      }
    }

    setSubmitted(true);
    // Reset after delay
    setTimeout(() => {
      setSubmitted(false);
      setCounts({});
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Count Submitted!</h2>
        <p className="text-slate-400">Inventory updated successfully.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Stock Take</h2>
        
        {/* Location Select */}
        <div className="bg-slate-800 p-2 rounded-lg flex space-x-2">
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-slate-900 border-none rounded-md text-white py-3 px-4 focus:ring-2 focus:ring-indigo-500"
          >
            {LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setCountType('OPENING')}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${countType === 'OPENING' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Opening
          </button>
          <button 
            onClick={() => setCountType('CLOSING')}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${countType === 'CLOSING' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Closing
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {PRODUCTS.map(product => (
          <SmartCalculator 
            key={product.id} 
            product={product}
            onChange={(total, cases, loose) => handleCountChange(product.id, total, cases, loose)}
          />
        ))}
      </div>

      <button 
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-all text-lg"
      >
        Save Stock Count
      </button>
      <div className="h-4"></div>
    </div>
  );
};