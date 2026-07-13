import React from 'react';
import { Award, Compass, Star, CalendarDays } from 'lucide-react';

interface Milestone {
  title: string;
  description: string;
  category: string;
  importance: string; // HIGH, MEDIUM, LOW
  date: string;
}

interface MilestonesPanelProps {
  milestones: Milestone[];
}

export const MilestonesPanel: React.FC<MilestonesPanelProps> = ({ milestones }) => {
  
  const getImportanceColor = (imp: string) => {
    switch (imp.toUpperCase()) {
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="pb-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <Award className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Relationship Milestones</h4>
            <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Identified customer achievements & events</span>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-slate-950 border border-white/5 rounded-lg text-[10px] font-black text-slate-400">
          Total Achieved: {milestones.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((ms, idx) => (
          <div key={idx} className="bg-slate-950/40 border border-white/5 hover:border-white/10 p-4 rounded-2xl flex items-start space-x-4 transition-colors duration-200">
            <div className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-teal-400 mt-0.5 flex-shrink-0">
              <Star className="h-4 w-4 fill-teal-400/20" />
            </div>
            
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-xs font-black text-white uppercase tracking-wide">
                  {ms.title}
                </h5>
                <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${getImportanceColor(ms.importance)}`}>
                  {ms.importance}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                {ms.description}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-bold">
                <span className="uppercase">Category: <strong className="text-slate-400">{ms.category}</strong></span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(ms.date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
