import React, { useState } from 'react';
import { PRODUCTS, LOCATIONS, CURRENT_USER_ID } from '../constants';
import { DataService } from '../services/dataService';

export const Wastage: React.FC = () => {
  const [locationId, setLocationId] = useState(LOCATIONS[0].id);
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState<string>('WASTAGE');
  const [status, setStatus] = useState<'IDLE' | 'SAVING' | 'DONE'>('IDLE');

  const handleSave = async () => {
    setStatus('SAVING');
    await DataService.logIncident({
      locationId,
      productId,
      quantityUnits: quantity,
      reason: reason as any,
      note: '',
      timestamp: Date.now()
    });
    setStatus('DONE');
    setTimeout(() => {
        setStatus('IDLE');
        setQuantity(1);
    }, 2000);
  };

  if (status === 'DONE') {
      return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Incident Logged</h2>
            <p className="text-slate-400">Inventory adjusted for variance.</p>
        </div>
      )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Log Incident</h2>
      <p className="text-sm text-slate-400">Record breakage, spoilage, or theft.</p>

      <div className="space-y-4">
        <div className="space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Location</label>
            <select 
                value={locationId} onChange={e => setLocationId(e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 outline-none"
            >
                {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
        </div>

        <div className="space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Product</label>
            <select 
                value={productId} onChange={e => setProductId(e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 outline-none"
            >
                {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
        </div>

        <div className="space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Reason</label>
            <select 
                value={reason} onChange={e => setReason(e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 outline-none"
            >
                <option value="BREAKAGE">Breakage (Accidental)</option>
                <option value="WASTAGE">Wastage (Spoilage/Pour)</option>
                <option value="THEFT">Suspected Theft</option>
                <option value="COMP">Promo / Comp</option>
            </select>
        </div>

        <div className="space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Units Lost</label>
            <div className="flex items-center space-x-2">
                <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="p-4 bg-slate-800 rounded-xl text-white font-bold text-xl">-</button>
                <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} className="flex-1 p-4 bg-slate-900 rounded-xl text-center text-white font-bold" />
                <button onClick={() => setQuantity(quantity+1)} className="p-4 bg-red-600 rounded-xl text-white font-bold text-xl">+</button>
            </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg mt-8"
      >
        Log Incident
      </button>
    </div>
  );
};
