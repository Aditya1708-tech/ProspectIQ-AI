import React from 'react';
import { Bell, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { PlatformNotification } from '../../services/ai-client.js';

interface NotificationsPanelProps {
  notifications: PlatformNotification[];
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertCircle className="h-4 w-4 text-rose-400" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      default:
        return <Info className="h-4 w-4 text-indigo-400" />;
    }
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'border-rose-500/20 bg-rose-500/5';
      case 'WARNING':
        return 'border-amber-500/20 bg-amber-500/5';
      default:
        return 'border-white/5 bg-slate-950/20';
    }
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6 h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="h-4.5 w-4.5 text-indigo-400" />
            <span>Governance Notifications</span>
          </span>
          <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[8px] font-black text-indigo-400 uppercase tracking-wider">
            Active Alerts
          </span>
        </div>

        {/* List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {notifications.map((item, idx) => (
            <div key={idx} className={`flex items-start space-x-2.5 p-3 border rounded-xl transition-all duration-150 hover:border-white/10 ${getSeverityStyle(item.severity)}`}>
              <span className="mt-0.5">{getSeverityIcon(item.severity)}</span>
              <div className="space-y-1 flex-1">
                <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">{item.message}</p>
                <span className="text-[8px] text-slate-500 font-mono block">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 text-[8px] text-slate-500 font-black uppercase tracking-wider flex justify-between items-center">
        <span>Logged today:</span>
        <span className="text-white font-mono">{notifications.length} Alerts</span>
      </div>
    </div>
  );
};
