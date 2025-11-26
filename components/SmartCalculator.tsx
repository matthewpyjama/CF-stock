import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface SmartCalculatorProps {
  product: Product;
  onChange: (totalUnits: number, cases: number, loose: number) => void;
  initialCases?: number;
  initialLoose?: number;
}

export const SmartCalculator: React.FC<SmartCalculatorProps> = ({ 
  product, 
  onChange,
  initialCases = 0,
  initialLoose = 0
}) => {
  const [cases, setCases] = useState(initialCases);
  const [loose, setLoose] = useState(initialLoose);

  useEffect(() => {
    const total = (cases * product.caseSize) + loose;
    onChange(total, cases, loose);
  }, [cases, loose, product.caseSize, onChange]);

  const incrementCases = () => setCases(c => c + 1);
  const decrementCases = () => setCases(c => Math.max(0, c - 1));
  const incrementLoose = () => setLoose(l => l + 1);
  const decrementLoose = () => setLoose(l => Math.max(0, l - 1));

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-white">{product.name}</h3>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
          {product.caseSize} / case
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Cases Input */}
        <div className="flex flex-col items-center space-y-2">
          <label className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Cases</label>
          <div className="flex items-center space-x-2">
            <button 
              onClick={decrementCases}
              className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-bold text-xl flex items-center justify-center transition-colors touch-manipulation"
            >
              -
            </button>
            <input 
              type="number" 
              value={cases}
              onChange={(e) => setCases(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-14 text-center bg-slate-900 border border-slate-600 rounded-lg py-2 text-white font-mono text-lg"
            />
            <button 
              onClick={incrementCases}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-400 text-white font-bold text-xl flex items-center justify-center transition-colors touch-manipulation"
            >
              +
            </button>
          </div>
        </div>

        {/* Loose Input */}
        <div className="flex flex-col items-center space-y-2">
          <label className="text-xs text-sky-300 font-semibold uppercase tracking-wider">Loose</label>
          <div className="flex items-center space-x-2">
            <button 
              onClick={decrementLoose}
              className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-bold text-xl flex items-center justify-center transition-colors touch-manipulation"
            >
              -
            </button>
            <input 
              type="number" 
              value={loose}
              onChange={(e) => setLoose(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-14 text-center bg-slate-900 border border-slate-600 rounded-lg py-2 text-white font-mono text-lg"
            />
            <button 
              onClick={incrementLoose}
              className="w-10 h-10 rounded-full bg-sky-600 hover:bg-sky-500 active:bg-sky-400 text-white font-bold text-xl flex items-center justify-center transition-colors touch-manipulation"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center">
        <span className="text-sm text-slate-400">Total Units:</span>
        <span className="text-xl font-bold text-green-400 font-mono">
          {(cases * product.caseSize) + loose}
        </span>
      </div>
    </div>
  );
};
