import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

interface MorningBriefCardProps {
  brief: string;
  loading?: boolean;
}

export const MorningBriefCard: React.FC<MorningBriefCardProps> = ({ brief, loading = false }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/30 to-teal-950/15 border border-indigo-500/20 hover:border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition-colors relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span>Branch Morning Brief</span>
          </span>
          <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[8px] text-indigo-400 font-bold tracking-wider rounded uppercase">
            Deterministic Intel
          </span>
        </div>

        {loading ? (
          <div className="py-6 space-y-3 animate-pulse">
            <div className="h-3 w-full bg-slate-800 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
            <div className="h-3 w-4/5 bg-slate-800 rounded"></div>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-semibold">
            {brief}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center space-x-1.5 border-t border-white/5 pt-4 text-[9px] text-slate-500 font-semibold uppercase">
        <Activity className="h-3.5 w-3.5 text-teal-500" />
        <span>Compiled deterministically based on active customer and task metrics.</span>
      </div>
    </div>
  );
};
