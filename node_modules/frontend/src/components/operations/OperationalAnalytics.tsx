import React, { useState } from 'react';
import { BarChart, Compass, Info } from 'lucide-react';
import { OperationalAnalytics as AnalyticsData } from '../../services/ai-client.js';

interface OperationalAnalyticsProps {
  analytics: AnalyticsData;
}

export const OperationalAnalytics: React.FC<OperationalAnalyticsProps> = ({ analytics }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'growth' | 'usage'>('requests');

  const getUsageDataList = () => {
    return Object.entries(analytics.engineUsage).map(([engine, count]) => ({
      engine,
      count
    })).sort((a, b) => b.count - a.count);
  };

  const renderUsageProgress = () => {
    const list = getUsageDataList();
    const maxVal = Math.max(...list.map(l => l.count), 1);

    return (
      <div className="space-y-4">
        {list.slice(0, 6).map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-semibold text-idbi-textSec">
              <span>{item.engine}</span>
              <span className="font-mono text-idbi-text">{item.count} queries</span>
            </div>
            <div className="w-full bg-idbi-bg h-2 rounded-full overflow-hidden border border-idbi-border">
              <div 
                className="h-full bg-idbi-orange rounded-full transition-all duration-500" 
                style={{ width: `${(item.count / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRequestsSVG = () => {
    const data = analytics.dailyAIRequests || [];
    const maxVal = Math.max(...data.map((d: any) => d.count), 1);
    const width = 360;
    const height = 120;
    const padding = 20;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[450px] mx-auto">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--idbi-border)" strokeWidth="1" />
        
        {data.map((d: any, i: number) => {
          const barW = 20;
          const spacing = (width - padding * 2) / (data.length || 1);
          const x = padding + (i * spacing) + (spacing - barW) / 2;
          const barH = (d.count * (height - padding * 2)) / maxVal;
          const y = height - padding - barH;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill="var(--idbi-orange)"
                rx="3.5"
                opacity="0.85"
                className="hover:opacity-100 transition-opacity duration-200"
              />
              <text x={x + barW / 2} y={height - 5} fill="var(--idbi-text-sec)" fontSize="8" textAnchor="middle" fontWeight="bold">
                {d.date.substring(5)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderGrowthSVG = () => {
    const data = analytics.monthlyCustomerGrowth || [];
    const maxVal = Math.max(...data.map((d: any) => d.count), 1);
    const width = 360;
    const height = 120;
    const padding = 20;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[450px] mx-auto">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--idbi-border)" strokeWidth="1" />

        {data.map((d: any, i: number) => {
          const barW = 22;
          const spacing = (width - padding * 2) / (data.length || 1);
          const x = padding + (i * spacing) + (spacing - barW) / 2;
          const barH = (d.count * (height - padding * 2)) / maxVal;
          const y = height - padding - barH;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill="var(--idbi-green)"
                rx="4"
                opacity="0.8"
                className="hover:opacity-100 transition-opacity duration-200"
              />
              <text x={x + barW / 2} y={height - 5} fill="var(--idbi-text-sec)" fontSize="8" textAnchor="middle" fontWeight="bold">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-idbi-card border border-idbi-border rounded-[14px] p-6 shadow-md space-y-6">
      {/* Header and selector tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-idbi-border gap-3">
        <div className="flex items-center space-x-2">
          <BarChart className="h-4.5 w-4.5 text-idbi-orange" />
          <h4 className="text-xs font-bold text-idbi-text uppercase tracking-wider font-sans">Operational Analytics</h4>
        </div>

        <div className="flex bg-idbi-bg p-1 rounded-xl border border-idbi-border gap-1 self-stretch sm:self-auto">
          {(['requests', 'growth', 'usage'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all duration-200
                ${activeTab === tab ? 'bg-idbi-orange text-white shadow-sm shadow-idbi-orange/25' : 'text-idbi-textSec hover:text-idbi-text'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Render Graph Container */}
        <div className="md:col-span-2 relative bg-idbi-bg border border-idbi-border rounded-2xl p-4 min-h-[150px] flex items-center justify-center">
          {activeTab === 'requests' && renderRequestsSVG()}
          {activeTab === 'growth' && renderGrowthSVG()}
          {activeTab === 'usage' && renderUsageProgress()}
        </div>

        {/* Info Legend Panel */}
        <div className="md:col-span-1 bg-idbi-bg border border-idbi-border rounded-2xl p-4 space-y-4">
          <span className="text-[9px] font-black text-idbi-textSec uppercase tracking-widest block font-sans">Dashboard briefing</span>
          
          <div className="space-y-2">
            <span className="text-[10px] text-idbi-text font-bold block font-sans">Telemetry charts</span>
            <p className="text-[9px] text-idbi-textSec leading-normal font-semibold font-sans">
              Select tabs at the top to toggle queries capacity, customer metrics growth multipliers, and processing engine query footprints.
            </p>
          </div>

          <div className="pt-3 border-t border-idbi-border flex items-start space-x-1 text-[8px] text-idbi-textSec leading-normal font-sans">
            <Info className="h-3 w-3 text-idbi-green mt-0.5 flex-shrink-0" />
            <span>Data is calculated locally in-memory and reflects operational telemetry volumes.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
