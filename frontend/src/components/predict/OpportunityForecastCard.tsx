import React from 'react';
import { Briefcase, Coins, Sparkles, TrendingUp } from 'lucide-react';
import { OpportunityForecast } from '../../services/ai-client.js';

interface OpportunityForecastCardProps {
  opportunity: OpportunityForecast;
}

export const OpportunityForecastCard: React.FC<OpportunityForecastCardProps> = ({ opportunity }) => {
  const {
    futureOpportunityScore,
    futureWealthPotential,
    futurePriority,
    expectedRMAttentionLevel,
    expectedRelationshipValue
  } = opportunity;

  const getAttentionColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Medium': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(expectedRelationshipValue);

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="h-4.5 w-4.5 text-teal-400" />
            <span>Opportunity Valuation</span>
          </span>
          <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${getAttentionColor(expectedRMAttentionLevel)}`}>
            {expectedRMAttentionLevel} RM Attention
          </span>
        </div>

        {/* Forecasted valuation indicator */}
        <div className="space-y-1">
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Projected Relationship Value (INR)</span>
          <div className="text-xl font-black text-white font-mono tracking-tight leading-none pt-0.5">
            {formattedValue}
          </div>
          <span className="text-[9px] text-slate-400 font-medium leading-relaxed block mt-1">Based on projected capital deposits and annualized turnover.</span>
        </div>

        {/* Wealth and Opportunity Score grid */}
        <div className="grid grid-cols-2 gap-3.5 pt-1.5">
          <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-3">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Opportunity score</span>
            <span className="text-sm font-black text-white font-mono mt-1 block">{futureOpportunityScore.toFixed(0)}%</span>
          </div>

          <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-3">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Wealth Potential</span>
            <span className="text-sm font-black text-teal-400 font-mono mt-1 block">{futureWealthPotential.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
        <span>Projected Priority Index:</span>
        <span className="text-white font-mono">{futurePriority.toFixed(0)}%</span>
      </div>
    </div>
  );
};
