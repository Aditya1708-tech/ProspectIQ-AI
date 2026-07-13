import React, { useState } from 'react';
import { HelpCircle, Activity } from 'lucide-react';
import { PredictIQProfile } from '../../services/ai-client.js';
import { ForecastHeroCard } from './ForecastHeroCard.js';
import { ChurnGauge } from './ChurnGauge.js';
import { GrowthForecastCard } from './GrowthForecastCard.js';
import { OpportunityForecastCard } from './OpportunityForecastCard.js';
import { PredictionTimeline } from './PredictionTimeline.js';
import { PredictionTrendCharts } from '../charts/PredictionTrendCharts.js';
import { EarlyWarningPanel } from './EarlyWarningPanel.js';
import { ForecastConfidenceCard } from './ForecastConfidenceCard.js';
import { ExecutiveForecastSummary } from '../strategy/ExecutiveForecastSummary.js';
import { PredictionDrawer } from './PredictionDrawer.js';

interface PredictionDashboardProps {
  data: PredictIQProfile;
}

export const PredictionDashboard: React.FC<PredictionDashboardProps> = ({ data }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    forecasts,
    churn,
    growth,
    relationship,
    opportunity,
    earlyWarnings,
    timeline,
    summary,
    confidence
  } = data;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-wide uppercase">Predictive Intelligence (PredictIQ)</h2>
            <p className="text-[10px] text-slate-400">Customer trajectory forecasting & risk telemetry</p>
          </div>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-3 py-1.5 bg-slate-950 border border-white/10 hover:border-indigo-500/30 text-indigo-400 hover:text-white rounded-xl text-[10px] font-bold flex items-center space-x-1.5 cursor-pointer transition-all duration-200"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Decision Explanation</span>
        </button>
      </div>

      {/* Row 1: Hero Cards & Briefings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExecutiveForecastSummary summary={summary} />
        </div>
        <div className="lg:col-span-1">
          <ForecastHeroCard relationship={relationship} />
        </div>
      </div>

      {/* Row 2: Gauges & Forecast Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChurnGauge churn={churn} />
        <GrowthForecastCard growth={growth} />
        <OpportunityForecastCard opportunity={opportunity} />
      </div>

      {/* Row 3: Timeline & Charts & Early Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PredictionTrendCharts
            relationshipHealth={forecasts.relationshipHealth}
            savingsHealth={forecasts.savingsHealth}
            customerEngagement={forecasts.customerEngagement}
          />
          <PredictionTimeline timeline={timeline} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <EarlyWarningPanel earlyWarnings={earlyWarnings} />
          <ForecastConfidenceCard confidence={confidence} />
        </div>
      </div>

      {/* Explainability Drawer */}
      <PredictionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        confidence={confidence}
      />
    </div>
  );
};
