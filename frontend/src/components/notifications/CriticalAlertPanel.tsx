import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { NotificationItem } from './NotificationCard.js';

interface CriticalAlertPanelProps {
  alerts: NotificationItem[];
  onAcknowledge: (id: string) => void;
}

export const CriticalAlertPanel: React.FC<CriticalAlertPanelProps> = ({ alerts, onAcknowledge }) => {
  const criticalOnly = alerts.filter(a => a.priority === 'CRITICAL' || a.priority === 'HIGH');

  return (
    <div className="bg-slate-900/20 border border-white/5 rounded-3xl p-6 space-y-4">
      <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center space-x-1.5 block">
        <AlertCircle className="h-4 w-4 text-rose-500 animate-bounce" />
        <span>Critical Action Queue</span>
      </span>

      {criticalOnly.length === 0 ? (
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 text-center space-y-2">
          <ShieldAlert className="h-8 w-8 text-slate-700 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">No critical queue alerts pending. All SLAs on track.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {criticalOnly.map(alert => (
            <div 
              key={alert.id} 
              className="bg-slate-950/60 border border-rose-500/20 rounded-2xl p-4 space-y-3 relative overflow-hidden transition-all hover:border-rose-500/35"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-rose-500" />
              
              <div className="flex justify-between items-start pl-2">
                <div>
                  <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider block">
                    {alert.category.replace(/_/g, ' ')}
                  </span>
                  <h4 className="font-bold text-xs text-white">
                    {alert.title}
                  </h4>
                </div>
                
                <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase rounded">
                  {alert.priority}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 pl-2 leading-relaxed font-semibold">
                {alert.description}
              </p>

              {!alert.acknowledgedStatus && (
                <div className="pl-2 pt-2 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 text-[10px] font-black rounded-lg uppercase cursor-pointer transition-colors"
                  >
                    Acknowledge
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
