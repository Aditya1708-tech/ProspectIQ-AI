import React from 'react';
import { Award, Briefcase } from 'lucide-react';

interface ExecutiveBriefCardProps {
  brief: string;
  loading?: boolean;
}

export const ExecutiveBriefCard: React.FC<ExecutiveBriefCardProps> = ({ brief, loading = false }) => {
  return (
    <div className="bg-slate-900/30 border border-white/5 hover:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <span>Weekly Executive Summary</span>
          </span>
          <span className="px-2.5 py-0.5 bg-slate-950 border border-white/10 rounded-md text-[8px] font-black uppercase text-slate-300">
            Manager Review
          </span>
        </div>

        {loading ? (
          <div className="py-6 space-y-3 animate-pulse">
            <div className="h-3 w-full bg-slate-800 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
            <div className="h-3 w-4/5 bg-slate-800 rounded"></div>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-semibold">
            {brief}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center space-x-1.5 border-t border-white/5 pt-4 text-[9px] text-slate-500 font-semibold uppercase">
        <Award className="h-3.5 w-3.5 text-indigo-400" />
        <span>Synthesized performance and regulatory compliance metrics.</span>
      </div>
    </div>
  );
};
