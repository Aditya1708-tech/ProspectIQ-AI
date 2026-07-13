import React, { useState } from 'react';
import { LineChart, BarChart2, Info } from 'lucide-react';
import { ForecastMetric } from '../../services/ai-client.js';

interface PredictionTrendChartsProps {
  relationshipHealth: ForecastMetric;
  savingsHealth: ForecastMetric;
  customerEngagement: ForecastMetric;
}

export const PredictionTrendCharts: React.FC<PredictionTrendChartsProps> = ({
  relationshipHealth,
  savingsHealth,
  customerEngagement
}) => {
  const [activeMetric, setActiveMetric] = useState<'health' | 'savings' | 'engagement'>('health');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const getMetricData = () => {
    switch (activeMetric) {
      case 'savings': return { title: 'Savings Health Projections', color: 'var(--idbi-green)', metric: savingsHealth };
      case 'engagement': return { title: 'Engagement Index Projections', color: 'var(--idbi-orange)', metric: customerEngagement };
      default: return { title: 'Relationship Health Projections', color: 'var(--idbi-dark-green)', metric: relationshipHealth };
    }
  };

  const { title, color, metric } = getMetricData();

  // Coordinates mapping
  const points = [
    { label: 'Today', value: metric.currentValue, x: 40, y: 150 - (metric.currentValue * 1.2), desc: 'Baseline current record' },
    { label: '30 Days', value: metric.d30.predictedValue, x: 140, y: 150 - (metric.d30.predictedValue * 1.2), desc: metric.d30.reason },
    { label: '90 Days', value: metric.d90.predictedValue, x: 240, y: 150 - (metric.d90.predictedValue * 1.2), desc: metric.d90.reason },
    { label: '180 Days', value: metric.d180.predictedValue, x: 340, y: 150 - (metric.d180.predictedValue * 1.2), desc: metric.d180.reason }
  ];

  // Build SVG Path
  const dPath = `M ${points[0].x} ${points[0].y} ` +
    `L ${points[1].x} ${points[1].y} ` +
    `L ${points[2].x} ${points[2].y} ` +
    `L ${points[3].x} ${points[3].y}`;

  const dAreaPath = `${dPath} L 340 150 L 40 150 Z`;

  return (
    <div className="bg-idbi-card border border-idbi-border rounded-[14px] p-6 shadow-md space-y-6">
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-idbi-border gap-3">
        <div className="flex items-center space-x-2">
          <LineChart className="h-4.5 w-4.5 text-idbi-orange" />
          <h4 className="text-xs font-bold text-idbi-text uppercase tracking-wider">{title}</h4>
        </div>

        <div className="flex bg-idbi-bg p-1 rounded-xl border border-idbi-border gap-1 self-stretch sm:self-auto">
          {(['health', 'savings', 'engagement'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setActiveMetric(m); setHoveredPoint(null); }}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all duration-200
                ${activeMetric === m ? 'bg-idbi-orange text-white shadow-sm shadow-idbi-orange/25' : 'text-idbi-textSec hover:text-idbi-text'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 relative flex justify-center bg-idbi-bg border border-idbi-border rounded-2xl p-4">
          <svg viewBox="0 0 380 170" className="w-full max-w-[450px]">
            {/* Grid Lines */}
            <line x1="40" y1="30" x2="340" y2="30" stroke="var(--idbi-border)" strokeWidth="1" strokeDasharray="3" />
            <line x1="40" y1="90" x2="340" y2="90" stroke="var(--idbi-border)" strokeWidth="1" strokeDasharray="3" />
            <line x1="40" y1="150" x2="340" y2="150" stroke="var(--idbi-border)" strokeWidth="1" />

            {/* Y Axis Labels */}
            <text x="30" y="34" fill="var(--idbi-text-sec)" fontSize="8" textAnchor="end" fontFamily="monospace">100%</text>
            <text x="30" y="94" fill="var(--idbi-text-sec)" fontSize="8" textAnchor="end" fontFamily="monospace">50%</text>
            <text x="30" y="154" fill="var(--idbi-text-sec)" fontSize="8" textAnchor="end" fontFamily="monospace">0%</text>

            {/* Gradient Fill */}
            <defs>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Path */}
            <path d={dAreaPath} fill="url(#areaGrad)" />

            {/* Line Path */}
            <path d={dPath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* X Axis Labels & Interactive Circles */}
            {points.map((pt, idx) => (
              <g key={idx}>
                {/* Vertical dot tracker line */}
                {hoveredPoint === idx && (
                  <line x1={pt.x} y1="30" x2={pt.x} y2="150" stroke="var(--idbi-border)" strokeWidth="1" strokeDasharray="2" />
                )}

                {/* Main point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint === idx ? 6 : 4}
                  fill={color}
                  stroke="var(--idbi-card)"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredPoint(idx)}
                />

                {/* X axis labels */}
                <text x={pt.x} y="165" fill="var(--idbi-text-sec)" fontSize="8" textAnchor="middle" fontWeight="bold">
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Selected Data Point Detail Panel */}
        <div className="lg:col-span-1 bg-idbi-bg border border-idbi-border rounded-2xl p-4 flex flex-col justify-between h-full min-h-[160px]">
          {hoveredPoint !== null ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[8px] text-idbi-textSec font-bold uppercase tracking-wider">{points[hoveredPoint].label} Projection</span>
                <span className="px-2 py-0.5 bg-idbi-card border border-idbi-border rounded-lg text-[10px] font-black text-idbi-text font-mono">
                  {points[hoveredPoint].value.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-idbi-orange font-bold uppercase tracking-wider block">Projection Reasoning</span>
                <p className="text-[10px] text-idbi-textSec leading-relaxed font-semibold">
                  {points[hoveredPoint].desc}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-6 text-idbi-textSec space-y-2">
              <Info className="h-5 w-5 text-idbi-green" />
              <p className="text-[10px] leading-normal font-medium max-w-[160px]">
                Hover or click on the chart vertices to view specific timeline forecast descriptions.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-idbi-border flex items-center justify-between text-[8px] text-idbi-textSec font-black uppercase tracking-wider">
            <span>Forecast Period:</span>
            <span className="text-idbi-text font-mono">180 Days Max</span>
          </div>
        </div>
      </div>
    </div>
  );
};
