import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';
import { PlatformHealthSummary } from '../../services/ai-client.js';

interface SystemHealthCardProps {
  summary: PlatformHealthSummary;
  cpu: number;
  memory: number;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ summary, cpu, memory }) => {
  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="h-4.5 w-4.5 text-indigo-400" />
            <span>Governance Command Center</span>
          </span>
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[8px] font-black text-emerald-400 uppercase tracking-wider">
            All Systems Nominal
          </span>
        </div>

        {/* Big Health Value */}
        <div className="flex items-center space-x-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
          <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
            <Activity className="h-6 w-6 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Average response index</span>
            <span className="text-xl font-black text-white font-mono">{summary.averageResponseTimeMs} ms</span>
          </div>
        </div>

        {/* Resources gauges */}
        <div className="space-y-4 pt-2">
          {/* CPU */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>CPU Core Allocation</span>
              <span className="font-mono text-white font-bold">{cpu}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${cpu}%` }}
              />
            </div>
          </div>

          {/* Memory */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>Heap memory consumption</span>
              <span className="font-mono text-white font-bold">{memory} MB</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${(memory / 512) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[8px] text-slate-500 font-black uppercase tracking-wider">
        <span>System Uptime:</span>
        <span className="text-white font-mono">{summary.platformUptimeDays} days</span>
      </div>
    </div>
  );
};
