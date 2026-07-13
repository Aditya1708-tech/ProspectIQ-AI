import React from 'react';
import { Users, Briefcase, Database, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { PlatformHealthSummary } from '../../services/ai-client.js';

interface PlatformSummaryProps {
  summary: PlatformHealthSummary;
}

export const PlatformSummary: React.FC<PlatformSummaryProps> = ({ summary }) => {
  const statsList = [
    { label: "Total Platform Users", value: summary.totalUsers, desc: `${summary.relationshipManagers} RMs | ${summary.branchManagers} BMs`, icon: <Users className="h-4.5 w-4.5 text-indigo-400" /> },
    { label: "Active Bank Branches", value: summary.branches, desc: "BR001 to BR008 configured", icon: <Briefcase className="h-4.5 w-4.5 text-teal-400" /> },
    { label: "Total Client Profiles", value: summary.customers, desc: "MSME & Retail portfolios", icon: <Database className="h-4.5 w-4.5 text-amber-400" /> },
    { label: "Analyses Computed Today", value: summary.todayAnalyses, desc: "Descriptive & Predictive", icon: <Cpu className="h-4.5 w-4.5 text-pink-400" /> }
  ];

  const getStatusStyle = (status: string) => {
    if (status === 'HEALTHY') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'DEGRADED') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((stat, idx) => (
          <div key={idx} className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all duration-200">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">{stat.label}</span>
              <span className="p-1.5 bg-slate-950 border border-white/5 rounded-xl block">
                {stat.icon}
              </span>
            </div>
            <div className="mt-3 space-y-0.5">
              <span className="text-xl font-black text-white font-mono">{stat.value}</span>
              <p className="text-[9px] text-slate-400 font-medium">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Services status indicator bar */}
      <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Runtime Services Registry</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex justify-between items-center bg-slate-950/40 border border-white/5 rounded-2xl p-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Backend Gateway</span>
            <span className={`px-2.5 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${getStatusStyle(summary.backendStatus)}`}>
              {summary.backendStatus}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/40 border border-white/5 rounded-2xl p-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Frontend App</span>
            <span className={`px-2.5 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${getStatusStyle(summary.frontendStatus)}`}>
              {summary.frontendStatus}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/40 border border-white/5 rounded-2xl p-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PostgreSQL Database</span>
            <span className={`px-2.5 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${getStatusStyle(summary.databaseStatus)}`}>
              {summary.databaseStatus}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/40 border border-white/5 rounded-2xl p-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PlatformIQ Engine</span>
            <span className={`px-2.5 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${getStatusStyle(summary.aiStatus)}`}>
              {summary.aiStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
