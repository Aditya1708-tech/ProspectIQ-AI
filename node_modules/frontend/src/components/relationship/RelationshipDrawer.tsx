import React from 'react';
import { X, HelpCircle, ShieldAlert, BarChart3, Scale, Layers, AlertOctagon } from 'lucide-react';

interface RelationshipDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  healthScore: number;
}

export const RelationshipDrawer: React.FC<RelationshipDrawerProps> = ({ isOpen, onClose, healthScore }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-slate-950/95 border-l border-white/5 shadow-2xl flex flex-col justify-between h-full transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block mb-1">
              AI Explainability & Governance
            </span>
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-teal-400" />
              <span>RelationshipIQ Decision Logic</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Health Score Calculation Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wide flex items-center space-x-2">
              <Scale className="h-4.5 w-4.5 text-teal-400" />
              <span>Relationship Health Index Weights</span>
            </h4>
            
            <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-3 text-xs">
              <p className="text-slate-400 font-semibold leading-relaxed">
                The overall Relationship Health Score is currently calculated using a deterministic rules aggregation engine. It prevents bias by weighting the following dimensions:
              </p>
              
              <div className="space-y-2.5 pt-2 font-mono text-[10px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Data Integrity & Trust (TrustLayer)</span>
                  <span className="text-teal-400 font-black">20% Weight</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Client Engagement Cues (Interaction Freq)</span>
                  <span className="text-teal-400 font-black">20% Weight</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Digital Adoption (digitalPaymentRatio)</span>
                  <span className="text-teal-400 font-black">15% Weight</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>RM Workspace Tasks Completed</span>
                  <span className="text-teal-400 font-black">15% Weight</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Attrition & Churn Risk (100 - Risk)</span>
                  <span className="text-teal-400 font-black">20% Weight</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>PriorityIQ Opportunity Index</span>
                  <span className="text-teal-400 font-black">10% Weight</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center font-bold">
                <span className="text-slate-400">Resulting Score:</span>
                <span className="text-teal-400 text-sm font-black">{healthScore}%</span>
              </div>
            </div>
          </div>

          {/* Engagement Analytics Formula Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wide flex items-center space-x-2">
              <Layers className="h-4.5 w-4.5 text-blue-400" />
              <span>Engagement Metrics Breakdown</span>
            </h4>
            
            <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-4 text-[11px] text-slate-400 leading-normal">
              <div className="space-y-1">
                <strong className="text-slate-200 uppercase block text-[9px] tracking-wider text-blue-400">Interaction Score</strong>
                <span>Assesses the quantity of touchpoints combined with the days since last contact. Penalties accrue if the contact interval exceeds 15 days.</span>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-200 uppercase block text-[9px] tracking-wider text-blue-400">Follow-up Quality</strong>
                <span>Calculates the ratio of completed follow-up tasks to scheduled follow-up tasks to ensure continuous query resolution.</span>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-200 uppercase block text-[9px] tracking-wider text-blue-400">Response Consistency</strong>
                <span>Tracks task completion compliance against the assigned SLA due dates. Higher scores reflect timely task closures.</span>
              </div>
            </div>
          </div>

          {/* Risk Checks Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wide flex items-center space-x-2">
              <AlertOctagon className="h-4.5 w-4.5 text-rose-500" />
              <span>Risk Telemetry Rules</span>
            </h4>
            
            <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-3 text-xs text-slate-400 leading-relaxed">
              <p>
                ProspectIQ flags warnings if key operational or transactional parameters deviate from baseline standards:
              </p>
              <ul className="list-disc pl-4 space-y-2 pt-1 font-semibold text-[11px]">
                <li><strong className="text-slate-300">Contact Latency:</strong> Triggered when no interaction occurs for over 30 days.</li>
                <li><strong className="text-slate-300">Task Backlog:</strong> Triggered when the profile has overdue compliance or operational tasks.</li>
                <li><strong className="text-slate-300">Balance Decline:</strong> Flags cases where monthly outflows (debits) exceed incoming credits by 10%.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-950 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
          <span>ProspectIQ Explainability Module</span>
          <span>Engine Version 1.0.0</span>
        </div>

      </div>
    </div>
  );
};
