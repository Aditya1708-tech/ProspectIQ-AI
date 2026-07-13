import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, BarChart3, Binary, Eye } from 'lucide-react';
import { getCustomerExplain } from '../../services/api.js';
import { DecisionTree } from './DecisionTree.js';
import { EvidenceTable } from './EvidenceTable.js';
import { ConfidenceGauge } from './ConfidenceGauge.js';
import { AuditCard } from './AuditCard.js';
import { ComparisonCard } from './ComparisonCard.js';
import { TimelineView } from '../workspace/TimelineView.js';
import type { ExplainIQProfile } from '../../services/api.js';

interface ExplainDrawerProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainDrawer: React.FC<ExplainDrawerProps> = ({ customerId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ExplainIQProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'flow' | 'evidence' | 'audit'>('flow');

  useEffect(() => {
    if (!isOpen || !customerId) {
      setProfile(null);
      return;
    }

    const loadExplain = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCustomerExplain(customerId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load explainability metrics');
      } finally {
        setLoading(false);
      }
    };

    loadExplain();
  }, [customerId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel container */}
      <div className="relative w-full max-w-3xl bg-slate-950/95 border-l border-white/5 shadow-2xl flex flex-col justify-between h-full transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">
              AI Governance & Explainability Command Center
            </span>
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Eye className="h-5 w-5 text-indigo-400" />
              <span>Decision Explanation Drawer</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Parsing AI Telemetry...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-3 text-xs text-rose-400">
              <ShieldAlert className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && profile && (
            <div className="space-y-6">
              
              {/* Executive summary block */}
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 space-y-2">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Executive Briefing</span>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {profile.executiveExplanation}
                </p>
              </div>

              {/* Tab Selector buttons */}
              <div className="flex border-b border-white/5 text-xs">
                <button
                  onClick={() => setActiveTab('flow')}
                  className={`pb-3 pr-6 font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2
                    ${activeTab === 'flow' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <Binary className="h-4 w-4" />
                  <span>Reasoning Tree</span>
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`pb-3 px-6 font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2
                    ${activeTab === 'evidence' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Evidence & Confidence</span>
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`pb-3 px-6 font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2
                    ${activeTab === 'audit' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Compliance Audit</span>
                </button>
              </div>

              {/* Tabs Content */}
              {activeTab === 'flow' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7">
                    <DecisionTree nodes={profile.decisionTree} />
                  </div>
                  <div className="lg:col-span-5 bg-slate-950/40 border border-white/5 rounded-2xl p-4">
                    <TimelineView timeline={profile.reasoningTimeline} />
                  </div>
                </div>
              )}

              {activeTab === 'evidence' && (
                <div className="space-y-6">
                  <ConfidenceGauge model={profile.confidenceModel} />
                  <EvidenceTable evidence={profile.evidenceMatrix} />
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <AuditCard record={profile.auditRecord} />
                  <ComparisonCard comparison={profile.comparisonAnalysis} />
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer Metrics */}
        {!loading && profile && (
          <div className="p-4 bg-slate-950 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500">
            <span className="font-semibold uppercase font-mono text-indigo-400">
              Audit completeness: {profile.explainabilityRating.auditCompleteness.toFixed(0)}%
            </span>
            <span className="font-semibold">
              E2E decision compiled in {profile.auditRecord.executionTimeMs.toFixed(2)}ms (certified deterministic AI)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
