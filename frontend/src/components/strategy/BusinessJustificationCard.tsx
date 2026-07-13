import React from 'react';
import { HelpCircle, Cpu, BarChart3, TrendingUp } from 'lucide-react';
import type { NBAIQBusinessJustification } from '../../services/api.js';

interface BusinessJustificationCardProps {
  justification: NBAIQBusinessJustification;
}

export const BusinessJustificationCard: React.FC<BusinessJustificationCardProps> = ({ justification }) => {
  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Decision Rationale & Drivers</span>
      
      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-2xl rounded-full" />
        
        <div className="flex items-start space-x-3">
          <HelpCircle className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Why this action exists</span>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              {justification.whyThisActionExists}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-white/5">
          {/* Triggering Engine */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-teal-400" />
              <span>Triggering Engine</span>
            </span>
            <span className="text-xs font-bold text-slate-200 block">
              {justification.triggeringEngine}
            </span>
          </div>

          {/* Contributing Metrics */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-amber-500" />
              <span>Contributing Metrics</span>
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {justification.contributingMetrics.map((metric: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-950 border border-white/5 rounded text-[8px] font-bold font-mono text-slate-400">
                  {metric}
                </span>
              ))}
            </div>
          </div>

          {/* Expected Benefit */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
              <span>Relationship Benefit</span>
            </span>
            <span className="text-xs text-slate-300 block font-medium leading-normal">
              {justification.expectedBenefit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
