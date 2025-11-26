import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { TransferLog, IncidentLog } from '../types';
import { GOOGLE_SHEETS_API_URL } from '../constants';

export const Dashboard: React.FC = () => {
  const [transfers, setTransfers] = useState<TransferLog[]>([]);
  const [incidents, setIncidents] = useState<IncidentLog[]>([]);

  useEffect(() => {
    // Load initial data
    setTransfers(DataService.getTransfers());
    setIncidents(DataService.getIncidents());
  }, []);

  const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-slate-400 mt-1 uppercase tracking-wide">{title}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Event Dashboard</h2>
        <p className="text-slate-400 text-sm">Real-time logistics overview</p>
      </div>

      {GOOGLE_SHEETS_API_URL.includes('YOUR_SCRIPT_ID') && (
        <div className="bg-amber-900/50 text-amber-200 p-4 rounded-xl border border-amber-700/50 text-sm">
          <strong>Configuration Required:</strong> Please update <code>GOOGLE_SHEETS_API_URL</code> in <code>constants.ts</code> to connect to your backend sheet.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          title="Transfers" 
          value={transfers.length} 
          color="text-indigo-400" 
        />
        <StatCard 
          title="Wastage Logged" 
          value={incidents.length} 
          color="text-red-400" 
        />
        <StatCard 
          title="Active Bars" 
          value="7" 
          color="text-emerald-400" 
        />
        <StatCard 
          title="Staff Online" 
          value="8" 
          color="text-amber-400" 
        />
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Recent Activity</h3>
        <div className="space-y-2">
          {transfers.slice(-5).reverse().map(t => (
            <div key={t.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex justify-between items-center text-sm">
              <div>
                <span className="text-indigo-400 font-bold">Transfer</span>
                <span className="text-slate-500 mx-2">•</span>
                <span className="text-slate-300">{t.quantityUnits} units</span>
              </div>
              <span className="text-slate-500 text-xs">
                {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {incidents.slice(-5).reverse().map(i => (
             <div key={i.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex justify-between items-center text-sm">
             <div>
               <span className="text-red-400 font-bold">Incident</span>
               <span className="text-slate-500 mx-2">•</span>
               <span className="text-slate-300">{i.reason}</span>
             </div>
             <span className="text-slate-500 text-xs">
               {new Date(i.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
           </div>
          ))}
          {transfers.length === 0 && incidents.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm italic">
              No activity recorded yet for this session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};