import React, { useState } from 'react';
import { ShieldAlert, Calendar, BarChart3, Award, Info, Heart, HelpCircle, Activity } from 'lucide-react';
import { RelationshipHealthCard } from './RelationshipHealthCard.js';
import { ExecutiveRelationshipSummary } from '../strategy/ExecutiveRelationshipSummary.js';
import { JourneyTimeline } from './JourneyTimeline.js';
import { InteractionHistory } from './InteractionHistory.js';
import { TouchpointAnalytics } from './TouchpointAnalytics.js';
import { EngagementDashboard } from './EngagementDashboard.js';
import { MilestonesPanel } from './MilestonesPanel.js';
import { RelationshipRiskPanel } from './RelationshipRiskPanel.js';
import { RelationshipTrendCharts } from '../charts/RelationshipTrendCharts.js';
import { RelationshipDrawer } from './RelationshipDrawer.js';

interface Relationship360Props {
  data: {
    health: {
      score: number;
      category: string;
      positiveDrivers: string[];
      negativeDrivers: string[];
      confidence: string;
    };
    journey: any[];
    interactions: any;
    engagement: any;
    milestones: any[];
    touchpoints: any;
    risks: any[];
    summary: any;
    confidence: string;
  };
}

export const Relationship360: React.FC<Relationship360Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'interactions' | 'milestones' | 'risks' | 'engagement'>('timeline');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { health, journey, interactions, engagement, milestones, touchpoints, risks, summary } = data;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-400">
            <Heart className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-wide uppercase">Relationship Intelligence (RelationshipIQ)</h2>
            <p className="text-[10px] text-slate-400">Customer 360 Workspace & Client Telemetry</p>
          </div>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-3 py-1.5 bg-slate-950 border border-white/10 hover:border-teal-500/30 text-teal-400 hover:text-white rounded-xl text-[10px] font-bold flex items-center space-x-1.5 cursor-pointer transition-all duration-200"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Decision Explanation</span>
        </button>
      </div>

      {/* Hero row: Executive Summary & Health gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExecutiveRelationshipSummary summary={summary} />
        </div>
        <div className="lg:col-span-1">
          <RelationshipHealthCard health={health} />
        </div>
      </div>

      {/* Secondary row: Interactive SVG Trend Chart & active risks summary alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RelationshipTrendCharts 
            currentScore={health.score}
            digitalAdoption={engagement.digitalAdoption || health.score} 
            trustScore={health.score}
          />
        </div>
        
        {/* Quick risk indicators summary */}
        <div className="lg:col-span-1 bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block">Risk Alert Monitor</span>
            
            {risks.length === 0 ? (
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-emerald-400">Active status cleared</h5>
                <p className="text-[10px] text-slate-400 leading-normal font-medium">
                  Client profile holds zero critical retention alerts. Standard communications schedule remains operational.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {risks.slice(0, 2).map((r, idx) => (
                  <div key={idx} className="p-3 bg-rose-950/10 border border-rose-500/20 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-rose-400">
                      <span>{r.severity} Severity</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-semibold leading-relaxed truncate" title={r.reason}>
                      {r.reason}
                    </p>
                  </div>
                ))}
                {risks.length > 2 && (
                  <div className="text-right text-[9px] text-slate-500 font-bold">
                    + {risks.length - 2} more warnings active
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
            <span>Engagement index:</span>
            <span className="font-mono text-white font-extrabold">{engagement.interactionScore}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Control Section */}
      <div className="space-y-4">
        <div className="flex border-b border-white/5 overflow-x-auto pb-px gap-2">
          {[
            { id: 'timeline', label: 'Timeline Journey', icon: <Calendar className="h-4 w-4" /> },
            { id: 'interactions', label: 'Interaction Stats', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'engagement', label: 'Engagement Index', icon: <Activity className="h-4 w-4" /> },
            { id: 'milestones', label: 'Client Milestones', icon: <Award className="h-4 w-4" /> },
            { id: 'risks', label: 'Risk Logs', icon: <ShieldAlert className="h-4 w-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 py-3 px-4 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-teal-500 text-teal-400 bg-teal-500/5'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab view panels */}
        <div className="transition-all duration-300">
          {activeTab === 'timeline' && <JourneyTimeline journey={journey} />}
          {activeTab === 'interactions' && (
            <div className="space-y-6">
              <InteractionHistory interactions={interactions} />
              <TouchpointAnalytics touchpoints={touchpoints} />
            </div>
          )}
          {activeTab === 'engagement' && <EngagementDashboard engagement={engagement} />}
          {activeTab === 'milestones' && <MilestonesPanel milestones={milestones} />}
          {activeTab === 'risks' && <RelationshipRiskPanel risks={risks} />}
        </div>
      </div>

      {/* Explainability Drawer */}
      <RelationshipDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        healthScore={health.score}
      />
    </div>
  );
};
