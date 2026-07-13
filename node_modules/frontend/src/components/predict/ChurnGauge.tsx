import React from 'react';
import { AlertCircle, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ChurnPrediction } from '../../services/ai-client.js';

interface ChurnGaugeProps {
  churn: ChurnPrediction;
}

export const ChurnGauge: React.FC<ChurnGaugeProps> = ({ churn }) => {
  const { probability, riskCategory, primaryDrivers, recommendedRMWorkflow } = churn;

  // SVG parameters
  const radius = 55;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  const getColorClass = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-rose-500 stroke-rose-500 border-rose-500/20 bg-rose-500/10';
      case 'High': return 'text-orange-500 stroke-orange-500 border-orange-500/20 bg-orange-500/10';
      case 'Medium': return 'text-amber-500 stroke-amber-500 border-amber-500/20 bg-amber-500/10';
      default: return 'text-emerald-500 stroke-emerald-500 border-emerald-500/20 bg-emerald-500/10';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Critical': return <Flame className="h-4 w-4 text-rose-400 animate-pulse" />;
      case 'High': return <ShieldAlert className="h-4 w-4 text-orange-400" />;
      case 'Medium': return <AlertCircle className="h-4 w-4 text-amber-400" />;
      default: return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    }
  };

  const styleDetails = getColorClass(riskCategory);

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg border ${styleDetails.split(' ')[2]} ${styleDetails.split(' ')[3]}`}>
              {getRiskIcon(riskCategory)}
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Attrition Risk Analysis</h4>
          </div>
          <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${styleDetails.split(' ')[0]} ${styleDetails.split(' ')[2]}`}>
            {riskCategory} Risk
          </span>
        </div>

        {/* Circular Progress Gauge */}
        <div className="flex items-center justify-center py-2 relative">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <circle
              stroke="rgba(255, 255, 255, 0.03)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              className={`transition-all duration-1000 ease-out ${styleDetails.split(' ')[1]}`}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-black text-white leading-none block">{probability.toFixed(0)}%</span>
            <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Probability</span>
          </div>
        </div>

        {/* Drivers */}
        <div className="space-y-2">
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Risk Drivers</span>
          <div className="space-y-1.5">
            {primaryDrivers.map((driver: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-2 p-2 bg-slate-950/20 border border-white/5 rounded-xl text-[9px] text-slate-300 font-medium leading-relaxed">
                <span className="w-1 h-1 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                <span>{driver}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Playbook Workflow */}
      <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
        <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-wider block">Recommended RM Workflow</span>
        <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
          {recommendedRMWorkflow}
        </p>
      </div>
    </div>
  );
};
