import React from 'react';
import { ShieldAlert, ShieldCheck, Flame, Compass, AlertTriangle } from 'lucide-react';

interface RelationshipRisk {
  severity: string; // HIGH, MEDIUM, LOW
  reason: string;
  suggestedRMWorkflow: string;
  confidence: number;
}

interface RelationshipRiskPanelProps {
  risks: RelationshipRisk[];
}

export const RelationshipRiskPanel: React.FC<RelationshipRiskPanelProps> = ({ risks }) => {
  
  const getSeverityStyles = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'HIGH':
        return {
          bg: 'bg-red-950/20 border-red-500/30 hover:border-red-500/50',
          text: 'text-red-400',
          badge: 'bg-red-500/10 text-red-400 border-red-500/30'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50',
          text: 'text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
      default:
        return {
          bg: 'bg-slate-900/30 border-white/5 hover:border-white/10',
          text: 'text-slate-400',
          badge: 'bg-slate-800 text-slate-400 border-slate-700'
        };
    }
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="pb-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            <ShieldAlert className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Relationship Risks Desk</h4>
            <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Automated compliance & retention warnings</span>
          </div>
        </div>
        
        {risks.length === 0 ? (
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] font-black text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            No Risks Detected
          </span>
        ) : (
          <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] font-black text-red-400">
            {risks.length} Active Risks
          </span>
        )}
      </div>

      {risks.length === 0 ? (
        <div className="bg-emerald-950/5 border border-emerald-500/10 rounded-2xl p-5 text-center space-y-2">
          <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto" />
          <h5 className="text-xs font-bold text-emerald-400">Relationship is Secure</h5>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
            Data integrity checks, task completion SLAs, and engagement frequencies are fully compliant with relationship standards.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {risks.map((risk, idx) => {
            const styles = getSeverityStyles(risk.severity);
            return (
              <div key={idx} className={`border p-5 rounded-2xl flex items-start space-x-4 transition-all duration-200 ${styles.bg}`}>
                <div className={`p-2.5 bg-slate-950 border border-white/5 rounded-xl ${styles.text} flex-shrink-0`}>
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
                
                <div className="flex-1 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider ${styles.badge}`}>
                      {risk.severity} Risk
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold">
                      Confidence: {(risk.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider block">Risk Reason</span>
                    <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                      {risk.reason}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-white/5 rounded-xl space-y-1.5">
                    <span className="text-[8px] text-teal-400 uppercase font-black tracking-wider block flex items-center gap-1">
                      <Compass className="h-3 w-3" />
                      Suggested RM Workflow
                    </span>
                    <p className="text-[11px] text-slate-300 leading-normal font-semibold">
                      {risk.suggestedRMWorkflow}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
