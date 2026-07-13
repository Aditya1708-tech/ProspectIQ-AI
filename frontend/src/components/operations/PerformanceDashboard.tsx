import React from 'react';
import { Gauge, Info } from 'lucide-react';
import { PerformanceMetrics } from '../../services/ai-client.js';

interface PerformanceDashboardProps {
  metrics: PerformanceMetrics;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ metrics }) => {
  // Let's create an SVG line/area chart of the hourly query trend
  const trend = metrics.hourlyRequestTrend || [];
  const maxTrend = Math.max(...trend, 100);
  const width = 360;
  const height = 90;
  const padding = 20;

  const points = trend.map((val: number, idx: number) => {
    const x = padding + (idx * (width - padding * 2)) / (trend.length - 1 || 1);
    const y = height - padding - (val * (height - padding * 2)) / maxTrend;
    return { x, y };
  });

  const pathStr = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p: any) => `L ${p.x} ${p.y}`).join(' ') 
    : '';

  const areaStr = points.length > 0
    ? `${pathStr} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <Gauge className="h-4.5 w-4.5 text-indigo-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Performance Telemetry</h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Average Gateway Latency</span>
              <span className="text-base font-black text-white font-mono">{metrics.averageApiLatencyMs} ms</span>
            </div>
            <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 font-mono">Nominal</span>
          </div>

          <div className="bg-idbi-bg border border-idbi-border rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-[8px] text-idbi-textSec font-bold uppercase tracking-wider block">95th Percentile P95</span>
              <span className="text-base font-black text-idbi-text font-mono">{metrics.p95LatencyMs} ms</span>
            </div>
            <span className="text-[8px] px-1.5 py-0.5 bg-idbi-orange/10 border border-idbi-orange/30 rounded text-idbi-orange font-mono">Standard</span>
          </div>

          <div className="bg-idbi-bg border border-idbi-border rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-[8px] text-idbi-textSec font-bold uppercase tracking-wider block">Database Query Latency</span>
              <span className="text-base font-black text-idbi-text font-mono">{metrics.databaseQueryTimeMs} ms</span>
            </div>
            <span className="text-[8px] px-1.5 py-0.5 bg-idbi-green/10 border border-idbi-green/30 rounded text-idbi-green font-mono">Optimal</span>
          </div>
        </div>

        {/* Chart Panel */}
        <div className="lg:col-span-2 bg-idbi-bg border border-idbi-border rounded-2xl p-4 space-y-4 flex flex-col justify-between">
          <span className="text-[9px] font-black text-idbi-textSec uppercase tracking-widest block">Hourly Request Trends Volume</span>
          
          <div className="w-full relative flex justify-center py-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[450px]">
              {/* Grid line */}
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--idbi-border)" strokeWidth="1" />
              
              <defs>
                <linearGradient id="perfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--idbi-green)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--idbi-green)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {points.length > 0 && (
                <>
                  <path d={areaStr} fill="url(#perfGrad)" />
                  <path d={pathStr} fill="none" stroke="var(--idbi-green)" strokeWidth="2" strokeLinecap="round" />
                  {points.map((p: any, i: number) => (
                    <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--idbi-green)" />
                  ))}
                </>
              )}
            </svg>
          </div>

          <div className="flex items-start space-x-1.5 text-[8px] text-idbi-textSec leading-normal border-t border-idbi-border pt-2">
            <Info className="h-3 w-3 text-idbi-orange mt-0.5 flex-shrink-0" />
            <span>Chart maps relative API requests capacity per hour during the active operational shift.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
