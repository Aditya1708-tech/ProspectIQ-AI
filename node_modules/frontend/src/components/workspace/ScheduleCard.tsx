import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

interface ScheduleCardProps {
  schedule: string[];
  recommendedCompletionWindow: string;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, recommendedCompletionWindow }) => {
  const labels = ['Primary Target', 'Secondary Target', 'Optional Target'];

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Deterministic Completion Schedule</span>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {schedule.map((window, idx) => (
          <div key={idx} className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-2 relative overflow-hidden group">
            {/* Status bar */}
            <div className={`absolute top-0 left-0 bottom-0 w-1 
              ${idx === 0 ? 'bg-teal-500' : (idx === 1 ? 'bg-amber-500' : 'bg-slate-500')}`} 
            />
            
            <div className="pl-2 space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">
                {labels[idx] || 'Action Target'}
              </span>
              
              <span className="text-sm font-black text-slate-200 block flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{window}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-950/10 border border-amber-500/10 rounded-2xl p-4 flex items-start space-x-3 mt-4">
        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block">Completion SLA Commitment</span>
          <p className="text-xs text-amber-300/80 font-medium leading-relaxed mt-1">
            Ensure actions are completed within the core relationship window of <strong className="text-white font-mono">{recommendedCompletionWindow}</strong> to preserve interaction benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
};
