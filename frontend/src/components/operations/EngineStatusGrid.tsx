import React from 'react';
import { Cpu, CheckCircle, AlertTriangle } from 'lucide-react';
import { SystemHealthItem } from '../../services/ai-client.js';

interface EngineStatusGridProps {
  engines: SystemHealthItem[];
}

export const EngineStatusGrid: React.FC<EngineStatusGridProps> = ({ engines }) => {
  const getStatusBadge = (status: string) => {
    if (status === 'HEALTHY') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'DEGRADED') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <Cpu className="h-4.5 w-4.5 text-indigo-400" />
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Intelligence Engine Monitor</h4>
          <p className="text-[9px] text-slate-500 block font-medium mt-0.5">Real-time status check metrics across all 12 modules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {engines.map(engine => (
          <div key={engine.engineName} className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="text-xs font-black text-white leading-none">{engine.engineName}</h5>
                <span className="text-[8px] text-slate-500 font-mono mt-1 block">v{engine.version}</span>
              </div>
              <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${getStatusBadge(engine.status)}`}>
                {engine.status}
              </span>
            </div>

            <div className="space-y-1.5 border-t border-white/5 pt-2">
              <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                <span>Latency index:</span>
                <span className="font-mono text-white font-bold">{engine.averageLatencyMs.toFixed(2)}ms</span>
              </div>
              <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                <span>Success rate:</span>
                <span className="font-mono text-white font-bold">{engine.successRate}%</span>
              </div>
              <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                <span>Query volume:</span>
                <span className="font-mono text-white font-bold">{engine.requestsToday}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[8px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Overall score:</span>
              <span className="text-indigo-400 font-mono">{engine.overallHealthScore}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
