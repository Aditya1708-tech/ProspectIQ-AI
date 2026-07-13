import React, { useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';

interface TrendPoint {
  month: string;
  health: number;
  digital: number;
  trust: number;
}

interface RelationshipTrendChartsProps {
  currentScore: number;
  digitalAdoption: number;
  trustScore: number;
}

export const RelationshipTrendCharts: React.FC<RelationshipTrendChartsProps> = ({
  currentScore,
  digitalAdoption,
  trustScore
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate 6 months of historical trend points closing with current data
  const data: TrendPoint[] = [
    { month: 'Jan', health: Math.max(30, currentScore - 15), digital: Math.max(30, digitalAdoption - 10), trust: Math.max(30, trustScore - 5) },
    { month: 'Feb', health: Math.max(30, currentScore - 10), digital: Math.max(30, digitalAdoption - 8), trust: Math.max(30, trustScore - 4) },
    { month: 'Mar', health: Math.max(30, currentScore - 12), digital: Math.max(30, digitalAdoption - 5), trust: Math.max(30, trustScore - 2) },
    { month: 'Apr', health: Math.max(30, currentScore - 5), digital: Math.max(30, digitalAdoption - 2), trust: Math.max(30, trustScore - 2) },
    { month: 'May', health: Math.max(30, currentScore - 2), digital: Math.max(30, digitalAdoption - 1), trust: Math.max(30, trustScore) },
    { month: 'Jun', health: currentScore, digital: digitalAdoption, trust: trustScore }
  ];

  // SVG dimensions
  const width = 600;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Scale calculations
  const getX = (idx: number) => paddingLeft + (idx / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - (val / 100) * chartHeight;

  // Build SVG path generators
  const generatePath = (key: 'health' | 'digital' | 'trust') => {
    return data.map((pt, idx) => {
      const x = getX(idx);
      const y = getY(pt[key]);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const healthPath = generatePath('health');
  const digitalPath = generatePath('digital');
  const trustPath = generatePath('trust');

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="pb-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Relationship Telemetry Trends</h4>
            <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Historical drift index over 6 months</span>
          </div>
        </div>
        <div className="text-right flex items-center gap-1.5 text-[10px] text-slate-500">
          <Info className="h-3.5 w-3.5" />
          <span>Hover chart for values</span>
        </div>
      </div>

      <div className="relative">
        {/* Custom SVG Line Chart */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((grid, idx) => {
            const y = getY(grid);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--idbi-border)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  fill="var(--idbi-text-sec)"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {grid}
                </text>
              </g>
            );
          })}

          {/* Month markers (X axis) */}
          {data.map((pt, idx) => {
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - 8}
                fill="var(--idbi-text-sec)"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {pt.month}
              </text>
            );
          })}

          {/* Trend lines */}
          {/* Trust Index */}
          <path
            d={trustPath}
            fill="none"
            stroke="var(--idbi-orange)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Digital Adoption */}
          <path
            d={digitalPath}
            fill="none"
            stroke="var(--idbi-muted)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Health Index */}
          <path
            d={healthPath}
            fill="none"
            stroke="var(--idbi-green)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Vertical highlight bar on hover */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingTop}
              x2={getX(hoveredIndex)}
              y2={height - paddingBottom}
              stroke="var(--idbi-border)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Data Points and Interactivity anchors */}
          {data.map((pt, idx) => {
            const x = getX(idx);
            return (
              <g
                key={idx}
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  setHoveredPoint(pt);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setHoveredPoint(null);
                }}
                className="cursor-pointer"
              >
                {/* Invisible hover capture block */}
                <rect
                  x={x - 20}
                  y={paddingTop}
                  width="40"
                  height={chartHeight}
                  fill="transparent"
                />
                
                {/* Health Indicator Circle */}
                <circle
                  cx={x}
                  cy={getY(pt.health)}
                  r={hoveredIndex === idx ? '5' : '3'}
                  fill="var(--idbi-green)"
                  stroke="var(--idbi-card)"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white border border-idbi-border rounded-xl p-3 shadow-2xl space-y-1.5 min-w-[120px] z-30">
            <span className="text-[9px] text-idbi-textSec font-black uppercase tracking-wider block border-b border-idbi-border pb-1">
              {hoveredPoint.month} Indicators
            </span>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between items-center gap-4">
                <span className="text-idbi-green font-bold">Health Score:</span>
                <span className="text-idbi-text font-black">{hoveredPoint.health}%</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-idbi-textSec font-bold">Digital Index:</span>
                <span className="text-idbi-text font-black">{hoveredPoint.digital}%</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-idbi-orange font-bold">Trust Index:</span>
                <span className="text-idbi-text font-black">{hoveredPoint.trust}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-5 pt-2 border-t border-idbi-border text-[10px] font-bold text-idbi-textSec">
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00836C]"></span>
          <span>Health Score</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#6A737D]"></span>
          <span>Digital Adoption</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F58220]"></span>
          <span>Trust Index</span>
        </div>
      </div>
    </div>
  );
};
