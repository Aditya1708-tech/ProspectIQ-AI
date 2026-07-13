import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { RelationshipForecast } from '../../services/ai-client.js';

interface ForecastHeroCardProps {
  relationship: RelationshipForecast;
}

export const ForecastHeroCard: React.FC<ForecastHeroCardProps> = ({ relationship }) => {
  const {
    predictedHealth,
    predictedStage,
    momentum,
    predictedEngagement,
    sentiment,
    rmCoverage,
    expectedDirection
  } = relationship;

  const isUpward = expectedDirection === 'Upward';
  const isDownward = expectedDirection === 'Downward';

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
              <span>Projected Relationship Outlook</span>
            </span>
            <h3 className="text-xl font-black text-white tracking-tight leading-tight">{predictedStage}</h3>
          </div>

          <span className={`px-2.5 py-1 border rounded-xl text-[10px] font-black uppercase flex items-center gap-1
            ${isUpward ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              isDownward ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
              'bg-slate-500/10 text-slate-400 border-slate-500/20'
            }`}
          >
            {isUpward && <ArrowUpRight className="h-3 w-3" />}
            {isDownward && <ArrowDownRight className="h-3 w-3" />}
            {!isUpward && !isDownward && <TrendingUp className="h-3 w-3" />}
            <span>{expectedDirection} Direction</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-3 text-center">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Health Trajectory</span>
            <span className="text-lg font-black text-white font-mono mt-0.5 block">{predictedHealth.toFixed(0)}%</span>
          </div>

          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-3 text-center">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Momentum Score</span>
            <span className="text-lg font-black text-indigo-400 font-mono mt-0.5 block">{momentum.toFixed(0)}%</span>
          </div>

          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-3 text-center">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Sentiment Profile</span>
            <span className={`text-xs font-black mt-1.5 block uppercase tracking-wide
              ${sentiment === 'Positive' ? 'text-emerald-400' : sentiment === 'Negative' ? 'text-rose-400' : 'text-slate-400'}`}
            >
              {sentiment}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
        <span>RM Telemetry Coverage:</span>
        <span className="font-mono text-white text-xs">{rmCoverage.toFixed(0)}% Density</span>
      </div>
    </div>
  );
};
