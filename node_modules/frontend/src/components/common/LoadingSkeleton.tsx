import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI block skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-900/30 border border-white/5 rounded-2xl h-24" />
        ))}
      </div>
      
      {/* Dashboard sections skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/30 border border-white/5 rounded-3xl h-64" />
          <div className="bg-slate-900/30 border border-white/5 rounded-3xl h-80" />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/30 border border-white/5 rounded-3xl h-96" />
          <div className="bg-slate-900/30 border border-white/5 rounded-3xl h-48" />
        </div>
      </div>
    </div>
  );
};
