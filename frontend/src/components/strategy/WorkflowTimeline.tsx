import React from 'react';
import { Clock, ArrowRight, UserCheck, CalendarDays } from 'lucide-react';
import type { NBAAction } from '../../services/api.js';

interface WorkflowTimelineProps {
  primaryAction: NBAAction;
  secondaryAction: NBAAction | null;
  optionalFollowUp: NBAAction | null;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  primaryAction,
  secondaryAction,
  optionalFollowUp
}) => {
  const actions = [
    { type: 'Primary Action', act: primaryAction, bg: 'from-teal-950/20 via-slate-900/30 to-slate-950/20 border-teal-500/20' },
    { type: 'Secondary Action', act: secondaryAction, bg: 'from-slate-900/40 to-slate-950/40 border-white/5' },
    { type: 'Optional Follow-up', act: optionalFollowUp, bg: 'from-slate-900/10 to-slate-950/10 border-white/5 opacity-80' }
  ].filter(item => item.act !== null) as { type: string; act: NBAAction; bg: string }[];

  const getPriorityColor = (priority: string) => {
    if (priority === 'HIGH') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (priority === 'MEDIUM') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-slate-500/10 text-slate-400 border-white/5';
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Recommended Workflow Sequence</span>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {actions.map((item, idx) => (
          <div 
            key={idx} 
            className={`bg-gradient-to-b ${item.bg} border rounded-2xl p-5 space-y-4 shadow-lg hover:shadow-2xl transition-all duration-200 relative group`}
          >
            {/* Step indicator */}
            <div className="absolute top-4 right-4 text-[9px] font-black uppercase text-slate-500 tracking-wider">
              {item.type}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="h-5 w-5 bg-slate-950 border border-white/10 rounded-full flex items-center justify-center text-[10px] font-mono text-slate-300">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                  {item.act.title}
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {item.act.description}
              </p>
            </div>

            {/* SLA + Priority Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${getPriorityColor(item.act.priority)}`}>
                {item.act.priority}
              </span>
              <span className="px-2 py-0.5 bg-slate-950 border border-white/5 rounded text-[9px] font-bold text-slate-400 flex items-center space-x-1">
                <Clock className="h-2.5 w-2.5 text-teal-400" />
                <span>{item.act.sla} SLA</span>
              </span>
              <span className="px-2 py-0.5 bg-slate-950 border border-white/5 rounded text-[9px] font-bold text-slate-400 flex items-center space-x-1">
                <Clock className="h-2.5 w-2.5 text-slate-500" />
                <span>{item.act.expectedDuration}</span>
              </span>
            </div>

            {/* Owner + Due Date */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
              <span className="flex items-center space-x-1">
                <UserCheck className="h-3.5 w-3.5" />
                <span className="truncate max-w-[120px]">{item.act.owner}</span>
              </span>
              <span className="flex items-center space-x-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatDate(item.act.recommendedDueDate)}</span>
              </span>
            </div>
            
            {/* Arrow connector for lg screens */}
            {idx < actions.length - 1 && (
              <div className="hidden lg:block absolute -right-[15px] top-1/2 transform -translate-y-1/2 z-10 p-1 bg-slate-950 border border-white/5 rounded-full text-slate-500">
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
