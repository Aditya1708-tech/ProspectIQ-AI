import React from 'react';
import { MessageSquareCode } from 'lucide-react';
import { SimulationSummary } from '../../services/ai-client.js';

interface ExecutiveSimulationSummaryProps {
  summary: SimulationSummary;
}

export const ExecutiveSimulationSummary: React.FC<ExecutiveSimulationSummaryProps> = ({ summary }) => {
  const { briefing, objective, expectedOutcome, operationalImprovements, potentialRisks } = summary;

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <MessageSquareCode className="h-4.5 w-4.5 text-indigo-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Executive Simulation Summary</h4>
      </div>

      {/* Briefing text block */}
      <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4">
        <p className="text-slate-300 text-[11px] leading-relaxed font-semibold font-sans tracking-wide">
          {briefing}
        </p>
      </div>

      {/* Objective and risks logs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-3 space-y-1">
          <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider block">Operational Action Target</span>
          <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
            {operationalImprovements}
          </p>
        </div>

        <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-3 space-y-1">
          <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider block">Simulation Warning Risk</span>
          <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
            {potentialRisks}
          </p>
        </div>
      </div>
    </div>
  );
};
