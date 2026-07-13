import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { SimulationScenario, ScenarioAdjustment } from '../../services/ai-client.js';
import { ScenarioTemplates } from './ScenarioTemplates.js';
import { SimulationControlPanel } from './SimulationControlPanel.js';

interface ScenarioBuilderProps {
  adjustments: ScenarioAdjustment;
  scenarioName: string;
  onAdjustmentsChange: (adj: ScenarioAdjustment) => void;
  onPresetSelect: (scenario: SimulationScenario) => void;
  onExecute: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({
  adjustments,
  scenarioName,
  onAdjustmentsChange,
  onPresetSelect,
  onExecute,
  onReset,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Templates Row */}
      <ScenarioTemplates onSelect={onPresetSelect} />

      {/* Controller Controls + Action Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <SimulationControlPanel
            adjustments={adjustments}
            onChange={onAdjustmentsChange}
          />
        </div>

        <div className="md:col-span-1 bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full min-h-[300px]">
          <div className="space-y-4">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Simulation Target</span>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Active Scenario Name</span>
              <div className="px-4 py-2.5 bg-slate-950/60 border border-white/5 text-white font-bold text-xs rounded-xl">
                {scenarioName}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
              Adjust sliders on the left or select presets to test what-if customer metrics. Projections are computed locally in-memory and will not affect client live records.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5">
            <button
              onClick={onExecute}
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/30 text-white font-black text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{isLoading ? 'Running Projections...' : 'Execute Simulator Run'}</span>
            </button>
            <button
              onClick={onReset}
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-150"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset parameters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
