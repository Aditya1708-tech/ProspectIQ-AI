import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface ConfidencePanelProps {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const ConfidencePanel: React.FC<ConfidencePanelProps> = ({ confidence }) => {
  const getIntegrityScore = (conf: string) => {
    if (conf === 'HIGH') return { score: 92, text: 'Optimal', color: 'bg-emerald-500', badge: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    if (conf === 'MEDIUM') return { score: 74, text: 'Standard', color: 'bg-indigo-500', badge: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' };
    return { score: 45, text: 'Deficient', color: 'bg-amber-500', badge: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
  };

  const cal = getIntegrityScore(confidence);

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-5 h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
            <span>Simulation Confidence</span>
          </span>
          <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${cal.badge}`}>
            {confidence}
          </span>
        </div>

        {/* Breakdown bar */}
        <div className="space-y-3.5 pt-1">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
              <span>Overall Integrity Score</span>
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-slate-500 text-[9px] uppercase font-bold">{cal.text}</span>
                <span className="text-white font-bold">{cal.score}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full ${cal.color} rounded-full transition-all duration-1000`}
                style={{ width: `${cal.score}%` }}
              />
            </div>
          </div>

          <div className="flex items-start space-x-1.5 text-[9px] text-slate-400 font-medium leading-relaxed">
            <Info className="h-3.5 w-3.5 text-indigo-500/50 mt-0.5 flex-shrink-0" />
            <p>
              Confidence parameters reflect historical customer response stability, profile data completeness, and overall simulation parameter adjustments complexity.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[8px] text-slate-500 font-black uppercase tracking-wider">
        <span>Model Version:</span>
        <span className="text-white font-mono">SimIQ v1.0</span>
      </div>
    </div>
  );
};
