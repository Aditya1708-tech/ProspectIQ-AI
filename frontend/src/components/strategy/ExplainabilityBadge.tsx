import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ExplainabilityBadgeProps {
  score: number;
  rating: string;
  onClick: () => void;
}

export const ExplainabilityBadge: React.FC<ExplainabilityBadgeProps> = ({ score, rating, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 py-1 px-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/40 text-indigo-300 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-inner animate-pulse"
      title="Click to view AI Explainability Report"
    >
      <HelpCircle className="h-3.5 w-3.5" />
      <span>Audit: {rating} ({score.toFixed(0)}%)</span>
    </button>
  );
};
