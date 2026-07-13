import React from 'react';
import { Phone, Mail, Users, Calendar } from 'lucide-react';
import type { Interaction } from 'shared';

interface ActionHistoryProps {
  interactions: Interaction[];
}

export const ActionHistory: React.FC<ActionHistoryProps> = ({ interactions }) => {
  if (!interactions || interactions.length === 0) {
    return (
      <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Relationship Activity Log</span>
        <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-6 text-center text-slate-500 text-xs font-semibold">
          No past relationship actions recorded.
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    if (type === 'CALL') return <Phone className="h-3.5 w-3.5 text-teal-400" />;
    if (type === 'MEETING') return <Users className="h-3.5 w-3.5 text-amber-500" />;
    return <Mail className="h-3.5 w-3.5 text-blue-400" />;
  };

  const getIconBg = (type: string) => {
    if (type === 'CALL') return 'bg-teal-950/40 border-teal-500/20';
    if (type === 'MEETING') return 'bg-amber-950/40 border-amber-500/20';
    return 'bg-blue-950/40 border-blue-500/20';
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Relationship Activity Log</span>
      
      <div className="space-y-4 pl-3 relative border-l border-white/5 max-h-[350px] overflow-y-auto pr-1">
        {interactions.map((item, idx) => (
          <div key={item.id || idx} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[27px] top-1.5 p-1 border rounded-full flex items-center justify-center ${getIconBg(item.type)}`}>
              {getIcon(item.type)}
            </div>

            <div className="flex justify-between items-start text-xs pl-2">
              <div className="space-y-1">
                <span className="font-bold text-white uppercase tracking-wide block">
                  {item.summary}
                </span>
                {item.notes && (
                  <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed max-w-sm">
                    {item.notes}
                  </span>
                )}
              </div>
              <div className="text-right flex items-center space-x-1 text-slate-500 font-semibold text-[10px]">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.interactionDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
