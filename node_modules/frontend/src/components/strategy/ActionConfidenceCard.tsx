import React from 'react';
import type { NBAIQConfidenceDetails } from '../../services/api.js';

interface ActionConfidenceCardProps {
  confidence: NBAIQConfidenceDetails;
}

export const ActionConfidenceCard: React.FC<ActionConfidenceCardProps> = ({ confidence }) => {
  const { overallScore, trustLayerQuality, dataCompleteness, priorityConfidence, portfolioConfidence, interactionCoverage } = confidence;

  // SVG Ring calculation
  const radius = 50;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return { text: 'HIGH', color: 'text-idbi-green' };
    if (score >= 55) return { text: 'MEDIUM', color: 'text-idbi-orange' };
    return { text: 'LOW', color: 'text-idbi-error' };
  };

  const level = getConfidenceLevel(overallScore);

  return (
    <div className="bg-idbi-card border border-idbi-border rounded-[14px] p-6 shadow-md space-y-4">
      <span className="text-[10px] text-idbi-textSec font-bold uppercase tracking-wider block font-sans">Workflow Telemetry Confidence</span>

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
              <span className="text-xl font-black text-idbi-text">{overallScore.toFixed(0)}%</span>
              <span className={`text-[8px] block font-bold uppercase font-sans ${level.color}`}>{level.text} CONF</span>
            </div>
          </div>
        </div>

        {/* Right Side: Progress dimensions breakdown */}
        <div className="md:col-span-8 space-y-3">
          {[
            { label: 'TrustLayer Quality', val: trustLayerQuality, desc: 'Assesses document accuracy and data error levels.' },
            { label: 'KYC Data Completeness', val: dataCompleteness, desc: 'Calculates the ratio of verified demographic registry inputs.' },
            { label: 'Priority Consistency', val: priorityConfidence, desc: 'Derived from urgency matrices and segment priority rankings.' },
            { label: 'Portfolio Stability', val: portfolioConfidence, desc: 'Measures risk category profiles and asset holdings.' },
            { label: 'Interaction Coverage', val: interactionCoverage, desc: 'Measures standard touchpoint frequency and SLA windows.' }
          ].map((dim, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="font-bold text-idbi-textSec uppercase font-sans">{dim.label}</span>
                <span className="font-mono font-bold text-idbi-green">{dim.val}%</span>
              </div>
              <div className="w-full bg-idbi-bg h-1.5 rounded-full overflow-hidden border border-idbi-border">
                <div 
                  className="bg-idbi-green h-full rounded-full transition-all duration-1000"
                  style={{ width: `${dim.val}%` }}
                />
              </div>
              <span className="text-[9px] text-idbi-textSec block leading-tight font-semibold italic font-sans">{dim.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
