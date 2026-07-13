import React from 'react';
import { Users, Briefcase, Coins, Landmark, ShieldCheck, Heart } from 'lucide-react';
import { BusinessImpact } from '../../services/ai-client.js';

interface ImpactAnalysisCardProps {
  impact: BusinessImpact;
}

export const ImpactAnalysisCard: React.FC<ImpactAnalysisCardProps> = ({ impact }) => {
  const impactsList = [
    { label: "Customer Relationship Impact", desc: impact.customerImpact, icon: <Users className="h-4 w-4 text-emerald-400" /> },
    { label: "RM Service Performance", desc: impact.rmImpact, icon: <Briefcase className="h-4 w-4 text-indigo-400" /> },
    { label: "Deposit & Portfolio Value", desc: impact.portfolioImpact, icon: <Coins className="h-4 w-4 text-amber-400" /> },
    { label: "Branch Health index", desc: impact.branchImpact, icon: <Landmark className="h-4 w-4 text-teal-400" /> },
    { label: "Compliance & Ops Safeguard", desc: impact.operationalImpact, icon: <ShieldCheck className="h-4 w-4 text-rose-400" /> },
    { label: "Relationship Trajectory", desc: impact.relationshipImpact, icon: <Heart className="h-4 w-4 text-purple-400" /> }
  ];

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 h-full">
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <Users className="h-4.5 w-4.5 text-indigo-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Business Impact Evaluation</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {impactsList.map((item, idx) => (
          <div key={idx} className="bg-slate-950/20 border border-white/5 rounded-2xl p-4 space-y-2 hover:border-white/10 transition-colors duration-200">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-slate-900 border border-white/5 rounded-lg block">
                {item.icon}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
