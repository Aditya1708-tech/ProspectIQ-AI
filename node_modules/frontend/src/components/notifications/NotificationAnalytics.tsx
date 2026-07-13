import React from 'react';
import { 
  Bell, AlertOctagon, Clock, CheckSquare, TrendingUp, BarChart3, Users 
} from 'lucide-react';

export interface NotificationAnalyticsData {
  unreadNotifications: number;
  criticalAlerts: number;
  overdueAlerts: number;
  averageResponseTime: number;
  acknowledgementRate: number;
  resolutionRate: number;
  escalationRate: number;
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
}

interface NotificationAnalyticsProps {
  analytics: NotificationAnalyticsData;
}

export const NotificationAnalytics: React.FC<NotificationAnalyticsProps> = ({ analytics }) => {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unread Alerts */}
        <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-1.5 relative overflow-hidden">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Unread Alerts</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-indigo-400">{analytics.unreadNotifications}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">alerts</span>
          </div>
          <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Critical Queue */}
        <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-1.5 relative overflow-hidden">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Critical Alerts</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-rose-400">{analytics.criticalAlerts}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">critical</span>
          </div>
          <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${analytics.criticalAlerts > 0 ? 80 : 0}%` }}></div>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-1.5 relative overflow-hidden">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Avg Response Time</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-teal-400">{analytics.averageResponseTime}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">hours</span>
          </div>
          <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-teal-400 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Acknowledgement Rate */}
        <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-1.5 relative overflow-hidden">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Ack Rate</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-amber-400">{analytics.acknowledgementRate}%</span>
          </div>
          <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${analytics.acknowledgementRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Analytics Details Dashboard card */}
      <div className="bg-slate-900/20 border border-white/5 rounded-3xl p-6 space-y-5">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Operational SLA Metrics</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress Rates */}
          <div className="space-y-4 bg-slate-950/40 border border-white/5 p-5 rounded-2xl">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Resolution Status rates</h4>
            
            {/* Resolution Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">SLA Resolution Rate</span>
                <span className="text-teal-400">{analytics.resolutionRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: `${analytics.resolutionRate}%` }}></div>
              </div>
            </div>

            {/* Escalation Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Manager Escalation Rate</span>
                <span className="text-rose-400">{analytics.escalationRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${analytics.escalationRate * 10}%` }}></div>
              </div>
            </div>
          </div>

          {/* Volume Summary */}
          <div className="space-y-4 bg-slate-950/40 border border-white/5 p-5 rounded-2xl">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Notification Volume Trends</h4>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase font-bold text-slate-500 block">Daily</span>
                <span className="text-lg font-black text-slate-200">{analytics.dailyVolume}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase font-bold text-slate-500 block">Weekly</span>
                <span className="text-lg font-black text-indigo-400">{analytics.weeklyVolume}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase font-bold text-slate-500 block">Monthly</span>
                <span className="text-lg font-black text-teal-400">{analytics.monthlyVolume}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              Volume forecasts are calculated based on active task volumes, pending review deadlines, and transactional warning limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
