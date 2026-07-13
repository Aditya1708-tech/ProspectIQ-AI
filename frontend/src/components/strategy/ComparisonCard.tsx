import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { ComparisonAnalysis } from '../../services/api.js';

interface ComparisonCardProps {
  comparison: ComparisonAnalysis;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ comparison }) => {
  const metrics = [
    { label: 'Priority Score', data: comparison.priorityScore },
    { label: 'Trust Index', data: comparison.trustScore },
    { label: 'Digital Adoption', data: comparison.digitalAdoption },
    { label: 'Wealth Potential', data: comparison.wealthScore },
    { label: 'Growth Rating', data: comparison.growthScore },
    { label: 'Retention Risk', data: comparison.retentionRisk }
  ];

  return (
    <div className="space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Decision Comparison (vs Prior Cycle)</span>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const isUp = m.data.difference > 0;
          
          return (
            <div key={idx} className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 transition-all hover:border-white/10 flex flex-col justify-between space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                  {m.label}
                </span>
                
                <span className={`flex items-center space-x-0.5 text-[9px] font-black uppercase py-0.5 px-1.5 rounded
                  ${m.data.status === 'Improved' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                  ${m.data.status === 'Declined' ? 'bg-rose-500/10 text-rose-400' : ''}
                  ${m.data.status === 'Stable' ? 'bg-slate-800 text-slate-400' : ''}
                `}>
                  {m.data.status === 'Improved' && <ArrowUpRight className="h-3 w-3" />}
                  {m.data.status === 'Declined' && <ArrowDownRight className="h-3 w-3" />}
                  {m.data.status === 'Stable' && <Minus className="h-3 w-3" />}
                  <span>{m.data.status}</span>
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-black text-white">
                  {m.data.currentScore.toFixed(0)}%
                </span>
                <span className="text-[9px] text-slate-500 font-semibold">
                  prev: {m.data.previousScore.toFixed(0)}%
                </span>
                {m.data.difference !== 0 && (
                  <span className={`text-[10px] font-mono font-bold
                    ${isUp ? 'text-emerald-400' : 'text-rose-400'}
                  `}>
                    {isUp ? '+' : ''}{m.data.difference.toFixed(1)}%
                  </span>
                )}
              </div>

              <span className="text-[9px] text-slate-500 italic block leading-snug">
                {m.data.reason}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
