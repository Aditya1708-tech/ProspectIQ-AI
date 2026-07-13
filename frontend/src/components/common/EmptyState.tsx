import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "No system record data logged." }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-900/10 border border-dashed border-white/5 rounded-2xl space-y-2 min-h-[150px]">
      <HelpCircle className="h-6 w-6 text-slate-600" />
      <p className="text-xs text-slate-400 font-semibold">{message}</p>
    </div>
  );
};
