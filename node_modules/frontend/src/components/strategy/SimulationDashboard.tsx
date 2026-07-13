import React, { useState, useEffect } from 'react';
import { Activity, History, Info } from 'lucide-react';
import { SimulationIQProfile, ScenarioAdjustment, SimulationScenario } from '../../services/ai-client.js';
import { ScenarioBuilder } from './ScenarioBuilder.js';
import { MetricComparisonCards } from './MetricComparisonCards.js';
import { ImpactAnalysisCard } from './ImpactAnalysisCard.js';
import { DecisionMatrixCard } from './DecisionMatrixCard.js';
import { SimulationTimeline } from './SimulationTimeline.js';
import { ExecutiveSimulationSummary } from './ExecutiveSimulationSummary.js';
import { ConfidencePanel } from './ConfidencePanel.js';
import { SimulationCharts } from '../charts/SimulationCharts.js';
import { ScenarioHistoryDrawer } from './ScenarioHistoryDrawer.js';

interface SimulationDashboardProps {
  customerId: string;
  initialData: SimulationIQProfile;
}

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ customerId, initialData }) => {
  const defaultAdjustments: ScenarioAdjustment = {
    rmInteractionsChange: 0,
    kycEvent: null,
    savingsRatioChange: 0,
    digitalPaymentsChange: 0,
    salaryStabilityChange: 0,
    meetingCompletionChange: 0,
    followUpQualityChange: 0,
    engagementChange: 0,
    closePendingTasks: null
  };

  const [adjustments, setAdjustments] = useState<ScenarioAdjustment>(defaultAdjustments);
  const [scenarioName, setScenarioName] = useState<string>("Baseline Simulation");
  const [description, setDescription] = useState<string>("Baseline customer trajectory projections.");
  
  const [simulationData, setSimulationData] = useState<SimulationIQProfile>(initialData);
  const [history, setHistory] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/v1/customers/${customerId}/simulation/history`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setHistory(result.data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch simulation run history logs:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [customerId]);

  const handlePresetSelect = (preset: SimulationScenario) => {
    setAdjustments(preset.adjustments);
    setScenarioName(preset.scenarioName);
    setDescription(preset.description);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/customers/${customerId}/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scenario: {
            scenarioName,
            description,
            adjustments
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSimulationData(result.data);
          // Refresh logs history list
          await fetchHistory();
        }
      }
    } catch (err) {
      console.error("Failed to run decision simulation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAdjustments(defaultAdjustments);
    setScenarioName("Baseline Simulation");
    setDescription("Baseline customer trajectory projections.");
    setSimulationData(initialData);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-wide uppercase">What-If Decision Simulator (SimulationIQ)</h2>
            <p className="text-[10px] text-slate-400">Stateless decision-support models for relationship planning</p>
          </div>
        </div>
        <button
          onClick={() => { setHistoryOpen(true); fetchHistory(); }}
          className="px-3 py-1.5 bg-slate-950 border border-white/10 hover:border-indigo-500/30 text-indigo-400 hover:text-white rounded-xl text-[10px] font-bold flex items-center space-x-1.5 cursor-pointer transition-all duration-200"
        >
          <History className="h-4 w-4" />
          <span>Simulation History Logs</span>
        </button>
      </div>

      {/* Scenario Builder Inputs */}
      <ScenarioBuilder
        adjustments={adjustments}
        scenarioName={scenarioName}
        onAdjustmentsChange={setAdjustments}
        onPresetSelect={handlePresetSelect}
        onExecute={handleExecute}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Comparisons, Matrix, Summary Outcome Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MetricComparisonCards metrics={simulationData.projectedMetrics} />
          <SimulationCharts metrics={simulationData.projectedMetrics} />
          <SimulationTimeline timeline={simulationData.timeline} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <DecisionMatrixCard decision={simulationData.decision} />
          <ExecutiveSimulationSummary summary={simulationData.summary} />
          <ConfidencePanel confidence={simulationData.confidence} />
          <ImpactAnalysisCard impact={simulationData.impact} />
        </div>
      </div>

      {/* Session History Drawer */}
      <ScenarioHistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
      />
    </div>
  );
};
