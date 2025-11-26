import React, { useState } from 'react';
import { PRODUCTS, LOCATIONS, CURRENT_USER_ID } from '../constants';
import { DataService } from '../services/dataService';
import { LocationType } from '../types';

export const Transfers: React.FC = () => {
  const [sourceId, setSourceId] = useState('bar2'); // Default to Main Hub
  const [targetId, setTargetId] = useState(LOCATIONS.filter(l => l.id !== 'bar2')[0].id);
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<'IDLE' | 'SAVING' | 'DONE'>('IDLE');

  const selectedProduct = PRODUCTS.find(p => p.id === productId);

  const handleTransfer = async () => {
    if (quantity <= 0) return;
    if (sourceId === targetId) return;

    setStatus('SAVING');
    await DataService.logTransfer({
      sourceLocationId: sourceId,
      targetLocationId: targetId,
      productId,
      quantityUnits: quantity,
      timestamp: Date.now(),
      userId: CURRENT_USER_ID
    });
    setStatus('DONE');
    
    // Reset form partially
    setTimeout(() => {
      setStatus('IDLE');
      setQuantity(1);
    }, 2000);
  };

  // Helper to ensure Hub & Spoke compliance visual cues
  const getSourceLabel = () => {
    const loc = LOCATIONS.find(l => l.id === sourceId);
    if (loc?.type === LocationType.SATELLITE) {
      return `${loc.name} (Warning: Typically receives stock only)`;
    }
    return loc?.name;
  };

  if (status === 'DONE') {
    return (
       <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Transfer Logged!</h2>
        <p className="text-slate-400 text-center px-8">
            Moved {quantity} {selectedProduct?.name} <br/>
            from {LOCATIONS.find(l => l.id === sourceId)?.name} <br/>
            to {LOCATIONS.find(l => l.id === targetId)?.name}
        </p>
        <button onClick={() => setStatus('IDLE')} className="mt-8 text-indigo-400 font-bold">New Transfer</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">New Stock Transfer</h2>

      <div className="space-y-4">
        {/* Source */}
        <div className="space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">From (Source)</label>
            <select 
                value={sourceId} 
                onChange={e => setSourceId(e.target.value)}
                className="w-full bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none"
            >
                {LOCATIONS.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                ))}
            </select>
        </div>

        {/* Target */}
        <div className="space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">To (Destination)</label>
            <select 
                value={targetId} 
                onChange={e => setTargetId(e.target.value)}
                className="w-full bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none"
            >
                {LOCATIONS.filter(l => l.id !== sourceId).map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                ))}
            </select>
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Product */}
      <div className="space-y-1">
        <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Item to move</label>
        <select 
            value={productId} 
            onChange={e => setProductId(e.target.value)}
            className="w-full bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none"
        >
            {PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
            ))}
        </select>
      </div>

      {/* Quantity */}
      <div className="space-y-1">
        <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Units (Bottles/Cans)</label>
        <div className="flex items-center space-x-3">
             <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl font-bold border border-slate-700 active:bg-slate-700"
             >-</button>
             <input 
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-slate-900 text-center text-2xl font-mono text-white p-3 rounded-xl border border-slate-700 h-14"
             />
             <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white active:bg-indigo-500 shadow-lg shadow-indigo-600/20"
             >+</button>
        </div>
        {selectedProduct && (
            <p className="text-xs text-center text-slate-500 mt-2">
                This equals {(quantity / selectedProduct.caseSize).toFixed(1)} cases
            </p>
        )}
      </div>

      <button 
        disabled={status === 'SAVING'}
        onClick={handleTransfer}
        className="w-full bg-white text-indigo-900 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all text-lg mt-8 disabled:opacity-50"
      >
        {status === 'SAVING' ? 'Processing...' : 'Confirm Transfer'}
      </button>
    </div>
  );
};
