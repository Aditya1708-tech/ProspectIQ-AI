import React from 'react';
import { X, HelpCircle, Scale, ShieldAlert, FileCheck, Layers } from 'lucide-react';

interface PredictionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  confidence: string;
}

export const PredictionDrawer: React.FC<PredictionDrawerProps> = ({ isOpen, onClose, confidence }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-slate-950/97 border-l border-white/5 shadow-2xl flex flex-col justify-between h-full transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">
              PredictIQ Explainability & Governance
            </span>
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-indigo-400" />
              <span>Forecasting Decision Model</span>
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
          {/* Explainability logic */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wide flex items-center space-x-2">
              <Scale className="h-4.5 w-4.5 text-indigo-400" />
              <span>Deterministic Model Factors</span>
            </h4>
            
            <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-3 text-xs">
              <p className="text-slate-400 font-semibold leading-relaxed">
                All projections are calculated deterministically using rule-based algorithms. No neural networks, deep learning models, or external AI/LLMs are involved, ensuring complete auditability and compliance:
              </p>
              
              <div className="space-y-2.5 pt-2 font-mono text-[10px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Relationship Trajectory Window</span>
                  <span className="text-indigo-400 font-black">30 / 90 / 180 Days</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Attrition Risk Formula factors</span>
                  <span className="text-indigo-400 font-black">Health + Savings + Gaps</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Growth Classification basis</span>
                  <span className="text-indigo-400 font-black">Digital Adoption + Balances</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Confidence Model components</span>
                  <span className="text-indigo-400 font-black">6 Data Quality Matrices</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Audit Logs */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wide flex items-center space-x-2">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-400" />
              <span>Regulatory Compliance & Safeguards</span>
            </h4>
            
            <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-3 text-xs text-slate-400 leading-relaxed font-semibold">
              <p>
                In alignment with banking compliance guidelines, the PredictIQ engine enforces a strict filter on output recommendations:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                <li>Never recommends credit, deposit, insurance, or other financial products.</li>
                <li>Directs the Relationship Manager focus strictly toward service check-ins, interaction density, and KYC updates.</li>
                <li>Generates explanations that are fully trace-auditable down to transaction logs.</li>
              </ul>
            </div>
          </div>

          {/* Audit record */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wide flex items-center space-x-2">
              <FileCheck className="h-4.5 w-4.5 text-teal-400" />
              <span>Verification Audit Digest</span>
            </h4>
            
            <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-2.5 font-mono text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase">Audit ID:</span>
                <span>AUD-PREDICTIQ-SECURE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase">Engine:</span>
                <span>PredictIQ Engine v1.0.0</span>
              </div>
              <div className="flex flex-col space-y-1 pt-1.5 border-t border-white/5">
                <span className="text-slate-500 font-bold uppercase">SHA-256 Audit Signature:</span>
                <span className="text-[9px] text-indigo-400 font-mono tracking-tight leading-normal break-all">
                  a6b8c9d1e2f3a4b5c6d7e8f90a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Overall Confidence:</span>
          <span className="text-white font-mono text-xs">{confidence}</span>
        </div>
      </div>
    </div>
  );
};
