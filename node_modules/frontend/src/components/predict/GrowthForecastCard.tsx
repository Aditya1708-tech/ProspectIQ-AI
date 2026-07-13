import React from 'react';
import { ArrowUpRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { GrowthPrediction } from '../../services/ai-client.js';

interface GrowthForecastCardProps {
  growth: GrowthPrediction;
}

export const GrowthForecastCard: React.FC<GrowthForecastCardProps> = ({ growth }) => {
  const { growthScore, growthCategory, growthDrivers, growthRisks } = growth;

  const getGrowthColor = (category: string) => {
    switch (category) {
      case 'Accelerating': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Growing': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'Stable': return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  const colorStyle = getGrowthColor(growthCategory);

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Growth Potential</span>
          <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${colorStyle}`}>
            {growthCategory}
          </span>
        </div>

        {/* Growth Score Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Overall Growth Index</span>
            <span className="font-mono text-white text-xs">{growthScore.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5 relative">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-1000"
              style={{ width: `${growthScore}%` }}
            />
          </div>
        </div>

        {/* Positive Drivers */}
        <div className="space-y-2">
          <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Growth Drivers</span>
          </span>
          <div className="space-y-1.5">
            {growthDrivers.map((driver: string, idx: number) => (
              <p key={idx} className="text-[10px] text-slate-300 font-semibold leading-relaxed pl-2 border-l border-emerald-500/40">
                {driver}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Risks block if any exist */}
      {growthRisks.length > 0 && (
        <div className="pt-4 border-t border-white/5 space-y-2">
          <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Growth Barriers</span>
          </span>
          <div className="space-y-1">
            {growthRisks.map((risk: string, idx: number) => (
              <p key={idx} className="text-[10px] text-slate-400 font-medium leading-relaxed">
                {risk}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
