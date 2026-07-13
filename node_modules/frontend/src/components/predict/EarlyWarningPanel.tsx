import React from 'react';
import { AlertCircle, ShieldAlert, Sparkles, Bell } from 'lucide-react';
import { EarlyWarning } from '../../services/ai-client.js';

interface EarlyWarningPanelProps {
  earlyWarnings: EarlyWarning[];
}

export const EarlyWarningPanel: React.FC<EarlyWarningPanelProps> = ({ earlyWarnings }) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Bell className="h-4.5 w-4.5 text-rose-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Predictive Early Warning Signals</h4>
        </div>
        <span className="text-[9px] font-mono text-slate-500 font-extrabold uppercase">
          {earlyWarnings.length} Flags Active
        </span>
      </div>

      {/* Warnings List */}
      <div className="space-y-3">
        {earlyWarnings.map((warning, idx) => {
          const isBaseline = warning.id === 'EW-NONE';
          return (
            <div key={idx} className="bg-slate-950/30 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors duration-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {!isBaseline && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
                  <span>{warning.type}</span>
                </span>
                <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${getSeverityStyle(warning.severity)}`}>
                  {warning.severity} Severity
                </span>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                {warning.description}
              </p>

              {!isBaseline && (
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Trigger probability:</span>
                  <span className="text-white font-mono">{warning.probability.toFixed(0)}%</span>
                  <span>Days to trigger:</span>
                  <span className="text-white font-mono">{warning.daysToTrigger} Days</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
