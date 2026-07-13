import React from 'react';
import { Compass, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { DecisionMatrix } from '../../services/ai-client.js';

interface DecisionMatrixCardProps {
  decision: DecisionMatrix;
}

export const DecisionMatrixCard: React.FC<DecisionMatrixCardProps> = ({ decision }) => {
  const { category, reason, expectedOutcome, confidence } = decision;

  const getStyle = (cat: string) => {
    switch (cat) {
      case 'Highly Beneficial':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          text: 'text-emerald-400',
          icon: <CheckCircle className="h-5 w-5 text-emerald-400" />
        };
      case 'Beneficial':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30',
          text: 'text-indigo-400',
          icon: <CheckCircle className="h-5 w-5 text-indigo-400" />
        };
      case 'High Risk':
        return {
          bg: 'bg-red-500/10 border-red-500/30',
          text: 'text-red-400',
          icon: <AlertTriangle className="h-5 w-5 text-red-400" />
        };
      case 'Negative':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30',
          text: 'text-rose-400',
          icon: <AlertTriangle className="h-5 w-5 text-rose-400" />
        };
      default:
        return {
          bg: 'bg-slate-900/30 border-white/5',
          text: 'text-slate-400',
          icon: <HelpCircle className="h-5 w-5 text-slate-400" />
        };
    }
  };

  const style = getStyle(category);

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="h-4.5 w-4.5 text-indigo-400" />
            <span>Decision Support Matrix</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">
            Calibrated Index
          </span>
        </div>

        {/* Category Big Status Bar */}
        <div className={`flex items-center space-x-3 p-4 border rounded-2xl ${style.bg}`}>
          {style.icon}
          <div className="space-y-0.5">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Decision classification</span>
            <span className={`text-sm font-black uppercase tracking-wider ${style.text}`}>{category}</span>
          </div>
        </div>

        {/* Reason details */}
        <div className="space-y-3.5 pt-1">
          <div className="space-y-1">
            <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-wider block">Matrix Justification</span>
            <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">
              {reason}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[8px] text-teal-400 font-bold uppercase tracking-wider block">Projected Outcome</span>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              {expectedOutcome}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
        <span>Calibration Confidence:</span>
        <span className="text-white font-mono">{confidence}</span>
      </div>
    </div>
  );
};
