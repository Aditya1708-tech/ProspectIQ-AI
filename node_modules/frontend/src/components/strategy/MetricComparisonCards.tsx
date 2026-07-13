import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { ProjectedMetric } from '../../services/ai-client.js';

interface MetricComparisonCardsProps {
  metrics: Record<string, ProjectedMetric>;
}

export const MetricComparisonCards: React.FC<MetricComparisonCardsProps> = ({ metrics }) => {
  const displayMetrics = [
    { key: "relationshipHealth", name: "Relationship Health Index", format: "%" },
    { key: "churnProbability", name: "Attrition Churn Risk", format: "%", invertColors: true },
    { key: "savingsHealth", name: "Savings Health Index", format: "%" },
    { key: "priorityScore", name: "Priority Attention Score", format: "%" },
    { key: "opportunityScore", name: "Opportunity Value", format: "%" },
    { key: "digitalAdoption", name: "Digital Adoption", format: "%" }
  ];

  return (
    <div className="space-y-3.5">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Before vs After Comparisons</span>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {displayMetrics.map(item => {
          const metric = metrics[item.key];
          if (!metric) return null;

          const isDiffPositive = item.invertColors ? metric.difference < 0 : metric.difference > 0;
          const diffColor = metric.difference === 0 ? 'text-slate-500' : (isDiffPositive ? 'text-emerald-400' : 'text-rose-400');
          const ArrowIcon = metric.difference >= 0 ? ArrowUpRight : ArrowDownRight;

          return (
            <div key={item.key} className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-colors duration-200 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">{item.name}</span>
                <span className={`flex items-center gap-0.5 text-[10px] font-black font-mono ${diffColor}`}>
                  {metric.difference > 0 ? '+' : ''}{metric.difference}{item.format}
                  <ArrowIcon className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="flex items-baseline space-x-3.5 pt-1">
                <div>
                  <span className="text-[8px] text-slate-600 block uppercase font-bold">Current</span>
                  <span className="text-sm font-bold text-slate-400 font-mono">{metric.currentValue}{item.format}</span>
                </div>
                <div className="border-l border-white/5 h-6 self-center" />
                <div>
                  <span className="text-[8px] text-indigo-400 block uppercase font-bold">Projected</span>
                  <span className="text-base font-black text-white font-mono">{metric.projectedValue}{item.format}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
