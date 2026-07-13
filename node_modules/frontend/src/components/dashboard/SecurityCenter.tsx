import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SecuritySummary } from '../../services/ai-client.js';

interface SecurityCenterProps {
  security: SecuritySummary;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({ security }) => {
  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="h-4.5 w-4.5 text-indigo-400" />
            <span>Governance Security Center</span>
          </span>
          <span className="text-[8px] font-bold text-slate-500 uppercase font-mono">
            Calibrated Score
          </span>
        </div>

        {/* Security Health Score Card */}
        <div className="flex items-center space-x-3.5 p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
          <div>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Security posture score</span>
            <span className="text-base font-black text-white font-mono">{security.securityHealthScore}%</span>
          </div>
        </div>

        {/* Counts List */}
        <div className="space-y-2 pt-1.5">
          <div className="flex justify-between items-center bg-slate-950/20 border border-white/5 rounded-xl px-3.5 py-2 text-[10px]">
            <span className="text-slate-400 font-semibold">Failed Login Attempts</span>
            <span className={`font-mono font-bold ${security.failedLoginAttempts > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
              {security.failedLoginAttempts}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/20 border border-white/5 rounded-xl px-3.5 py-2 text-[10px]">
            <span className="text-slate-400 font-semibold">Account Lockouts</span>
            <span className={`font-mono font-bold ${security.accountLockouts > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              {security.accountLockouts}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/20 border border-white/5 rounded-xl px-3.5 py-2 text-[10px]">
            <span className="text-slate-400 font-semibold">Suspicious Activities</span>
            <span className={`font-mono font-bold ${security.suspiciousActivities > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
              {security.suspiciousActivities}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/20 border border-white/5 rounded-xl px-3.5 py-2 text-[10px]">
            <span className="text-slate-400 font-semibold">Audit Violations</span>
            <span className={`font-mono font-bold ${security.auditViolations > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              {security.auditViolations}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[8px] text-slate-500 font-black uppercase tracking-wider">
        <span>Inactive Users Count:</span>
        <span className="text-white font-mono">{security.inactiveUsers} Users</span>
      </div>
    </div>
  );
};
