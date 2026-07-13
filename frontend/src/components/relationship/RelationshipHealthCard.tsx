import React from 'react';
import { Heart, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RelationshipHealthCardProps {
  health: {
    score: number;
    category: string;
    positiveDrivers: string[];
    negativeDrivers: string[];
    confidence: string;
  };
}

export const RelationshipHealthCard: React.FC<RelationshipHealthCardProps> = ({ health }) => {
  const { score, category, positiveDrivers, negativeDrivers, confidence } = health;

  // Determine colors based on category
  const getCategoryStyles = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'healthy':
        return {
          bg: 'from-emerald-500/20 to-teal-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          gaugeColor: '#10b981'
        };
      case 'growing':
        return {
          bg: 'from-blue-500/20 to-indigo-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          gaugeColor: '#3b82f6'
        };
      case 'needs attention':
        return {
          bg: 'from-amber-500/20 to-orange-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          gaugeColor: '#f59e0b'
        };
      default:
        return {
          bg: 'from-rose-500/20 to-red-500/10',
          text: 'text-rose-400',
          border: 'border-rose-500/30',
          gaugeColor: '#f43f5e'
        };
    }
  };

  const styles = getCategoryStyles(category);

  // SVG Gauge calculations
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-slate-900/30 border ${styles.border} rounded-3xl p-6 shadow-xl space-y-6 transition-all duration-300 hover:shadow-2xl hover:border-white/10`}>
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 bg-slate-950 border border-white/5 rounded-xl ${styles.text}`}>
            <Heart className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Relationship Health Index</h4>
            <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Composite telemetry monitoring</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Confidence Rating</span>
          <span className="text-xs font-mono font-black text-teal-400 flex items-center gap-1 justify-end">
            <ShieldCheck className="h-3.5 w-3.5" />
            {confidence}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Animated Gauge Arc */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke={styles.gaugeColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white leading-none tracking-tighter">
                {score}%
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wide mt-1.5 px-2 py-0.5 rounded-full bg-slate-950 border border-white/5 ${styles.text}`}>
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Drivers Analysis */}
        <div className="md:col-span-7 space-y-4">
          {/* Positive Drivers */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">Strengthening Factors</span>
            <div className="space-y-1.5">
              {positiveDrivers.map((driver, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Negative Drivers */}
          {negativeDrivers.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider block">Attention Areas</span>
              <div className="space-y-1.5">
                {negativeDrivers.map((driver, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
