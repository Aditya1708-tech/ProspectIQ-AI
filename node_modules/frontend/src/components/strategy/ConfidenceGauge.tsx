import React from 'react';
import type { ConfidenceModel } from '../../services/api.js';

interface ConfidenceGaugeProps {
  model: ConfidenceModel;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ model }) => {
  const { overallConfidence, dataCompleteness, behaviorConsistency, interactionCoverage, portfolioContext } = model;
  
  // SVG Ring calculation
  const radius = 45;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallConfidence / 100) * circumference;

  return (
    <div className="space-y-6">
      <span className="text-[10px] text-idbi-textSec font-bold uppercase tracking-wider block font-sans">Decision Telemetry Confidence</span>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Circular SVG Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-idbi-bg border border-idbi-border rounded-2xl">
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="var(--idbi-border)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="var(--idbi-green)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-black text-idbi-text">{overallConfidence.toFixed(0)}%</span>
              <span className="text-[8px] block font-bold text-idbi-textSec uppercase font-sans">Confidence</span>
            </div>
          </div>
        </div>

        {/* Right Side: Progress dimensions breakdown */}
        <div className="md:col-span-8 space-y-3">
          {[
            { label: 'KYC Data Completeness', val: dataCompleteness.score, desc: dataCompleteness.explanation },
            { label: 'Behavioral Consistency', val: behaviorConsistency.score, desc: behaviorConsistency.explanation },
            { label: 'RM Interaction SLA Coverage', val: interactionCoverage.score, desc: interactionCoverage.explanation },
            { label: 'Segment Context Integrity', val: portfolioContext.score, desc: portfolioContext.explanation }
          ].map((dim, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="font-bold text-idbi-textSec uppercase font-sans">{dim.label}</span>
                <span className="font-mono font-bold text-idbi-orange">{dim.val}%</span>
              </div>
              <div className="w-full bg-idbi-bg h-1.5 rounded-full overflow-hidden border border-idbi-border">
                <div 
                  className="bg-idbi-orange h-full rounded-full transition-all duration-1000"
                  style={{ width: `${dim.val}%` }}
                />
              </div>
              <span className="text-[9px] text-idbi-textSec leading-normal block italic font-sans">{dim.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
