import React, { useState } from 'react';
import { LineChart, Info } from 'lucide-react';
import { ProjectedMetric } from '../../services/ai-client.js';

interface SimulationChartsProps {
  metrics: Record<string, ProjectedMetric>;
}

export const SimulationCharts: React.FC<SimulationChartsProps> = ({ metrics }) => {
  const [activeMetric, setActiveMetric] = useState<'health' | 'churn' | 'savings'>('health');

  const getMetricData = () => {
    switch (activeMetric) {
      case 'churn':
        return {
          title: 'Attrition Churn Risk Comparison',
          color: 'var(--idbi-error)',
          current: metrics.churnProbability?.currentValue || 15.0,
          projected: metrics.churnProbability?.projectedValue || 15.0
        };
      case 'savings':
        return {
          title: 'Savings Health Comparison',
          color: 'var(--idbi-green)',
          current: metrics.savingsHealth?.currentValue || 65.0,
          projected: metrics.savingsHealth?.projectedValue || 65.0
        };
      default:
        return {
          title: 'Relationship Health Comparison',
          color: 'var(--idbi-orange)',
          current: metrics.relationshipHealth?.currentValue || 75.0,
          projected: metrics.relationshipHealth?.projectedValue || 75.0
        };
    }
  };

  const { title, color, current, projected } = getMetricData();

  // Baseline coordinates: Today, 30d, 90d, 180d
  const basePoints = [
    { x: 40, y: 150 - (current * 1.2) },
    { x: 140, y: 150 - (current * 1.2) },
    { x: 240, y: 150 - (current * 1.2) },
    { x: 340, y: 150 - (current * 1.2) }
  ];

  // Simulated coordinates: Today, 30d (halfway delta), 90d (full delta), 180d (stabilized)
  const projPoints = [
    { x: 40, y: 150 - (current * 1.2) },
    { x: 140, y: 150 - ((current + (projected - current) * 0.4) * 1.2) },
    { x: 240, y: 150 - (projected * 1.2) },
    { x: 340, y: 150 - (projected * 1.2) }
  ];

  const buildPath = (pts: { x: number, y: number }[]) => 
    `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y} L ${pts[3].x} ${pts[3].y}`;

  const basePathStr = buildPath(basePoints);
  const projPathStr = buildPath(projPoints);
  const projAreaPathStr = `${projPathStr} L 340 150 L 40 150 Z`;

  return (
    <div className="bg-idbi-card border border-idbi-border rounded-[14px] p-6 shadow-md space-y-6">
      {/* Header and selector tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-idbi-border gap-3">
        <div className="flex items-center space-x-2">
          <LineChart className="h-4.5 w-4.5 text-idbi-orange" />
          <h4 className="text-xs font-bold text-idbi-text uppercase tracking-wider">{title}</h4>
        </div>

        <div className="flex bg-idbi-bg p-1 rounded-xl border border-idbi-border gap-1 self-stretch sm:self-auto">
          {(['health', 'churn', 'savings'] as const).map(m => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all duration-200
                ${activeMetric === m ? 'bg-idbi-orange text-white shadow-sm shadow-idbi-orange/25' : 'text-idbi-textSec hover:text-idbi-text'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Container */}
        <div className="lg:col-span-2 relative flex justify-center bg-idbi-bg border border-idbi-border rounded-2xl p-4">
          <svg viewBox="0 0 380 170" className="w-full max-w-[450px]">
            {/* Grid Y helper lines */}
            <line x1="40" y1="30" x2="340" y2="30" stroke="var(--idbi-border)" strokeWidth="1" strokeDasharray="3" />
            <line x1="40" y1="90" x2="340" y2="90" stroke="var(--idbi-border)" strokeWidth="1" strokeDasharray="3" />
            <line x1="40" y1="150" x2="340" y2="150" stroke="var(--idbi-border)" strokeWidth="1" />

            <defs>
              <linearGradient id="simAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area fill under simulated path */}
            <path d={projAreaPathStr} fill="url(#simAreaGrad)" />

            {/* Baseline path (Dashed) */}
            <path d={basePathStr} fill="none" stroke="var(--idbi-text-sec)" strokeWidth="2" strokeDasharray="4" strokeLinecap="round" />

            {/* Simulated path */}
            <path d={projPathStr} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Circles at simulated coordinates */}
            {projPoints.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill={color}
                stroke="var(--idbi-card)"
                strokeWidth="2"
              />
            ))}

            {/* X Labels */}
            <text x="40" y="165" fill="var(--idbi-text-sec)" fontSize="8" textAnchor="middle" fontWeight="bold">Today</text>
            <text x="140" y="165" fill="var(--idbi-text-sec)" fontSize="8" textAnchor="middle" fontWeight="bold">30 Days</text>
            <text x="240" y="165" fill="var(--idbi-text-sec)" fontSize="8" textAnchor="middle" fontWeight="bold">90 Days</text>
            <text x="340" y="165" fill="var(--idbi-text-sec)" fontSize="8" textAnchor="middle" fontWeight="bold">180 Days</text>
          </svg>
        </div>

        {/* Legend / Info panel */}
        <div className="lg:col-span-1 bg-idbi-bg border border-idbi-border rounded-2xl p-4 space-y-4">
          <span className="text-[9px] font-black text-idbi-textSec uppercase tracking-widest block font-sans">Trajectory Legend</span>

          <div className="space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-4 h-0.5 border-t-2 border-dashed border-[#6A737D]" />
              <div className="space-y-0.5">
                <span className="text-[9px] text-idbi-text font-bold block leading-none font-sans">Baseline path</span>
                <span className="text-[8px] text-idbi-textSec font-medium font-sans">Descriptive current trajectory ({current.toFixed(1)}%)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="w-4 h-0.5 border-t-2 stroke-3" style={{ borderColor: color }} />
              <div className="space-y-0.5">
                <span className="text-[9px] text-idbi-text font-bold block leading-none font-sans">Simulated path</span>
                <span className="text-[8px] text-idbi-textSec font-medium font-sans">What-if scenario outcome ({projected.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          <div className="pt-3.5 border-t border-idbi-border flex items-start space-x-1 text-[9px] text-idbi-textSec leading-normal">
            <Info className="h-3.5 w-3.5 text-idbi-green mt-0.5 flex-shrink-0" />
            <span className="font-sans">The line graph projects trajectory trends based on the current adjustment factors.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
