import React from 'react';
import { Award, Compass, Heart, Activity } from 'lucide-react';
import { RelationshipForecast } from '../../services/ai-client.js';

interface RelationshipForecastCardProps {
  relationship: RelationshipForecast;
}

export const RelationshipForecastCard: React.FC<RelationshipForecastCardProps> = ({ relationship }) => {
  const {
    predictedHealth,
    predictedStage,
    momentum,
    predictedEngagement,
    sentiment,
    rmCoverage,
    expectedDirection
  } = relationship;

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <Compass className="h-4.5 w-4.5 text-indigo-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Relationship Projection (90-Day Outlook)</h4>
      </div>

      <div className="space-y-3.5">
        {/* Metric rows */}
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
          <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-rose-400" /> Projected Health Score</span>
          <span className="text-white font-mono font-bold text-xs">{predictedHealth}%</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
          <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-indigo-400" /> Predicted Engagement Index</span>
          <span className="text-white font-mono font-bold text-xs">{predictedEngagement}%</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
          <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-amber-400" /> Target Relationship Stage</span>
          <span className="text-white font-bold">{predictedStage}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
        <span>Direction Trend:</span>
        <span className="text-indigo-400">{expectedDirection}</span>
      </div>
    </div>
  );
};
