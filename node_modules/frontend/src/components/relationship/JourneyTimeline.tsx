import React from 'react';
import { Calendar, Award, Sparkles, CheckSquare, ShieldCheck, UserPlus, Clock } from 'lucide-react';

interface JourneyEvent {
  timestamp: string;
  title: string;
  description: string;
  sourceEngine: string;
  confidence: number;
}

interface JourneyTimelineProps {
  journey: JourneyEvent[];
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ journey }) => {
  
  // Helper to map sourceEngine to icons and colors
  const getEventIcon = (engine: string) => {
    const name = engine.toLowerCase();
    if (name.includes('customer') || name.includes('repository')) {
      return {
        icon: <UserPlus className="h-4 w-4" />,
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/40'
      };
    }
    if (name.includes('trust')) {
      return {
        icon: <ShieldCheck className="h-4 w-4" />,
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      };
    }
    if (name.includes('behavior')) {
      return {
        icon: <Sparkles className="h-4 w-4" />,
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
      };
    }
    if (name.includes('priority')) {
      return {
        icon: <Award className="h-4 w-4" />,
        color: 'bg-rose-500/20 text-rose-400 border-rose-500/40'
      };
    }
    return {
      icon: <CheckSquare className="h-4 w-4" />,
      color: 'bg-teal-500/20 text-teal-400 border-teal-500/40'
    };
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="pb-4 border-b border-white/5 flex items-center space-x-2.5">
        <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
          <Calendar className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Customer Relationship Journey</h4>
          <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Chronological relationship lifecycle events</span>
        </div>
      </div>

      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 ml-2 py-2">
        {journey.map((event, idx) => {
          const style = getEventIcon(event.sourceEngine);
          return (
            <div key={idx} className="relative group transition-all duration-300">
              {/* Timeline dot marker with icon */}
              <div className={`absolute -left-10 top-0.5 p-1.5 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${style.color}`}>
                {style.icon}
              </div>

              {/* Event Card */}
              <div className="bg-slate-950/40 border border-white/5 hover:border-white/10 rounded-2xl p-4 space-y-1.5 transition-colors duration-200 shadow-sm hover:shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-xs font-black text-white tracking-wide uppercase">
                    {event.title}
                  </h5>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(event.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal font-medium">
                  {event.description}
                </p>
                <div className="flex items-center justify-between pt-1 text-[9px] text-slate-600 font-semibold border-t border-white/5">
                  <span>Engine: <strong className="text-slate-400">{event.sourceEngine}</strong></span>
                  <span>Confidence: <strong className="text-teal-500">{(event.confidence * 100).toFixed(0)}%</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
