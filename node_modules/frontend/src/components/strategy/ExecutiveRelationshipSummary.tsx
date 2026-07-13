import React from 'react';
import { Sparkles, BarChart2, ShieldAlert, Award, Compass } from 'lucide-react';

interface ExecutiveRelationshipSummaryProps {
  summary: {
    briefing: string;
    relationshipStatus: string;
    engagementQuality: string;
    strengths: string[];
    risks: string[];
    rmEffectiveness: string;
    trajectory: string;
    recommendedFocus: string;
    confidence: string;
  };
}

export const ExecutiveRelationshipSummary: React.FC<ExecutiveRelationshipSummaryProps> = ({ summary }) => {
  const {
    briefing,
    relationshipStatus,
    engagementQuality,
    strengths,
    risks,
    rmEffectiveness,
    trajectory,
    recommendedFocus,
    confidence
  } = summary;

  const getTrajectoryColor = (tr: string) => {
    const trLower = tr.toLowerCase();
    if (trLower.includes('improving')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (trLower.includes('declining')) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-950/20 border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Executive Customer 360 Summary</h4>
            <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Automated stateless briefing desk</span>
          </div>
        </div>

        {/* Dynamic Telemetry tags */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 ${getTrajectoryColor(trajectory)}`}>
            <Compass className="h-3 w-3" />
            <span>Trajectory: {trajectory}</span>
          </span>
          <span className="px-2.5 py-1 bg-slate-950 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <BarChart2 className="h-3 w-3 text-slate-500" />
            <span>RM Effectiveness: {rmEffectiveness}</span>
          </span>
        </div>
      </div>

      <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-5 shadow-inner">
        <p className="text-xs text-slate-200 leading-relaxed font-semibold">
          {briefing}
        </p>
      </div>

      {/* Structured metrics summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-4">
        {/* Recommended Focus */}
        <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Recommended Focus</span>
          <span className="text-[11px] text-white font-extrabold block leading-normal pt-1 capitalize">
            {recommendedFocus}
          </span>
        </div>

        {/* Key Strengths Summary */}
        <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Primary Strength</span>
          <span className="text-[11px] text-emerald-400 font-extrabold block leading-normal pt-1 capitalize flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 flex-shrink-0" />
            {strengths[0] || "Active deposits flow"}
          </span>
        </div>

        {/* Primary Risk Summary */}
        <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Primary Risk</span>
          <span className="text-[11px] text-rose-400 font-extrabold block leading-normal pt-1 capitalize flex items-center gap-1.5">
            <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
            {risks[0] || "None flagged"}
          </span>
        </div>
      </div>
    </div>
  );
};
