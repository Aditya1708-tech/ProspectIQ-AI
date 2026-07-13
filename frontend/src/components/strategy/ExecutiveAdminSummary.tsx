import React from 'react';
import { MessageSquareCode, ShieldCheck } from 'lucide-react';
import { AdminSummaryBriefing } from '../../services/ai-client.js';

interface ExecutiveAdminSummaryProps {
  summary: AdminSummaryBriefing;
}

export const ExecutiveAdminSummary: React.FC<ExecutiveAdminSummaryProps> = ({ summary }) => {
  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <MessageSquareCode className="h-4.5 w-4.5 text-indigo-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Executive Admin Summary</h4>
        </div>
        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[8px] font-black text-indigo-400 uppercase tracking-wider font-mono">
          Confidence {summary.overallConfidence}
        </span>
      </div>

      {/* Briefing text */}
      <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4">
        <p className="text-slate-300 text-[11px] leading-relaxed font-semibold font-sans tracking-wide">
          {summary.briefing}
        </p>
      </div>

      {/* Structured points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-3 space-y-1">
          <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider block">Operational highlights</span>
          <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
            {summary.operationalHighlights}
          </p>
        </div>

        <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-3 space-y-1">
          <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider block">Largest operational concern</span>
          <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
            {summary.largestOperationalConcern}
          </p>
        </div>
      </div>
    </div>
  );
};
