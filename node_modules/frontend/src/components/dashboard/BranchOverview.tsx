import React from 'react';
import { Landmark, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';
import { BranchKPI } from '../../services/ai-client.js';

interface BranchOverviewProps {
  branches: BranchKPI[];
}

export const BranchOverview: React.FC<BranchOverviewProps> = ({ branches }) => {
  const getRatingStyle = (rating: string) => {
    if (rating === 'High') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (rating === 'Stable') return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header and highlights indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-white/5 gap-4">
        <div className="flex items-center space-x-2">
          <Landmark className="h-4.5 w-4.5 text-indigo-400" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Branch Performance Overview</h4>
            <p className="text-[9px] text-slate-500 font-medium block mt-0.5">Comparative analytics across branch networks</p>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1.5 p-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-[9px]">
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-400 font-medium">Top Branch:</span>
            <strong className="text-emerald-400 font-bold font-mono">BR001</strong>
          </div>

          <div className="flex items-center space-x-1.5 p-2 bg-rose-500/5 border border-rose-500/15 rounded-xl text-[9px]">
            <Award className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-slate-400 font-medium">Needs Attention:</span>
            <strong className="text-rose-400 font-bold font-mono">BR003</strong>
          </div>
        </div>
      </div>

      {/* Grid columns */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-white/5 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-2.5">Branch</th>
              <th className="py-2.5">Customers</th>
              <th className="py-2.5">Avg Trust</th>
              <th className="py-2.5">Avg Health</th>
              <th className="py-2.5">Avg Workload</th>
              <th className="py-2.5 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {branches.map((b, idx) => (
              <tr key={idx} className="text-[10px] font-medium text-slate-300 hover:bg-slate-950/10 transition-colors duration-150">
                <td className="py-3 font-bold text-white flex items-center space-x-2">
                  <span className="p-1 bg-slate-950 border border-white/5 rounded-lg block">
                    <Landmark className="h-3.5 w-3.5 text-indigo-400" />
                  </span>
                  <span>{b.branchName}</span>
                </td>
                <td className="py-3 font-mono text-slate-400">{b.customerCount}</td>
                <td className="py-3 font-mono text-slate-400">{b.averageTrustScore}%</td>
                <td className="py-3 font-mono text-slate-400">{b.averageRelationshipHealth}%</td>
                <td className="py-3 font-mono text-slate-400">{b.averageRMWorkload} accounts/RM</td>
                <td className="py-3 text-right">
                  <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${getRatingStyle(b.performanceRating)}`}>
                    {b.performanceRating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
