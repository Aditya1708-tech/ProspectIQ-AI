import React from 'react';
import { Clock } from 'lucide-react';
import type { ExplainTimelineEvent } from '../../services/api.js';

interface TimelineViewProps {
  timeline: ExplainTimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  return (
    <div className="space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Real-time Analytics Chronology</span>

      <div className="space-y-4 pl-3 relative border-l border-white/5">
        {timeline.map((event, idx) => (
          <div key={idx} className="relative group">
            {/* Dot */}
            <div className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-indigo-500 border border-slate-900 group-hover:scale-150 transition-transform" />

            <div className="flex justify-between items-start text-[11px]">
              <div>
                <span className="font-bold text-white uppercase tracking-wide block">
                  {event.stepName}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold font-mono">
                  {new Date(event.timestamp).toISOString().split('T')[1].replace('Z', '')}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-right">
                <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 flex items-center space-x-1">
                  <Clock className="h-2.5 w-2.5 text-slate-500" />
                  <span>{event.latencyMs.toFixed(2)}ms</span>
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[8px] font-black uppercase">
                  {event.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
