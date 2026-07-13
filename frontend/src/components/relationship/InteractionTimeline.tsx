import React from 'react';
import { Phone, MessageSquare, Users, Calendar } from 'lucide-react';
import type { Interaction } from 'shared';

interface InteractionTimelineProps {
  interactions: Interaction[];
}

export const InteractionTimeline: React.FC<InteractionTimelineProps> = ({ interactions }) => {
  if (interactions.length === 0) {
    return (
      <div className="bg-slate-900/10 border border-white/5 rounded-2xl p-8 text-center text-slate-400 text-sm leading-relaxed">
        No client interactions recorded yet.
      </div>
    );
  }

  const getIcon = (type: string) => {
    if (type === 'CALL') return <Phone className="h-3.5 w-3.5 text-teal-400" />;
    if (type === 'MEETING') return <Users className="h-3.5 w-3.5 text-amber-500" />;
    return <MessageSquare className="h-3.5 w-3.5 text-blue-400" />;
  };

  const getIconBg = (type: string) => {
    if (type === 'CALL') return 'bg-teal-950/40 border-teal-500/30';
    if (type === 'MEETING') return 'bg-amber-950/40 border-amber-500/30';
    return 'bg-blue-950/40 border-blue-500/30';
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative pl-6 border-l border-white/10 space-y-6 ml-3">
      {interactions.map(item => (
        <div key={item.id} className="relative group">
          {/* Timeline Dot */}
          <div className={`absolute -left-[35px] top-1.5 p-1.5 border rounded-full flex items-center justify-center ${getIconBg(item.type)}`}>
            {getIcon(item.type)}
          </div>

          <div className="bg-slate-900/30 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  {item.type} Checkpoint
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  {item.summary}
                </h4>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] font-semibold whitespace-nowrap">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(item.interactionDate)}</span>
              </div>
            </div>

            {item.notes && (
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 border border-white/5 rounded-xl p-3">
                {item.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
