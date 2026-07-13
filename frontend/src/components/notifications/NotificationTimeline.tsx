import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, MessageSquare, Award, AlertTriangle, HelpCircle, ArrowUpRight 
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  type: string;
  sourceEngine: string;
  customerId?: string;
  customerName?: string;
  workflowLink?: string;
}

interface NotificationTimelineProps {
  events: TimelineEvent[];
}

export const NotificationTimeline: React.FC<NotificationTimelineProps> = ({ events }) => {
  const navigate = useNavigate();

  const getEventIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'TASK':
        return <ClipboardList className="h-3.5 w-3.5 text-blue-400" />;
      case 'INTERACTION':
        return <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />;
      case 'MILESTONES':
        return <Award className="h-3.5 w-3.5 text-pink-400" />;
      case 'ALERTS':
      default:
        return <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />;
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'TASK':
        return 'bg-blue-500/10 border-blue-500/40 text-blue-400';
      case 'INTERACTION':
        return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
      case 'MILESTONES':
        return 'bg-pink-500/10 border-pink-500/40 text-pink-400';
      case 'ALERTS':
      default:
        return 'bg-rose-500/10 border-rose-500/40 text-rose-400';
    }
  };

  const getRelativeGroup = (timestamp: string) => {
    const eventDate = new Date(timestamp);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - eventDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 3) return '3 Days Ago';
    if (diffDays <= 7) return '7 Days Ago';
    if (diffDays <= 15) return '15 Days Ago';
    return '30 Days Ago';
  };

  // Group events by relative date
  const groupedEvents: Record<string, TimelineEvent[]> = {};
  events.forEach(evt => {
    const group = getRelativeGroup(evt.timestamp);
    if (!groupedEvents[group]) {
      groupedEvents[group] = [];
    }
    groupedEvents[group].push(evt);
  });

  const groupOrder = ['Today', 'Yesterday', '3 Days Ago', '7 Days Ago', '15 Days Ago', '30 Days Ago'];

  return (
    <div className="bg-slate-900/20 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Communication Feed Timeline</span>
      
      {events.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-xs font-semibold">No timeline events compiled.</div>
      ) : (
        <div className="space-y-6">
          {groupOrder.map(group => {
            const groupList = groupedEvents[group] || [];
            if (groupList.length === 0) return null;

            return (
              <div key={group} className="space-y-4">
                {/* Date Group Header */}
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-slate-950 border border-white/10 text-slate-400 font-mono text-[9px] font-bold rounded-md uppercase">
                    {group}
                  </span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Group Timeline Stream */}
                <div className="relative pl-6 border-l border-white/5 space-y-5 ml-3">
                  {groupList.map(evt => (
                    <div key={evt.id} className="relative group">
                      {/* Circle Dot Marker */}
                      <div className={`absolute -left-[35px] top-1.5 p-1.5 rounded-full border bg-slate-950 z-10 flex items-center justify-center transition-transform group-hover:scale-110 ${getMarkerColor(evt.type)}`}>
                        {getEventIcon(evt.type)}
                      </div>

                      {/* Event details */}
                      <div className="bg-slate-950/40 hover:bg-slate-950/70 border border-white/5 rounded-2xl p-4 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">
                              {evt.sourceEngine} &bull; {evt.category}
                            </span>
                            <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {evt.title}
                            </h4>
                          </div>
                          
                          {evt.workflowLink && (
                            <button
                              onClick={() => navigate(evt.workflowLink!)}
                              className="p-1 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                              title="Navigate to Workspace"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-semibold">
                          {evt.description}
                        </p>

                        {evt.customerName && (
                          <div className="mt-2.5 flex items-center space-x-1.5 text-[9px] font-bold text-indigo-400 uppercase">
                            <span className="h-1 w-1 bg-indigo-500 rounded-full" />
                            <span>Client: {evt.customerName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
