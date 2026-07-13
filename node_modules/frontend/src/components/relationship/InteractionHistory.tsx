import React from 'react';
import { MessagesSquare, Calendar, Phone, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface InteractionHistoryProps {
  interactions: {
    meetings: number;
    calls: number;
    emails: number;
    followUps: number;
    completedTasks: number;
    pendingTasks: number;
    missedTasks: number;
    averageResponseTime: number;
    interactionCoverage: number;
    daysSinceLastContact: number;
  };
}

export const InteractionHistory: React.FC<InteractionHistoryProps> = ({ interactions }) => {
  const {
    meetings,
    calls,
    emails,
    followUps,
    completedTasks,
    pendingTasks,
    missedTasks,
    averageResponseTime,
    interactionCoverage,
    daysSinceLastContact
  } = interactions;

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="pb-4 border-b border-white/5 flex items-center space-x-2.5">
        <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
          <MessagesSquare className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Interaction Intelligence</h4>
          <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Interaction counters and response latencies</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Meetings */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Meetings</span>
            <span className="text-base font-black text-white block mt-0.5">{meetings}</span>
          </div>
        </div>

        {/* Calls */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Phone className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Calls</span>
            <span className="text-base font-black text-white block mt-0.5">{calls}</span>
          </div>
        </div>

        {/* Emails */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
            <Mail className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Emails</span>
            <span className="text-base font-black text-white block mt-0.5">{emails}</span>
          </div>
        </div>

        {/* Days Since Last Contact */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Last Contact</span>
            <span className="text-base font-black text-white block mt-0.5">{daysSinceLastContact} Days</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Task completion rates */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 space-y-3.5">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Operational Task Activity</span>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2.5 bg-slate-900/30 border border-white/5 rounded-xl">
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Completed</span>
              <span className="text-sm font-black text-emerald-400 block mt-0.5">{completedTasks}</span>
            </div>
            <div className="text-center p-2.5 bg-slate-900/30 border border-white/5 rounded-xl">
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Pending</span>
              <span className="text-sm font-black text-blue-400 block mt-0.5">{pendingTasks}</span>
            </div>
            <div className="text-center p-2.5 bg-slate-900/30 border border-white/5 rounded-xl">
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Missed</span>
              <span className="text-sm font-black text-rose-400 block mt-0.5">{missedTasks}</span>
            </div>
          </div>
        </div>

        {/* Latency and Coverage metrics */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500 uppercase tracking-wider">Interaction Coverage</span>
              <span className="text-teal-400">{interactionCoverage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${interactionCoverage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-3 border-t border-white/5 mt-3">
            <span>Avg Task Completion Time:</span>
            <span className="font-mono text-white font-extrabold">{averageResponseTime} Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
