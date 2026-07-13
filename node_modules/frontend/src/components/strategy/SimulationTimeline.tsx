import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { SimulationTimelineNode } from '../../services/ai-client.js';

interface SimulationTimelineProps {
  timeline: SimulationTimelineNode[];
}

export const SimulationTimeline: React.FC<SimulationTimelineProps> = ({ timeline }) => {
  
  const getConfidenceColor = (conf: string) => {
    if (conf === 'HIGH') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (conf === 'MEDIUM') return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <Calendar className="h-4.5 w-4.5 text-indigo-400" />
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulated Path Timeline</h4>
          <span className="text-[9px] text-slate-500 block font-medium mt-0.5">Projected event milestones based on what-if variables</span>
        </div>
      </div>

      {/* Timeline flow */}
      <div className="relative border-l border-white/5 pl-6 ml-3 space-y-8 py-2">
        {timeline.map((node, idx) => {
          const confColor = getConfidenceColor(node.confidence);

          return (
            <div key={idx} className="relative">
              {/* Bullet circle */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 bg-slate-950 border-2 border-indigo-500/50 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
              </div>

              <div className="space-y-2 bg-slate-950/20 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors duration-200">
                {/* Top Row */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider block">{node.timeframe}</span>
                    <h5 className="text-xs font-bold text-white leading-relaxed">{node.expectedEvent}</h5>
                  </div>
                  <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${confColor}`}>
                    {node.confidence} Confidence
                  </span>
                </div>

                {/* Metric Change details */}
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  {node.expectedMetricChange}
                </p>

                {/* Recommended RM Action */}
                <div className="pt-2 border-t border-white/5 flex items-start space-x-1.5 mt-2 text-[10px] text-slate-300">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold leading-relaxed">
                    <strong className="text-indigo-400 font-bold">Recommended workflow action:</strong> {node.recommendedRMAction}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
