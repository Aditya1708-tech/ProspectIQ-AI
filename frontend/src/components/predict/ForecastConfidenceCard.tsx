import React from 'react';
import { Award, ShieldAlert, Sparkles, Heart } from 'lucide-react';

interface ForecastConfidenceCardProps {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const ForecastConfidenceCard: React.FC<ForecastConfidenceCardProps> = ({ confidence }) => {
  const getMetrics = (conf: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (conf) {
      case 'HIGH':
        return [
          { name: 'Trust Layer Quality', score: 92, status: 'Optimal' },
          { name: 'Data Completeness', score: 90, status: 'Satisfactory' },
          { name: 'Transaction Coverage', score: 88, status: 'Satisfactory' },
          { name: 'Interaction Coverage', score: 85, status: 'Satisfactory' },
          { name: 'Relationship Stability', score: 90, status: 'Optimal' },
          { name: 'Prediction Stability', score: 88, status: 'Optimal' }
        ];
      case 'LOW':
        return [
          { name: 'Trust Layer Quality', score: 48, status: 'Deficient' },
          { name: 'Data Completeness', score: 55, status: 'Deficient' },
          { name: 'Transaction Coverage', score: 40, status: 'Insufficient' },
          { name: 'Interaction Coverage', score: 35, status: 'Insufficient' },
          { name: 'Relationship Stability', score: 42, status: 'Deficient' },
          { name: 'Prediction Stability', score: 45, status: 'Insufficient' }
        ];
      default:
        return [
          { name: 'Trust Layer Quality', score: 78, status: 'Standard' },
          { name: 'Data Completeness', score: 80, status: 'Standard' },
          { name: 'Transaction Coverage', score: 72, status: 'Standard' },
          { name: 'Interaction Coverage', score: 68, status: 'Standard' },
          { name: 'Relationship Stability', score: 75, status: 'Standard' },
          { name: 'Prediction Stability', score: 78, status: 'Standard' }
        ];
    }
  };

  const metrics = getMetrics(confidence);

  const getBadgeColor = (conf: string) => {
    if (conf === 'HIGH') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (conf === 'MEDIUM') return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 65) return 'bg-indigo-500';
    return 'bg-amber-500';
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <span className="text-xs font-bold text-white uppercase tracking-wider">Confidence Integrity Model</span>
        <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${getBadgeColor(confidence)}`}>
          {confidence} Confidence
        </span>
      </div>

      {/* Metrics breakdown */}
      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
              <span>{metric.name}</span>
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-slate-500 text-[9px] uppercase font-bold">{metric.status}</span>
                <span className="text-white font-bold">{metric.score}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full ${getScoreColor(metric.score)} rounded-full transition-all duration-1000`}
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
