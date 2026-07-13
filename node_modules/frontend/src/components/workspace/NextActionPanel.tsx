import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

interface NextActionPanelProps {
  data: {
    overallRecommendation: string;
    recommendationCategory: string;
    urgency: string;
    estimatedRMTime: string;
    recommendedCompletionWindow: string;
  };
}

export const NextActionPanel: React.FC<NextActionPanelProps> = ({ data }) => {
  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'HIGH') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (urgency === 'MEDIUM') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  return (
    <div className="bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-white/5 hover:border-teal-500/20 rounded-3xl p-6 shadow-2xl transition-all duration-300 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 flex-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-md text-[10px] font-bold tracking-wider uppercase">
              {data.recommendationCategory}
            </span>
            <span className={`px-2.5 py-0.5 border rounded-md text-[10px] font-bold tracking-wider uppercase ${getUrgencyColor(data.urgency)}`}>
              {data.urgency} Urgency
            </span>
          </div>
          
          <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-snug">
            {data.overallRecommendation}
          </h3>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 border border-white/5 rounded-2xl p-4 md:self-stretch">
          <div className="text-center px-2">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Estimated RM Time</span>
            <span className="text-sm font-black text-slate-200 flex items-center justify-center gap-1.5 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-teal-400" />
              <span>{data.estimatedRMTime}</span>
            </span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="text-center px-2">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Completion Target</span>
            <span className="text-sm font-black text-amber-400 flex items-center justify-center gap-1.5 mt-0.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{data.recommendedCompletionWindow}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
