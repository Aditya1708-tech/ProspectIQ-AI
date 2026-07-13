import React from 'react';
import { BarChart3, Phone, Calendar, Mail, CheckCircle, Flame } from 'lucide-react';

interface ChannelDetail {
  count: number;
  completionRate: number;
  successRate: number;
  resolutionTime: number; // in hours
  effectivenessScore: number;
}

interface TouchpointAnalyticsProps {
  touchpoints: {
    calls: ChannelDetail;
    meetings: ChannelDetail;
    emails: ChannelDetail;
    followUps: ChannelDetail;
    tasks: ChannelDetail;
  };
}

export const TouchpointAnalytics: React.FC<TouchpointAnalyticsProps> = ({ touchpoints }) => {
  const channels = [
    { name: 'Calls', data: touchpoints.calls, icon: <Phone className="h-4 w-4" />, color: 'text-emerald-400', barBg: 'bg-emerald-500' },
    { name: 'Meetings', data: touchpoints.meetings, icon: <Calendar className="h-4 w-4" />, color: 'text-blue-400', barBg: 'bg-blue-500' },
    { name: 'Emails', data: touchpoints.emails, icon: <Mail className="h-4 w-4" />, color: 'text-purple-400', barBg: 'bg-purple-500' },
    { name: 'Follow-ups', data: touchpoints.followUps, icon: <CheckCircle className="h-4 w-4" />, color: 'text-amber-400', barBg: 'bg-amber-500' },
    { name: 'Tasks', data: touchpoints.tasks, icon: <Flame className="h-4 w-4" />, color: 'text-rose-400', barBg: 'bg-rose-500' }
  ];

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="pb-4 border-b border-white/5 flex items-center space-x-2.5">
        <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
          <BarChart3 className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Touchpoint Effectiveness</h4>
          <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Channel performance and success coefficients</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {channels.map((ch, idx) => (
          <div key={idx} className="bg-slate-950/40 border border-white/5 hover:border-white/10 p-4 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-200">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className={ch.color}>{ch.icon}</span>
                <span>{ch.name}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">Vol: {ch.data.count}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider block">Effectiveness</span>
              <div className="flex justify-between items-baseline">
                <span className={`text-base font-black ${ch.color}`}>{ch.data.effectivenessScore}%</span>
                <span className="text-[9px] text-slate-500 font-bold">Res: {ch.data.resolutionTime}h</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full ${ch.barBg} rounded-full transition-all`}
                  style={{ width: `${ch.data.effectivenessScore}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-between text-[9px] text-slate-500 font-bold">
              <span>SLA: {ch.data.completionRate.toFixed(0)}%</span>
              <span>Success: {ch.data.successRate.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
