import React from 'react';

export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div 
          key={n} 
          className="bg-slate-900/45 border border-white/5 p-4 rounded-2xl space-y-3 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-2 w-1/4 bg-slate-800 rounded"></div>
            <div className="h-2.5 w-12 bg-slate-800 rounded"></div>
          </div>
          <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
          <div className="h-2 w-full bg-slate-800 rounded"></div>
          <div className="h-2 w-1/2 bg-slate-800 rounded"></div>
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <div className="h-2 w-20 bg-slate-800 rounded"></div>
            <div className="h-3 w-16 bg-slate-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
