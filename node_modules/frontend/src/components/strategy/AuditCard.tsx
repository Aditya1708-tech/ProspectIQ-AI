import React, { useState } from 'react';
import { ShieldCheck, Copy, Check } from 'lucide-react';
import type { AuditRecord } from '../../services/api.js';

interface AuditCardProps {
  record: AuditRecord;
}

export const AuditCard: React.FC<AuditCardProps> = ({ record }) => {
  const [copied, setCopied] = useState(false);

  const copyDigest = () => {
    navigator.clipboard.writeText(record.sha256Digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Compliance Audit Ledger</span>
      
      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden">
        {/* Glow indicator */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
        
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                {record.auditId}
              </h4>
              <span className="text-[9px] text-slate-500 block font-bold">
                AUDITED & LOGGED ON {new Date(record.generatedTime).toLocaleString()}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[9px] font-bold uppercase tracking-wide">
            Verified
          </span>
        </div>

        <div className="space-y-2.5 text-[11px]">
          <div>
            <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider">Trace Context ID:</span>
            <span className="font-mono text-slate-400">{record.traceId}</span>
          </div>

          <div>
            <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider">Model Digest Signature (SHA-256):</span>
            <div className="flex items-center space-x-2 mt-1 bg-slate-950 border border-white/5 rounded-lg p-2 font-mono text-[10px] text-slate-400 overflow-x-auto relative">
              <span className="select-all break-all pr-8 leading-normal">{record.sha256Digest}</span>
              <button 
                onClick={copyDigest}
                className="absolute right-2 top-2 p-1 bg-slate-900 border border-white/10 hover:border-indigo-500/30 text-slate-400 hover:text-white rounded transition-colors"
                title="Copy SHA-256 digest signature"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider">Input Summaries:</span>
              <span className="text-slate-400 leading-relaxed font-semibold">{record.inputSummary}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider">Output Signatures:</span>
              <span className="text-slate-400 leading-relaxed font-semibold">{record.outputSummary}</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-white/5">
            <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Registered Modules & Core Versions:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(record.engineVersions).map(([engine, ver]) => (
                <span key={engine} className="px-2 py-0.5 bg-slate-950 border border-white/5 text-slate-500 rounded text-[9px] font-bold">
                  {engine}: <strong className="text-indigo-400 font-mono">v{ver as string}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
