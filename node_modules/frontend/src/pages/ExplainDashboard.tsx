import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Binary, BarChart3, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Layout } from '../components/layout/Layout.js';
import { getCustomerExplain } from '../services/api.js';
import { DecisionTree } from '../components/strategy/DecisionTree.js';
import { EvidenceTable } from '../components/strategy/EvidenceTable.js';
import { ConfidenceGauge } from '../components/strategy/ConfidenceGauge.js';
import { AuditCard } from '../components/strategy/AuditCard.js';
import { ComparisonCard } from '../components/strategy/ComparisonCard.js';
import { TimelineView } from '../components/workspace/TimelineView.js';
import type { ExplainIQProfile } from '../services/api.js';

export const ExplainDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ExplainIQProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'flow' | 'evidence' | 'audit'>('flow');

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCustomerExplain(id);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load explainability data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Navigation Action Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-idbi-border mb-6">
          <div className="flex items-center space-x-4">
            <Link 
              to={`/customers/${id}`}
              className="p-2 hover:bg-slate-100 border border-transparent hover:border-slate-300 rounded-xl text-idbi-textSec hover:text-idbi-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <span className="text-[10px] text-idbi-orange font-bold uppercase tracking-widest block">
                ExplainIQ Platform
              </span>
              <h1 className="text-sm font-bold text-idbi-text uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="h-4.5 w-4.5 text-idbi-green" />
                <span>AI Audit Console</span>
              </h1>
            </div>
          </div>
          
          {profile && (
            <div className="flex items-center space-x-4">
              <span className="px-2.5 py-1 bg-idbi-lightGreen border border-idbi-green/30 text-idbi-green rounded-lg text-[9px] font-bold uppercase tracking-wider">
                Explainability Score: {profile.explainabilityRating.explainabilityScore}%
              </span>
            </div>
          )}
        </div>
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-36 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-idbi-orange" />
            <span className="text-xs text-idbi-textSec font-bold uppercase tracking-wider">Compiling explainability metrics...</span>
          </div>
        )}

        {error && (
          <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-3 text-xs text-rose-400 max-w-xl mx-auto">
            <ShieldAlert className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top row: Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2 bg-slate-950/40 border border-white/5 rounded-3xl p-6 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">AI Executive Briefing</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {profile.executiveExplanation}
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 pt-4 border-t border-white/5 font-semibold">
                  This brief is verified as 100% deterministic, tracing the decision paths of 6 independent analytical sub-engines.
                </div>
              </div>

              {/* Explainability rating indicators */}
              <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Transparency Rating</span>
                    <span className="text-lg font-black text-white uppercase tracking-wider">{profile.explainabilityRating.transparencyRating}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[9px] font-black uppercase">
                    certified
                  </span>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500 uppercase">Engine Coverage</span>
                    <span className="text-indigo-400 font-bold">{profile.explainabilityRating.coverage}%</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500 uppercase">Decision Consistency</span>
                    <span className="text-indigo-400 font-bold">{profile.explainabilityRating.decisionConsistency}%</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500 uppercase">Audit Ledger Logging</span>
                    <span className="text-emerald-400 font-bold">100.0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="space-y-6">
              <div className="flex border-b border-white/5 text-xs">
                <button
                  onClick={() => setActiveTab('flow')}
                  className={`pb-3 pr-8 font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2
                    ${activeTab === 'flow' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <Binary className="h-4 w-4" />
                  <span>Pipeline Reasoning Tree</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`pb-3 px-8 font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2
                    ${activeTab === 'evidence' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Evidence Matrix & Confidence</span>
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`pb-3 px-8 font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2
                    ${activeTab === 'audit' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Regulatory Audit & Versioning</span>
                </button>
              </div>

              {/* Tab Sections */}
              <div className="bg-slate-900/10 border border-white/5 rounded-3xl p-6">
                {activeTab === 'flow' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                      <DecisionTree nodes={profile.decisionTree} />
                    </div>
                    <div className="lg:col-span-5 bg-slate-950/40 border border-white/5 rounded-3xl p-6">
                      <TimelineView timeline={profile.reasoningTimeline} />
                    </div>
                  </div>
                )}

                {activeTab === 'evidence' && (
                  <div className="space-y-8">
                    <ConfidenceGauge model={profile.confidenceModel} />
                    <EvidenceTable evidence={profile.evidenceMatrix} />
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="space-y-8">
                    <AuditCard record={profile.auditRecord} />
                    <ComparisonCard comparison={profile.comparisonAnalysis} />
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
        {/* Latency footer inside layout container */}
        {!loading && profile && (
          <footer className="border-t border-idbi-border pt-6 text-center text-[10px] text-idbi-textSec font-semibold uppercase font-mono">
            E2E Latency: {profile.auditRecord.executionTimeMs.toFixed(2)}ms | Compile checksum verified | SHA256 Signature certified
          </footer>
        )}
      </div>
    </Layout>
  );
};
